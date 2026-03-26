"use client";

import React from 'react';
import { Files, Search, GitBranch, Bug, Settings, User } from 'lucide-react';

interface ActivityBarProps {
  activeTab: 'explorer' | 'git';
  onTabChange: (tab: 'explorer' | 'git') => void;
}

export const ActivityBar = ({ activeTab, onTabChange }: ActivityBarProps) => {
  return (
    <nav className="w-14 bg-zinc-950 border-r border-zinc-900 flex flex-col items-center py-4 gap-4 shrink-0 h-full">
      {/* Top Icons */}
      <div className="flex-1 flex flex-col items-center gap-2 w-full">
        {/* Explorer */}
        <button 
          onClick={() => onTabChange('explorer')}
          className="relative w-full h-12 flex items-center justify-center group"
          title="Explorer"
        >
          {activeTab === 'explorer' && (
            <div className="absolute left-0 w-[2px] h-6 bg-brand-yellow rounded-r-full shadow-[0_0_8px_#FACC15]" />
          )}
          <Files className={`w-5 h-5 transition-colors ${activeTab === 'explorer' ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-200'}`} />
        </button>

        {/* Source Control */}
        <button 
          onClick={() => onTabChange('git')}
          className="relative w-full h-12 flex items-center justify-center group"
          title="Source Control"
        >
          {activeTab === 'git' && (
            <div className="absolute left-0 w-[2px] h-6 bg-brand-yellow rounded-r-full shadow-[0_0_8px_#FACC15]" />
          )}
          <div className="relative">
            <GitBranch className={`w-5 h-5 transition-colors ${activeTab === 'git' ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-200'}`} />
            <span className="absolute -top-1.5 -right-2 bg-blue-600 text-[8px] font-medium text-white px-1 py-0.5 rounded-full ring-1 ring-zinc-950">
              4
            </span>
          </div>
        </button>
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-2 w-full">
        <button 
          className="w-full h-12 flex items-center justify-center group"
          title="Account"
        >
          <User className="w-6 h-6 text-zinc-500 transition-colors group-hover:text-zinc-200" />
        </button>
        <button 
          className="w-full h-12 flex items-center justify-center group"
          title="Settings"
        >
          <Settings className="w-6 h-6 text-zinc-500 transition-colors group-hover:text-zinc-200" />
        </button>
      </div>
    </nav>
  );
};
