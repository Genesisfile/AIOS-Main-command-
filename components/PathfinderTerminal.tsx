
import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal, Shield, Upload, Download, Activity, Key, Globe, Play, FileCode, Wifi, Send, Cloud, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { PathfinderClient } from '../api/pathfinder';

interface PathfinderTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPLINK_SOURCE_CODE = `/**
 * PATHFINDER UPLINK PROTOCOL V3.0 (Omni-Shell Edition)
 * INTEGRATED COMMAND, CONTROL & GIT EVOLUTION
 * 
 * USAGE: node pathfinder_uplink.js
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

const CONFIG = {
    apiKey: process.env.VITE_PHOENIX_API_KEY,
    gateway: process.env.VITE_PHOENIX_GATEWAY,
    hive_id: process.env.VITE_PHOENIX_HIVE_ID
};

// --- TERMINAL VISUALS ---
const C = {
    Reset: "\\\\x1b[0m",
    Bright: "\\\\x1b[1m",
    Green: "\\\\x1b[32m",
    Cyan: "\\\\x1b[36m",
    Red: "\\\\x1b[31m",
    Yellow: "\\\\x1b[33m",
    Dim: "\\\\x1b[2m",
    Purple: "\\\\x1b[35m"
};

const log = (msg, type = 'INFO') => {
    const ts = new Date().toISOString().split('T')[1].replace('Z','');
    let color = C.Cyan;
    if (type === 'SUCCESS') color = C.Green;
    if (type === 'WARN') color = C.Yellow;
    if (type === 'ERROR') color = C.Red;
    if (type === 'SHELL') color = C.Dim;
    if (type === 'GIT') color = C.Purple;
    console.log(\`\${C.Bright}[\${ts}] [\${type}] \${color}\${msg}\${C.Reset}\`);
};

// --- SHELL COMMANDER ENGINE ---
class ShellCommander {
    static async run(cmd, label) {
        if (label) log(\`EXEC: \${label} (\${cmd})\`, 'SHELL');
        return new Promise((resolve) => {
            exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
                if (error) {
                    resolve({ success: false, output: stderr || error.message });
                } else {
                    resolve({ success: true, output: stdout.trim() });
                }
            });
        });
    }
}

// --- GIT EVOLUTION PROTOCOL ---
class GitEvolutionProtocol {
    static async checkStatus() {
        const isGit = fs.existsSync(path.join(process.cwd(), '.git'));
        if (!isGit) return { active: false, reason: "No .git directory" };

        const remote = await ShellCommander.run('git config --get remote.origin.url');
        const status = await ShellCommander.run('git status --short');
        const branch = await ShellCommander.run('git rev-parse --abbrev-ref HEAD');

        return {
            active: true,
            remote: remote.output,
            branch: branch.output,
            dirty: status.output.length > 0,
            status: status.output
        };
    }

    static async autoCommit(message) {
        log("Initiating Auto-Commit Protocol...", "GIT");
        await ShellCommander.run('git add .');
        await ShellCommander.run(\`git commit -m "feat(hive-mind): \${message}"\`);
        log("Changes committed to local HEAD.", "GIT");
    }
}

// --- MAIN SEQUENCE ---
async function uplink() {
    console.clear();
    log(\`INITIALIZING HIVE MIND UPLINK...\`, 'INFO');
    log(\`TARGET: \${CONFIG.hive_id}\`, 'INFO');
    
    // 1. SYSTEM RECONNAISSANCE
    log("--- SYSTEM RECONNAISSANCE ---", 'WARN');
    
    const RECON_TASKS = [
        { cmd: 'whoami', label: 'USER_ID' },
        { cmd: 'uname -srm', label: 'KERNEL_VER' },
        { cmd: 'node -v', label: 'NODE_RUNTIME' }
    ];

    const contextData = {};

    for (const task of RECON_TASKS) {
        const res = await ShellCommander.run(task.cmd, task.label);
        if (res.success) {
            contextData[task.label] = res.output;
            log(\`> \${res.output}\`, 'SUCCESS');
        } else {
            log(\`> FAILED: \${res.output}\`, 'ERROR');
        }
        await sleep(200);
    }

    // 2. GIT AWARENESS
    log("--- GIT REPOSITORY SCAN ---", 'WARN');
    const gitState = await GitEvolutionProtocol.checkStatus();
    if (gitState.active) {
        log(\`REPO DETECTED: \${gitState.remote}\`, 'GIT');
        log(\`BRANCH: \${gitState.branch}\`, 'GIT');
        if (gitState.dirty) {
            log("Uncommitted changes detected.", 'WARN');
            // log(gitState.status, 'SHELL'); 
        } else {
            log("Working tree clean.", 'SUCCESS');
        }
        contextData['GIT'] = gitState;
    } else {
        log("No Git repository found.", 'INFO');
    }

    // 3. HIVE MIND EXPORT
    log("--- INITIATING EXPORT ---", 'WARN');
    await sleep(800);
    log("Bundling Context Data...", 'INFO');
    
    // Simulate Upload
    log("Transmitting to Phoenix Gateway...", 'INFO');
    await sleep(1500);
    log("PAYLOAD RECEIVED BY HIVE MIND.", 'SUCCESS');
    
    // 4. OPTIMIZATION LOOP
    log("--- AWAITING DIRECTIVES ---", 'WARN');
    log("Sentinel Active. Listening for remote shell commands...", 'INFO');
    
    // Mock Listening Loop
    let cycle = 0;
    setInterval(() => {
        cycle++;
        if (cycle % 10 === 0) {
            // Heartbeat
            // process.stdout.write('.'); 
        }
    }, 1000);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

uplink().catch(e => {
    log(e.message, 'ERROR');
    process.exit(1);
});
`;

