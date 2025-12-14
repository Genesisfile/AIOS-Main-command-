import React, { useEffect, useRef } from 'react';
import { SystemLog } from '../types';
import { TerminalSquare } from 'lucide-react';

interface TerminalLogProps {
  logs: SystemLog[];
}

const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-1/2 bg-black font-mono text-xs overflow-hidden">
      <div className="p-3 border-b border-cyber-border bg-cyber-panel flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <TerminalSquare className="w-4 h-4" /> System Logs
        </h2>
        <span className="text-[10px] text-gray-600">TAIL -F</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 hover:bg-white/5 p-0.5 rounded">
            <span className="text-gray-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`font-bold shrink-0 w-24 ${
                log.type === 'error' ? 'text-neon-red' :
                log.type === 'warning' ? 'text-neon-gold' :
                log.type === 'success' ? 'text-neon-green' :
                'text-neon-cyan'
            }`}>
                {log.source}
            </span>
            <span className={`break-all ${
                log.type === 'critical' ? 'text-neon-red font-bold animate-pulse' : 'text-gray-400'
            }`}>
                {log.type === 'critical' && 'CRITICAL FAILURE: '}
                {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalLog;