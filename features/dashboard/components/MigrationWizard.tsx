"use client";

import React, { useState } from 'react';
import { X, Rocket, Cpu, Layers, CheckCircle2, ChevronRight, Info } from 'lucide-react';

interface MigrationWizardProps {
  onClose: () => void;
  onPlanGenerated: (stack: string) => void;
  architecture: string;
  purpose: string;
}

const FRONTEND_STACKS = [
  { id: 'nextjs', name: 'Next.js 14', desc: 'App Router, React Server Components.', icon: Rocket },
  { id: 'react-vite', name: 'React + Vite', desc: 'Fast, modern SPA with Hooks.', icon: Cpu },
  { id: 'tailwind', name: 'Tailwind CSS', desc: 'Utility-first styling modernization.', icon: Layers }
];

const BACKEND_STACKS = [
  { id: 'fastapi', name: 'Python FastAPI', desc: 'High-performance async API.', icon: Rocket },
  { id: 'nestjs', name: 'Node.js (NestJS)', desc: 'Modular, scalable enterprise BE.', icon: Cpu },
  { id: 'go-gin', name: 'Go (Gin)', desc: 'Blazing fast, compiled microservices.', icon: Layers }
];

export const MigrationWizard = ({ onClose, onPlanGenerated, architecture, purpose }: MigrationWizardProps) => {
  const [selectedFE, setSelectedFE] = useState<string>('nextjs');
  const [selectedBE, setSelectedBE] = useState<string>('fastapi');
  const [activeTab, setActiveTab] = useState<'fe' | 'be'>('fe');
  const [step, setStep] = useState<'selection' | 'roadmap'>('selection');

  const handleStartMigration = () => {
    onPlanGenerated(`${selectedFE} + ${selectedBE}`);
    setStep('roadmap');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[var(--bg-main)] border border-[var(--border-main)] w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[var(--bg-sidebar)] px-6 py-4 border-b border-[var(--border-main)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--accent-primary)]/10 flex items-center justify-center border border-[var(--accent-primary)]/20">
              <Rocket size={18} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase">Full-Stack Migration Wizard</h2>
              <p className="text-[10px] text-[var(--text-secondary)]">Modernizing legacy architectures with precision</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            title="Close Migration Wizard"
            aria-label="Close Migration Wizard"
            className="p-1.5 hover:bg-[var(--bg-main)] rounded-md transition-colors text-[var(--text-secondary)] hover:text-[var(--text-main)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'selection' ? (
            <div className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-md flex gap-3">
                <Info size={18} className="text-blue-400 mt-0.5" />
                <div className="text-[12px] leading-relaxed">
                  <span className="font-bold text-blue-400">Blueprint Loaded:</span> Detected <span className="text-white font-medium">{architecture}</span>. 
                  Project: <span className="italic text-[var(--text-secondary)]">"{purpose}"</span>.
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex p-1 bg-[var(--bg-sidebar)]/50 rounded-lg border border-[var(--border-main)]">
                <button 
                  onClick={() => setActiveTab('fe')}
                  className={`flex-1 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'fe' ? 'bg-[var(--accent-primary)] text-black shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                  Frontend Target
                </button>
                <button 
                  onClick={() => setActiveTab('be')}
                  className={`flex-1 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'be' ? 'bg-[var(--accent-primary)] text-black shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                  Backend Target
                </button>
              </div>

              <div className="grid gap-3">
                {(activeTab === 'fe' ? FRONTEND_STACKS : BACKEND_STACKS).map((stack) => {
                  const Icon = stack.icon;
                  const isSelected = activeTab === 'fe' ? selectedFE === stack.id : selectedBE === stack.id;
                  return (
                    <button
                      key={stack.id}
                      onClick={() => activeTab === 'fe' ? setSelectedFE(stack.id) : setSelectedBE(stack.id)}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left group relative overflow-hidden ${
                        isSelected 
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/[0.03] ring-1 ring-[var(--accent-primary)]/50 shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.1)]' 
                          : 'border-[var(--border-main)] hover:border-[var(--text-secondary)] bg-[var(--bg-sidebar)]/30 backdrop-blur-md'
                      }`}
                    >
                      {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent pointer-events-none" />}
                      <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-[var(--accent-primary)] text-black shadow-inner' : 'bg-[var(--bg-main)] text-[var(--text-secondary)] group-hover:text-[var(--text-main)] transition-colors'}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold tracking-tight">{stack.name}</span>
                          {isSelected && <CheckCircle2 size={14} className="text-[var(--accent-primary)]" />}
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          {stack.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="p-6 bg-[var(--bg-sidebar)]/40 border border-[var(--border-main)] rounded-xl backdrop-blur-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 bg-[var(--accent-primary)]/5 blur-3xl rounded-full -mr-10 -mt-10" />
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] mb-6 flex items-center gap-3">
                   <Layers size={14} /> Full-Stack Roadmap
                 </h3>
                 <div className="space-y-6">
                   {[
                     { step: "Project Initialization", desc: `Scaffold ${FRONTEND_STACKS.find(s=>s.id===selectedFE)?.name} & ${BACKEND_STACKS.find(s=>s.id===selectedBE)?.name} containers.`, active: true },
                     { step: "Architecture Mapping", desc: `Translate ${architecture} pattern to modern idiomatic structures.`, active: false },
                     { step: "Surgical Modernization", desc: "Extract and rewrite business logic units with AI optimization.", active: false },
                     { step: "Integration & Delivery", desc: "Connect frontend components to new API endpoints.", active: false }
                   ].map((item, idx) => (
                     <div key={idx} className="flex gap-5 group">
                       <div className="flex flex-col items-center">
                         <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-[11px] font-black transition-all ${item.active ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-black shadow-[0_0_25px_rgba(var(--accent-primary-rgb),0.4)] scale-110' : 'border-[var(--border-main)] text-[var(--text-secondary)]'}`}>
                           {idx + 1}
                         </div>
                         {idx < 3 && <div className="w-[1px] flex-1 bg-gradient-to-b from-[var(--border-main)] to-transparent my-2" />}
                       </div>
                       <div className="pb-2">
                         <h4 className={`text-xs font-bold leading-none mb-1.5 ${item.active ? 'text-white' : 'text-[var(--text-secondary)]'}`}>{item.step}</h4>
                         <p className="text-[10px] text-[var(--text-secondary)] leading-normal max-w-[400px]">{item.desc}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[var(--bg-sidebar)] px-6 py-4 border-t border-[var(--border-main)] flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleStartMigration}
            disabled={!selectedFE || !selectedBE || step === 'roadmap'}
            className="bg-[var(--accent-primary)] text-black px-6 py-2 rounded-md text-[11px] font-bold uppercase tracking-widest hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)]"
          >
            {step === 'selection' ? 'Proceed to Roadmap' : 'Roadmap Built'}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
