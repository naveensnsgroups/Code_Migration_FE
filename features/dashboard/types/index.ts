export interface RepoInfo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  status?: string;
}

export interface FileItem {
  name: string;
  isDir: boolean;
  path: string;
  status?: 'modified' | 'added' | 'deleted';
}

export interface LogicUnit {
  id: string;
  name: string;
  type: 'ui_component' | 'api_logic' | 'business_rule';
  priority: 'high' | 'medium' | 'low';
  description: string;
  selected?: boolean;
}

export interface FileContent {
  content: string;
  path: string;
  encoding: string;
  analysis?: {
    logic_units: LogicUnit[];
  };
}
