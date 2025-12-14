
import React from 'react';
import { MissionReport } from '../api/swarm';
import { X, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus, Activity, FileText, ShieldCheck, ArrowRight } from 'lucide-react';

interface MissionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: MissionReport | null;
}

const MissionReportModal: React.FC<MissionReportModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] bg-cyber-black border border-cyber-border shadow-[0_0_60px_rgba(0,243,255,0.15)] flex flex-col relative overflow-hidden rounded-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-panel shrink-0">
          <div className="flex items-center gap-4">
            <div className={`p-2 border ${report.status === 'SUCCESS' ? 'border-neon-green bg-neon-green/10' : 'border-neon-gold bg-neon-gold/10'} rounded-sm`}>
               {report.status === 'SUCCESS' ? <CheckCircle2 className="w-6 h-6 text-neon-green" /> : <AlertCircle className="w-6 h-6 text-neon-gold" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-widest font-mono uppercase">Mission Report Details</h2>
              <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                 MISSION_ID: {report.missionId} <span className="text-cyber-border">|</span> {new Date(report.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-cyber-dark space-y-8">
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.output.metrics.map((metric, i) => (
                    <div key={i} className="bg-cyber-panel border border-cyber-border p-5 rounded-sm hover:border-neon-cyan/50 transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">{metric.label}</span>
                            {metric.trend && (
                                metric.trend === 'up' ? <TrendingUp className="w-4 h-4 text-neon-green" /> :
                                metric.trend === 'down' ? <TrendingDown className="w-4 h-4 text-neon-red" /> :
                                <Minus className="w-4 h-4 text-gray-500" />
                            )}
                        </div>
                        <div className={`text-3xl font-mono font-bold ${metric.color || 'text-white'}`}>
                            {metric.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Executive Summary */}
            <div className="bg-cyber-panel/50 border border-cyber-border p-6 rounded-sm">
                <h3 className="text-neon-gold text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Executive Summary
                </h3>
                <p className="text-gray-300 leading-relaxed font-sans text-lg">
                    {report.output.summary}
                </p>
            </div>

            {/* Analysis & Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col h-full">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4" /> Detailed Analysis
                    </h4>
                    <div className="flex-1 p-5 bg-black border border-cyber-border text-gray-400 text-sm leading-relaxed rounded-sm whitespace-pre-wrap">
                        {report.output.analysis}
                    </div>
                </div>
                <div className="flex flex-col h-full">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-4 h-4" /> Strategic Recommendation
                    </h4>
                    <div className="flex-1 p-5 bg-neon-cyan/5 border border-neon-cyan/30 text-neon-cyan text-sm leading-relaxed font-bold rounded-sm whitespace-pre-wrap">
                        {report.output.recommendation}
                    </div>
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cyber-border bg-cyber-panel flex justify-end shrink-0">
            <button 
                onClick={onClose}
                className="flex items-center gap-2 bg-white text-black px-6 py-2 font-bold hover:bg-neon-cyan transition-colors rounded-sm text-sm tracking-wider"
            >
                CLOSE REPORT <ArrowRight className="w-4 h-4" />
            </button>
        </div>

      </div>
    </div>
  );
};

export default MissionReportModal;
