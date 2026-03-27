import axios from 'axios';
import { FileItem, FileContent } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const dashboardApi = {
  listSourceFiles: (path: string = "") => 
    axios.get<FileItem[]>(`${API_BASE_URL}/api/files/list?path=${path}`),
    
  readSourceFile: (path: string) => 
    axios.get<FileContent>(`${API_BASE_URL}/api/files/read?path=${path}`),
    
  analyzeSourceFile: (path: string) =>
    axios.post(`${API_BASE_URL}/api/migrations/analyze`, { path }),
    
  analyzeProject: () =>
    axios.post(`${API_BASE_URL}/api/migrations/analyze-project`),
    
  executeMigration: (selected_units: LogicUnit[]) =>
    axios.post(`${API_BASE_URL}/api/migrations/execute`, { selected_units }),
};
