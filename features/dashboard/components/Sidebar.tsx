"use client";

import React from 'react';
import { Folder, File, Rocket, FileCode2, FileJson, FileText, Database } from 'lucide-react';
import { Skeleton } from '../../../components/Skeleton';
import { GitHubConnect } from './GitHubConnect';
import { FileItem } from '../types';

interface SidebarProps {
  activeTab: 'explorer' | 'git';
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

export const Sidebar = ({ activeTab, files, selectedFile, onFileClick, loading, onRepoCloned }: SidebarProps) => {
  return (
    <aside className="w-80 border-r border-zinc-900 flex flex-col bg-[#09090b] shrink-0 h-full font-sans overflow-hidden">
      {/* Surgical Minimalist Header */}
      <div className="p-5 border-b border-zinc-900 bg-zinc-950/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-brand-yellow/10 rounded-sm border border-brand-yellow/20">
            <Rocket className="w-4 h-4 text-brand-yellow" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-[9px] text-brand-yellow/70 uppercase tracking-[0.2em] leading-none mb-1">Antigravity</span>
            <h1 className="font-medium text-[13px] tracking-tight text-zinc-100 uppercase italic">
              {activeTab === 'explorer' ? 'Explorer' : 'Source Control'}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'git' ? (
          <div className="divide-y divide-zinc-900">
            <GitHubConnect onCloneSuccess={onRepoCloned} />
          </div>
        ) : (
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em]">Repository Files</span>
              <div className="w-8 h-[1px] bg-zinc-800" />
            </div>

            {loading ? (
              <div className="space-y-3 px-2">
                <Skeleton className="h-8 w-full" count={8} />
              </div>
            ) : files.length === 0 ? (
              <div className="p-8 text-[11px] text-zinc-500 italic bg-zinc-950/20 rounded-sm border border-zinc-900 text-center leading-relaxed">
                Connect a repository in the <br/>
                <span className="text-brand-yellow font-medium uppercase tracking-wider">Source Control</span> tab
              </div>
            ) : (
              <div className="relative border-l border-zinc-800/50 ml-2 pl-1 space-y-0.5">
                {files.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => onFileClick(file)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-sm transition-all text-[11px] font-medium group ${
                      selectedFile === file.path 
                        ? 'bg-brand-yellow/5 text-brand-yellow border-r border-brand-yellow/30' 
                        : 'text-zinc-400 hover:bg-zinc-800/20 hover:text-zinc-200'
                    }`}
                  >
                    <div className="shrink-0">
                      {file.isDir ? (
                        <Folder className="w-3.5 h-3.5 text-brand-yellow/40" />
                      ) : (
                        getFileIcon(file.name)
                      )}
                    </div>
                    <span className="truncate tracking-tight">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
