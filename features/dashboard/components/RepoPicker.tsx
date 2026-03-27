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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-sm py-2.5 pl-10 pr-4 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-primary)] transition-all font-bold placeholder:font-medium shadow-sm transition-colors duration-300"
        />
      </div>

      <div className="max-h-80 overflow-y-auto space-y-1 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 opacity-60">
            <Loader2 className="w-5 h-5 text-[var(--accent-primary)] animate-spin" />
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Fetching Source...</p>
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-[var(--border-main)] rounded-sm bg-[var(--bg-card)]/20">
            <p className="text-[10px] text-[var(--text-muted)] font-bold italic">No repositories indexed.</p>
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => onSelect(repo)}
              className="w-full text-left px-4 py-2 hover:bg-[var(--bg-card-hover)] transition-all group border-b border-[var(--border-main)]/30 active:bg-[var(--accent-primary)]/5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <GitBranch className="w-3.5 h-3.5 text-[var(--accent-primary)] opacity-40 shrink-0" />
                  <span className="text-[12px] font-semibold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] truncate tracking-tight transition-colors">
                    {repo.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {repo.language && (
                    <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <div className="flex items-center gap-1 text-[9px] text-[var(--text-muted)] opacity-30 font-bold">
                      <Star className="w-2.5 h-2.5" />
                      {repo.stargazers_count}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-0.5 flex items-center justify-between opacity-40 group-hover:opacity-60 transition-opacity">
                <span className="text-[8px] font-medium text-[var(--text-muted)] truncate max-w-[150px]">
                  {repo.full_name.split('/')[0]}
                </span>
                {repo.status && (
                  <span className="text-[7px] font-black bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-1 rounded-xs uppercase tracking-tighter">
                    Ready
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
