"use client";

import React, { useState } from 'react';
import { Search, GitBranch, Star, Code, Loader2 } from 'lucide-react';
import { RepoInfo } from '../apis/github.api';

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

      {/* Repo List */}
      <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
            <p className="text-xs text-zinc-500 font-medium">Fetching repositories...</p>
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="text-center py-8 bg-zinc-900/40 rounded-sm border border-dashed border-zinc-800">
            <p className="text-xs text-zinc-500 italic">No repositories found.</p>
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => onSelect(repo)}
              className="w-full text-left p-3 rounded-sm bg-zinc-900/60 border border-zinc-800 hover:border-yellow-400/40 hover:bg-zinc-800/80 transition-all group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-semibold text-zinc-100 group-hover:text-yellow-400 truncate">
                  {repo.name}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold uppercase">
                  <Star className="w-3 h-3 text-yellow-500/80" />
                  {repo.stargazers_count}
                </div>
              </div>

              {repo.description && (
                <p className="text-[11px] text-zinc-500 line-clamp-1 mb-2 leading-relaxed">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center gap-3">
                {repo.language && (
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    {repo.language}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold">
                  <GitBranch className="w-3 h-3 text-zinc-600" />
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
