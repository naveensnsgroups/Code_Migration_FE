"use client";

import React from 'react';
import { Files, Search, GitBranch, Bug, Settings, User, Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ActivityBarProps {
  activeTab: 'explorer' | 'git' | 'migration_hub';
  onTabChange: (tab: 'explorer' | 'git' | 'migration_hub') => void;
  authState: 'unauthenticated' | 'authenticating' | 'authenticated';
  onLogout: () => void;
  badgeCount?: number;
}

export const ActivityBar = ({ activeTab, onTabChange, authState, onLogout, badgeCount }: ActivityBarProps) => {
  const { theme, toggleTheme } = useTheme();
  const isConnected = authState === 'authenticated';

  return (
    <nav className="w-14 bg-[var(--bg-activity)] border-r border-[var(--border-main)] flex flex-col items-center py-4 gap-4 shrink-0 h-full transition-colors duration-300">
      {/* Top Icons */}
      <div className="flex-1 flex flex-col items-center gap-2 w-full font-medium">
        {/* Explorer */}
        <button 
          onClick={() => onTabChange('explorer')}
          className="relative w-full h-12 flex items-center justify-center group"
          title="Explorer (Normal Mode)"
        >
          {activeTab === 'explorer' && (
            <div className="absolute left-0 w-[2.5px] h-6 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_12px_rgba(250,204,21,0.3)]" />
          )}
          <Files className={`w-5 h-5 transition-colors ${activeTab === 'explorer' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-accent)]'}`} />
        </button>

        {/* Migration Hub */}
        <button 
          onClick={() => onTabChange('migration_hub')}
          className="relative w-full h-12 flex items-center justify-center group"
          title="Migration Intelligence Hub"
        >
          {activeTab === 'migration_hub' && (
            <div className="absolute left-0 w-[2.5px] h-6 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_12px_rgba(250,204,21,0.3)]" />
          )}
          <Zap className={`w-5 h-5 transition-colors ${activeTab === 'migration_hub' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-accent)]'}`} />
        </button>

        {/* Source Control */}
        <button 
          onClick={() => onTabChange('git')}
          className="relative w-full h-12 flex items-center justify-center group"
          title="Source Control"
        >
          {activeTab === 'git' && (
            <div className="absolute left-0 w-[2.5px] h-6 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_12px_rgba(250,204,21,0.3)]" />
          )}
          <div className="relative">
            <GitBranch className={`w-[18px] h-[18px] transition-colors ${activeTab === 'git' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-accent)]'}`} />
          </div>
        </button>
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-2 w-full mt-auto">
        <button 
          onClick={toggleTheme}
          className="w-full h-12 flex items-center justify-center group transition-all duration-300"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-[var(--text-muted)] group-hover:text-yellow-400 rotate-0 transition-transform duration-500 group-hover:rotate-45" />
          ) : (
            <Moon className="w-5 h-5 text-[var(--text-muted)] group-hover:text-indigo-600 -rotate-12 transition-transform duration-500 group-hover:rotate-0" />
          )}
        </button>

        <button 
          onClick={isConnected ? onLogout : undefined}
          className="relative w-full h-12 flex items-center justify-center group"
          title={isConnected ? "Sign Out" : "Account"}
        >
          {isConnected && (
            <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[var(--bg-activity)] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          )}
          <User className={`w-5 h-5 transition-colors ${isConnected ? 'text-[var(--text-accent)]' : 'text-[var(--text-muted)]'} group-hover:text-[var(--text-main)]`} />
        </button>
        <button 
          className="w-full h-12 flex items-center justify-center group"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-main)]" />
        </button>
      </div>
    </nav>
  );
};
