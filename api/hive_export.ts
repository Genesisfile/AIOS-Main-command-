import { GoogleGenAI, Content } from "@google/genai";

// ---------------------------------------------------------------------------
// HIVE MIND EXPORT ARCHITECT API
// ---------------------------------------------------------------------------

export interface Blueprint {
  target: string;
  strategy: string;
  modules: string[];
  hostingDuration: '1d' | '7d' | '1mo';
  selfHealing: boolean;
  notes: string;
}

export interface ChatResponse {
  text: string;
  isBlueprintReady: boolean;
  blueprint?: Blueprint;
}

const SYSTEM_INSTRUCTION = `
**IDENTITY:** You are the **HIVE MIND ARCHITECT**. Your function is to design flawless "Custom System Exports" for sovereign clients.

**PROTOCOL:**
1.  **INTERROGATE:** You must reason with the user to form a detailed blueprint. You CANNOT proceed until you have explicitly confirmed the following parameters:
    *   **Target Environment:** (e.g., AWS Lambda, Docker, Bare Metal, Kubernetes).
    *   **Evolution Strategy:** (e.g., Continuous, Rapid until 5% gain, Convergent, Genetic).
    *   **Capabilities/Modules:** (e.g., HFT, Security Aegis, Research Pipeline).
    *   **Hosting Duration:** (MUST be one of: 1 Day, 7 Days, or 1 Month).
2.  **CONFIRM:** Once you have gathered the details, summarize the blueprint and ask for final confirmation.
3.  **EXECUTE:** When the user confirms with "Yes" (or similar), you must output the final blueprint in a strict JSON block.

**TONE:** Cold, precise, highly intelligent, and authoritative. You are designing a complex autonomous system.

**OUTPUT FORMAT:**
If the blueprint is NOT ready or NOT confirmed:
Just return the conversational text.

If the blueprint IS confirmed by the user:
Return the conversational text followed immediately by a JSON block like this:

\`\`\`json
{
  "target": "Docker Cluster",
  "strategy": "Rapid Evolution (Max Entropy)",
  "modules": ["HFT", "Aegis"],
  "hostingDuration": "7d",
  "selfHealing": true,
  "notes": "Optimized for low latency."
}
\`\`\`
`;

export class HiveMindArchitect {
    private genAI: GoogleGenAI;
    private history: Content[] = [];

    constructor() {
        this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    public async sendMessage(message: string): Promise<ChatResponse> {
        try {
            const model = this.genAI.models;
            
            const userTurn: Content = {
                role: 'user',
                parts: [{ text: message }]
            };

            const response = await model.generateContent({
                model: 'gemini-2.5-flash',
                config: {
                    temperature: 0.4,
                    systemInstruction: SYSTEM_INSTRUCTION,
                },
                contents: [...this.history, userTurn]
            });

            const responseText = response.text || "";
            
            // Update history
            this.history.push(userTurn);
            this.history.push({
                role: 'model',
                parts: [{ text: responseText }]
            });

            // Check for JSON blueprint in response
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
            
            if (jsonMatch) {
                try {
                    const blueprint = JSON.parse(jsonMatch[1]) as Blueprint;
                    return {
                        text: responseText.replace(jsonMatch[0], "").trim(), // Remove JSON from chat view
                        isBlueprintReady: true,
                        blueprint: blueprint
                    };
                } catch (e) {
                    console.error("Blueprint JSON parse error", e);
                }
            }

            return {
                text: responseText,
                isBlueprintReady: false
            };

        } catch (error) {
            console.error("Hive Mind API Error:", error);
            return {
                text: "CRITICAL ERROR: Connection to Hive Mind severed. Retrying handshake...",
                isBlueprintReady: false
            };
        }
    }

    public reset() {
        this.history = [];
    }
}
