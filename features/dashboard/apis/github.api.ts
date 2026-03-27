import axios from 'axios';
import { RepoInfo } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const githubApi = {
  getLoginUrl: () => 
    axios.get(`${API_BASE}/api/github/login`),

  exchangeCode: (code: string) =>
    axios.get(`${API_BASE}/api/github/callback`, { params: { code } }),

  listRepos: (accessToken: string) =>
    axios.get(`${API_BASE}/api/github/repos`, {
      params: { access_token: accessToken }
    }),

  cloneSelected: (repoUrl: string, accessToken: string) =>
    axios.post(`${API_BASE}/api/github/clone-selected`, {
      repo_url: repoUrl,
      access_token: accessToken
    }),

  cleanup: () =>
    axios.post(`${API_BASE}/api/github/cleanup`),
};