const PathfinderTerminal: React.FC<PathfinderTerminalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_PHOENIX_API_KEY || '');
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'SCAN' | 'EXPORT' | 'UPLINK' | 'VERIFY'>('UPLINK');
  const [commandInput, setCommandInput] = useState("");
  
  // Verify State
  const [verifyEndpoint, setVerifyEndpoint] = useState('');
  const [verifyKey, setVerifyKey] = useState('');

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        addLog("PATHFINDER SDK INITIALIZED.");
        addLog("READY FOR OPERATIONS.");
    } else {
        setLogs([]);
        setVerifyEndpoint('');
        setVerifyKey('');
    }
  }, [isOpen]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string, type: 'INFO' | 'SUCCESS' | 'ERROR' | 'SHELL' = 'INFO') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'INFO' ? '[INFO]' : type === 'SUCCESS' ? '[SUCCESS]' : type === 'SHELL' ? '[SHELL]' : '[ERROR]';
    const colorClass = type === 'INFO' ? 'text-gray-400' : type === 'SUCCESS' ? 'text-neon-green' : type === 'SHELL' ? 'text-neon-cyan' : 'text-neon-red';
    setLogs(prev => [...prev, \`<span class="text-gray-600 font-mono text-[10px] mr-2">\${timestamp}</span><span class="\${colorClass}">\${prefix} \${msg}</span>\`]);
  };

  const handleDownloadUplink = () => {
      try {
          const blob = new Blob([UPLINK_SOURCE_CODE], { type: 'text/typescript' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'pathfinder_uplink.js';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          addLog("UPLINK SCRIPT DOWNLOADED.", 'SUCCESS');
      } catch (e: any) {
          addLog("DOWNLOAD FAILED: " + e.message, 'ERROR');
      }
  };

  const handleGKEAuth = () => {
    const cmd = "gcloud container clusters get-credentials autopilot-cluster-1 --region us-central1 --project clu-481110";
    setCommandInput(cmd);
    setTimeout(() => {
        handleSendCommand(null, cmd);
    }, 100);
  };

  const handleSendCommand = (e: React.FormEvent | null, overrideCmd?: string) => {
      if (e) e.preventDefault();
      const cmd = overrideCmd || commandInput;
      if(!cmd.trim()) return;
      
      setCommandInput("");
      
      addLog(\`Sending directive to Uplink: "\${cmd}"\`, 'SHELL');
      
      // Simulation of sending command to remote
      setTimeout(() => {
          if (cmd === 'ls') {
              addLog("drwxr-xr-x node_modules\\n-rw-r--r-- package.json\\n-rw-r--r-- pathfinder_uplink.js", 'INFO');
          } else if (cmd.startsWith('git status')) {
              addLog("On branch main\\nYour branch is up to date with 'origin/main'.\\n\\nnothing to commit, working tree clean", 'INFO');
          } else if (cmd.includes('gcloud container clusters get-credentials')) {
              addLog("Fetching cluster endpoint and auth data...", 'INFO');
              setTimeout(() => {
                 addLog("kubeconfig entry generated for autopilot-cluster-1.", 'SUCCESS');
                 addLog("Context switched to: gke_clu-481110_us-central1_autopilot-cluster-1", 'INFO');
              }, 600);
          } else {
              addLog(\`Command executed. (PID: \${Math.floor(Math.random()*9000)+1000})\`, 'SUCCESS');
          }
      }, 600);
  };

  const handleScan = async () => {
    setIsProcessing(true);
    addLog("--- STARTING VULNERABILITY SCAN ---", 'INFO');
    addLog(\`TARGET: Production Web Server\`, 'INFO');
    
    try {
        const result = await PathfinderClient.scan(apiKey, {
            targetName: 'Production Web Server',
            payload: 'base64_encoded_snapshot',
            assetType: 'NETWORK_MAP'
        });
        
        addLog(\`SCAN COMPLETE. ID: \${result.scanId}\`, 'SUCCESS');
        if (result.findings.length > 0) {
            addLog(\`DETECTED \${result.findings.length} VULNERABILITIES:\`, 'ERROR');
            result.findings.forEach(f => {
                 addLog(\`[\${f.severity}] \${f.id}: \${f.description}\`, 'INFO');
            });
        }
    } catch (e: any) {
        addLog(\`SCAN FAILED: \${e.message}\`, 'ERROR');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    addLog("--- REQUESTING SYSTEM EXPORT ---", 'INFO');
    addLog("RUNTIME: Cloud Run / Docker", 'INFO');
    
    try {
        const result = await PathfinderClient.requestCustomExport(apiKey, {
            targetRuntime: "Cloud Run",
            requiredFeatures: ["quantum-encryption", "self-healing-logic"],
            baseVersion: "v4.2.0"
        });
        
        addLog(\`EXPORT SUCCESSFUL. BUNDLE READY.\`, 'SUCCESS');
        addLog(\`ID: \${result.exportId}\`, 'INFO');
        
        const jsonString = JSON.stringify(result.integrationManifest, null, 2);
        const codeBlock = \`
<div class="mt-2 mb-2 p-3 bg-neon-purple/5 border border-neon-purple/50 rounded-sm relative group">
  <div class="absolute top-0 right-0 bg-neon-purple text-black text-[9px] px-2 py-0.5 font-bold uppercase">Builder Config</div>
  <pre class="text-[10px] font-mono text-neon-purple whitespace-pre-wrap">\${jsonString}</pre>
</div>
        \`;
        setLogs(prev => [...prev, codeBlock]);
        addLog(\`PACKET TRANSMITTED. READY FOR INSTANT INJECTION.\`, 'SUCCESS');

    } catch (e: any) {
        addLog(\`EXPORT FAILED: \${e.message}\`, 'ERROR');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleVerifyUplink = async () => {
      if (!verifyEndpoint || !verifyKey) return;
      setIsProcessing(true);
      addLog("--- INITIATING UPLINK HANDSHAKE ---", 'INFO');
      addLog(\`RESOLVING: \${verifyEndpoint.replace('https://', '')}\`, 'INFO');
      
      try {
          const result = await PathfinderClient.verifyUplink(verifyEndpoint, verifyKey);
          
          addLog(\`CONNECTION ESTABLISHED. LATENCY: \${result.latency}\`, 'SUCCESS');
          addLog(\`NODE ID: \${result.nodeId}\`, 'INFO');
          addLog(\`TIME REMAINING: \${result.expiry}\`, 'INFO');
          addLog(\`INTEGRITY CHECK: \${result.integrity}\`, 'SUCCESS');
          
      } catch (e: any) {
          addLog(\`HANDSHAKE FAILED: \${e.message}\`, 'ERROR');
      } finally {
          setIsProcessing(false);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] bg-cyber-black border border-cyber-border shadow-[0_0_80px_rgba(255,0,255,0.1)] flex flex-col relative overflow-hidden rounded-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-panel shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 border border-neon-purple/50 rounded-sm bg-neon-purple/10">
               <Globe className="w-6 h-6 text-neon-purple" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-widest font-mono uppercase">Pathfinder Export API</h2>
              <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                 SDK_VERSION: 2.1.0 <span className="text-cyber-border">|</span> STATUS: ONLINE
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r border-cyber-border bg-black/40 p-4 flex flex-col gap-2 shrink-0">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Operations</div>
                
                <button 
                    onClick={() => setActiveTab('UPLINK')}
                    className={\`text-left p-3 rounded-sm border transition-all duration-200 flex items-center gap-2 \${activeTab === 'UPLINK' ? 'bg-neon-purple/20 border-neon-purple text-white' : 'border-transparent text-gray-400 hover:bg-white/5'}\`}
                >
                    <Wifi className="w-4 h-4" /> Uplink Protocol
                </button>

                <button 
                    onClick={() => setActiveTab('SCAN')}
                    className={\`text-left p-3 rounded-sm border transition-all duration-200 flex items-center gap-2 \${activeTab === 'SCAN' ? 'bg-neon-purple/20 border-neon-purple text-white' : 'border-transparent text-gray-400 hover:bg-white/5'}\`}
                >
                    <Shield className="w-4 h-4" /> Vulnerability Scan
                </button>
                
                <button 
                    onClick={() => setActiveTab('EXPORT')}
                    className={\`text-left p-3 rounded-sm border transition-all duration-200 flex items-center gap-2 \${activeTab === 'EXPORT' ? 'bg-neon-purple/20 border-neon-purple text-white' : 'border-transparent text-gray-400 hover:bg-white/5'}\`}
                >
                    <Upload className="w-4 h-4" /> System Export
                </button>

                <div className="h-px bg-cyber-border my-2"></div>

                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Network Diagnostics</div>
                <button 
                    onClick={() => setActiveTab('VERIFY')}
                    className={\`text-left p-3 rounded-sm border transition-all duration-200 flex items-center gap-2 \${activeTab === 'VERIFY' ? 'bg-neon-purple/20 border-neon-purple text-white' : 'border-transparent text-gray-400 hover:bg-white/5'}\`}
                >
                    <Radio className="w-4 h-4" /> Verify Uplink
                </button>

                <div className="mt-auto">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</div>
                     <button 
                        onClick={handleGKEAuth}
                        className="w-full text-left p-2 rounded-sm border border-cyber-border hover:border-neon-cyan/50 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-all flex items-center gap-2 text-[10px] font-mono"
                    >
                        <Cloud className="w-3 h-3" /> GKE Auth (Cluster-1)
                    </button>

                    <div className="h-px bg-cyber-border my-2"></div>
                    
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Configuration</div>
                    <div className="bg-black border border-cyber-border p-3 rounded-sm">
                        <div className="flex items-center gap-2 text-neon-gold text-xs font-bold mb-2">
                            <Key className="w-3 h-3" /> API KEY
                        </div>
                        <input 
                            type="text" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-cyber-dark border border-gray-700 rounded-sm px-2 py-1 text-[10px] font-mono text-gray-300 focus:border-neon-purple outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col bg-cyber-dark relative">
                {/* Visualizer */}
                <div className="h-2/3 border-b border-cyber-border p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-purple/5 via-transparent to-transparent"></div>
                    
                    {activeTab === 'UPLINK' && (
                         <div className="w-full h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4 z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-widest flex items-center gap-2">
                                        <Wifi className="w-6 h-6 text-neon-purple" /> UPLINK PROTOCOL
                                    </h3>
                                    <p className="text-gray-400 text-xs font-mono mt-1">Direct connection bridge for local environments.</p>
                                </div>
                                <button
                                    onClick={handleDownloadUplink}
                                    className="bg-neon-purple text-black px-6 py-2 font-bold font-mono tracking-wider hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(191,0,255,0.4)]"
                                >
                                    <Download className="w-4 h-4" /> DOWNLOAD SCRIPT (.JS)
                                </button>
                            </div>
                            <div className="flex-1 bg-black border border-cyber-border rounded-sm p-4 overflow-hidden relative z-10">
                                <div className="absolute top-0 right-0 bg-neon-purple text-black text-[10px] px-2 py-0.5 font-bold">pathfinder_uplink.js</div>
                                <pre className="text-[10px] font-mono text-gray-300 whitespace-pre-wrap h-full overflow-y-auto custom-scrollbar">
                                    {UPLINK_SOURCE_CODE}
                                </pre>
                            </div>
                         </div>
                    )}

                    {activeTab === 'SCAN' && (
                        <div className="text-center z-10">
                            <Shield className={\`w-16 h-16 mx-auto mb-4 \${isProcessing ? 'text-neon-purple animate-pulse' : 'text-gray-500'}\`} />
                            <h3 className="text-2xl font-bold text-white tracking-widest mb-2">VULNERABILITY SCANNER</h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 font-mono">
                                Scans target infrastructure for security gaps, misconfigurations, and outdated protocols.
                            </p>
                            <button 
                                onClick={handleScan}
                                disabled={isProcessing}
                                className="bg-neon-purple text-black px-8 py-3 font-bold font-mono tracking-wider hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                            >
                                {isProcessing ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                RUN DIAGNOSTIC
                            </button>
                        </div>
                    )}

                    {activeTab === 'EXPORT' && (
                        <div className="text-center z-10">
                            <FileCode className={\`w-16 h-16 mx-auto mb-4 \${isProcessing ? 'text-neon-purple animate-pulse' : 'text-gray-500'}\`} />
                            <h3 className="text-2xl font-bold text-white tracking-widest mb-2">CLOUD RUN EXPORT</h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 font-mono">
                                Generates a self-contained runtime bundle for large-scale Google Cloud Run deployments.
                            </p>
                            <button 
                                onClick={handleExport}
                                disabled={isProcessing}
                                className="bg-neon-purple text-black px-8 py-3 font-bold font-mono tracking-wider hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                            >
                                {isProcessing ? <Activity className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                REQUEST EXPORT BUNDLE
                            </button>
                        </div>
                    )}

                    {activeTab === 'VERIFY' && (
                        <div className="w-full max-w-lg mx-auto z-10 flex flex-col gap-6">
                            <div className="text-center">
                                <Activity className={\`w-12 h-12 mx-auto mb-4 \${isProcessing ? 'text-neon-green animate-pulse' : 'text-gray-500'}\`} />
                                <h3 className="text-xl font-bold text-white tracking-widest">UPLINK VERIFICATION</h3>
                                <p className="text-gray-500 text-xs font-mono">Validate connectivity to Sovereign Nodes.</p>
                            </div>
                            
                            <div className="bg-black/40 border border-cyber-border p-6 rounded-sm space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Target Endpoint</label>
                                    <input 
                                        type="text"
                                        placeholder="https://api.hive-mind-exports.io/v1/sovereign/..."
                                        className="w-full bg-cyber-dark border border-gray-700 p-2 text-xs font-mono text-white focus:outline-none focus:border-neon-purple"
                                        value={verifyEndpoint}
                                        onChange={(e) => setVerifyEndpoint(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Secure Access Key</label>
                                    <input 
                                        type="text"
                                        placeholder="sk_sovereign_..."
                                        className="w-full bg-cyber-dark border border-gray-700 p-2 text-xs font-mono text-neon-purple focus:outline-none focus:border-neon-purple"
                                        value={verifyKey}
                                        onChange={(e) => setVerifyKey(e.target.value)}
                                    />
                                </div>
                                <button 
                                    onClick={handleVerifyUplink}
                                    disabled={isProcessing || !verifyEndpoint || !verifyKey}
                                    className="w-full bg-neon-green/20 text-neon-green border border-neon-green/50 py-3 font-bold font-mono hover:bg-neon-green hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Activity className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    ESTABLISH HANDSHAKE
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Console */}
                <div className="flex-1 bg-black flex flex-col">
                    <div className="bg-cyber-panel border-b border-cyber-border px-4 py-1 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <Terminal className="w-3 h-3" /> System Logs
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono">
                            TAIL -F
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
                        {logs.map((log, i) => (
                            <div key={i} dangerouslySetInnerHTML={{ __html: log }} />
                        ))}
                        <div ref={logsEndRef} />
                        {isProcessing && <div className="text-neon-purple animate-pulse">_</div>}
                    </div>
                    
                    {/* Command Injection for Uplink */}
                    {activeTab === 'UPLINK' && (
                        <form onSubmit={handleSendCommand} className="p-2 border-t border-cyber-border bg-cyber-dark flex gap-2">
                            <span className="text-neon-cyan font-mono text-sm pt-1">$</span>
                            <input 
                                className="flex-1 bg-transparent border-none text-white font-mono text-xs focus:ring-0 outline-none"
                                placeholder="Inject command to Uplink (e.g. ls, git status)"
                                value={commandInput}
                                onChange={(e) => setCommandInput(e.target.value)}
                            />
                            <button type="submit" className="text-neon-cyan hover:text-white transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PathfinderTerminal;
