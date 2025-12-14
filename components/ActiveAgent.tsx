import React, { useState } from 'react';
import { Agent } from '../types';
import { Terminal, Play, Activity, Clock, Cpu, CheckCircle2, Lock } from 'lucide-react';

interface ActiveAgentProps {
  agent: Agent;
  isFrozen?: boolean;
}

const ActiveAgent: React.FC<ActiveAgentProps> = ({ agent, isFrozen = false }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [executing, setExecuting] = useState<string | null>(null);

  const invokeFunction = async (fnName: string) => {
    setExecuting(fnName);
    setLogs(prev => [...prev, `> INVOKING: ${fnName} on ${agent.name}...`]);
    
    // Simulate Cold Start if applicable
    if (agent.status === 'COLD') {
        setLogs(prev => [...prev, `[SYSTEM] Cold Start detected. Provisioning runtime...`]);
        await new Promise(r => setTimeout(r, 800));
    }

    await new Promise(r => setTimeout(r, 400));
    
    setLogs(prev => [...prev, `[SUCCESS] Function executed. Duration: ${Math.floor(Math.random() * 50) + 10}ms`]);
    setLogs(prev => [...prev, `[OUTPUT] { "status": 200, "data": "ACK" }`]);
    setExecuting(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-ghost-bg relative overflow-hidden">
       <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

       <div className="p-8 z-10 flex flex-col h-full">
         
         {/* Service Header */}
         <div className="flex items-start justify-between mb-8 pb-6 border-b border-ghost-border">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white tracking-tighter font-mono">{agent.name}</h1>
                    <span className="bg-ghost-border text-gray-400 px-2 py-1 text-xs font-mono rounded-sm border border-gray-700">
                        {agent.type}
                    </span>
                </div>
                <div className="flex items-center gap-6 text-gray-400 text-xs font-mono mt-2">
                    <span className="flex items-center gap-2"><Clock className="w-3 h-3"/> Latency: <span className="text-ghost-blue">{agent.latency}</span></span>
                    <span className="flex items-center gap-2"><Activity className="w-3 h-3"/> Uptime: <span className="text-success-green">{agent.uptime}</span></span>
                    <span className="flex items-center gap-2"><Cpu className="w-3 h-3"/> Hash: <span>{agent.deployment_hash}</span></span>
                </div>
            </div>
            
            {/* Status Indicator */}
            <div className={`w-24 h-24 border flex items-center justify-center relative ${
                isFrozen ? 'border-success-green bg-success-green/5' : 'border-ghost-blue bg-ghost-blue/5'
            }`}>
                {isFrozen ? (
                    <Lock className="w-8 h-8 text-success-green" />
                ) : (
                    <Activity className="w-8 h-8 text-ghost-blue animate-pulse" />
                )}
                <div className="absolute bottom-1 right-1 text-[9px] font-mono text-gray-500">
                    {agent.status}
                </div>
            </div>
         </div>

         {/* Content Grid */}
         <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
            
            {/* Function List */}
            <div className="bg-ghost-panel border border-ghost-border flex flex-col">
                <div className="p-3 border-b border-ghost-border bg-black/20 flex items-center gap-2 text-xs font-bold text-white">
                    <Terminal className="w-4 h-4" /> Serverless Functions
                </div>
                <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    {agent.functions.map((fn, i) => (
                        <button 
                            key={i}
                            onClick={() => invokeFunction(fn)}
                            disabled={executing !== null}
                            className="w-full text-left p-3 border border-ghost-border hover:border-ghost-blue bg-black/40 hover:bg-ghost-blue/5 transition-all rounded-sm flex items-center justify-between group"
                        >
                            <span className="font-mono text-xs text-gray-300 group-hover:text-white">λ {fn}</span>
                            {executing === fn ? (
                                <Activity className="w-3 h-3 text-ghost-blue animate-spin" />
                            ) : (
                                <Play className="w-3 h-3 text-gray-600 group-hover:text-ghost-blue" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Execution Log */}
            <div className="bg-black border border-ghost-border flex flex-col font-mono text-xs">
                <div className="p-3 border-b border-ghost-border flex items-center justify-between">
                    <span className="text-gray-500">EXECUTION LOG</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-2 text-gray-400">
                    {logs.length === 0 && (
                        <div className="text-gray-700 italic">Ready for invocation...</div>
                    )}
                    {logs.map((log, i) => (
                        <div key={i} className="break-all animate-in fade-in slide-in-from-left-2 duration-200">
                            {log}
                        </div>
                    ))}
                </div>
            </div>

         </div>
       </div>
    </div>
  );
};

export default ActiveAgent;