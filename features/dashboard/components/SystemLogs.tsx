"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
  message: string;
  timestamp: string;
}

export const SystemLogs = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', type: 'info', message: 'System initialized. Ready for migration.', timestamp: new Date().toLocaleTimeString() },
    { id: '2', type: 'ai', message: 'Idle. Waiting for repository selection...', timestamp: new Date().toLocaleTimeString() },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-0 right-8 bg-zinc-900 border-x border-t border-zinc-800 px-4 py-2 flex items-center gap-2 text-zinc-400 hover:text-white transition-all rounded-t-sm z-50"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">System Logs</span>
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <div className="h-48 border-t border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-50">
      <div className="h-8 flex items-center justify-between px-4 bg-zinc-900/50 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-brand-yellow/70" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Terminal — System Logs</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-zinc-800 rounded-sm text-zinc-500 hover:text-white transition-all"
          title="Minimize Logs"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1 selection:bg-brand-yellow/20">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300 tracking-tight">
            <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
            <span className={`
              ${log.type === 'success' ? 'text-emerald-400' : ''}
              ${log.type === 'error' ? 'text-red-400' : ''}
              ${log.type === 'warning' ? 'text-brand-yellow/80' : ''}
              ${log.type === 'ai' ? 'text-blue-400' : 'text-zinc-300'}
            `}>
              {log.type === 'ai' && (
                <span className="mr-2 font-medium inline-flex items-center gap-1.5 translate-y-[1px]">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  AI:
                </span>
              )}
              {log.message}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-zinc-700 animate-pulse">
          <span>&gt;</span>
          <div className="w-1.5 h-3.5 bg-zinc-700" />
        </div>
      </div>
    </div>
  );
};
