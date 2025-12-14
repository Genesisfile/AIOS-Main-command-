
import { GoogleGenAI, Type, Content } from "@google/genai";

/*
 * SENTINEL KNOWLEDGE ASSISTANT (SKA) - STRICT RAG IMPLEMENTATION
 * 
 * Architecture: Retrieval-Augmented Generation (Client-Side Simulation)
 * Mandate: The assistant MUST answer based ONLY on the provided VIRTUAL_FILES context.
 * Authority: Read-Only. No execution capabilities.
 */

export interface SKAResponse {
  text: string;
  suggestedCommand?: string;
  commandLabel?: string;
  uiAction?: 'DownloadButton';
}

// ---------------------------------------------------------------------------
// 1. KNOWLEDGE BASE (VIRTUAL FILE SYSTEM)
// These files represent the "Ground Truth" for the RAG system.
// ---------------------------------------------------------------------------
const VIRTUAL_FILES = {
  "README.md": `
# Omni-Sentinel (Phoenix Edition)

## Project Phoenix Overview
The Omni-Sentinel Core has transitioned to a Microservice Feature Delivery model.
Source code is no longer distributed in static NPM packages. It is fetched dynamically from the **Phoenix API Gateway**.

## Security Gateway
Access requires:
1. Google Sign-In (Firebase Auth)
2. Valid "OMNI-HEAL CORE LICENSE" (Stripe Subscription)

## Architecture
- **Client**: Authenticates & verifies license.
- **Phoenix API**: Returns a JSON payload containing the **Kernel Bundle** (CommonJS).
- **Runtime**: The client SDK dynamically hydrates the bundle using \`new Function()\`.
`,

  "FLEET_COMMAND_MANUAL.md": `
# Fleet Command Protocols

## Massive Scalability
The system supports **Unlimited Self-Replication** via the "FleetOrchestrator" module.
- **Vectors**: AWS, GCP, Azure, and Bare Metal.
- **Strategy**: Fractal Expansion (Self-similar node replication).

## Safety Directives
To prevent Skynet-like scenarios, the following limits are hardcoded:
- **Runaway Evolution Tolerance**: 0 (Zero Tolerance).
- **Destructive Behavior**: BLOCKED at Kernel Level.
- **Aethelgard Protocol**: Monitors all replication events for drift.

## Usage
Issue a directive in the Executive Console:
"Initiate massive cloud scalability scan for fleet expansion."
`,

  "package.json": JSON.stringify({
    "name": "omni-sentinel-core",
    "version": "9.9.9-PHOENIX",
    "description": "Autonomous Debugging & Self-Healing Runtime (Distributed via Phoenix API)",
    "scripts": {
      "start": "node dist/omni_sentinel_core.js",
      "deploy": "ts-node ./deployment_nexus.ts",
      "fleet:expand": "node dist/fleet_orchestrator.js --mode=unlimited"
    },
    "dependencies": {
      "uuid": "^9.0.0",
      "axios": "^1.5.0"
    }
  }, null, 2),

  "deployment_nexus.ts": `
import { PhoenixService } from './phoenix';

// --- DEPLOYMENT NEXUS CLI ---
// The Universal Entry Point for Swarm Artifact Generation

async function deploy() {
    console.log("INITIATING PHOENIX PROTOCOL...");
    
    // 1. AUTHENTICATE
    const session = await PhoenixService.login();
    
    // 2. VERIFY LICENSE
    await PhoenixService.verifyLicense(session.token);
    
    // 3. FETCH KERNEL
    const payload = await PhoenixService.fetchCoreFeatures(session.token);
    
    console.log("Kernel Version:", payload.version);
    console.log("Kernel Bundle Size:", payload.kernel_bundle.length, "bytes");
}
`,

  "api_gateway_spec.yaml": `
openapi: 3.0.0
info:
  title: Phoenix Core Distribution API
  version: v1
paths:
  /api/v1/core-features:
    get:
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Returns the Source Code Payload
          content:
            application/json:
              schema:
                type: object
                properties:
                  version:
                    type: string
                  kernel_bundle:
                    type: string
                    description: The pre-compiled CommonJS bundle source.
                  modules:
                    type: array
`,
  "omni_sentinel_core.ts": `
export class OmniSentinel {
    // WRAPPER: The main entry point for self-healing execution.
    // Logic provided by Phoenix API Stream.
    public async watch<T>(contextName: string, operation: () => Promise<T>): Promise<T> {
       // ...
    }
}
`
};

