
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { sendDirectiveToAction, DirectiveResponse } from '../../api/swarm';
import { Terminal, Cpu, CheckCircle2, ChevronRight, ArrowRight, Shield, Download } from 'lucide-react';
import { ReportItem } from '../../types';

interface DirectiveControlProps {
    onReportGenerated?: (report: ReportItem) => void;
}

interface HistoryItem {
    id: string;
    cmd: string;
    res?: DirectiveResponse;
    error?: boolean;
}

const DirectiveControl: React.FC<DirectiveControlProps> = ({ onReportGenerated }) => {
  const [command, setCommand] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const parseDualOutput = (details: string) => {
    if (!details || !details.startsWith('G3P-ACTION:DUAL_OUTPUT:')) return null;
    try {
        const jsonStr = details.replace('G3P-ACTION:DUAL_OUTPUT:', '');
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Dual Output Parse Error", e);
        return null;
    }
  };

  const handleDownload = (filename: string, content: string, mimeType: string) => {
    try {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (e) {
        console.error("Download failed", e);
    }
  };

  const handleSubmit = async () => {
    if (!command.trim()) return;
    
    setIsSending(true);
    const currentCmd = command;
    const cmdId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    setCommand('');
    
    // Optimistic update with unique ID
    setHistory(prev => [...prev, { id: cmdId, cmd: currentCmd }]);

    try {
      const result = await sendDirectiveToAction(currentCmd);
      
      let reportItem: ReportItem | null = null;

      if (result.finalOutput) {
        const parsed = parseDualOutput(result.finalOutput.details);
        
        if (parsed) {
             reportItem = {
                 id: result.executionHash,
                 title: result.finalOutput.summary,
                 content: parsed.displayText,
                 timestamp: result.timestamp,
                 downloadPayload: parsed.downloadPayload
             };
        } else {
             // Fallback: Treat generic output as a report if substantial
             reportItem = {
                 id: result.executionHash,
                 title: result.finalOutput.summary,
                 content: result.finalOutput.details,
                 timestamp: result.timestamp,
                 downloadPayload: {
                     filename: `execution_log_${result.executionHash}.txt`,
                     mimeType: 'text/plain',
                     content: `SUMMARY: ${result.finalOutput.summary}\n\nDETAILS:\n${result.finalOutput.details}\n\nIMPACT:\n${result.finalOutput.impact}`
                 }
             };
        }
        
        if (reportItem) {
             onReportGenerated?.(reportItem);
        }
      }

      // Update the specific history item, checking if mounted
      if (isMounted.current) {
        setHistory(prev => prev.map(item => 
            item.id === cmdId ? { ...item, res: result } : item
        ));
      }

    } catch (error) {
      if (isMounted.current) {
        setHistory(prev => prev.map(item => 
            item.id === cmdId ? { ...item, error: true } : item
        ));
      }
      console.error("Directive failed:", error);
    } finally {
      if (isMounted.current) {
        setIsSending(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <CardHeader className="bg-cyber-panel/80 backdrop-blur border-b border-cyber-border/50 sticky top-0 z-10">
        <CardTitle className="flex items-center gap-2 text-neon-purple text-sm tracking-widest uppercase">
          <Terminal className="w-5 h-5" />
          HAK Kernel Executive Console
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative bg-black/40">
        {/* Output Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 font-mono text-xs custom-scrollbar">
          {history.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-2 opacity-50">
                <Shield className="w-12 h-12" />
                <p>SECURE CHANNEL ESTABLISHED</p>
                <p>AWAITING EXECUTIVE INPUT...</p>
             </div>
          )}

          {history.map((entry) => (
            <div key={entry.id} className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Command Bubble */}
              <div className="flex justify-end">
                 <div className="bg-neon-purple/10 border border-neon-purple/30 text-neon-purple px-4 py-2 rounded-tl-xl rounded-bl-xl rounded-tr-xl">
                    <span className="opacity-50 mr-2">$</span>
                    {entry.cmd}
                 </div>
              </div>

              {/* Response Block */}
              {entry.error ? (
                 <div className="text-neon-red bg-neon-red/5 p-3 rounded border border-neon-red/20">
                    ERROR: EXECUTION FAILED
                 </div>
              ) : !entry.res ? (
                 <div className="flex items-center gap-2 text-gray-500 pl-2">
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Processing Directive...</span>
                 </div>
              ) : (
                <div className="bg-black/60 border border-cyber-border rounded-sm overflow-hidden">
                    {/* Tool Announcement Header */}
                    <div className="bg-cyber-panel border-b border-cyber-border p-2 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-neon-cyan font-bold">
                            <Cpu className="w-4 h-4" />
                            {entry.res.toolCall?.name || 'UnknownTool'}
                         </div>
                         <div className="text-[10px] text-gray-500">ID: {entry.res.executionHash}</div>
                    </div>

                    {/* Execution Stream */}
                    <div className="p-3 border-b border-cyber-border/30 bg-black/20 space-y-1">
                        {entry.res.executionStream?.map((step, sIdx) => (
                            <div key={sIdx} className="text-gray-400 flex gap-2">
                                <ChevronRight className="w-3 h-3 text-gray-600 shrink-0 mt-0.5" />
                                <span>{step}</span>
                            </div>
                        ))}
                    </div>

                    {/* Final Output Report */}
                    {entry.res.finalOutput && (
                        <div className="p-4 bg-neon-green/5">
                            <div className="flex items-center gap-2 text-neon-green font-bold mb-2">
                                <CheckCircle2 className="w-4 h-4" />
                                EXECUTION COMPLETE
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="text-gray-300"><span className="text-gray-500 uppercase text-[10px] block">Summary</span> {entry.res.finalOutput.summary}</div>
                                
                                <div className="text-gray-300">
                                    <span className="text-gray-500 uppercase text-[10px] block">Details</span> 
                                    {(() => {
                                        const parsed = parseDualOutput(entry.res.finalOutput.details);
                                        if (parsed) {
                                            return (
                                                <div className="mt-2 space-y-3">
                                                    <div className="bg-black/50 border border-cyber-border p-3 rounded text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                                                        {parsed.displayText}
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        className="w-full flex items-center gap-2 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDownload(
                                                                parsed.downloadPayload.filename, 
                                                                parsed.downloadPayload.content, 
                                                                parsed.downloadPayload.mimeType
                                                            );
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        DOWNLOAD REPORT ({parsed.downloadPayload.filename})
                                                    </Button>
                                                    <div className="text-[10px] text-neon-cyan/70 italic text-right">
                                                        * Archived to Mission Reports
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="mt-2 space-y-3">
                                                    <div className="bg-black/50 border border-cyber-border p-3 rounded text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                                                        {entry.res.finalOutput.details}
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        className="w-full flex items-center gap-2 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDownload(
                                                                `execution_log_${entry.res?.executionHash}.txt`,
                                                                `SUMMARY: ${entry.res?.finalOutput?.summary}\n\nDETAILS:\n${entry.res?.finalOutput?.details}\n\nIMPACT:\n${entry.res?.finalOutput?.impact}`,
                                                                'text/plain'
                                                            );
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        DOWNLOAD LOG
                                                    </Button>
                                                    <div className="text-[10px] text-neon-cyan/70 italic text-right">
                                                        * Archived to Mission Reports
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>

                                <div className="text-neon-gold"><span className="text-gray-500 uppercase text-[10px] block">Impact</span> {entry.res.finalOutput.impact}</div>
                            </div>
                        </div>
                    )}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-cyber-panel border-t border-cyber-border">
            <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <span className="absolute left-3 top-2.5 text-neon-cyan font-mono text-xs transition-opacity group-focus-within:opacity-100 opacity-50">$</span>
                    <Input 
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="ENTER_ROOT_COMMAND..."
                        className="pl-6 font-mono bg-black border-neon-cyan/30 focus-visible:ring-neon-purple h-10 transition-all"
                        disabled={isSending}
                    />
                </div>
                <Button 
                    onClick={handleSubmit} 
                    disabled={isSending || !command.trim()}
                    className="w-32 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 hover:bg-neon-purple hover:text-black transition-all"
                >
                    {isSending ? (
                        <Cpu className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            SEND <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default DirectiveControl;
