"use client";

import React from 'react';
import { Link2, Search, Zap, ChevronRight } from 'lucide-react';

interface ProgressionTrackerProps {
  currentStep: 'connect' | 'analyze' | 'migrate';
}

export const ProgressionTracker = ({ currentStep }: ProgressionTrackerProps) => {
  const steps = [
    { id: 'connect', label: 'Connect', icon: Link2 },
    { id: 'analyze', label: 'Analyze', icon: Search },
    { id: 'migrate', label: 'Migrate', icon: Zap },
  ];

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const idx = steps.findIndex(s => s.id === currentStep);
        const isCompleted = index < idx;

        return (
          <React.Fragment key={step.id}>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-all border ${isActive
                ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/40 text-[var(--accent-primary)] shadow-sm font-bold'
                : isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                  : 'bg-transparent border-transparent text-[var(--text-main)] opacity-50'
              }`}>
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-3 h-3 text-[var(--text-main)] opacity-20" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
