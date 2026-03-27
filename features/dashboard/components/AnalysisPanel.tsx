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
      <div className="flex flex-col h-full bg-[var(--bg-main)] border-l border-[var(--border-main)] animate-pulse">
        <div className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-sidebar)]/50">
          <div className="h-4 w-32 bg-[var(--border-main)] rounded-sm mb-2" />
          <div className="h-3 w-48 bg-[var(--bg-sidebar)] rounded-sm" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--bg-sidebar)]/30 rounded-sm border border-[var(--border-main)]/50" />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[var(--bg-main)] border-l border-[var(--border-main)] text-center p-8">
        <Layers className="w-10 h-10 text-[var(--border-accent)] mb-4" />
        <h3 className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest mb-2">No Analysis Data</h3>
        <p className="text-[var(--text-muted)] text-[10px] leading-relaxed max-w-[180px] font-medium">
          Select a file and click <span className="text-[var(--accent-primary)] font-black">ANALYZE LOGIC</span> to extract migration points.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-main)] overflow-hidden flex-1 select-none animate-in fade-in duration-700">
      <header className="p-6 border-b border-[var(--border-main)] bg-[var(--bg-sidebar)]/30 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-[var(--accent-primary)] font-black" />
            <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-[0.2em]">Logic Analysis Roadmap</h3>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] tracking-tight font-bold opacity-80">Surgical migration units mapped from repository cross-references</p>
        </div>

        {projectStack && (
          <div className="flex items-center gap-4 py-2 px-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm">
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-[var(--text-muted)] uppercase font-black tracking-widest">Frontend Stack</span>
              <span className="text-[10px] text-[var(--accent-primary)] font-black truncate tracking-tight">{projectStack.frontend}</span>
            </div>
            <div className="w-px h-6 bg-[var(--border-main)]" />
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-[var(--text-muted)] uppercase font-black tracking-widest">Backend Stack</span>
              <span className="text-[10px] text-[var(--text-main)] font-black truncate tracking-tight">{projectStack.backend}</span>
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
                ? 'bg-[var(--bg-sidebar)] border-[var(--accent-primary)] shadow-[0_0_40px_rgba(250,204,21,0.08)] scale-[1.02] z-10'
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
                <span className={`text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full w-fit border ${unit.type === 'ui_component' ? 'text-blue-500 border-blue-500/40 bg-blue-500/10' :
                    unit.type === 'api_logic' ? 'text-purple-500 border-purple-500/40 bg-purple-500/10' :
                      'text-emerald-500 border-emerald-500/40 bg-emerald-500/10'
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
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                    : 'bg-[var(--bg-card)] border-[var(--border-accent)] text-[var(--border-accent)] hover:border-[var(--text-muted)]'
                  }`}
              >
                {unit.selected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-accent)]" />}
              </button>
            </div>

            <p className="text-[11px] text-[var(--text-main)] opacity-70 leading-relaxed mb-6 font-medium line-clamp-2 italic">
              {unit.description}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-[var(--border-main)] pt-4">
              <div className="flex items-center gap-1.5">
                <AlertCircle className={`w-3 h-3 ${unit.priority === 'high' ? 'text-red-500' :
                    unit.priority === 'medium' ? 'text-amber-500' :
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

      <div className="p-4 border-t border-[var(--border-main)] bg-[var(--bg-sidebar)]/30 shrink-0">
        <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-muted)] mb-2 px-1">
          <span className="uppercase tracking-widest">Selected Migration Units</span>
          <span className="text-[var(--accent-primary)] font-black">{results.filter(r => r.selected).length} / {results.length}</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-primary)] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(250,204,21,0.3)]"
            style={{ width: `${(results.filter(r => r.selected).length / results.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
