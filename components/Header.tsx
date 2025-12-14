import React from 'react';
import { Ghost, Zap, Snowflake, Download, Globe, Cpu, Layers, Shield, FileText, LogOut } from 'lucide-react';
import { SystemState } from '../types';

interface HeaderProps {
  config: any; // Using any to be flexible with SYSTEM_CONFIG structure
  onOpenEvolution: (mode: any) => void;
  currentView: 'dashboard' | 'swarm_interface';
  onNavigate: (view: 'dashboard' | 'swarm_interface') => void;
  onSystemExport: () => void;
  onOpenDeployment: () => void;
  onOpenSKA: () => void;
  onOpenPathfinder: () => void;
  onDownloadLatestReport: () => void;
  hasLatestReport: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    config, 
    onOpenEvolution, 
    currentView, 
    onNavigate, 
    onSystemExport,
    onOpenDeployment,
    onOpenSKA,
    onOpenPathfinder,
    onDownloadLatestReport,
    hasLatestReport,
    onLogout
}) => {
  const isFrozen = config.is_frozen;

  return (
    <header className="bg-ghost-panel border-b border-ghost-border px-6 py-4 flex items-center justify-between text-xs tracking-widest uppercase shadow-lg shrink-0 relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(168,177,255,0.05),transparent)] animate-pulse pointer-events-none"></div>

      <div className="flex items-center gap-4 z-10">
        <div className={`p-2 rounded-sm border ${isFrozen ? 'border-success-green bg-success-green/10' : 'border-ghost-blue bg-ghost-blue/10'}`}>
          <Ghost className={`w-5 h-5 ${isFrozen ? 'text-success-green' : 'text-ghost-blue'}`} />
        </div>
        <div>
            <h1 className="text-lg font-bold font-mono text-white tracking-tighter">
                GHOST INVENTORY <span className="text-gray-500">//</span> {isFrozen ? 'LEVEL ALPHA' : 'MIGRATION IN PROGRESS'}
            </h1>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                <span>VER: {config.version}</span>
                <span className="text-ghost-border">|</span>
                <span className={isFrozen ? 'text-success-green' : 'text-ghost-blue'}>
                    ARCH_SCORE: {config.architecture_score.toFixed(2)}
                </span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-6 z-10">
        {/* Navigation */}
        <div className="flex bg-black/30 p-1 rounded-sm border border-ghost-border">
            <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-1.5 rounded-sm transition-all ${currentView === 'dashboard' ? 'bg-ghost-blue text-black font-bold' : 'text-gray-500 hover:text-white'}`}
            >
                DASHBOARD
            </button>
            <button
                onClick={() => onNavigate('swarm_interface')}
                className={`px-3 py-1.5 rounded-sm transition-all ${currentView === 'swarm_interface' ? 'bg-ghost-blue text-black font-bold' : 'text-gray-500 hover:text-white'}`}
            >
                SWARM INTERFACE
            </button>
        </div>

        <div className="h-6 w-px bg-ghost-border"></div>

        {/* Actions */}
        <div className="flex items-center gap-3">
            <button
                onClick={onOpenSKA}
                className="flex items-center gap-2 px-3 py-2 bg-ghost-blue/5 border border-ghost-blue/30 text-ghost-blue hover:bg-ghost-blue hover:text-black transition-all rounded-sm font-bold"
                title="Sentinel Knowledge Assistant"
            >
                <Shield className="w-4 h-4" /> SKA
            </button>

            <button
                onClick={onOpenPathfinder}
                className="flex items-center gap-2 px-3 py-2 bg-ghost-blue/5 border border-ghost-blue/30 text-ghost-blue hover:bg-ghost-blue hover:text-black transition-all rounded-sm font-bold"
                title="Pathfinder Terminal"
            >
                <Globe className="w-4 h-4" /> PATHFINDER
            </button>
            
            <button
                onClick={onOpenDeployment}
                className="flex items-center gap-2 px-3 py-2 bg-ghost-blue/5 border border-ghost-blue/30 text-ghost-blue hover:bg-ghost-blue hover:text-black transition-all rounded-sm font-bold"
                title="Deploy Artifacts"
            >
                <Cpu className="w-4 h-4" /> DEPLOY
            </button>

            {hasLatestReport && (
                <button
                    onClick={onDownloadLatestReport}
                    className="flex items-center gap-2 px-3 py-2 bg-neon-purple/10 border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-all rounded-sm font-bold animate-pulse"
                >
                    <Download className="w-4 h-4" /> REPORT
                </button>
            )}

            <div className="h-6 w-px bg-ghost-border mx-2"></div>

            <button 
                onClick={() => onOpenEvolution('ZCP')}
                className="flex items-center gap-2 px-4 py-2 bg-ghost-blue/10 border border-ghost-blue/30 text-ghost-blue hover:bg-ghost-blue hover:text-black transition-all rounded-sm font-bold"
            >
                <Zap className="w-4 h-4" /> EVOLVE
            </button>
            
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm font-bold ml-2"
                title="Terminate Session / Lock System"
            >
                <LogOut className="w-4 h-4" /> LOCK
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;