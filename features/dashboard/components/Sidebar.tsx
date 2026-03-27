"use client";

import React from 'react';
import { Folder, File, Rocket, FileCode2, FileJson, FileText, Database, ChevronRight, ChevronDown } from 'lucide-react';
import { Skeleton } from '../../../components/Skeleton';
import { GitHubConnect } from './GitHubConnect';
import { FileItem } from '../types';

interface SidebarProps {
  activeTab: 'explorer' | 'git';
  files: FileItem[];
  selectedFile: string | null;
  onFileClick: (file: FileItem) => void;
  loading?: boolean;
  github: any;
  folderContents?: Record<string, FileItem[]>;
  expandedFolders?: Set<string>;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'py':
      return <FileCode2 className="w-3.5 h-3.5 text-sky-400" />;
    case 'js':
    case 'jsx':
      return <FileCode2 className="w-3.5 h-3.5 text-yellow-400" />;
    case 'ts':
    case 'tsx':
      return <FileCode2 className="w-3.5 h-3.5 text-blue-500" />;
    case 'json':
      return <FileJson className="w-3.5 h-3.5 text-orange-400" />;
    case 'md':
      return <FileText className="w-3.5 h-3.5 text-blue-300" />;
    case 'html':
      return <FileCode2 className="w-3.5 h-3.5 text-orange-500" />;
    case 'sql':
      return <Database className="w-3.5 h-3.5 text-pink-400" />;
    default:
      return <File className="w-3.5 h-3.5 text-zinc-500" />;
  }
};

const FileTreeItem = ({
  file,
  level,
  selectedFile,
  onFileClick,
  folderContents,
  expandedFolders
}: {
  file: FileItem;
  level: number;
  selectedFile: string | null;
  onFileClick: (file: FileItem) => void;
  folderContents: Record<string, FileItem[]>;
  expandedFolders: Set<string>;
}) => {
  const isExpanded = expandedFolders.has(file.path);
  const isSelected = selectedFile === file.path;
  const children = folderContents[file.path] || [];

  return (
    <div className="flex flex-col">
      <button
        onClick={() => onFileClick(file)}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        className={`w-full flex items-center gap-2 py-1 transition-colors text-[11px] font-medium group relative ${isSelected
            ? 'bg-brand-yellow/5 text-brand-yellow'
            : 'text-zinc-400 hover:bg-zinc-800/20 hover:text-zinc-200'
          }`}
      >
        {isSelected && (
          <div className="absolute left-0 w-[2px] h-full bg-brand-yellow/50" />
        )}

        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          {file.isDir ? (
            isExpanded ? <ChevronDown className="w-3 h-3 text-zinc-500" /> : <ChevronRight className="w-3 h-3 text-zinc-500" />
          ) : null}
        </div>

        <div className="shrink-0">
          {file.isDir ? (
            <Folder className={`w-3.5 h-3.5 ${isExpanded ? 'text-brand-yellow/60' : 'text-brand-yellow/40'}`} />
          ) : (
            getFileIcon(file.name)
          )}
        </div>

        <span className={`truncate tracking-tight ${file.status === 'modified' ? 'text-yellow-500/80' : ''}`}>
          {file.name}
        </span>

        {file.status === 'modified' && (
          <span className="ml-auto mr-4 text-[9px] font-medium text-yellow-500/60 w-3 h-3 flex items-center justify-center">M</span>
        )}
      </button>

      {file.isDir && isExpanded && children.map(child => (
        <FileTreeItem
          key={child.path}
          file={child}
          level={level + 1}
          selectedFile={selectedFile}
          onFileClick={onFileClick}
          folderContents={folderContents}
          expandedFolders={expandedFolders}
        />
      ))}
    </div>
  );
};

export const Sidebar = ({
  activeTab,
  files,
  selectedFile,
  onFileClick,
  loading,
  github,
  folderContents = {},
  expandedFolders = new Set()
}: SidebarProps) => {
  return (
    <aside className="w-80 border-r border-[var(--border-main)] flex flex-col bg-[var(--bg-sidebar)] shrink-0 h-full font-sans overflow-hidden transition-colors duration-300">
      {/* Surgical Minimalist Header */}
      <div className="p-5 border-b border-[var(--border-main)] bg-[var(--bg-sidebar)]/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[var(--accent-primary)]/10 rounded-sm border border-[var(--accent-primary)]/20">
            <Rocket className="w-4 h-4 text-brand-yellow" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-[9px] text-[var(--accent-primary)] uppercase tracking-[0.2em] leading-none mb-1">Migrate AI</span>
            <div className="flex items-center justify-between w-48">
              <h1 className="font-medium text-[13px] tracking-tight text-[var(--text-main)] uppercase italic">
                {activeTab === 'explorer' ? 'Explorer' : 'Source Control'}
              </h1>
              {activeTab === 'explorer' && (
                <div className="flex gap-1 text-zinc-600">
                  <div className="w-1 h-1 rounded-full bg-zinc-800" />
                  <div className="w-1 h-1 rounded-full bg-zinc-800" />
                  <div className="w-1 h-1 rounded-full bg-zinc-800" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'git' ? (
          <div className="divide-y divide-zinc-900">
            <GitHubConnect github={github} />
          </div>
        ) : (
          <div className="py-2">
            <div className="flex items-center justify-between mb-2 px-6">
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em]">Repository Files</span>
              <div className="w-8 h-[1px] bg-zinc-800" />
            </div>

            {loading ? (
              <div className="space-y-2 px-6">
                <Skeleton className="h-6 w-full" count={8} />
              </div>
            ) : files.length === 0 ? (
              <div className="mx-6 p-8 text-[11px] text-zinc-500 italic bg-zinc-950/20 rounded-sm border border-zinc-900 text-center leading-relaxed">
                Connect a repository in the <br />
                <span className="text-brand-yellow font-medium uppercase tracking-wider">Source Control</span> tab
              </div>
            ) : (
              <div className="flex flex-col">
                {files.map((file) => (
                  <FileTreeItem
                    key={file.path}
                    file={file}
                    level={0}
                    selectedFile={selectedFile}
                    onFileClick={onFileClick}
                    folderContents={folderContents}
                    expandedFolders={expandedFolders}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
