import React, { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FileText, Download, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';
import { ReportItem } from '../../types';

interface ReportLogProps {
  reports: ReportItem[];
}

const ReportLog: React.FC<ReportLogProps> = ({ reports }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [reports]);

  const handleDownload = (payload: NonNullable<ReportItem['downloadPayload']>) => {
    try {
        const blob = new Blob([payload.content], { type: payload.mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = payload.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (e) {
        console.error("Report Archive Download Failed", e);
    }
  };

  return (
    <Card className="flex flex-col h-96 shadow-[0_0_20px_rgba(0,0,0,0.3)] border-neon-cyan/20 shrink-0">
      <CardHeader className="bg-cyber-panel/90 border-b border-cyber-border sticky top-0 z-10 flex flex-row items-center justify-between py-3">
        <CardTitle className="flex items-center gap-2 text-neon-cyan text-sm tracking-widest uppercase">
          <FileText className="w-5 h-5" />
          Mission Report Archive
        </CardTitle>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
            STREAM_ACTIVE
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40 font-mono text-xs custom-scrollbar" ref={scrollRef}>
        {reports.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-50 space-y-2">
              <Terminal className="w-8 h-8" />
              <p>NO REPORTS GENERATED</p>
           </div>
        ) : (
            reports.map((report) => (
                <div key={report.id} className="border border-cyber-border bg-black/60 rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-cyber-panel border-b border-cyber-border px-4 py-2 flex items-center justify-between">
                         <div className="text-neon-gold font-bold uppercase">{report.title}</div>
                         <div className="text-gray-500 text-[10px]">{new Date(report.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="p-4 text-gray-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto custom-scrollbar border-b border-cyber-border/30">
                        {report.content}
                    </div>
                    {report.downloadPayload && (
                        <div className="bg-cyber-dark px-4 py-2 flex justify-end">
                             <Button 
                                variant="outline" 
                                className="h-7 text-[10px] border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:text-white gap-2 transition-all"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDownload(report.downloadPayload!);
                                }}
                             >
                                <Download className="w-3 h-3" />
                                DOWNLOAD ARTIFACT
                             </Button>
                        </div>
                    )}
                </div>
            ))
        )}
      </CardContent>
    </Card>
  );
};

export default ReportLog;