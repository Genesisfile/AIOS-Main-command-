import React, { useState } from 'react';
import EvolutionMonitor from './EvolutionMonitor';
import DirectiveControl from './DirectiveControl';
import ThoughtProcessMonitor from './ThoughtProcessMonitor';
import ReportLog from './ReportLog';
import { Layers } from 'lucide-react';
import { ReportItem } from '../../types';

interface SwarmInterfacePageProps {
  onGlobalReportGenerated?: (report: ReportItem) => void;
}

const SwarmInterfacePage: React.FC<SwarmInterfacePageProps> = ({ onGlobalReportGenerated }) => {
  const [reports, setReports] = useState<ReportItem[]>([]);

  const handleReportGenerated = (report: ReportItem) => {
    setReports(prev => [report, ...prev]);
    onGlobalReportGenerated?.(report);
  };

  return (
    <div className="flex-1 bg-cyber-black p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-2 bg-neon-cyan/10 border border-neon-cyan/50 rounded-sm">
          <Layers className="w-6 h-6 text-neon-cyan" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-widest font-mono uppercase">Operational Interface V1</h1>
          <p className="text-xs text-gray-500 font-mono">SWARM_ID: CHIMERA // HAK_KERNEL_ACCESS: GRANTED</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px] lg:h-[600px] shrink-0">
        {/* Left Column: Monitoring */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <div className="flex-1 min-h-[300px]">
                <EvolutionMonitor />
            </div>
            <div className="flex-1 min-h-[300px]">
                <ThoughtProcessMonitor />
            </div>
        </div>

        {/* Right Column: Control */}
        <div className="h-full min-h-[600px]">
          <DirectiveControl onReportGenerated={handleReportGenerated} />
        </div>
      </div>

      {/* Report Log Section */}
      <div className="shrink-0">
         <ReportLog reports={reports} />
      </div>
    </div>
  );
};

export default SwarmInterfacePage;