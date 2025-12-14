
import express from 'express';
import stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { db, admin } from './firebase-admin'; // Assuming you have this configured

const app = express();

// Initialize Stripe with the secret key from environment variables
const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // It's a good practice to specify the API version
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// Client-side endpoint to create a checkout session
app.post('/create-checkout-session', express.json(), async (req, res) => {
    const { firebase_uid } = req.body; // Expecting Firebase UID from the client

    if (!firebase_uid) {
        return res.status(400).json({ error: 'Firebase UID is required.' });
    }

    try {
        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: 'prod_TaxmHBW8TdKhoH',
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel`,
            metadata: {
                firebase_uid: firebase_uid // Link the session to the Firebase User ID
            }
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Checkout Session Error:', error);
        res.status(500).json({ error: 'Failed to create checkout session.' });
    }
});

// Webhook handler for Stripe events
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const uid = session.metadata.firebase_uid;

        if (session.payment_status === 'paid' && uid) {
            await db.collection('users').doc(uid).set({
                isLifetimePro: true,
                paidAt: admin.firestore.FieldValue.serverTimestamp(),
                stripeSessionId: session.id,
                email: session.customer_details ? session.customer_details.email : 'N/A'
            }, { merge: true });
        }
    }

    res.json({ received: true });
});

// Verification endpoint for the client to confirm payment and get a JWT
app.get('/verify-payment', async (req, res) => {
    const sessionId = req.query.session_id;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required.' });
    }

    try {
        const session = await stripeClient.checkout.sessions.retrieve(sessionId);
        const uid = session.metadata.firebase_uid;

        if (!uid) {
            return res.status(403).json({ error: 'Payment session is not linked to a user.' });
        }

        if (session.payment_status !== 'paid' || session.status !== 'complete') {
            return res.status(403).json({ error: 'Payment not yet confirmed by Stripe.' });
        }

        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists || !userDoc.data().isLifetimePro) {
            await db.collection('users').doc(uid).set({ isLifetimePro: true }, { merge: true });
        }

        const payload = { uid: uid, access: 'LIFETIME_PRO' };
        const activationToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '100y' });

        return res.status(200).json({ activationToken: activationToken, message: 'Access granted.' });

    } catch (error) {
        console.error('Verification Error:', error);
        return res.status(500).json({ error: 'Failed to verify payment with Stripe.' });
    }
});

export default app;
