import React from 'react';
import { SystemEvent } from '../types';
import { Activity, Radio } from 'lucide-react';

interface EventStreamProps {
  events: SystemEvent[];
}

const EventStream: React.FC<EventStreamProps> = ({ events }) => {
  return (
    <div className="flex flex-col h-1/2 border-b border-ghost-border bg-ghost-panel overflow-hidden">
      <div className="p-3 border-b border-ghost-border flex items-center justify-between sticky top-0 z-10 bg-ghost-panel">
        <h2 className="text-xs font-bold text-ghost-blue uppercase tracking-widest flex items-center gap-2">
          <Radio className="w-4 h-4" /> Live Event Bus
        </h2>
        <div className="w-2 h-2 bg-ghost-blue rounded-full animate-pulse"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] relative">
        <div className="absolute left-4 top-4 bottom-4 w-px bg-ghost-border"></div>
        {events.map((event, i) => (
            <div key={i} className="relative pl-6 group">
                <div className={`absolute left-[13px] top-1.5 w-1.5 h-1.5 rounded-full border bg-ghost-bg transition-colors ${
                    event.type === 'ERROR' ? 'border-alert-red bg-alert-red' :
                    event.type === 'TRIGGER' ? 'border-ghost-blue bg-ghost-blue' :
                    'border-success-green bg-success-green'
                }`}></div>
                <div className="flex justify-between items-start mb-0.5">
                    <span className={`font-bold ${
                        event.type === 'ERROR' ? 'text-alert-red' : 'text-white'
                    }`}>{event.source}</span>
                    <span className="text-gray-600">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-gray-400 break-words leading-tight">
                    {event.payload}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default EventStream;
