import React from 'react';
import { LogicUnit } from '../types';
import { Box, Code, Cpu, Layout, FileCode, CheckCircle2, ChevronRight, Zap, ChevronLeft } from 'lucide-react';

interface LogicUnitDetailProps {
  unit: LogicUnit;
  onMigrate: () => void;
  onBack: () => void;
}

export const LogicUnitDetail = ({ unit, onMigrate, onBack }: LogicUnitDetailProps) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-workspace)] overflow-hidden select-none animate-in fade-in duration-500">
      <header className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-sidebar)]/20 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            aria-label="Back to Roadmap"
            className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-medium text-[var(--text-muted)] uppercase tracking-widest">Roadmap</span>
              <ChevronRight className="w-2.5 h-2.5 text-[var(--text-muted)]" />
              <span className="text-[9px] font-medium text-[var(--accent-primary)] uppercase tracking-widest">Surgical Extraction</span>
            </div>
            <h2 className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight">{unit.name}</h2>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${unit.type === 'ui_component' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' :
                  unit.type === 'api_logic' ? 'text-purple-400 border-purple-400/20 bg-purple-400/5' :
                    'text-emerald-400 border-emerald-400/20 bg-emerald-400/5'
                }`}>
                {unit.type.replace('_', ' ')}
              </span>
              <div className="h-px flex-1 bg-zinc-900/50" />
              <span className={`text-[10px] font-medium uppercase tracking-widest ${unit.priority === 'high' ? 'text-red-500' : 'text-zinc-500'
                }`}>
                {unit.priority} Priority Extraction
              </span>
            </div>

            <h1 className="text-4xl font-black text-zinc-100 tracking-tight leading-tight mb-4">
              {unit.name}
            </h1>
            <p className="text-lg text-zinc-500 font-medium leading-relaxed italic">
              "{unit.description}"
            </p>
          </header>

          <section className="grid grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Cpu className="w-5 h-5" />
                <h3 className="text-xs font-medium uppercase tracking-widest">Logic Dependencies</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <ChevronRight className="w-3 h-3 text-brand-yellow" />
                  <span>State Initialization</span>
                </li>
                <li className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <ChevronRight className="w-3 h-3 text-brand-yellow" />
                  <span>Event Listeners</span>
                </li>
                <li className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <ChevronRight className="w-3 h-3 text-brand-yellow" />
                  <span>External Stylesheets</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Layout className="w-5 h-5" />
                <h3 className="text-xs font-medium uppercase tracking-widest">Target Workspace</h3>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-medium text-zinc-300">proper/components/{unit.name.toLowerCase().replace(/\s+/g, '_')}.jsx</span>
                </div>
                <p className="text-[10px] text-zinc-600 italic">
                  Surgical extraction will create a modular, framework-ready component.
                </p>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-zinc-900 mb-12" />

          <div className="flex items-center justify-between p-8 rounded-2xl bg-brand-yellow/5 border border-brand-yellow/20 shadow-[0_0_50px_rgba(250,204,21,0.05)]">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-zinc-100">Ready for Modular Extraction</h4>
                <p className="text-sm text-zinc-500">This logic unit has been fully mapped and isolated.</p>
              </div>
            </div>
            <button
              onClick={onMigrate}
              className="px-8 py-3 bg-brand-yellow text-black font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-xl"
            >
              Migrate Component
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
