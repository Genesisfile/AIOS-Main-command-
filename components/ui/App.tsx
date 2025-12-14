import React, { useState, useEffect } from 'react';
import Header from '../Header';
import AgentList from '../AgentList';
import ActiveAgent from '../ActiveAgent';
import MarketFeed from '../MarketFeed';
import TerminalLog from '../TerminalLog';
import EvolutionModal from '../EvolutionModal';
import SwarmInterfacePage from '../swarm/SwarmInterfacePage';
import DeploymentModal from '../DeploymentModal';
import SKAModal from '../SKAModal';
import PathfinderTerminal from '../PathfinderTerminal';
import { AGENTS, MARKET_EVENTS, INITIAL_LOGS, SYSTEM_CONFIG } from '../../data';
import { Agent, SystemLog, ReportItem } from '../../types';
import { sendDirectiveToAction } from '../../api/swarm';

type ViewState = 'dashboard' | 'swarm_interface';

const App: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENTS[0].id);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [evolutionMode, setEvolutionMode] = useState<'ZCP' | 'GENESIS' | 'INTEGRATION' | 'SYNTHESIS' | 'AETHELGARD' | 'AUTHORITY' | 'OMNI_HEAL' | 'PREDATION' | 'COMPLETION' | 'ORACLE' | 'HYDRA' | null>(null);
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);
  const [isSKAOpen, setIsSKAOpen] = useState(false);
  const [isPathfinderOpen, setIsPathfinderOpen] = useState(false);
  const [latestReport, setLatestReport] = useState<ReportItem | null>(null);
  
  // Lifted State for Logs
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  
  const selectedAgent = AGENTS.find(a => a.id === selectedAgentId) || AGENTS[0];

  const handleSystemExport = () => {
    const exportData = {
        config: SYSTEM_CONFIG,
        agents: AGENTS,
        logs: systemLogs,
        timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SWARM_SYS_EXPORT_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadLatestReport = () => {
    if (!latestReport || !latestReport.downloadPayload) {
        return;
    }
    const payload = latestReport.downloadPayload;
    try {
        const blob = new Blob([payload.content], { type: payload.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = payload.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error("Failed to download report", e);
    }
  };

  const handleLogout = () => {
      // Clear all authentication artifacts
      localStorage.removeItem('OMNI_ACTIVATION_TOKEN');
      localStorage.removeItem('OMNI_LIFETIME_ID');
      // Force reload to return to Gate
      window.location.reload();
  };

  // Global Command Executor for SKA
  const handleSKAExecution = async (command: string) => {
      // 1. Add intent log
      const attemptLog: SystemLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          source: 'SKA_BRIDGE',
          message: `EXECUTING DIRECTIVE: ${command}`,
          type: 'info'
      };
      setSystemLogs(prev => [...prev, attemptLog]);

      try {
          // 2. Execute via API
          const result = await sendDirectiveToAction(command);

          // 3. Add success log
          const successLog: SystemLog = {
              id: (Date.now() + 1).toString(),
              timestamp: new Date().toISOString(),
              source: 'KERNEL',
              message: `EXEC_SUCCESS: ${result.finalOutput?.summary || 'Command processed.'}`,
              type: 'success'
          };
          setSystemLogs(prev => [...prev, successLog]);

      } catch (e: any) {
          // 4. Add error log
          const errorLog: SystemLog = {
              id: (Date.now() + 1).toString(),
              timestamp: new Date().toISOString(),
              source: 'KERNEL_ERROR',
              message: `EXEC_FAILURE: ${e.message}`,
              type: 'error'
          };
          setSystemLogs(prev => [...prev, errorLog]);
      }
  };

  return (
    <div className={`flex flex-col bg-cyber-black text-white font-sans ${currentView === 'dashboard' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Header 
        config={SYSTEM_CONFIG} 
        onOpenEvolution={(mode) => setEvolutionMode(mode)}
        currentView={currentView}
        onNavigate={setCurrentView}
        onSystemExport={handleSystemExport}
        onOpenDeployment={() => setIsDeploymentOpen(true)}
        onOpenSKA={() => setIsSKAOpen(!isSKAOpen)} // Toggle logic for sidebar
        onOpenPathfinder={() => setIsPathfinderOpen(true)}
        onDownloadLatestReport={handleDownloadLatestReport}
        hasLatestReport={!!latestReport}
        onLogout={handleLogout}
      />
      
      <div className={`flex-1 relative ${currentView === 'dashboard' ? 'overflow-hidden' : ''}`}>
        {currentView === 'dashboard' ? (
             <div className="flex h-full">
                <AgentList 
                    agents={AGENTS} 
                    selectedId={selectedAgentId} 
                    onSelect={(agent) => setSelectedAgentId(agent.id)} 
                />
                
                <div className="flex-1 flex flex-col min-w-0">
                    <ActiveAgent 
                        agent={selectedAgent} 
                    />
                </div>

                <div className="w-96 flex flex-col border-l border-cyber-border shrink-0">
                    <MarketFeed events={MARKET_EVENTS} />
                    <TerminalLog logs={systemLogs} />
                </div>
            </div>
        ) : (
            <SwarmInterfacePage onGlobalReportGenerated={setLatestReport} />
        )}
      </div>

      <EvolutionModal 
        isOpen={!!evolutionMode} 
        onClose={() => setEvolutionMode(null)} 
        mode={evolutionMode || 'ZCP'}
      />

      <DeploymentModal
        isOpen={isDeploymentOpen}
        onClose={() => setIsDeploymentOpen(false)}
      />

      <SKAModal 
        isOpen={isSKAOpen}
        onClose={() => setIsSKAOpen(false)}
        onExecuteCommand={handleSKAExecution}
        systemLogs={systemLogs}
      />

      <PathfinderTerminal 
        isOpen={isPathfinderOpen}
        onClose={() => setIsPathfinderOpen(false)}
      />
    </div>
  );
};

export default App;