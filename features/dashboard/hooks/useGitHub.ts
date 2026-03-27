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
  const [selectedRepo, setSelectedRepo] = useState<RepoInfo | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('gh_access_token');
    const savedRepo = localStorage.getItem('gh_selected_repo');
    
    if (savedToken) {
      setAccessToken(savedToken);
      setAuthState('authenticated');
      fetchRepos(savedToken);
    }

    if (savedRepo) {
      try {
        setSelectedRepo(JSON.parse(savedRepo));
      } catch (e) {
        console.error('Failed to parse saved repo:', e);
      }
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('gh_access_token', accessToken);
    } else {
      localStorage.removeItem('gh_access_token');
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectedRepo) {
      localStorage.setItem('gh_selected_repo', JSON.stringify(selectedRepo));
    } else {
      localStorage.removeItem('gh_selected_repo');
    }
  }, [selectedRepo]);

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
    setSelectedRepo(repo);
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
      setSelectedRepo(null);
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
    setSelectedRepo(null);
    setAuthState('unauthenticated');
    setStatus('idle');
    setMessage('');

    // Clear session storage
    localStorage.removeItem('gh_access_token');
    localStorage.removeItem('gh_selected_repo');
    
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
    accessToken,
    selectedRepo
  };
};
