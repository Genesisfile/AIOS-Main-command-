import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Send, Cpu, Download, Clock, ShieldCheck, Database, Zap, Lock, AlertTriangle, FileJson, Copy, Check, Globe } from 'lucide-react';
import { HiveMindArchitect, Blueprint } from '../api/hive_export';

interface HiveMindExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'USER' | 'HIVE';
  text: string;
}

const COOLDOWN_KEY = 'hive_export_cooldown_timestamp';
const COOLDOWN_DURATION = 60 * 60 * 1000; // 1 Hour

const HiveMindExportModal: React.FC<HiveMindExportModalProps> = ({ isOpen, onClose }) => {
  const [architect] = useState(() => new HiveMindArchitect());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState<'BLUEPRINT' | 'GENERATING' | 'RESULT' | 'COOLDOWN'>('BLUEPRINT');
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [now, setNow] = useState(Date.now());
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Result State
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [secureKey, setSecureKey] = useState('');
  const [integrationJson, setIntegrationJson] = useState('');

  // Check Cooldown on Mount/Open
  useEffect(() => {
    const stored = localStorage.getItem(COOLDOWN_KEY);
    if (stored) {
        const expiry = parseInt(stored);
        if (Date.now() < expiry) {
            setStage('COOLDOWN');
            setCooldownTime(expiry);
        } else {
            localStorage.removeItem(COOLDOWN_KEY);
            setStage('BLUEPRINT');
        }
    }
  }, [isOpen]);

  // Timer for Cooldown UI
  useEffect(() => {
    if (stage === 'COOLDOWN') {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }
  }, [stage]);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0 && stage === 'BLUEPRINT') {
        setMessages([{
            sender: 'HIVE',
            text: "AUTHENTICATED. I am the Hive Mind Architect.\n\nI require a detailed specification to construct a Custom System Export. State your intended application, target environment, and desired autonomous capabilities."
        }]);
    }
  }, [isOpen, messages, stage]);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'USER', text: userMsg }]);
    setIsTyping(true);

    try {
        const response = await architect.sendMessage(userMsg);
        
        setMessages(prev => [...prev, { sender: 'HIVE', text: response.text }]);
        
        if (response.isBlueprintReady && response.blueprint) {
            setBlueprint(response.blueprint);
            // Small delay before transition
            setTimeout(() => {
                setStage('GENERATING');
                startGenerationProtocol(response.blueprint!);
            }, 2000);
        }

    } catch (e) {
        setMessages(prev => [...prev, { sender: 'HIVE', text: "ERROR: Neural Link Unstable." }]);
    } finally {
        setIsTyping(false);
    }
  };

  const startGenerationProtocol = async (bp: Blueprint) => {
    await new Promise(r => setTimeout(r, 1000));
    setMessages(prev => [...prev, { sender: 'HIVE', text: `[SYSTEM] Blueprint Confirmed. Initiating compilation for target: ${bp.target}...` }]);
    
    await new Promise(r => setTimeout(r, 2500));
    
    // Generate Fake Details
    const exportId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const endpoint = `https://api.hive-mind-exports.io/v1/sovereign/${exportId}`;
    const key = `sk_sovereign_${Math.random().toString(36).substr(2, 16)}_${bp.hostingDuration}`;
    
    const manifest = {
        deployment_target: bp.target,
        evolution_strategy: bp.strategy,
        modules: bp.modules,
        hosting_expiry: new Date(Date.now() + (bp.hostingDuration === '1d' ? 86400000 : bp.hostingDuration === '7d' ? 604800000 : 2592000000)).toISOString(),
        auto_heal: bp.selfHealing,
        uplink: endpoint
    };

    setApiEndpoint(endpoint);
    setSecureKey(key);
    setIntegrationJson(JSON.stringify(manifest, null, 2));
    
    setStage('RESULT');
    
    // Set Cooldown
    localStorage.setItem(COOLDOWN_KEY, (Date.now() + COOLDOWN_DURATION).toString());
  };

  const getCooldownString = () => {
      const diff = Math.max(0, cooldownTime - now);
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return `${m}m ${s}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-5xl h-[85vh] bg-[#050508] border border-neon-purple/30 shadow-[0_0_100px_rgba(147,51,234,0.15)] flex flex-col relative overflow-hidden rounded-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neon-purple/20 bg-neon-purple/5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 border border-neon-purple/50 rounded-sm bg-neon-purple/10">
               <Cpu className="w-6 h-6 text-neon-purple" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-widest font-mono uppercase">Hive Mind Architect</h2>
              <div className="text-xs text-neon-purple/70 font-mono flex items-center gap-2">
                 CUSTOM EXPORT DIVISION <span className="text-gray-700">|</span> {stage === 'COOLDOWN' ? 'OFFLINE' : 'ONLINE'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
            
            {/* Background Grid */}
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>

            {stage === 'COOLDOWN' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
                    <Clock className="w-24 h-24 text-gray-700 mb-6 animate-pulse" />
                    <h3 className="text-3xl font-bold text-gray-500 tracking-widest mb-2 font-mono">SYSTEM COOLDOWN</h3>
                    <p className="text-gray-600 max-w-md mb-8">
                        Custom export fabrication requires significant computational resources. 
                        Please wait for the quantum arrays to cool down.
                    </p>
                    <div className="text-4xl font-mono text-neon-purple font-bold tracking-widest border border-neon-purple/30 px-8 py-4 rounded bg-neon-purple/5">
                        {getCooldownString()}
                    </div>
                </div>
            )}

            {stage === 'GENERATING' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-neon-purple/20 blur-xl rounded-full animate-pulse"></div>
                        <Database className="w-24 h-24 text-neon-purple animate-bounce relative z-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-widest mb-2 font-mono">FABRICATING EXPORT</h3>
                    <div className="text-neon-purple/80 font-mono text-sm mb-8 animate-pulse">
                        Compiling {blueprint?.target} Artifacts...
                    </div>
                    
                    <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-purple animate-[width_2s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
                    </div>
                </div>
            )}

            {stage === 'RESULT' && (
                <div className="flex-1 overflow-y-auto p-8 z-10 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="text-center">
                             <Check className="w-16 h-16 text-neon-green mx-auto mb-4 border-2 border-neon-green rounded-full p-2" />
                             <h2 className="text-3xl font-bold text-white tracking-wider mb-2">EXPORT SUCCESSFUL</h2>
                             <p className="text-gray-400 font-mono text-sm">
                                Hosted securely for: <span className="text-neon-purple font-bold">{blueprint?.hostingDuration}</span>
                             </p>
                        </div>

                        <div className="bg-neon-red/5 border border-neon-red/20 p-4 rounded-sm flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-neon-red shrink-0" />
                            <div className="text-xs text-neon-red/80 font-mono leading-relaxed">
                                <strong>WARNING:</strong> This information is displayed ONCE. It cannot be retrieved after you close this window. 
                                Save the credentials immediately. The Hive Mind does not retain private keys.
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-black/50 border border-cyber-border p-4 rounded-sm group">
                                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> API Endpoint
                                </label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 font-mono text-sm text-neon-cyan truncate">{apiEndpoint}</code>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(apiEndpoint)}
                                        className="text-gray-500 hover:text-white transition-colors"
                                    ><Copy className="w-4 h-4"/></button>
                                </div>
                            </div>

                            <div className="bg-black/50 border border-cyber-border p-4 rounded-sm group">
                                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> Secure Access Key
                                </label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 font-mono text-sm text-neon-purple truncate">{secureKey}</code>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(secureKey)}
                                        className="text-gray-500 hover:text-white transition-colors"
                                    ><Copy className="w-4 h-4"/></button>
                                </div>
                            </div>

                            <div className="bg-black/50 border border-cyber-border p-4 rounded-sm relative">
                                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block flex items-center gap-2">
                                    <FileJson className="w-3 h-3" /> Integration JSON
                                </label>
                                <pre className="font-mono text-[10px] text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-60 custom-scrollbar">
                                    {integrationJson}
                                </pre>
                                <button 
                                     onClick={() => navigator.clipboard.writeText(integrationJson)}
                                     className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                                ><Copy className="w-4 h-4"/></button>
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                             <button 
                                onClick={() => {
                                    const blob = new Blob([JSON.stringify({
                                        endpoint: apiEndpoint,
                                        key: secureKey,
                                        manifest: JSON.parse(integrationJson)
                                    }, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `HIVE_EXPORT_${blueprint?.target.replace(/\s/g,'_')}.json`;
                                    document.body.appendChild(a);
                                    a.click();
                                }}
                                className="bg-neon-purple text-black px-8 py-3 font-bold font-mono tracking-wider hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(191,0,255,0.4)]"
                             >
                                <Download className="w-5 h-5" /> SAVE CREDENTIALS (.JSON)
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {stage === 'BLUEPRINT' && (
                <div className="flex-1 flex flex-col z-10">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-sm border ${
                                    msg.sender === 'USER' 
                                    ? 'bg-neon-purple/10 border-neon-purple/30 text-gray-100' 
                                    : 'bg-black/60 border-cyber-border text-neon-cyan'
                                }`}>
                                    <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] font-mono uppercase font-bold">
                                        {msg.sender === 'HIVE' ? <Cpu className="w-3 h-3"/> : <MessageSquare className="w-3 h-3"/>}
                                        {msg.sender === 'HIVE' ? 'HIVE MIND' : 'OPERATOR'}
                                    </div>
                                    <div className="text-xs font-mono whitespace-pre-wrap leading-relaxed">
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-black/60 border border-cyber-border p-3 rounded-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 bg-black/80 border-t border-neon-purple/20 shrink-0">
                         <div className="flex gap-2">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Describe your export requirements..."
                                className="flex-1 bg-cyber-dark border border-gray-700 p-3 text-sm font-mono text-white focus:outline-none focus:border-neon-purple transition-colors rounded-sm"
                                disabled={isTyping}
                                autoFocus
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="bg-neon-purple/80 text-black px-6 font-bold font-mono hover:bg-neon-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
      </div>
    </div>
  );
};

export default HiveMindExportModal;