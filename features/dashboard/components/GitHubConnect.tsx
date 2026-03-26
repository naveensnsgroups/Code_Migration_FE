"use client";

import React from 'react';
import { GitBranch, Loader2, CheckCircle2, AlertCircle, LogIn, RefreshCcw } from 'lucide-react';
import { RepoPicker } from './RepoPicker';
import { useGitHub } from '../hooks/useGitHub';
import { RepoInfo } from '../types';

interface GitHubConnectProps {
  onCloneSuccess: () => void;
}

export const GitHubConnect = ({ onCloneSuccess }: GitHubConnectProps) => {
  const { 
    authState, 
    repos, 
    isLoadingRepos, 
    status, 
    message, 
    login, 
    fetchRepos, 
    cloneRepo 
  } = useGitHub(onCloneSuccess);

  if (authState === 'unauthenticated') {
    return (
      <div className="p-6 space-y-5 bg-zinc-900/20 border-b border-zinc-800/50">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse shadow-[0_0_8px_#FACC15]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Source Control</span>
        </div>
        
        <div className="relative group p-4 bg-zinc-950 border border-zinc-800 rounded-sm hover:border-brand-yellow/30 transition-all duration-500">
          <div className="absolute inset-0 bg-brand-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="relative text-[11px] text-zinc-400 leading-relaxed mb-4">
            Connect your <span className="text-zinc-200 font-bold">GitHub</span> account to securely browse and migrate your source code.
          </p>
          
          <button
            onClick={login}
            className="group/btn relative w-full h-10 bg-brand-yellow hover:bg-white text-black text-[11px] font-medium rounded-sm transition-all active:scale-95 shadow-sm overflow-hidden"
            style={{ backgroundColor: '#FACC15', color: '#000000' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-2 uppercase tracking-wide">
              <LogIn className="w-3.5 h-3.5 text-black" />
              <span>Sign In to GitHub</span>
            </div>
          </button>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-500 text-[9px] font-bold bg-red-500/5 p-2 border border-red-500/10">
            <AlertCircle className="w-3 h-3" />
            {message}
          </div>
        )}
      </div>
    );
  }

  if (authState === 'authenticating') {
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
        <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Securing Session...</p>
      </div>
    );
  }

  return (
    <div className="border-b border-zinc-800">
      <div className="p-4 flex items-center justify-between bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter">Account Connected</span>
        </div>
        <button 
          onClick={fetchRepos}
          className="p-1.5 hover:bg-zinc-800 rounded-sm text-zinc-500 hover:text-yellow-400 transition-all"
          title="Refresh Repos"
        >
          <RefreshCcw className={`w-3 h-3 ${isLoadingRepos ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <RepoPicker 
        repos={repos} 
        onSelect={cloneRepo} 
        loading={isLoadingRepos || status === 'cloning'} 
      />

      {status === 'error' && (
        <div className="mx-4 mb-4 flex items-center gap-2 text-red-400 text-[10px] font-semibold bg-red-400/10 p-2 border border-red-400/20 rounded-sm">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {message}
        </div>
      )}

      {status === 'success' && (
        <div className="mx-4 mb-4 flex items-center gap-2 text-emerald-400 text-[10px] font-semibold bg-emerald-400/10 p-2 border border-emerald-400/20 rounded-sm">
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          {message}
        </div>
      )}
    </div>
  );
};
