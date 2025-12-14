import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { fetchThoughtStream } from '../../api/swarm';
import { Brain, Loader2, CheckCircle2, Circle, ArrowDown } from 'lucide-react';

interface ThoughtPhase {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

const ThoughtProcessMonitor: React.FC = () => {
  const [phases, setPhases] = useState<ThoughtPhase[]>([]);
  
  useEffect(() => {
    // Polling mechanism to keep the cognitive stream live without heavy sockets
    const interval = setInterval(async () => {
      const data = await fetchThoughtStream();
      setPhases(data);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full flex flex-col border-neon-cyan/20">
      <CardHeader className="pb-4 border-b border-cyber-border/50">
        <CardTitle className="flex items-center gap-2 text-neon-cyan">
          <Brain className="w-5 h-5 animate-pulse" />
          Cognitive Stream
          <div className="ml-auto flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
            </span>
            <span className="text-[10px] font-mono text-gray-500">LIVE_FEED</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-hide">
        <div className="flex flex-col">
            {phases.map((phase, index) => (
                <div 
                    key={phase.id} 
                    className={`flex items-center gap-4 p-4 border-b border-cyber-border/30 transition-all duration-300 ${
                        phase.status === 'active' ? 'bg-neon-cyan/5' : ''
                    }`}
                >
                    <div className="shrink-0">
                        {phase.status === 'completed' && (
                            <CheckCircle2 className="w-5 h-5 text-neon-green" />
                        )}
                        {phase.status === 'active' && (
                            <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />
                        )}
                        {phase.status === 'pending' && (
                            <Circle className="w-5 h-5 text-gray-700" />
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className={`font-mono text-xs mb-1 ${
                            phase.status === 'completed' ? 'text-gray-400' : 
                            phase.status === 'active' ? 'text-white font-bold tracking-wide' : 
                            'text-gray-600'
                        }`}>
                            PHASE_{String(phase.id).padStart(2, '0')}
                        </div>
                        <div className={`text-sm font-medium truncate ${
                             phase.status === 'active' ? 'text-neon-cyan' : 'text-gray-300'
                        }`}>
                            {phase.label}
                        </div>
                    </div>

                    {index < phases.length - 1 && (
                        <div className="absolute left-[29px] translate-y-8 h-4 w-px bg-cyber-border -z-10"></div>
                    )}
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThoughtProcessMonitor;