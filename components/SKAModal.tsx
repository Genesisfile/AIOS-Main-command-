
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, BookOpen, Terminal, CheckCircle2, Shield, AlertTriangle, Cpu, Play, Check, Loader2, Zap, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { SentinelKnowledgeAssistant, SKAResponse } from '../api/sentinel_knowledge_assistant';
import { SystemLog } from '../types';

interface SKAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand?: (command: string) => void;
  systemLogs?: SystemLog[];
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'SKA';
  text: string;
  timestamp: string;
  suggestedCommand?: string;
  commandLabel?: string;
  uiAction?: string;
  isTyping?: boolean;
}

// Extended Knowledge Base for RAG context
const SKA_KNOWLEDGE_BASE = `
--- SYSTEM CAPABILITIES UPDATE (V3.0) ---
1. SHELL COMMANDER:
   - The 'pathfinder_uplink.js' script now contains a ShellCommander class.
   - It allows the Hive Mind to execute system commands (ls, uname, whoami) on the host machine.
   - Purpose: Automated reconnaissance and environment fingerprinting.

2. GIT EVOLUTION PROTOCOL:
   - The Uplink script can now detect if it is running inside a Git repository.
   - Features:
     - Check remote origin URL.
     - Check current branch.
     - Detect uncommitted changes (dirty state).
     - AUTO-COMMIT: The system can autonomously stage and commit changes with the message prefix "feat(hive-mind):".

3. UPLINK USAGE:
   - Run 'node pathfinder_uplink.js' in your project root.
   - It will automatically connect to the Phoenix Gateway and start listening for shell commands.
`;

