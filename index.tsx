import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/ui/App';
import { initSystemHandshake, restoreSession, verifyPaymentSimulation } from './api/gateway';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Lock, Loader2, ShieldCheck, Terminal, AlertTriangle, Cpu, CreditCard, ArrowRight, CheckCircle2, XCircle, Key, Copy } from 'lucide-react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Phase 0: Payment Verification Handler (The /success Logic)
const PaymentVerification = () => {
  const [status, setStatus] = useState<'VERIFYING' | 'SUCCESS' | 'ERROR'>('VERIFYING');
  const [statusMessage, setStatusMessage] = useState<React.ReactNode>("Verifying payment... Please wait.");

  useEffect(() => {
    const handleStripeSuccessRedirect = async () => {
        // 1. Get the Session ID AND Customer ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const customerId = urlParams.get('customer_id');

        if (!sessionId || !customerId) {
            setStatus('ERROR');
            setStatusMessage("Error: Missing payment identifiers. Please ensure you followed the correct link.");
            return;
        }

        try {
            // 2. Call the Secure Verification (Simulated here for demo)
            // In prod: await fetch(`/verify-payment?session_id=${sessionId}&customer_id=${customerId}`)
            const data = await verifyPaymentSimulation(sessionId, customerId);

            // Success! The server confirmed payment and sent the Activation Token.
            setStatus('SUCCESS');
            
            // 3. Store the Activation Token (JWT) PERMANENTLY in localStorage
            localStorage.setItem('OMNI_ACTIVATION_TOKEN', data.activationToken);
            // Also store the ID for reference
            if (data.permanentID) {
                localStorage.setItem('OMNI_LIFETIME_ID', data.permanentID);
            }
            
            // 4. Show the Permanent ID before redirecting
            setStatusMessage(
                <div className="text-left space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="font-bold text-green-400 text-sm tracking-widest uppercase mb-1">Payment Confirmed</div>
                    <div className="text-gray-400 text-xs">Your Lifetime Access Credential is:</div>
                    
                    <div className="bg-black border border-green-500/50 p-3 rounded-sm font-mono text-lg text-white select-all flex items-center justify-between group">
                        <span>{data.permanentID}</span>
                        <Copy className="w-4 h-4 text-gray-500 group-hover:text-white cursor-pointer" />
                    </div>
                    
                    <div className="text-[10px] text-neon-red uppercase tracking-wider font-bold bg-neon-red/10 p-2 border border-neon-red/20 rounded-sm">
                        ⚠️ SAVE THIS ID. It is your only way to restore access.
                    </div>
                    
                    <div className="text-xs pt-4 text-gray-500 animate-pulse flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Initializing System Environment...
                    </div>
                </div>
            );
            
            // 5. Redirect to the main app root (/) to trigger the full load
            // Increased timeout so user has time to save their ID
            setTimeout(() => {
                window.location.href = '/'; 
            }, 6000);

        } catch (error: any) {
            setStatus('ERROR');
            setStatusMessage(`Payment Verification Failed: ${error.message || 'Please contact support.'}`);
            console.error("Verification Network Error:", error);
        }
    };

    handleStripeSuccessRedirect();
  }, []);

  return (
    <div className="h-screen w-screen bg-[#050508] text-gray-300 font-mono flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#a8b1ff] selection:text-black">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(168, 177, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 177, 255, 0.2) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
        }}></div>

        <div className="z-10 w-full max-w-md p-8 border border-gray-800 bg-[#0b0c15] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative text-center">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#a8b1ff] to-transparent animate-pulse"></div>

            <div className="mb-8 flex justify-center">
                {status === 'VERIFYING' && <Loader2 className="w-16 h-16 text-[#a8b1ff] animate-spin" />}
                {status === 'SUCCESS' && <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in duration-300" />}
                {status === 'ERROR' && <XCircle className="w-16 h-16 text-red-500 animate-in zoom-in duration-300" />}
            </div>

            <h1 className="text-xl font-bold tracking-widest text-white mb-2">PAYMENT AUTHORITY</h1>
            
            <div className={`mt-6 p-4 rounded-sm border text-xs font-mono transition-colors duration-300 ${
                status === 'SUCCESS' ? 'bg-green-500/5 border-green-500/30' :
                status === 'ERROR' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                'bg-[#a8b1ff]/5 border-[#a8b1ff]/20 text-gray-300'
            }`}>
                {statusMessage}
            </div>

            {status === 'ERROR' && (
                 <a href="/" className="mt-4 inline-block text-xs text-gray-500 hover:text-white underline decoration-dashed">
                    Return to Terminal
                 </a>
            )}
        </div>
    </div>
  );
};

