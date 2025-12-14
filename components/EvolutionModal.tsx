import React, { useState, useEffect } from 'react';
import { Server, Zap, Shield, X, CheckCircle2, Play, Terminal } from 'lucide-react';

interface EvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (impact: number) => void;
}

const EvolutionModal: React.FC<EvolutionModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'COMPLETED'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
        setStatus('IDLE');
        setLogs([]);
        setProgress(0);
    }
  }, [isOpen]);

  const startTransformation = () => {
    setStatus('RUNNING');
    const steps = [
        "Analyzing Monolith Codebase...",
        "Identifying Bounded Contexts...",
        "Extracting 'Auth' Module to Container...",
        "Migrating 'Inventory' to Lambda Functions...",
        "Deploying EventMesh (Kafka/EventBridge)...",
        "Decoupling Database Schema...",
        "Purging Legacy Dependencies...",
        "Verifying Microservice Latency..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep >= steps.length) {
            clearInterval(interval);
            setStatus('COMPLETED');
            onComplete(0.15); // Add score
            return;
        }
        setLogs(prev => [...prev, `[TRANSFORM] ${steps[currentStep]}`]);
        setProgress(((currentStep + 1) / steps.length) * 100);
        currentStep++;
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-ghost-panel border border-ghost-blue shadow-[0_0_30px_rgba(168,177,255,0.2)] rounded-sm overflow-hidden flex flex-col">
        
        <div className="p-4 border-b border-ghost-border flex items-center justify-between bg-black/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                <Server className="w-5 h-5 text-ghost-blue" />
                OMNI-TRANSFORM PROTOCOL
            </h2>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-500 hover:text-white"/></button>
        </div>

        <div className="p-8 flex flex-col gap-6">
            <div className="bg-black border border-ghost-border p-4 font-mono text-xs h-64 overflow-y-auto space-y-2 rounded-sm custom-scrollbar">
                {status === 'IDLE' && <div className="text-gray-500 animate-pulse">READY TO ENGAGE TRANSFORMATION...</div>}
                {logs.map((log, i) => (
                    <div key={i} className="text-ghost-blue">{log}</div>
                ))}
            </div>

            <div className="h-1 bg-gray-800 w-full rounded-full overflow-hidden">
                <div className="h-full bg-ghost-blue transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="flex justify-end gap-4">
                {status === 'IDLE' && (
                    <button 
                        onClick={startTransformation}
                        className="flex items-center gap-2 bg-ghost-blue text-black px-6 py-2 font-bold font-mono hover:bg-white transition-all rounded-sm"
                    >
                        <Play className="w-4 h-4" /> ENGAGE
                    </button>
                )}
                {status === 'COMPLETED' && (
                    <button 
                        onClick={onClose}
                        className="flex items-center gap-2 bg-success-green text-black px-6 py-2 font-bold font-mono hover:bg-white transition-all rounded-sm"
                    >
                        <CheckCircle2 className="w-4 h-4" /> APPLY CHANGES
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EvolutionModal;
