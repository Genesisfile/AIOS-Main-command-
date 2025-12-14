import React from 'react';
import { Agent } from '../types';
import { Server, Database, Box, Zap, Trash2 } from 'lucide-react';

interface AgentListProps {
  agents: Agent[];
  selectedId: string | null;
  onSelect: (agent: Agent) => void;
  isFrozen?: boolean;
}

const AgentList: React.FC<AgentListProps> = ({ agents, selectedId, onSelect, isFrozen = false }) => {
  const getIcon = (type: Agent['type']) => {
    switch (type) {
        case 'LAMBDA': return <Zap className="w-4 h-4" />;
        case 'CONTAINER': return <Box className="w-4 h-4" />;
        case 'DATABASE': return <Database className="w-4 h-4" />;
        case 'EVENT_BUS': return <Server className="w-4 h-4" />;
        default: return <Box className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-ghost-panel border-r border-ghost-border w-80 shrink-0">
      <div className="p-4 border-b border-ghost-border flex justify-between items-center">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Server className="w-4 h-4" /> Service Mesh
        </h2>
        <span className="text-[10px] text-gray-500 font-mono">{agents.length} NODES</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {agents.map((svc) => {
          const isSelected = svc.id === selectedId;
          const isDecaying = svc.status === 'DECAYING';
          
          if (isFrozen && isDecaying) return null; // Hide legacy in frozen state

          return (
            <button
              key={svc.id}
              onClick={() => onSelect(svc)}
              className={`w-full text-left p-3 rounded-sm border transition-all duration-200 group relative overflow-hidden ${
                isSelected
                  ? 'bg-ghost-blue/10 border-ghost-blue text-white'
                  : isDecaying 
                    ? 'bg-alert-red/5 border-transparent text-alert-red/70 hover:bg-alert-red/10'
                    : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono text-[10px] font-bold ${isSelected ? 'text-ghost-blue' : ''}`}>
                  {svc.id}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border ${
                  svc.status === 'WARM' ? 'border-success-green/30 text-success-green' :
                  svc.status === 'COLD' ? 'border-ghost-blue/30 text-ghost-blue' :
                  svc.status === 'DECAYING' ? 'border-alert-red/30 text-alert-red' :
                  'border-gray-600 text-gray-500'
                }`}>
                  {svc.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={isSelected ? 'text-white' : isDecaying ? 'text-alert-red' : 'text-gray-600'}>
                    {getIcon(svc.type)}
                </span>
                <span className="text-xs truncate font-medium font-mono tracking-tight">{svc.name}</span>
              </div>

              {isDecaying && (
                <div className="mt-1 text-[9px] text-alert-red/50 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> LEGACY ARTIFACT
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AgentList;