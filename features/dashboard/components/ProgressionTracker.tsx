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
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
              isActive 
                ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]' 
                : isCompleted
                  ? 'bg-emerald-400/5 border-emerald-400/20 text-emerald-400'
                  : 'bg-transparent border-transparent text-zinc-600'
            }`}>
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-zinc-800" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
