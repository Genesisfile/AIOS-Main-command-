import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Loader2, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  FileText,
  Activity,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { executeAgentCommand, MissionReport } from '../api/swarm';

interface MissionExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentId: string;
  query: string;
}

const MissionExecutionModal: React.FC<MissionExecutionModalProps> = ({ isOpen, onClose, agentName, agentId, query }) => {
  const [status, setStatus] = useState<'INITIALIZING' | 'EXECUTING' | 'COMPLETED'>('INITIALIZING');
  const [logs, setLogs] = useState<string[]>([]);
  const [report, setReport] = useState<MissionReport | null>(null);
  const [progress, setProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      startMission();
    } else {
      // Reset state on close
      setTimeout(() => {
        setStatus('INITIALIZING');
        setLogs([]);
        setReport(null);
        setProgress(0);
      }, 500);
    }
  }, [isOpen, query]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString().split(' ')[0]}] ${message}`]);
  };

  const startMission = async () => {
    setStatus('INITIALIZING');
    setProgress(0);
    setLogs([]);
    setReport(null);

    // Phase 1: Initialization
    addLog(`INIT_SEQUENCE_START: ${agentId}`);
    addLog(`TARGET_VECTOR: "${query.substring(0, 30)}..."`);
    
    await new Promise(r => setTimeout(r, 600));
    setProgress(10);
    addLog("Allocating Neural Resources...");
    
    await new Promise(r => setTimeout(r, 800));
    setProgress(30);
    setStatus('EXECUTING');
    addLog("Swarm Nodes Synchronized.");

    // Phase 2: Execution (Simulation)
    const result = await executeAgentCommand(agentId, query);
    
    // Simulate steps from the result
    for (const step of result.steps) {
        addLog(step);
        setProgress(prev => Math.min(prev + (60 / result.steps.length), 90));
        await new Promise(r => setTimeout(r, 600)); // Delay for effect
    }

    setProgress(100);
    setStatus('COMPLETED');
    setReport(result);
    addLog("MISSION_COMPLETE. REPORT_GENERATED.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[85vh] bg-cyber-black border border-cyber-border shadow-[0_0_100px_rgba(0,243,255,0.1)] flex flex-col relative overflow-hidden rounded-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-panel shrink-0">
          <div className="flex items-center gap-4">
            <div className={`p-2 border ${status === 'EXECUTING' ? 'border-neon-cyan animate-spin-slow' : 'border-gray-600'} rounded-sm`}>
               <Cpu className={`w-6 h-6 ${status === 'COMPLETED' ? 'text-neon-green' : 'text-neon-cyan'}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-widest font-mono uppercase">Mission Execution Protocol</h2>
              <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                 AGENT: {agentName} <span className="text-cyber-border">|</span> ID: {agentId}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Real-time Terminal */}
          <div className="w-1/3 border-r border-cyber-border bg-black p-4 flex flex-col font-mono text-xs">
             <div className="flex items-center gap-2 text-neon-cyan mb-4 uppercase font-bold tracking-wider pb-2 border-b border-cyber-border">
                <Terminal className="w-4 h-4" /> System Log
             </div>
             <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {logs.map((log, i) => (
                    <div key={i} className="text-gray-400 break-words animate-in slide-in-from-left-2 duration-300">
                        <span className="text-cyber-border mr-2">{'>'}</span>
                        {log}
                    </div>
                ))}
                <div ref={logsEndRef} />
                {status === 'EXECUTING' && (
                    <div className="text-neon-cyan animate-pulse">_</div>
                )}
             </div>
          </div>

          {/* Right Panel: Visualization / Report */}
          <div className="flex-1 bg-cyber-dark relative flex flex-col">
            
            {/* Progress Bar */}
            <div className="h-1 bg-cyber-border w-full">
                <div 
                    className={`h-full transition-all duration-300 ${status === 'COMPLETED' ? 'bg-neon-green' : 'bg-neon-cyan'}`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {status !== 'COMPLETED' ? (
                // Execution State
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full animate-pulse"></div>
                        <Loader2 className="w-24 h-24 text-neon-cyan animate-spin relative z-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-widest mb-2 font-mono">PROCESSING VECTOR</h3>
                    <p className="text-gray-400 max-w-md font-mono text-sm animate-pulse">
                        {status === 'INITIALIZING' ? "Establishing secure handshake..." : "Running advanced simulation algorithms..."}
                    </p>
                    
                    <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-lg">
                        <div className="bg-cyber-panel border border-cyber-border p-3 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">NODES</div>
                            <div className="text-neon-gold font-mono font-bold">ACTIVE</div>
                        </div>
                        <div className="bg-cyber-panel border border-cyber-border p-3 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">ENCRYPTION</div>
                            <div className="text-neon-purple font-mono font-bold">256-AES</div>
                        </div>
                        <div className="bg-cyber-panel border border-cyber-border p-3 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">LATENCY</div>
                            <div className="text-neon-green font-mono font-bold">12ms</div>
                        </div>
                    </div>
                </div>
            ) : (
                // Report State
                report && (
                    <div className="flex-1 overflow-y-auto p-8 animate-in zoom-in-95 duration-500">
                        <div className="max-w-3xl mx-auto space-y-8">
                            
                            {/* Report Header */}
                            <div className="flex items-center justify-between border-b border-cyber-border pb-4">
                                <div>
                                    <div className="text-neon-green font-mono text-xs font-bold mb-1 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> SUCCESS
                                    </div>
                                    <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Mission Report</h1>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-xs font-mono">REF ID</div>
                                    <div className="text-neon-cyan font-mono text-lg">{report.missionId}</div>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {report.output.metrics.map((metric, i) => (
                                    <div key={i} className="bg-cyber-panel border border-cyber-border p-4 rounded-sm hover:border-neon-cyan/50 transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">{metric.label}</span>
                                            {metric.trend && (
                                                metric.trend === 'up' ? <TrendingUp className="w-4 h-4 text-neon-green" /> :
                                                metric.trend === 'down' ? <TrendingDown className="w-4 h-4 text-neon-red" /> :
                                                <Minus className="w-4 h-4 text-gray-500" />
                                            )}
                                        </div>
                                        <div className={`text-2xl font-mono font-bold ${metric.color || 'text-white'}`}>
                                            {metric.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Section */}
                            <div className="bg-cyber-panel/50 border border-cyber-border p-6 rounded-sm">
                                <h3 className="text-neon-gold text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Executive Summary
                                </h3>
                                <p className="text-gray-300 leading-relaxed font-sans text-lg">
                                    {report.output.summary}
                                </p>
                            </div>

                            {/* Analysis & Recs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Analysis
                                    </h4>
                                    <div className="p-4 bg-black border border-cyber-border text-gray-400 text-sm leading-relaxed h-full">
                                        {report.output.analysis}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Recommendation
                                    </h4>
                                    <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/30 text-neon-cyan text-sm leading-relaxed h-full font-bold">
                                        {report.output.recommendation}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Footer */}
                             <div className="pt-8 flex justify-end">
                                <button 
                                    onClick={onClose}
                                    className="flex items-center gap-2 bg-white text-black px-6 py-2 font-bold hover:bg-neon-cyan transition-colors"
                                >
                                    ACKNOWLEDGE REPORT <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    </div>
                )
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MissionExecutionModal;