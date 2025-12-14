

import React, { useState, useEffect } from 'react';
import { X, Server, Cloud, Laptop, Database, Shield, Zap, Terminal, Download, CheckCircle2, Loader2, Code, Package, Bug, AlertTriangle, Archive, Lock, Fingerprint, ScanLine, Globe, BrainCircuit, Rocket, Copy, ExternalLink, Activity } from 'lucide-react';
import { GENERATE_ARTIFACTS } from '../api/deployment';
import JSZip from 'jszip';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODULES = [
  { id: 'HFT_ARBITRAGE_CORE', label: 'Financial Arbitrage', icon: Zap, desc: 'HFT Bot, Risk Engine, Market Connectors' },
  { id: 'AEGIS_FIREWALL_DAEMON', label: 'Sec. Aegis Daemon', icon: Shield, desc: 'IPS/IDS Rules, Threat Intel Feed' },
  { id: 'SWARM_INFRA_MESH', label: 'Infra Swarm Mesh', icon: Server, desc: 'K8s Manifests, Terraform, IoT Scripts' },
  { id: 'OMNI_RESEARCH_PIPELINE', label: 'Research Pipeline', icon: Database, desc: 'Jupyter Notebooks, Data Scrapers' },
  { id: 'OMNI_DEBUG_SENTINEL', label: 'Omni-Heal Sentinel', icon: Bug, desc: 'Project Phoenix: Remote Microservice' },
  { id: 'VERTEX_AI_SCANNER', label: 'Vertex AI Scanner', icon: ScanLine, desc: 'Cloud Function: Gemini Pro Integration' },
  { id: 'PATHFINDER_EXPORT_SERVICE', label: 'Pathfinder Export', icon: Globe, desc: 'Cloud Run: Large Scale System Export API' },
  { id: 'OMNI_HIVE_MIND_CORE', label: 'Vertex Hive Mind', icon: BrainCircuit, desc: 'Cloud Run: Closed-Loop Evolving System (Strict Protocols)' },
];

const TARGETS = [
  { id: 'LOCAL_HOST', label: 'Local Host', icon: Laptop, desc: 'Scripts for Personal Devices' },
  { id: 'CONTAINER_CLUSTER', label: 'Container Cluster', icon: Package, desc: 'Docker/K8s Manifests' },
  { id: 'HYPERSCALE_CLOUD', label: 'Hyperscale Cloud', icon: Cloud, desc: 'Terraform/AWS/GCP Configs' },
];

