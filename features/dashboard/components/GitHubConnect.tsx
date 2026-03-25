"use client";

import React, { useState, useEffect } from 'react';
import { GitBranch, Loader2, CheckCircle2, AlertCircle, LogIn, RefreshCcw } from 'lucide-react';
import { githubApi, RepoInfo } from '../apis/github.api';
import { RepoPicker } from './RepoPicker';

interface GitHubConnectProps {
  onCloneSuccess: () => void;
}

export const GitHubConnect = ({ onCloneSuccess }: GitHubConnectProps) => {
  const [authState, setAuthState] = useState<'unauthenticated' | 'authenticating' | 'authenticated'>('unauthenticated');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [status, setStatus] = useState<'idle' | 'cloning' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && authState === 'unauthenticated') {
      handleCallback(code);
    }
  }, []);

  const handleCallback = async (code: string) => {
    setAuthState('authenticating');
    try {
      const res = await githubApi.exchangeCode(code);
      const token = res.data.access_token;
      setAccessToken(token);
      setAuthState('authenticated');
      // Clear code from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchRepos(token);
    } catch (err) {
      setAuthState('unauthenticated');
      setStatus('error');
      setMessage('GitHub Authentication failed.');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await githubApi.getLoginUrl();
      window.location.href = res.data.url;
    } catch (err) {
      setStatus('error');
      setMessage('Could not connect to authentication server.');
    }
  };

  const fetchRepos = async (token: string) => {
    setIsLoadingRepos(true);
    try {
      const res = await githubApi.listRepos(token);
      setRepos(res.data);
    } catch (err) {
      setStatus('error');
      setMessage('Failed to fetch your repositories.');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleSelectRepo = async (repo: RepoInfo) => {
    if (!accessToken) return;
    setStatus('cloning');
    setMessage('');
    try {
      await githubApi.cloneSelected(repo.html_url, accessToken);
      setStatus('success');
      setMessage('Success! Files loaded.');
      setTimeout(() => {
        onCloneSuccess();
        setStatus('idle');
      }, 1500);
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.response?.data?.detail || 'Clone failed.');
    }
  };

  if (authState === 'unauthenticated') {
    return (
      <div className="p-5 space-y-4 bg-zinc-900/40">
        <div className="flex items-center gap-2 text-zinc-400">
          <GitBranch className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Product Vision</span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Connect your GitHub account to browse and migrate your repositories directly.
        </p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 hover:bg-white text-black text-xs font-black rounded-sm transition-all active:scale-95 shadow-lg shadow-white/5 uppercase tracking-tighter"
        >
          <LogIn className="w-4 h-4" />
          Login with GitHub
        </button>
        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold">
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
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Securing Session...</p>
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
          onClick={() => accessToken && fetchRepos(accessToken)}
          className="p-1.5 hover:bg-zinc-800 rounded-sm text-zinc-500 hover:text-yellow-400 transition-all"
          title="Refresh Repos"
        >
          <RefreshCcw className={`w-3 h-3 ${isLoadingRepos ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <RepoPicker 
        repos={repos} 
        onSelect={handleSelectRepo} 
        loading={isLoadingRepos || status === 'cloning'} 
      />

      {status === 'error' && (
        <div className="mx-4 mb-4 flex items-center gap-2 text-red-400 text-[10px] font-bold bg-red-400/10 p-2 border border-red-400/20 rounded-sm">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {message}
        </div>
      )}

      {status === 'success' && (
        <div className="mx-4 mb-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold bg-emerald-400/10 p-2 border border-emerald-400/20 rounded-sm">
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          {message}
        </div>
      )}
    </div>
  );
};
