"use client";

import React, { useState } from 'react';
import { Search, GitBranch, Star, Code, Loader2 } from 'lucide-react';
import { RepoInfo } from '../types';

interface RepoPickerProps {
  repos: RepoInfo[];
  onSelect: (repo: RepoInfo) => void;
  loading?: boolean;
}

export const RepoPicker = ({ repos, onSelect, loading }: RepoPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Search Input */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" />
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-sm py-2.5 pl-10 pr-4 text-sm text-zinc-200 outline-none focus:border-yellow-400/50 transition-all font-medium"
        />
      </div>

      <div className="max-h-80 overflow-y-auto space-y-1 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Loader2 className="w-5 h-5 text-brand-yellow/60 animate-spin" />
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Fetching Source...</p>
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-zinc-900 rounded-sm">
            <p className="text-[10px] text-zinc-600 italic">No repositories indexed.</p>
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => onSelect(repo)}
              className="w-full text-left p-3 rounded-sm bg-zinc-900/10 border border-zinc-900 hover:border-brand-yellow/30 hover:bg-zinc-900/40 transition-all group overflow-hidden"
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="text-[12px] font-medium text-zinc-200 group-hover:text-brand-yellow truncate tracking-tight">
                  {repo.name}
                </span>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-medium uppercase tracking-tighter">
                  <Star className="w-3 h-3 text-brand-yellow/40 group-hover:text-brand-yellow/80 transition-colors" />
                  {repo.stargazers_count}
                </div>
              </div>

              {repo.description && (
                <p className="text-[10px] text-zinc-500 line-clamp-1 mb-2 font-light">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center gap-4">
                {repo.language && (
                  <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-medium uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow/60" />
                    {repo.language}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-medium uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                  <GitBranch className="w-2.5 h-2.5" />
                  {repo.full_name.split('/')[0]}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
