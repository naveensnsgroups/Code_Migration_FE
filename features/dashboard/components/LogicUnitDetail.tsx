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
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${unit.type === 'ui_component' ? 'text-blue-500 border-blue-500/40 bg-blue-500/10' :
                  unit.type === 'api_logic' ? 'text-purple-500 border-purple-500/40 bg-purple-500/10' :
                    'text-emerald-500 border-emerald-500/40 bg-emerald-500/10'
                }`}>
                {unit.type.replace('_', ' ')}
              </span>
              <div className="h-px flex-1 bg-[var(--border-main)]" />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${unit.priority === 'high' ? 'text-red-600' : 'text-[var(--text-muted)]'
                }`}>
                {unit.priority} Priority Extraction
              </span>
            </div>

            <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight leading-tight mb-4 uppercase italic">
              {unit.name}
            </h1>
            <p className="text-lg text-[var(--text-main)] opacity-60 font-medium leading-relaxed italic">
              "{unit.description}"
            </p>
          </header>

          <section className="grid grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--text-main)]">
                <Cpu className="w-5 h-5 text-[var(--accent-primary)]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Logic Dependencies</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-bold">
                  <ChevronRight className="w-3 h-3 text-[var(--accent-primary)]" />
                  <span>State Initialization</span>
                </li>
                <li className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-bold">
                  <ChevronRight className="w-3 h-3 text-[var(--accent-primary)]" />
                  <span>Event Listeners</span>
                </li>
                <li className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-bold">
                  <ChevronRight className="w-3 h-3 text-[var(--accent-primary)]" />
                  <span>External Stylesheets</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--text-main)]">
                <Layout className="w-5 h-5 text-[var(--accent-primary)]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Target Workspace</h3>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-bold text-[var(--text-main)] bg-[var(--bg-sidebar)] px-2 py-0.5 rounded border border-[var(--border-main)]">proper/components/{unit.name.toLowerCase().replace(/\s+/g, '_')}.jsx</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] font-bold italic">
                  Surgical extraction will create a modular, framework-ready component.
                </p>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-[var(--border-main)] mb-12" />

          <div className="flex items-center justify-between p-8 rounded-2xl bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 shadow-[0_0_50px_rgba(250,204,21,0.05)]">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)] flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--text-main)]">Ready for Modular Extraction</h4>
                <p className="text-sm text-[var(--text-muted)] font-medium">This logic unit has been fully mapped and isolated.</p>
              </div>
            </div>
            <button
              onClick={onMigrate}
              className="px-8 py-3 bg-[var(--accent-primary)] text-white font-black uppercase tracking-widest rounded-lg hover:brightness-110 transition-all shadow-xl"
            >
              Migrate Component
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
