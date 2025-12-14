
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ServiceRegistry from './components/AgentList';
import FunctionConsole from './components/ActiveAgent';
import EventStream from './components/MarketFeed';
import TerminalLog from './components/TerminalLog';
import EvolutionModal from './components/EvolutionModal';
import DeploymentModal from './components/DeploymentModal';
import PathfinderTerminal from './components/PathfinderTerminal';
import HiveMindExportModal from './components/HiveMindExportModal';
import { SERVICES, MOCK_EVENTS, INITIAL_STATE, INITIAL_LOGS } from './data';
import { Microservice, SystemState, SystemEvent, SystemLog } from './types';

const UPLINK_SOURCE_CODE = `/**
 * PATHFINDER UPLINK PROTOCOL V3.0 (Omni-Shell Edition)
 * INTEGRATED COMMAND, CONTROL & GIT EVOLUTION
 * 
 * USAGE: node pathfinder_uplink.js
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

const CONFIG = {
    apiKey: "sk_live_33558800",
    gateway: "https://api.phoenix.swarm.ai/v1/uplink",
    hive_id: "CHIMERA_PRIME"
};

// --- TERMINAL VISUALS ---
const C = {
    Reset: "\\x1b[0m",
    Bright: "\\x1b[1m",
    Green: "\\x1b[32m",
    Cyan: "\\x1b[36m",
    Red: "\\x1b[31m",
    Yellow: "\\x1b[33m",
    Dim: "\\x1b[2m",
    Purple: "\\x1b[35m"
};

const log = (msg, type = 'INFO') => {
    const ts = new Date().toISOString().split('T')[1].replace('Z','');
    let color = C.Cyan;
    if (type === 'SUCCESS') color = C.Green;
    if (type === 'WARN') color = C.Yellow;
    if (type === 'ERROR') color = C.Red;
    if (type === 'SHELL') color = C.Dim;
    if (type === 'GIT') color = C.Purple;
    console.log(\`\${C.Bright}[\${ts}] [\${type}] \${color}\${msg}\${C.Reset}\`);
};

// --- SHELL COMMANDER ENGINE ---
class ShellCommander {
    static async run(cmd, label) {
        if (label) log(\`EXEC: \${label} (\${cmd})\`, 'SHELL');
        return new Promise((resolve) => {
            exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
                if (error) {
                    resolve({ success: false, output: stderr || error.message });
                } else {
                    resolve({ success: true, output: stdout.trim() });
                }
            });
        });
    }
}

// --- GIT EVOLUTION PROTOCOL ---
class GitEvolutionProtocol {
    static async checkStatus() {
        const isGit = fs.existsSync(path.join(process.cwd(), '.git'));
        if (!isGit) return { active: false, reason: "No .git directory" };

        const remote = await ShellCommander.run('git config --get remote.origin.url');
        const status = await ShellCommander.run('git status --short');
        const branch = await ShellCommander.run('git rev-parse --abbrev-ref HEAD');

        return {
            active: true,
            remote: remote.output,
            branch: branch.output,
            dirty: status.output.length > 0,
            status: status.output
        };
    }

    static async autoCommit(message) {
        log("Initiating Auto-Commit Protocol...", "GIT");
        await ShellCommander.run('git add .');
        await ShellCommander.run(\`git commit -m "feat(hive-mind): \${message}"\`);
        log("Changes committed to local HEAD.", "GIT");
    }
}

// --- MAIN SEQUENCE ---
async function uplink() {
    console.clear();
    log(\`INITIALIZING HIVE MIND UPLINK...\`, 'INFO');
    log(\`TARGET: \${CONFIG.hive_id}\`, 'INFO');
    
    // 1. SYSTEM RECONNAISSANCE
    log("--- SYSTEM RECONNAISSANCE ---", 'WARN');
    
    const RECON_TASKS = [
        { cmd: 'whoami', label: 'USER_ID' },
        { cmd: 'uname -srm', label: 'KERNEL_VER' },
        { cmd: 'node -v', label: 'NODE_RUNTIME' }
    ];

    const contextData = {};

    for (const task of RECON_TASKS) {
        const res = await ShellCommander.run(task.cmd, task.label);
        if (res.success) {
            contextData[task.label] = res.output;
            log(\`> \${res.output}\`, 'SUCCESS');
        } else {
            log(\`> FAILED: \${res.output}\`, 'ERROR');
        }
        await sleep(200);
    }

    // 2. GIT AWARENESS
    log("--- GIT REPOSITORY SCAN ---", 'WARN');
    const gitState = await GitEvolutionProtocol.checkStatus();
    if (gitState.active) {
        log(\`REPO DETECTED: \${gitState.remote}\`, 'GIT');
        log(\`BRANCH: \${gitState.branch}\`, 'GIT');
        if (gitState.dirty) {
            log("Uncommitted changes detected.", 'WARN');
            // log(gitState.status, 'SHELL'); 
        } else {
            log("Working tree clean.", 'SUCCESS');
        }
        contextData['GIT'] = gitState;
    } else {
        log("No Git repository found.", 'INFO');
    }

    // 3. HIVE MIND EXPORT
    log("--- INITIATING EXPORT ---", 'WARN');
    await sleep(800);
    log("Bundling Context Data...", 'INFO');
    
    // Simulate Upload
    log("Transmitting to Phoenix Gateway...", 'INFO');
    await sleep(1500);
    log("PAYLOAD RECEIVED BY HIVE MIND.", 'SUCCESS');
    
    // 4. OPTIMIZATION LOOP
    log("--- AWAITING DIRECTIVES ---", 'WARN');
    log("Sentinel Active. Listening for remote shell commands...", 'INFO');
    
    // Mock Listening Loop
    let cycle = 0;
    setInterval(() => {
        cycle++;
        if (cycle % 10 === 0) {
            // Heartbeat
            // process.stdout.write('.'); 
        }
    }, 1000);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

uplink().catch(e => {
    log(e.message, 'ERROR');
    process.exit(1);
});
`;

