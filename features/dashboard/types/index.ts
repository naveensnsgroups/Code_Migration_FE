export interface RepoInfo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
}

export interface FileItem {
  name: string;
  isDir: boolean;
  path: string;
}

export interface FileContent {
  content: string;
  path: string;
  encoding: string;
}
