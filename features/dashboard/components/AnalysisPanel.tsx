"use client";

import React from 'react';
import { Layers, CheckCircle2, Circle, AlertCircle, Zap, ChevronRight } from 'lucide-react';
import { LogicUnit } from '../types';

interface AnalysisPanelProps {
  results: LogicUnit[];
  onToggleSelection: (id: string) => void;
  isAnalyzing: boolean;
  projectStack?: { frontend: string; backend: string; database?: string } | null;
  activeId?: string | null;
  onSelectUnit?: (id: string | null) => void;
}

export const AnalysisPanel = ({ results, onToggleSelection, isAnalyzing, projectStack, activeId, onSelectUnit }: AnalysisPanelProps) => {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col h-full bg-[#050505] border-l border-zinc-900 animate-pulse">
        <div className="p-4 border-b border-zinc-900 bg-zinc-950/50">
          <div className="h-4 w-32 bg-zinc-800 rounded-sm mb-2" />
          <div className="h-3 w-48 bg-zinc-900 rounded-sm" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900/30 rounded-sm border border-zinc-900/50" />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#050505] border-l border-zinc-900 text-center p-8">
        <Layers className="w-10 h-10 text-zinc-800 mb-4" />
        <h3 className="text-zinc-500 font-medium text-xs uppercase tracking-widest mb-2">No Analysis Data</h3>
        <p className="text-zinc-700 text-[10px] leading-relaxed max-w-[180px]">
          Select a file and click <span className="text-brand-yellow/50">ANALYZE LOGIC</span> to extract migration points.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-workspace)] overflow-hidden flex-1 select-none animate-in fade-in duration-700">
      <header className="p-6 border-b border-[var(--border-main)] bg-[var(--bg-sidebar)]/20 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-brand-yellow" />
            <h3 className="text-xs font-medium text-zinc-100 uppercase tracking-[0.2em]">Logic Analysis Roadmap</h3>
          </div>
          <p className="text-xs text-zinc-600 tracking-tight font-medium">Surgical migration units mapped from repository cross-references</p>
        </div>

        {projectStack && (
          <div className="flex items-center gap-4 py-2 px-4 rounded-xl bg-zinc-900/20 border border-zinc-900 shadow-sm">
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Frontend Stack</span>
              <span className="text-[10px] text-brand-yellow font-medium truncate tracking-tight">{projectStack.frontend}</span>
            </div>
            <div className="w-px h-6 bg-zinc-800" />
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Backend Stack</span>
              <span className="text-[10px] text-zinc-500 font-medium truncate tracking-tight">{projectStack.backend}</span>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 custom-scrollbar scroll-smooth">
        {results.map((unit) => (
          <div
            key={unit.id}
            onClick={() => onSelectUnit?.(unit.id)}
            className={`flex flex-col p-5 rounded-xl border transition-all text-left relative group cursor-pointer h-fit ${activeId === unit.id
                ? 'bg-[var(--bg-sidebar)] border-[var(--accent-primary)]/50 shadow-[0_0_40px_rgba(250,204,21,0.08)] scale-[1.02] z-10'
                : unit.selected
                  ? 'bg-[var(--bg-sidebar)]/80 border-[var(--border-accent)]'
                  : 'bg-[var(--bg-card)] border-[var(--border-main)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-card-hover)]'
              }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <span className={`text-[13px] font-black tracking-tight leading-snug ${activeId === unit.id || unit.selected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-main)]'}`}>
                  {unit.name}
                </span>
                <span className={`text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full w-fit border ${unit.type === 'ui_component' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' :
                    unit.type === 'api_logic' ? 'text-purple-400 border-purple-400/20 bg-purple-400/5' :
                      'text-emerald-400 border-emerald-400/20 bg-emerald-400/10'
                  }`}>
                  {unit.type.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelection(unit.id);
                }}
                className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${unit.selected
                    ? 'bg-brand-yellow border-brand-yellow text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-800 hover:border-zinc-700'
                  }`}
              >
                {unit.selected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />}
              </button>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-6 font-medium line-clamp-2 italic">
              {unit.description}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-[var(--border-main)] pt-4">
              <div className="flex items-center gap-1.5">
                <AlertCircle className={`w-3 h-3 ${unit.priority === 'high' ? 'text-red-500' :
                    unit.priority === 'medium' ? 'text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                      'text-[var(--text-muted)]'
                  }`} />
                <span className="text-[9px] text-[var(--text-muted)] uppercase font-black tracking-widest">
                  {unit.priority} Level
                </span>
              </div>

              <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Detail</span>
                <ChevronRight className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 shrink-0">
        <div className="flex items-center justify-between text-[10px] font-medium text-zinc-500 mb-2 px-1">
          <span>Selected Items</span>
          <span className="text-brand-yellow">{results.filter(r => r.selected).length} / {results.length}</span>
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-yellow transition-all duration-500"
            style={{ width: `${(results.filter(r => r.selected).length / results.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