const App: React.FC = () => {
  const [state, setState] = useState<SystemState>(INITIAL_STATE);
  const [services, setServices] = useState<Microservice[]>(SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [events, setEvents] = useState<SystemEvent[]>(MOCK_EVENTS);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  
  const [isEvolutionOpen, setIsEvolutionOpen] = useState(false);
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);
  const [isPathfinderOpen, setIsPathfinderOpen] = useState(false);
  const [isHiveMindOpen, setIsHiveMindOpen] = useState(false);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleDownloadUplink = () => {
      try {
          const blob = new Blob([UPLINK_SOURCE_CODE], { type: 'text/typescript' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'pathfinder_uplink.js';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          const log: SystemLog = {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              source: "PATHFINDER",
              message: "Uplink Protocol Script downloaded.",
              type: "success"
          };
          setLogs(prev => [log, ...prev]);
      } catch (e) {
          console.error("Download failed", e);
      }
  };

  // Freeze Protocol
  const handleFreeze = () => {
    setState(prev => ({
        ...prev,
        is_frozen: true,
        migration_phase: 'FROZEN_ALPHA',
        version: '1.0.0-ALPHA-GHOST'
    }));
    
    // Purge Legacy
    setServices(prev => prev.filter(s => s.status !== 'DECAYING'));
    
    // Add Freeze Log
    const freezeLog: SystemLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        source: "SYSTEM_CORE",
        message: "SYSTEM FREEZE PROTOCOL EXECUTED. LEVEL ALPHA LOCKED.",
        type: "success"
    };
    setLogs(prev => [freezeLog, ...prev]);
  };

  const handleThaw = () => {
    setState(prev => ({
        ...prev,
        is_frozen: false,
        migration_phase: 'SERVERLESS',
        version: '1.1.0-EVO-RAPID'
    }));

    const thawLog: SystemLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        source: "SYSTEM_CORE",
        message: "RAPID EVOLUTION PROTOCOL ENGAGED. LOCK RELEASED.",
        type: "warning"
    };
    setLogs(prev => [thawLog, ...prev]);
  };

  const handleMigrationComplete = (impact: number) => {
    setState(prev => {
        const newScore = Math.min(prev.architecture_score + impact, 1.0);
        return {
            ...prev,
            architecture_score: newScore,
            migration_phase: newScore > 0.9 ? 'SERVERLESS' : 'DECOUPLING'
        };
    });
    
    // Simulate Service Transformation
    setServices(prev => prev.map(s => {
        if (s.name === 'legacy-monolith') return s;
        return { ...s, status: 'WARM' };
    }));

    setIsEvolutionOpen(false);
  };

  useEffect(() => {
    // Simulate real-time events
    const interval = setInterval(() => {
        if (state.is_frozen) return; // Stop random noise when frozen

        if (Math.random() > 0.7) {
            const newEvent: SystemEvent = {
                id: `evt-${Date.now()}`,
                timestamp: new Date().toISOString(),
                source: services[Math.floor(Math.random() * services.length)].name,
                payload: "Routine health check passed.",
                type: "RESPONSE"
            };
            setEvents(prev => [newEvent, ...prev].slice(0, 50));
        }
    }, 2000);
    return () => clearInterval(interval);
  }, [state.is_frozen, services]);

  return (
    <div className="flex flex-col h-screen bg-ghost-bg text-ghost-white font-sans overflow-hidden">
      <Header 
        state={state}
        onFreeze={handleFreeze}
        onThaw={handleThaw}
        onMigrate={() => setIsEvolutionOpen(true)}
        onDownloadUplink={handleDownloadUplink}
        onOpenPathfinder={() => setIsPathfinderOpen(true)}
        onOpenHiveMind={() => setIsHiveMindOpen(true)}
      />
      
      <div className="flex-1 flex overflow-hidden">
         {/* Left: Service Registry */}
         <ServiceRegistry 
            services={services}
            selectedId={selectedServiceId}
            onSelect={setSelectedServiceId}
            isFrozen={state.is_frozen}
         />

         {/* Center: Function Console */}
         <div className="flex-1 min-w-0 border-r border-ghost-border">
            <FunctionConsole 
                service={selectedService} 
                isFrozen={state.is_frozen}
            />
         </div>

         {/* Right: Telemetry */}
         <div className="w-96 flex flex-col shrink-0 bg-ghost-panel">
            <EventStream events={events} />
            <TerminalLog logs={logs} />
         </div>
      </div>

      <EvolutionModal 
        isOpen={isEvolutionOpen}
        onClose={() => setIsEvolutionOpen(false)}
        onComplete={handleMigrationComplete}
      />

      <DeploymentModal 
        isOpen={isDeploymentOpen} 
        onClose={() => setIsDeploymentOpen(false)} 
      />

      <PathfinderTerminal 
        isOpen={isPathfinderOpen} 
        onClose={() => setIsPathfinderOpen(false)} 
      />

      <HiveMindExportModal 
        isOpen={isHiveMindOpen}
        onClose={() => setIsHiveMindOpen(false)}
      />
    </div>
  );
};

export default App;
