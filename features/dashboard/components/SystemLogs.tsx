"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export interface LogEntry {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
  message: string;
  timestamp: string;
}

interface SystemLogsProps {
  logs?: LogEntry[];
}

export const SystemLogs = ({ logs = [] }: SystemLogsProps) => {
  const [isOpen, setIsOpen] = useState(true);
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
        className="fixed bottom-0 right-8 bg-[var(--bg-sidebar)] border-x border-t border-[var(--border-main)] px-4 py-2 flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all rounded-t-sm z-50 transition-colors duration-300"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-muted)]">System Logs</span>
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <div className="h-48 border-t border-[var(--border-main)] bg-[var(--bg-main)] flex flex-col shrink-0 z-50 transition-colors duration-300">
      <div className="h-8 flex items-center justify-between px-4 bg-[var(--bg-sidebar)]/50 border-b border-[var(--border-main)]/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-muted)]">Terminal — System Logs</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-[var(--bg-card-hover)] rounded-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
          title="Minimize Logs"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1 selection:bg-[var(--accent-primary)]/20">
        {logs && logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 tracking-tight">
            <span className="text-[var(--text-muted)] shrink-0 font-medium opacity-60">[{log.timestamp || '0:00:00'}]</span>
            <span className={`
              ${log.type === 'success' ? 'text-emerald-500' : ''}
              ${log.type === 'error' ? 'text-red-500' : ''}
              ${log.type === 'warning' ? 'text-[var(--accent-primary)]' : ''}
              ${log.type === 'ai' ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-main)]'}
              leading-relaxed font-medium
            `}>
              {log.type === 'ai' && (
                <span className="mr-2 font-medium inline-flex items-center gap-1.5 translate-y-[1px]">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  AI:
                </span>
              )}
              {log.message || 'Processing...'}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-[var(--border-accent)] animate-pulse">
          <span>&gt;</span>
          <div className="w-1.5 h-3.5 bg-[var(--border-accent)]" />
        </div>
      </div>
    </div>
  );
};
