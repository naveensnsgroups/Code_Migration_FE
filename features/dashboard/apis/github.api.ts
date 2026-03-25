import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface RepoInfo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
}

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
};