const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose }) => {
  const [selectedModule, setSelectedModule] = useState(MODULES[0].id);
  const [selectedTarget, setSelectedTarget] = useState(TARGETS[0].id);
  
  // Phoenix Auth State
  const [phoenixAuthState, setPhoenixAuthState] = useState<'IDLE' | 'AUTHENTICATING' | 'AUTHORIZED' | 'DENIED'>('IDLE');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState("");
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [step, setStep] = useState(1); // 1: Config, 2: Generation, 3: Download, 4: Launching, 5: Live
  const [launchLogs, setLaunchLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
        setStep(1);
        setArtifacts([]);
        setSuggestions([]);
        setIsGenerating(false);
        setPhoenixAuthState('IDLE');
        setLaunchLogs([]);
    }
  }, [isOpen]);

  useEffect(() => {
      // Reset auth state if module changes away from Sentinel
      if (selectedModule !== 'OMNI_DEBUG_SENTINEL') {
          setPhoenixAuthState('IDLE');
      }
  }, [selectedModule]);

  const handlePhoenixAuth = async () => {
      setPhoenixAuthState('AUTHENTICATING');
      // Simulate Auth & License Check Latency
      await new Promise(r => setTimeout(r, 2000));
      setPhoenixAuthState('AUTHORIZED');
  };

  const handleGenerate = async () => {
    setStep(2);
    setIsGenerating(true);
    
    if (selectedModule === 'OMNI_DEBUG_SENTINEL') {
        setGenerationPhase("PHOENIX_PROTOCOL_HANDSHAKE");
        await new Promise(r => setTimeout(r, 1000));
        setGenerationPhase("VERIFYING_LICENSE_SIGNATURE");
        await new Promise(r => setTimeout(r, 1000));
        setGenerationPhase("FETCHING_REMOTE_KERNEL");
    } else if (selectedModule === 'OMNI_HIVE_MIND_CORE') {
        setGenerationPhase("INITIALIZING_FLEET_COMMANDER");
        await new Promise(r => setTimeout(r, 800));
        setGenerationPhase("BUNDLING_SUBSYSTEMS");
        await new Promise(r => setTimeout(r, 800));
        setGenerationPhase("CONFIGURING_ORCHESTRATOR");
    } else {
        setGenerationPhase("ANALYZING_TARGET_ENV");
        await new Promise(r => setTimeout(r, 800));
        setGenerationPhase("BUNDLING_ARTIFACTS");
    }
    
    const result = await GENERATE_ARTIFACTS(selectedModule, selectedTarget);
    
    // Simulated Suggestions
    const newSuggestions = [];
    if (selectedModule === 'OMNI_DEBUG_SENTINEL') {
        newSuggestions.push("Authenticated via Phoenix Microservice.");
        newSuggestions.push("Retrieved Version: 9.9.9-PHOENIX.");
        newSuggestions.push("License Signature Verified.");
    } else if (selectedModule === 'VERTEX_AI_SCANNER') {
        newSuggestions.push("Cloud Function configured for 'us-central1'.");
        newSuggestions.push("IAM permissions: Ensure 'Vertex AI User' role is assigned.");
        newSuggestions.push("Environment variables placeholder added for Project ID.");
    } else if (selectedModule === 'PATHFINDER_EXPORT_SERVICE') {
        newSuggestions.push("Docker container configured for Cloud Run.");
        newSuggestions.push("Port 8080 exposed by default.");
        newSuggestions.push("API Key protection enabled via env var.");
    } else if (selectedModule === 'OMNI_HIVE_MIND_CORE') {
        newSuggestions.push("Safety Protocol 'Aethelgard' active by default.");
        newSuggestions.push("Background Thread configured for continuous optimization.");
        newSuggestions.push("Fleet Commander Status: ACTIVE (6 Subsystems Bundled).");
    } else {
        newSuggestions.push("Added standard 'README.md' for deployment guidance.");
    }
    setSuggestions(newSuggestions);

    setArtifacts(result);
    setIsGenerating(false);
    setStep(3);
  };

  const handleDirectLaunch = async () => {
      setStep(4);
      const logs = [
          "Authenticating with Google Cloud Platform...",
          "Setting project context: swarm-singularity-prod...",
          "Enabling Cloud Build API...",
          "Submitting build to Google Container Registry...",
          "Step 1/3: Building Docker Container...",
          "Step 2/3: Pushing image gcr.io/swarm/hive-mind:latest...",
          "Step 3/3: Deploying to Cloud Run (us-central1)...",
          "Routing traffic...",
          "Setting IAM Policy: Allow Unauthenticated...",
          "SERVICE_LIVE: https://hive-mind-x92.a.run.app"
      ];
      
      for (const log of logs) {
          await new Promise(r => setTimeout(r, 800));
          setLaunchLogs(prev => [...prev, log]);
      }
      
      setStep(5);
  };

  const downloadArtifact = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    try {
        const zip = new JSZip();
        if (suggestions.length > 0) {
            zip.file("SYSTEM_SUGGESTIONS.txt", suggestions.join("\n"));
        }
        artifacts.forEach(art => {
            zip.file(art.filename, art.content);
        });
        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SWARM_${selectedModule}_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error("Failed to generate ZIP archive", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-[90vh] bg-cyber-black border border-cyber-border shadow-[0_0_50px_rgba(0,243,255,0.1)] flex flex-col relative overflow-hidden rounded-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-panel shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 border border-neon-cyan/50 rounded-sm bg-neon-cyan/10">
               <Terminal className="w-6 h-6 text-neon-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-widest font-mono uppercase">Deployment Nexus</h2>
              <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                 REAL_WORLD_INTEGRATION_PROTOCOL <span className="text-cyber-border">|</span> V1.0
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar: Module Selection */}
            <div className="w-64 border-r border-cyber-border bg-black/50 p-4 flex flex-col gap-2 overflow-y-auto shrink-0 hidden md:flex">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-2">Select Capability Module</div>
                {MODULES.map((mod) => (
                    <button
                        key={mod.id}
                        onClick={() => { setSelectedModule(mod.id); setStep(1); }}
                        className={`text-left p-3 rounded-sm border transition-all duration-200 group ${
                            selectedModule === mod.id
                            ? 'bg-neon-cyan/10 border-neon-cyan text-white'
                            : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <mod.icon className={`w-4 h-4 ${selectedModule === mod.id ? 'text-neon-cyan' : 'text-gray-500'}`} />
                            <span className="font-bold text-sm truncate">{mod.label}</span>
                        </div>
                        <div className="text-[10px] opacity-70 leading-tight">{mod.desc}</div>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-cyber-dark relative overflow-y-auto">
                
                {step === 1 && (
                    <div className="flex-1 p-8 flex flex-col items-center justify-center animate-in slide-in-from-right-4 duration-300 min-h-[500px]">
                        <h3 className="text-2xl font-bold text-white mb-8 tracking-wide">SELECT TARGET ENVIRONMENT</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
                            {TARGETS.map((tgt) => (
                                <button
                                    key={tgt.id}
                                    onClick={() => setSelectedTarget(tgt.id)}
                                    className={`relative p-6 rounded-sm border-2 transition-all duration-300 flex flex-col items-center text-center gap-4 group hover:scale-105 ${
                                        selectedTarget === tgt.id
                                        ? 'bg-neon-purple/10 border-neon-purple shadow-[0_0_20px_rgba(191,0,255,0.2)]'
                                        : 'bg-cyber-panel border-cyber-border hover:border-gray-500'
                                    }`}
                                >
                                    <div className={`p-4 rounded-full ${selectedTarget === tgt.id ? 'bg-neon-purple text-black' : 'bg-black border border-gray-700 text-gray-400'}`}>
                                        <tgt.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className={`font-bold text-lg mb-1 ${selectedTarget === tgt.id ? 'text-neon-purple' : 'text-gray-300'}`}>{tgt.label}</div>
                                        <div className="text-xs text-gray-500">{tgt.desc}</div>
                                    </div>
                                    {selectedTarget === tgt.id && (
                                        <div className="absolute top-2 right-2">
                                            <CheckCircle2 className="w-5 h-5 text-neon-purple" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* PHOENIX GATEWAY / GENERATE BUTTON */}
                        {selectedModule === 'OMNI_DEBUG_SENTINEL' ? (
                            <div className="w-full max-w-md bg-black border border-neon-cyan/30 p-6 rounded-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-pulse"></div>
                                
                                {phoenixAuthState === 'IDLE' && (
                                    <div className="text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="p-3 bg-neon-cyan/10 rounded-full border border-neon-cyan/50">
                                                <Lock className="w-8 h-8 text-neon-cyan" />
                                            </div>
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-2">RESTRICTED ACCESS</h4>
                                        <p className="text-gray-400 text-xs mb-6 font-mono">
                                            The Omni-Heal Kernel is distributed via the secure Phoenix Microservice. Authentication required.
                                        </p>
                                        <button
                                            onClick={handlePhoenixAuth}
                                            className="w-full bg-neon-cyan text-black py-3 font-bold font-mono tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <Fingerprint className="w-5 h-5" /> AUTHENTICATE GATEWAY
                                        </button>
                                    </div>
                                )}

                                {phoenixAuthState === 'AUTHENTICATING' && (
                                    <div className="text-center py-4">
                                        <ScanLine className="w-12 h-12 text-neon-cyan mx-auto mb-4 animate-pulse" />
                                        <div className="text-neon-cyan font-mono text-sm animate-pulse">VERIFYING BIOMETRICS...</div>
                                        <div className="text-gray-500 font-mono text-xs mt-2">Checking OMNI-HEAL License DB...</div>
                                    </div>
                                )}

                                {phoenixAuthState === 'AUTHORIZED' && (
                                    <div className="text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="p-3 bg-neon-green/10 rounded-full border border-neon-green/50">
                                                <CheckCircle2 className="w-8 h-8 text-neon-green" />
                                            </div>
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-2">ACCESS GRANTED</h4>
                                        <p className="text-gray-400 text-xs mb-6 font-mono">
                                            Session ID: PHX-{Math.floor(Math.random()*9999)}<br/>
                                            License: VERIFIED (TIER-1)
                                        </p>
                                        <button
                                            onClick={handleGenerate}
                                            className="w-full bg-neon-green text-black py-3 font-bold font-mono tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.4)]"
                                        >
                                            <Download className="w-5 h-5" /> FETCH CORE KERNEL
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                className="bg-neon-cyan text-black px-12 py-4 text-lg font-bold font-mono tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] clip-path-polygon"
                            >
                                INITIATE ARTIFACT GENERATION
                            </button>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
                        <Loader2 className="w-16 h-16 text-neon-cyan animate-spin mb-6" />
                        <div className="text-xl font-mono text-neon-cyan animate-pulse">{generationPhase.replace(/_/g, " ")}...</div>
                        <div className="mt-4 text-xs font-mono text-gray-500 flex flex-col items-center gap-1">
                            <span>Establishing secure tunnel...</span>
                            <span>Validating checksums...</span>
                            {selectedModule === 'OMNI_DEBUG_SENTINEL' && <span className="text-neon-purple">Downloading 4.2MB Kernel Blob...</span>}
                            {selectedModule === 'OMNI_HIVE_MIND_CORE' && <span className="text-neon-green">Aggregating 6 Sub-Modules...</span>}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex-1 p-8 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6 text-neon-green" />
                                    DEPLOYMENT PACKAGE READY
                                </h3>
                                <p className="text-sm text-gray-400 font-mono mt-1">
                                    Target: <span className="text-neon-purple">{selectedTarget}</span> // Module: <span className="text-neon-cyan">{selectedModule}</span>
                                </p>
                            </div>
                            <button 
                                onClick={() => setStep(1)}
                                className="text-xs text-gray-500 hover:text-white underline font-mono"
                            >
                                START OVER
                            </button>
                        </div>

                        {suggestions.length > 0 && (
                            <div className="bg-neon-gold/5 border border-neon-gold/20 p-4 mb-6 rounded-sm shrink-0">
                                <h4 className="text-neon-gold text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> System Suggestions & Fixes Applied
                                </h4>
                                <ul className="space-y-1">
                                    {suggestions.map((sug, i) => (
                                        <li key={i} className="text-gray-300 text-xs font-mono flex items-start gap-2">
                                            <span className="text-neon-gold/50 mt-0.5">{'>'}</span> {sug}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {artifacts.map((art, idx) => (
                                <div key={idx} className="flex flex-col bg-black border border-cyber-border rounded-sm overflow-hidden h-96">
                                    <div className="bg-cyber-panel px-4 py-2 border-b border-cyber-border flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-2 text-sm font-mono text-gray-300 truncate max-w-[80%]">
                                            <Code className="w-4 h-4 text-neon-gold shrink-0" />
                                            <span className="truncate" title={art.filename}>{art.filename}</span>
                                        </div>
                                        <button 
                                            onClick={() => downloadArtifact(art.filename, art.content)}
                                            className="p-1 hover:bg-white/10 rounded transition-colors text-neon-cyan shrink-0"
                                            title="Download File"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-auto p-4 bg-black/50 custom-scrollbar">
                                        <pre className="text-[10px] font-mono text-gray-400 whitespace-pre-wrap">
                                            {art.content}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pb-8 gap-4">
                            {selectedModule === 'OMNI_HIVE_MIND_CORE' && (
                                <button
                                    onClick={handleDirectLaunch}
                                    className="bg-neon-purple text-white px-8 py-3 font-bold font-mono tracking-wider hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(191,0,255,0.4)] flex items-center gap-2 animate-pulse"
                                >
                                    <Rocket className="w-5 h-5" /> INITIATE CLOUD LAUNCH
                                </button>
                            )}
                            <button
                                onClick={handleDownloadZip}
                                className="bg-neon-green text-black px-8 py-3 font-bold font-mono tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,157,0.3)] flex items-center gap-2"
                            >
                                <Archive className="w-5 h-5" /> DOWNLOAD FULL PACKAGE (.ZIP)
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex-1 bg-black p-8 font-mono text-xs overflow-y-auto">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold text-neon-cyan mb-6 flex items-center gap-2">
                                <Terminal className="w-6 h-6" /> DEPLOYMENT CONSOLE
                            </h3>
                            <div className="space-y-2">
                                {launchLogs.map((log, i) => (
                                    <div key={i} className="text-gray-300 animate-in slide-in-from-left-2 fade-in duration-300">
                                        <span className="text-green-500 mr-2">➜</span>
                                        {log}
                                    </div>
                                ))}
                                <div className="animate-pulse text-neon-cyan">_</div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="flex-1 p-8 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                         <div className="w-full max-w-2xl bg-cyber-panel border border-neon-green/30 rounded-sm p-8 text-center relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-1 bg-neon-green animate-pulse"></div>
                             
                             <div className="flex justify-center mb-6">
                                 <div className="p-4 bg-neon-green/10 rounded-full border border-neon-green">
                                     <Rocket className="w-12 h-12 text-neon-green" />
                                 </div>
                             </div>

                             <h2 className="text-3xl font-bold text-white mb-2">DEPLOYMENT SUCCESSFUL</h2>
                             <p className="text-gray-400 font-mono mb-8">Omni-Hive Mind (Fleet Commander) is active.</p>

                             <div className="bg-black border border-cyber-border rounded text-left p-4 mb-6 space-y-4">
                                 <div>
                                     <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Service Endpoint</div>
                                     <div className="flex items-center gap-2 bg-cyber-dark p-2 border border-cyber-border rounded text-neon-cyan font-mono text-sm">
                                         <span className="truncate flex-1">https://hive-mind-x92.a.run.app</span>
                                         <button className="text-gray-500 hover:text-white" title="Copy"><Copy className="w-4 h-4"/></button>
                                         <a href="#" className="text-gray-500 hover:text-white" title="Open"><ExternalLink className="w-4 h-4"/></a>
                                     </div>
                                 </div>
                                 <div>
                                     <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Fleet API Key</div>
                                     <div className="flex items-center gap-2 bg-cyber-dark p-2 border border-cyber-border rounded text-neon-purple font-mono text-sm">
                                         <span className="truncate flex-1">sk_live_99283_fl33t_cmdr_x1</span>
                                         <button className="text-gray-500 hover:text-white" title="Copy"><Copy className="w-4 h-4"/></button>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="grid grid-cols-3 gap-4 mb-8">
                                 <div className="bg-cyber-dark p-3 border border-cyber-border rounded">
                                     <div className="text-xs text-gray-500">STATUS</div>
                                     <div className="text-neon-green font-bold">HEALTHY</div>
                                 </div>
                                 <div className="bg-cyber-dark p-3 border border-cyber-border rounded">
                                     <div className="text-xs text-gray-500">SUBSYSTEMS</div>
                                     <div className="text-white font-bold">6 ACTIVE</div>
                                 </div>
                                 <div className="bg-cyber-dark p-3 border border-cyber-border rounded">
                                     <div className="text-xs text-gray-500">UPTIME</div>
                                     <div className="text-white font-bold">0h 01m</div>
                                 </div>
                             </div>

                             <div className="flex justify-center gap-4">
                                 <button 
                                     onClick={() => setStep(1)}
                                     className="px-6 py-2 border border-cyber-border text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
                                 >
                                     DEPLOY ANOTHER
                                 </button>
                                 <button 
                                     className="px-6 py-2 bg-neon-cyan text-black font-bold hover:bg-white transition-colors text-xs font-mono flex items-center gap-2"
                                     onClick={onClose}
                                 >
                                     <Activity className="w-4 h-4" /> MONITOR IN DASHBOARD
                                 </button>
                             </div>
                         </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentModal;
