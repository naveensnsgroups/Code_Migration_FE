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
      <div className="p-6 space-y-5 bg-zinc-900/10 border-b border-zinc-900">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow/50 shadow-[0_0_8px_rgba(250,204,21,0.2)]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Source Control</span>
        </div>
        
        <div className="relative group p-4 bg-zinc-950 border border-zinc-900 rounded-sm hover:border-brand-yellow/20 transition-all duration-500">
          <p className="relative text-[11px] text-zinc-400 leading-relaxed mb-4">
            Connect your <span className="text-zinc-200 font-medium tracking-tight">GitHub</span> account to securely browse and migrate your source code.
          </p>
          
          <button
            onClick={login}
            className="group/btn relative w-full h-10 bg-brand-yellow hover:bg-white text-black text-[11px] font-medium rounded-sm transition-all active:scale-95 shadow-sm overflow-hidden mb-3"
            style={{ backgroundColor: '#FACC15', color: '#000000' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-2 uppercase tracking-wide">
              <LogIn className="w-3.5 h-3.5 text-black" />
              <span>Sign In to GitHub</span>
            </div>
          </button>

          <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col items-center space-y-3">
            <span className="text-[8px] font-medium text-zinc-600 uppercase tracking-[0.2em]">Want to use a different account?</span>
            <a 
              href="https://github.com/logout" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 hover:border-red-500/30 text-zinc-500 hover:text-red-400 text-[10px] font-medium rounded-sm transition-all uppercase tracking-widest flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign out of GitHub.com</span>
            </a>
            <p className="text-[8px] text-zinc-600 italic text-center px-4">
              Logout there, then return here to login with a new identity
            </p>
          </div>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-500 text-[9px] font-medium bg-red-500/5 p-2 border border-red-500/10 uppercase tracking-tighter">
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
    <div className="border-b border-zinc-900 bg-zinc-950/20">
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-900 bg-[#09090b]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.15em]">Account Connected</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={fetchRepos}
            className="p-1.5 hover:bg-zinc-800/50 rounded-xs text-zinc-500 hover:text-brand-yellow transition-all"
            title="Refresh Repos"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isLoadingRepos ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-1.5 px-2 py-1 bg-red-500/5 hover:bg-red-500/10 rounded-sm text-red-400/60 hover:text-red-400 transition-all border border-red-500/10 hover:border-red-500/20 shadow-sm shadow-red-500/5"
            title="Disconnect Account"
          >
            <span className="text-[9px] font-medium uppercase tracking-wider">Disconnect</span>
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
