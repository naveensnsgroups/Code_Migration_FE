import { useState, useEffect } from 'react';
import { githubApi } from '../apis/github.api';
import { RepoInfo } from '../types';

export const useGitHub = (onCloneSuccess?: () => void) => {
  const [authState, setAuthState] = useState<'unauthenticated' | 'authenticating' | 'authenticated'>('unauthenticated');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [status, setStatus] = useState<'idle' | 'cloning' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Handle OAuth callback on mount
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

  const login = async () => {
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

  const cloneRepo = async (repo: RepoInfo) => {
    if (!accessToken) return;
    setStatus('cloning');
    setMessage('');
    try {
      await githubApi.cloneSelected(repo.html_url, accessToken);
      setStatus('success');
      setMessage('Success! Files loaded.');
      setTimeout(() => {
        onCloneSuccess?.();
        setStatus('idle');
      }, 1500);
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.response?.data?.detail || 'Clone failed.');
    }
  };

  const logout = async () => {
    try {
      // Trigger backend cleanup of local cloned files
      await githubApi.cleanup();
    } catch (err) {
      console.warn('Backend cleanup failed or already clean:', err);
    }

    setAccessToken(null);
    setRepos([]);
    setAuthState('unauthenticated');
    setStatus('idle');
    setMessage('');
    
    // Hard reset: Clear URL and force fresh state
    const cleanUrl = window.location.pathname;
    window.location.href = cleanUrl;
  };

  return {
    authState,
    repos,
    isLoadingRepos,
    status,
    message,
    login,
    logout,
    fetchRepos: () => accessToken && fetchRepos(accessToken),
    cloneRepo,
    accessToken
  };
};
