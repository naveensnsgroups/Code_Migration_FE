"use client";

import React from 'react';
import { Folder, File, Rocket, FileCode2, FileJson, FileText, Database } from 'lucide-react';
import { Skeleton } from '../../../components/Skeleton';
import { GitHubConnect } from './GitHubConnect';
import { FileItem } from '../types';

interface SidebarProps {
  files: FileItem[];
  selectedFile: string | null;
  onFileClick: (file: FileItem) => void;
  loading?: boolean;
  onRepoCloned: () => void;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch(ext) {
    case 'py':
      return <FileCode2 className="w-4 h-4 text-sky-400" />;
    case 'js':
    case 'jsx':
      return <FileCode2 className="w-4 h-4 text-yellow-400" />;
    case 'ts':
    case 'tsx':
      return <FileCode2 className="w-4 h-4 text-blue-500" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-orange-400" />;
    case 'md':
      return <FileText className="w-4 h-4 text-blue-300" />;
    case 'sql':
      return <Database className="w-4 h-4 text-pink-400" />;
    default:
      return <File className="w-4 h-4 text-zinc-500" />;
  }
};

export const Sidebar = ({ files, selectedFile, onFileClick, loading, onRepoCloned }: SidebarProps) => {
  return (
    <aside className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-900/50 backdrop-blur-xl shrink-0 h-full font-sans">
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="p-2 bg-yellow-400 rounded-sm shadow-[0_0_15px_rgba(250,204,21,0.2)]">
          <Rocket className="w-5 h-5 text-black" />
        </div>
        <h1 className="font-bold text-lg tracking-tight text-white uppercase italic">Migration Hub</h1>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* GitHub Connect panel — always shown at top */}
        <div className="border-b border-zinc-800">
          <GitHubConnect onCloneSuccess={onRepoCloned} />
        </div>

        {/* File Tree */}
        <div className="p-4 space-y-2">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 px-2">
            Legacy Source Explorer
          </div>

          {loading ? (
            <div className="space-y-3 px-2">
              <Skeleton className="h-10 w-full" count={6} />
            </div>
          ) : files.length === 0 ? (
            <div className="p-4 text-[11px] text-zinc-500 italic bg-zinc-800/10 rounded-sm border border-dashed border-zinc-800 text-center">
              No source code detected. Connect a repository above.
            </div>
          ) : (
            files.map((file) => (
              <button
                key={file.path}
                onClick={() => onFileClick(file)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-all hover:bg-zinc-800/50 text-xs font-semibold ${
                  selectedFile === file.path 
                    ? 'bg-zinc-800 text-white shadow-inner border-l-2 border-yellow-400 pl-[10px]' 
                    : 'text-zinc-400'
                }`}
              >
                {file.isDir ? (
                  <Folder className="w-4 h-4 text-yellow-500/80 fill-yellow-500/10" />
                ) : (
                  getFileIcon(file.name)
                )}
                <span className="truncate">{file.name}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