const SKAModal: React.FC<SKAModalProps> = ({ isOpen, onClose, onExecuteCommand, systemLogs = [] }) => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [ska] = useState(() => new SentinelKnowledgeAssistant());
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const logsBottomRef = useRef<HTMLDivElement>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [viewLogs, setViewLogs] = useState(false);

  useEffect(() => {
    if (isOpen && history.length === 0) {
        // Initial Greeting
        setHistory([{
            id: 'init',
            sender: 'SKA',
            text: '[SKA] SYSTEM ONLINE. I am the Sentinel Knowledge Assistant.\nI am connected to the Gemini Neural Core with full system context.\n\nAsk me about:\n- System Configuration\n- Pre-flight Checks\n- Module Documentation\n- Shell Commander & Git Integration',
            timestamp: new Date().toLocaleTimeString()
        }]);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isProcessing]);

  useEffect(() => {
      if (viewLogs) {
          logsBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [viewLogs, systemLogs]);

  const handleSend = async () => {
    if (!query.trim() || isProcessing) return;

    const userText = query;
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'USER',
        text: userText,
        timestamp: new Date().toLocaleTimeString()
    };

    setHistory(prev => [...prev, userMsg]);
    setQuery('');
    setIsProcessing(true);

    try {
        // Inject extended knowledge base into the prompt context for this specific turn
        const enhancedQuery = `${userText}\n\n[CONTEXT INJECTION]\n${SKA_KNOWLEDGE_BASE}`;
        
        // Async API Call
        const response: SKAResponse = await ska.ask(enhancedQuery);
        
        const skaMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'SKA',
            text: response.text,
            suggestedCommand: response.suggestedCommand,
            commandLabel: response.commandLabel,
            uiAction: response.uiAction,
            timestamp: new Date().toLocaleTimeString()
        };
        setHistory(prev => [...prev, skaMsg]);
    } catch (e) {
         const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'SKA',
            text: "CRITICAL FAILURE: Unable to access Knowledge Graph.",
            timestamp: new Date().toLocaleTimeString()
        };
        setHistory(prev => [...prev, errorMsg]);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  const handleCommandAction = async (cmd: string, id: string) => {
      if (onExecuteCommand) {
          setExecutingId(id);
          setViewLogs(true); // Auto-open logs to show execution
          
          // Execute Command
          await onExecuteCommand(cmd);
          
          setTimeout(() => setExecutingId(null), 1500);
      }
  };

  const handleUiAction = (action: string) => {
    if (action === 'DownloadButton') {
        // Simulate download from Nexus Static Endpoint
        const content = `PK... [SIMULATED ZIP BINARY CONTENT]\n\nMANIFEST:\n- Source: Deployment Nexus\n- Timestamp: ${new Date().toISOString()}\n- Sync Status: VERIFIED\n\n[CONTENT ENCRYPTED]`;
        const blob = new Blob([content], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `omni_system_export_latest.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] pointer-events-none overflow-hidden ${isOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute top-0 right-0 h-full w-[450px] bg-cyber-black border-l border-cyber-border shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-panel shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 border border-white/20 rounded-sm bg-white/5">
               <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-widest font-mono uppercase">Sentinel Guide</h2>
              <div className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
                 RAG_LAYER <span className="text-cyber-border">|</span> ACTIVE
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewLogs(!viewLogs)} 
                className={`p-1.5 rounded transition-colors ${viewLogs ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-white'}`}
                title="Toggle System Logs"
              >
                  <Terminal className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-cyber-dark relative overflow-hidden">
            
            {/* Warning Banner */}
            <div className="bg-neon-red/5 border-b border-neon-red/10 px-4 py-2 flex items-center gap-2 shrink-0">
                 <Shield className="w-3 h-3 text-neon-red" />
                 <span className="text-[10px] font-mono text-neon-red/80 uppercase">Execution Authority: DELEGATED</span>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Message List */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20 ${viewLogs ? 'pb-2' : ''}`}>
                    {history.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] rounded-sm p-3 border flex flex-col gap-2 ${
                                msg.sender === 'USER' 
                                ? 'bg-cyber-panel border-cyber-border text-gray-200' 
                                : 'bg-white/5 border-white/10 text-white'
                            }`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-1 text-[10px] font-mono opacity-50 uppercase">
                                        {msg.sender === 'SKA' ? <BookOpen className="w-3 h-3"/> : <Terminal className="w-3 h-3"/>}
                                        {msg.sender}
                                    </div>
                                    <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed">
                                        {msg.text}
                                    </div>
                                </div>

                                {/* Suggested Command Button */}
                                {msg.suggestedCommand && (
                                    <div className="bg-black/50 border border-cyber-border p-2 rounded-sm mt-1">
                                        <div className="text-[9px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Suggested Action</div>
                                        <div className="flex items-center gap-2 bg-cyber-black p-2 border border-cyber-border rounded-sm font-mono text-[10px] text-neon-cyan mb-2 break-all">
                                            <span className="text-gray-600 select-none">$</span> {msg.suggestedCommand}
                                        </div>
                                        <button 
                                            onClick={() => handleCommandAction(msg.suggestedCommand!, msg.id)}
                                            className={`w-full text-xs font-bold py-2 rounded-sm flex items-center justify-center gap-2 transition-all ${
                                                executingId === msg.id 
                                                ? 'bg-neon-green text-black border border-neon-green'
                                                : 'bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black'
                                            }`}
                                        >
                                            {executingId === msg.id ? (
                                                <>
                                                    <Loader2 className="w-3 h-3 animate-spin" /> EXECUTING...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-3 h-3" /> {msg.commandLabel ? msg.commandLabel.replace(/_/g, ' ') : 'EXECUTE COMMAND'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* UI Action (Download) */}
                                {msg.uiAction === 'DownloadButton' && (
                                    <div className="bg-neon-purple/5 border border-neon-purple/20 p-2 rounded-sm mt-1">
                                        <div className="text-[9px] text-neon-purple/70 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Artifact Ready
                                        </div>
                                        <button 
                                            onClick={() => handleUiAction(msg.uiAction!)}
                                            className="w-full text-xs font-bold py-2 rounded-sm flex items-center justify-center gap-2 bg-neon-purple/10 border border-neon-purple/50 text-neon-purple hover:bg-neon-purple hover:text-black transition-all"
                                        >
                                            <Download className="w-3 h-3" /> DOWNLOAD EXPORT
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {isProcessing && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 text-white rounded-sm p-3 flex items-center gap-3">
                                <Loader2 className="w-3 h-3 animate-spin text-neon-cyan" />
                                <span className="text-[10px] font-mono text-gray-400">ANALYZING...</span>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* System Logs Panel */}
                {viewLogs && (
                    <div className="h-1/3 min-h-[150px] border-t border-cyber-border bg-black/90 flex flex-col shrink-0 animate-in slide-in-from-bottom duration-300">
                        <div className="px-4 py-2 border-b border-cyber-border bg-cyber-panel/50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-neon-cyan uppercase tracking-wider">
                                <Terminal className="w-3 h-3" /> System Execution Stream
                            </div>
                            <button 
                                onClick={() => setViewLogs(false)}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-[10px] custom-scrollbar">
                            {systemLogs.slice().map(log => (
                                <div key={log.id} className="flex gap-2">
                                    <span className="text-gray-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}]</span>
                                    <span className={`shrink-0 ${
                                        log.type === 'error' ? 'text-neon-red' :
                                        log.type === 'success' ? 'text-neon-green' :
                                        log.type === 'warning' ? 'text-neon-gold' :
                                        'text-neon-cyan'
                                    }`}>{log.source}:</span>
                                    <span className="text-gray-400 break-all">{log.message}</span>
                                </div>
                            ))}
                            <div ref={logsBottomRef} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-cyber-panel border-t border-cyber-border shrink-0">
                <div className="flex gap-2">
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask for guidance..."
                        className="flex-1 bg-black border border-cyber-border p-2 text-xs font-mono text-white focus:outline-none focus:border-white/50 transition-colors rounded-sm"
                        disabled={isProcessing}
                        autoFocus
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!query.trim() || isProcessing}
                        className="bg-white text-black px-4 font-bold font-mono hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm"
                    >
                        <Send className="w-3 h-3" />
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default SKAModal;