// Phase I: The Authentication Stub
const AccessGate = () => {
  // Check for existing token immediately to determine initial phase
  const hasLocalToken = !!localStorage.getItem('OMNI_ACTIVATION_TOKEN');
  
  const [phase, setPhase] = useState<'INIT' | 'CONNECTING' | 'VALIDATING' | 'AUTHORIZED' | 'DENIED'>(
    hasLocalToken ? 'VALIDATING' : 'INIT'
  );
  
  const [logs, setLogs] = useState<string[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [identityInput, setIdentityInput] = useState('');
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`]);

  useEffect(() => {
    const sequence = async () => {
        // Only do the fake "boot sequence" if we aren't already potentially authorized
        if (phase === 'INIT') {
            setPhase('CONNECTING');
            addLog("Initializing Authentication Stub...");
            await new Promise(r => setTimeout(r, 800));
        }

        try {
            if (phase === 'INIT' || phase === 'CONNECTING') {
                 addLog("Contacting Payment Validation Conduit...");
                 setPhase('VALIDATING');
            } else {
                 // Fast-track log for restoring
                 addLog("Resuming Session...");
            }
            
            // Phase III & IV: Token Exchange (Checks LocalStorage or Remote)
            const response = await initSystemHandshake();
            
            addLog("Payment Authorization Record: CONFIRMED");
            
            // Phase V: Activation Token Registration
            localStorage.setItem('OMNI_ACTIVATION_TOKEN', response.activationToken);
            if (response.permanentID) {
                localStorage.setItem('OMNI_LIFETIME_ID', response.permanentID);
            }
            
            if (phase === 'INIT' || phase === 'CONNECTING') {
                addLog("Decrypting Application Bundle...");
                await new Promise(r => setTimeout(r, 1200)); 
            }
            
            // Phase V: Full Instantiation
            setPhase('AUTHORIZED');
        } catch (e: any) {
            addLog(`CRITICAL: ${e.message}`);
            setPhase('DENIED');
        }
    };
    sequence();
  }, []);

  const handleRestoreSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!identityInput.trim()) return;

      setRestoreLoading(true);
      addLog(`Initiating Manual Restore for: ${identityInput}`);

      try {
          const response = await restoreSession(identityInput);
          addLog("Identity Verified. Restoring Access Token...");
          
          // SAVE PERMANENTLY
          localStorage.setItem('OMNI_ACTIVATION_TOKEN', response.activationToken);
          localStorage.setItem('OMNI_LIFETIME_ID', identityInput); 
          
          setPhase('AUTHORIZED');
      } catch (error: any) {
          addLog(`RESTORE FAILED: ${error.message}`);
          setRestoreLoading(false);
      }
  };

  const handleCheckout = (e: React.MouseEvent) => {
      e.preventDefault();
      setCheckoutLoading(true);
      addLog("Initiating Secure Checkout Sequence...");
      
      // Simulate redirect delay
      setTimeout(() => {
          // Redirect to the verification flow
          window.location.href = "/?session_id=chk_sim_123456789&customer_id=cus_sim_987654321";
      }, 1500);
  };

  // Phase V: Full Instantiation (Render Real App)
  if (phase === 'AUTHORIZED') {
      return <App />;
  }

  // The "Stub" UI
  return (
    <div className="h-screen w-screen bg-[#050508] text-gray-300 font-mono flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#a8b1ff] selection:text-black">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(168, 177, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 177, 255, 0.2) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
        }}></div>

        <div className="z-10 w-full max-w-md p-8 border border-gray-800 bg-[#0b0c15] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
            {/* Top Bar Scanline */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#a8b1ff] to-transparent animate-pulse"></div>

            <div className="text-center mb-8">
                {phase === 'DENIED' ? (
                    <div className="inline-flex p-4 rounded-full bg-red-500/10 border border-red-500/50 mb-4 animate-pulse">
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                ) : (
                    <div className="inline-flex p-4 rounded-full bg-[#a8b1ff]/10 border border-[#a8b1ff]/30 mb-4">
                        <Loader2 className="w-8 h-8 text-[#a8b1ff] animate-spin" />
                    </div>
                )}
                
                <h1 className="text-xl font-bold tracking-widest text-white mb-2">SYSTEM INITIALIZATION</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">
                    {phase === 'INIT' && 'Standing By...'}
                    {phase === 'CONNECTING' && 'Establishing Secure Uplink...'}
                    {phase === 'VALIDATING' && 'Verifying License Integrity...'}
                    {phase === 'DENIED' && 'Access Restricted'}
                </p>
            </div>

            {/* Terminal Output */}
            <div className="bg-black border border-gray-800 p-4 rounded-sm text-[10px] h-32 overflow-y-auto mb-6 custom-scrollbar shadow-inner relative">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1 text-gray-400 font-mono animate-in slide-in-from-left-2 duration-200">
                        <span className="text-[#a8b1ff] mr-2">{'>'}</span>{log}
                    </div>
                ))}
                {phase !== 'DENIED' && (
                    <div className="animate-pulse text-[#a8b1ff]">_</div>
                )}
            </div>

            {phase === 'DENIED' && !isRestoring && (
                <div className="text-center animate-in fade-in duration-500 flex flex-col items-center">
                    <button
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                        className="group w-full relative inline-flex items-center justify-center px-6 py-4 font-bold text-white transition-all duration-200 bg-transparent font-mono uppercase tracking-widest overflow-hidden border border-[#a8b1ff] hover:bg-[#a8b1ff] hover:text-black rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-full opacity-10"></span>
                        <span className="relative flex items-center gap-2 text-sm">
                             {checkoutLoading ? (
                                 <><Loader2 className="w-4 h-4 animate-spin" /> PROCESSING GATEWAY...</>
                             ) : (
                                 <>you are almost there <ArrowRight className="w-4 h-4 ml-1" /></>
                             )}
                        </span>
                    </button>
                    
                    <button 
                        onClick={() => setIsRestoring(true)}
                        className="mt-4 text-xs text-gray-500 hover:text-white underline decoration-dashed transition-colors"
                    >
                        Already a member? Restore Session
                    </button>
                    
                    <p className="mt-6 text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">
                        Gateway: Unauthorized // Session Halted
                    </p>
                </div>
            )}

            {phase === 'DENIED' && isRestoring && (
                <form onSubmit={handleRestoreSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                     <div className="mb-4">
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Lifetime Credential</label>
                        <Input 
                            value={identityInput}
                            onChange={(e) => setIdentityInput(e.target.value)}
                            placeholder="Stripe Customer ID (cus_...)"
                            className="w-full bg-black/50 border-gray-700 focus:border-[#a8b1ff]"
                        />
                        <div className="text-[9px] text-gray-600 mt-1">Enter the ID provided after payment.</div>
                     </div>
                     <div className="flex gap-2">
                         <Button 
                            onClick={() => setIsRestoring(false)}
                            className="flex-1 bg-transparent border border-gray-700 text-gray-400 hover:text-white"
                         >
                            CANCEL
                         </Button>
                         <Button 
                            type="submit"
                            disabled={restoreLoading}
                            className="flex-[2] bg-[#a8b1ff] text-black hover:bg-white border-transparent"
                         >
                            {restoreLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                            AUTHENTICATE
                         </Button>
                     </div>
                </form>
            )}

            <div className="text-center text-[9px] text-gray-700 mt-6 flex justify-between border-t border-gray-900 pt-4">
                <span className="flex items-center gap-1"><Cpu className="w-3 h-3"/> OMNI-SENTINEL KERNEL</span>
                <span>V9.9.9-PHOENIX</span>
            </div>
        </div>
    </div>
  );
};

const root = ReactDOM.createRoot(rootElement);

// Routing Logic: Check if we are in the payment verification loop
// Now checks for customer_id as well
const isVerificationFlow = window.location.pathname === '/success' || new URLSearchParams(window.location.search).has('session_id');

root.render(
  <React.StrictMode>
    {isVerificationFlow ? <PaymentVerification /> : <AccessGate />}
  </React.StrictMode>
);