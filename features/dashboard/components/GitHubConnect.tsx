"use client";

import React from 'react';
import { GitBranch, Loader2, CheckCircle2, AlertCircle, LogIn, RefreshCcw, LogOut } from 'lucide-react';
import { RepoPicker } from './RepoPicker';
import { useGitHub } from '../hooks/useGitHub';
import { RepoInfo } from '../types';

interface GitHubConnectProps {
  github: any;
}

export const GitHubConnect = ({ github }: GitHubConnectProps) => {
  const { 
    authState, 
    repos, 
    isLoadingRepos, 
    status, 
    message, 
    login, 
    logout,
    fetchRepos, 
    cloneRepo 
  } = github;

  if (authState === 'unauthenticated') {
    return (
      <div className="p-6 space-y-5 bg-[var(--bg-sidebar)]/50 border-b border-[var(--border-main)]">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]/50 shadow-[0_0_8px_rgba(250,204,21,0.2)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Source Control</span>
        </div>
        
        <div className="relative group p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-sm hover:border-[var(--accent-primary)]/30 transition-all duration-500 shadow-sm">
          <p className="relative text-[11px] text-[var(--text-main)] opacity-70 leading-relaxed mb-4">
            Connect your <span className="text-[var(--text-accent)] font-bold tracking-tight">GitHub</span> account to securely browse and migrate your source code.
          </p>
          
          <button
            onClick={login}
            className="group/btn relative w-full h-10 bg-[var(--accent-primary)] hover:brightness-110 text-white text-[11px] font-black rounded-sm transition-all active:scale-95 shadow-sm overflow-hidden mb-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-2 uppercase tracking-widest">
              <LogIn className="w-3.5 h-3.5 text-white" />
              <span>Sign In to GitHub</span>
            </div>
          </button>

          <div className="mt-8 pt-6 border-t border-[var(--border-main)] flex flex-col items-center space-y-3">
            <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Want to use a different account?</span>
            <a 
              href="https://github.com/logout" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[var(--bg-sidebar)] border border-[var(--border-main)] hover:border-red-500/30 text-[var(--text-muted)] hover:text-red-500 text-[10px] font-bold rounded-sm transition-all uppercase tracking-widest flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign out of GitHub.com</span>
            </a>
            <p className="text-[8px] text-[var(--text-muted)] opacity-60 italic text-center px-4 font-medium">
              Logout there, then return here to login with a new identity
            </p>
          </div>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-500 text-[9px] font-bold bg-red-500/5 p-2 border border-red-500/10 uppercase tracking-tighter">
            <AlertCircle className="w-3 h-3" />
            {message}
          </div>
        )}
      </div>
    );
  }

  if (authState === 'authenticating') {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-5">
        <Loader2 className="w-6 h-6 text-brand-yellow/60 animate-spin" />
        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.2em]">Synchronizing...</p>
      </div>
    );
  }

  return (
    <div className="border-b border-[var(--border-main)] bg-[var(--bg-main)]">
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-[var(--border-main)] bg-[var(--bg-sidebar)]/20">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em]">Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchRepos}
            className="p-1 px-1.5 hover:bg-[var(--bg-card-hover)] rounded-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all flex items-center gap-1.5"
            title="Refresh Repos"
          >
            <RefreshCcw className={`w-3 h-3 ${isLoadingRepos ? 'animate-spin' : ''}`} />
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Sync</span>
          </button>
          <div className="w-[1px] h-3 bg-[var(--border-main)]" />
          <button 
            onClick={logout}
            className="p-1 px-2.5 hover:bg-red-500/10 text-red-500/70 hover:text-red-600 rounded-sm transition-all flex items-center gap-1.5 border border-red-500/0 hover:border-red-500/20 bg-red-500/5"
            title="Disconnect & Cleanup"
          >
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">Disconnect</span>
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      </div>

      <RepoPicker 
        repos={repos} 
        onSelect={cloneRepo} 
        loading={isLoadingRepos || status === 'cloning'} 
      />

      {(status === 'error' || status === 'success') && (
        <div className={`mx-4 mb-4 flex items-center gap-2 text-[10px] font-medium p-2 border rounded-sm ${
          status === 'error' ? 'text-red-400 bg-red-400/5 border-red-400/10' : 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10'
        }`}>
          {status === 'error' ? <AlertCircle className="w-3 h-3 shrink-0" /> : <CheckCircle2 className="w-3 h-3 shrink-0" />}
          <span className="tracking-tight uppercase tracking-tighter">{message}</span>
        </div>
      )}
    </div>
  );
};
