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
