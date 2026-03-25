"use client";

import React from 'react';
import { Folder, File, Rocket } from 'lucide-react';
import { Skeleton } from '../../../components/Skeleton';
import { FileItem } from '../types';

interface SidebarProps {
  files: FileItem[];
  selectedFile: string | null;
  onFileClick: (file: FileItem) => void;
  loading?: boolean;
}

export const Sidebar = ({ files, selectedFile, onFileClick, loading }: SidebarProps) => {
  return (
    <aside className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-900/50 backdrop-blur-xl shrink-0 h-full">
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="p-2 bg-yellow-400 rounded-lg">
          <Rocket className="w-5 h-5 text-black" />
        </div>
        <h1 className="font-bold text-lg tracking-tight text-white">Migration Hub</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
          Legacy Source Explorer
        </div>
        
        {loading ? (
          <div className="space-y-3 px-2">
            <Skeleton className="h-10 w-full" count={6} />
          </div>
        ) : files.length === 0 ? (
          <div className="p-4 text-sm text-zinc-500 italic bg-zinc-800/30 rounded-xl border border-dashed border-zinc-700">
            No source code detected. Please clone your repository first.
          </div>
        ) : (
          files.map((file) => (
            <button
              key={file.path}
              onClick={() => onFileClick(file)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-zinc-800 text-sm ${
                selectedFile === file.path ? 'bg-zinc-800 text-white shadow-inner' : ''
              }`}
            >
              {file.isDir ? (
                <Folder className="w-4 h-4 text-yellow-500/80 fill-yellow-500/20" />
              ) : (
                <File className="w-4 h-4 text-blue-400/80" />
              )}
              <span className="truncate">{file.name}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};