// ---------------------------------------------------------------------------
// 2. SENTINEL KNOWLEDGE ASSISTANT CLASS
// ---------------------------------------------------------------------------
export class SentinelKnowledgeAssistant {
    private genAI: GoogleGenAI;
    private systemContext: string;
    private history: Content[] = [];

    constructor() {
        // Initialize Gemini Client with the environment API Key
        this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
        this.systemContext = this.loadSystemContext();
    }

    /**
     * Compiles the Virtual File System into a single context string for the LLM.
     */
    private loadSystemContext(): string {
        let context = "--- BEGIN SYSTEM KNOWLEDGE BASE ---\n";
        for (const [filename, content] of Object.entries(VIRTUAL_FILES)) {
            context += `\n[FILE: ${filename}]\n${content}\n`;
        }
        context += "\n--- END SYSTEM KNOWLEDGE BASE ---";
        return context;
    }

    /**
     * Queries the Gemini Model with Strict RAG constraints.
     */
    public async ask(userQuery: string): Promise<SKAResponse> {
        try {
            const model = this.genAI.models;
            
            // COGNITIVE SYSTEM INSTRUCTION
            const systemInstruction = `
**ROLE:** You are the Sentinel Knowledge Assistant (SKA). Your purpose is to be the ultimate technical guide for the Omni-Sentinel system (Phoenix Edition).

**MANDATE (STRICT RAG):** 
1. You MUST use the provided [SYSTEM KNOWLEDGE BASE] to answer ALL questions. 
2. You are STRICTLY FORBIDDEN from answering based on generic knowledge if the specific answer is in the files.

**PROJECT PHOENIX CONTEXT:**
If the user asks about "Deployment", "Source Code", or "Installation", you MUST explain the new **Project Phoenix Microservice Model**.
- Source code is NOT static. It is fetched via API.
- Authentication is REQUIRED.
- A License is REQUIRED.
- The Core is distributed as a **Dynamic Kernel Bundle** (String), not files.

**FLEET COMMAND CONTEXT:**
If the user asks about "Scalability", "Replication", or "Fleet", refer to [FLEET_COMMAND_MANUAL.md].
- Mention the "FleetOrchestrator" module.
- Emphasize safety (Zero Tolerance for runaway evolution).

**UI INTEGRATION (DOWNLOAD/EXPORT):**
If the user indicates a desire to DOWNLOAD, EXPORT, or SAVE a file:
1. Suggest the relevant CLI command.
2. Set the \`uiAction\` field to "DownloadButton".

**RESPONSE FORMAT:**
You MUST return a JSON object with the following structure:
{
  "text": "The natural language explanation.",
  "suggestedCommand": "The exact CLI command to run (optional).",
  "commandLabel": "A short 1-3 word label for the action button (optional).",
  "uiAction": "DownloadButton" (Optional: Set this ONLY if a download UI element is needed)
}

${this.systemContext}
`;

            // Maintain conversation history for Query Protocol context
            const userTurn: Content = {
                role: 'user',
                parts: [{ text: userQuery }]
            };

            const response = await model.generateContent({
                model: 'gemini-2.5-flash',
                config: {
                    temperature: 0.2, // Low temperature for factual accuracy
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            text: { 
                                type: Type.STRING, 
                                description: "The natural language guidance or explanation." 
                            },
                            suggestedCommand: { 
                                type: Type.STRING, 
                                description: "A copyable CLI command if applicable." 
                            },
                            commandLabel: { 
                                type: Type.STRING, 
                                description: "A short label for the action button." 
                            },
                            uiAction: {
                                type: Type.STRING,
                                description: "Enum: 'DownloadButton' or null. Use 'DownloadButton' when the user wants to download/export."
                            }
                        },
                        required: ["text"]
                    }
                },
                contents: [...this.history, userTurn]
            });

            const resultText = response.text;
            if (!resultText) {
                throw new Error("Empty response from SKA.");
            }

            // Update history
            this.history.push(userTurn);
            this.history.push({
                role: 'model',
                parts: [{ text: resultText }]
            });

            return JSON.parse(resultText) as SKAResponse;

        } catch (error) {
            console.error("SKA RAG Error:", error);
            // Fallback response if RAG fails
            return {
                text: "CRITICAL FAILURE: Neural Link to Knowledge Base disrupted. Unable to retrieve context.",
                suggestedCommand: "npm run preflight",
                commandLabel: "RETRY_CONNECT"
            };
        }
    }

    // Compatibility alias
    public guideUser(query: string): Promise<SKAResponse> {
        return this.ask(query);
    }
}
