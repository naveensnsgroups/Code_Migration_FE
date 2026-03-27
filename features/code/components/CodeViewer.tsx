import React from 'react';
import Editor from '@monaco-editor/react';
import { Code2, ChevronRight, Database, X } from 'lucide-react';
import { Skeleton } from '../../../components/Skeleton';
import { useTheme } from '../../dashboard/components/ThemeContext';

interface CodeViewerProps {
  selectedFile: string | null;
  fileContent: string;
  loading: boolean;
  onClose?: () => void;
}

export const CodeViewer = ({ selectedFile, fileContent, loading, onClose }: CodeViewerProps) => {
  const { theme } = useTheme();

  if (!selectedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 text-center bg-[var(--bg-main)]">
        <div className="p-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] shadow-2xl animate-pulse">
          <Database className="w-12 h-12 text-[var(--text-muted)]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[var(--text-main)]">No File Selected</h3>
          <p className="text-[var(--text-muted)] max-w-xs mx-auto text-sm leading-relaxed">
            Select a file from the explorer to begin analyzing and migrating your code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex-1 relative h-full flex flex-col bg-[var(--bg-main)] transition-colors duration-300">
      {/* VS Code Style Tab Bar */}
      <div className="h-9 bg-[var(--bg-sidebar)] flex items-end px-2 border-b border-[var(--border-main)] shrink-0 overflow-x-auto no-scrollbar">
        <div className="h-full px-3 flex items-center gap-2 bg-[var(--bg-main)] border-t border-l border-r border-[var(--border-main)] relative group min-w-[140px] justify-between">
          {theme === 'dark' && <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[var(--accent-primary)]" />}
          
          <div className="flex items-center gap-2 min-w-0">
            <Code2 className={`w-3.5 h-3.5 shrink-0 ${theme === 'dark' ? 'text-[var(--accent-primary)]/70' : 'text-[var(--accent-primary)]'}`} />
            <span className="text-[11px] font-medium text-[var(--text-main)] tracking-tight truncate max-w-[120px]">
              {selectedFile.split('/').pop()}
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="w-5 h-5 flex items-center justify-center rounded-xs hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all ml-2 shrink-0 group-hover:opacity-100 opacity-60"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Breadcrumb Area */}
      <div className="h-7 px-4 flex items-center gap-1.5 bg-[var(--bg-main)] border-b border-[var(--border-main)]/50 text-[10px] text-[var(--text-muted)] font-medium shrink-0">
        <span className="hover:text-[var(--text-main)] transition-colors cursor-pointer">Source Viewer</span>
        <ChevronRight className="w-3 h-3 text-[var(--border-accent)]" />
        <span className="text-[var(--text-main)] opacity-70 truncate">{selectedFile}</span>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[var(--bg-main)]">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-4 bg-zinc-900/50 rounded-xs" />
                <div className={`h-4 bg-zinc-900/30 rounded-xs ${i % 3 === 0 ? 'w-[70%]' : i % 2 === 0 ? 'w-[40%]' : 'w-[90%]'}`} />
              </div>
            ))}
          </div>
        ) : (
          <Editor
            height="100%"
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            path={selectedFile}
            defaultLanguage={selectedFile.split('.').pop() === 'html' ? 'html' : 'javascript'}
            value={fileContent}
            loading={<div className="flex items-center justify-center h-full text-[var(--text-muted)] font-medium text-xs uppercase tracking-widest">Initialising Engine...</div>}
            options={{
              readOnly: true,
              fontSize: 12.5,
              fontWeight: '500',
              minimap: { enabled: true, side: 'right', renderCharacters: false },
              padding: { top: 16, bottom: 16 },
              lineNumbers: 'on',
              lineNumbersMinChars: 4,
              glyphMargin: false,
              folding: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
              letterSpacing: 0.2,
              lineHeight: 1.6,
              renderLineHighlight: 'all',
              fontLigatures: true,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                useShadows: false,
              },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
            }}
          />
        )}
        
        {/* Read-only Badge */}
        <div className="absolute bottom-4 right-8 px-2.5 py-1 bg-[var(--bg-sidebar)]/80 border border-[var(--border-main)] rounded-sm text-[9px] font-medium text-[var(--text-muted)] uppercase tracking-widest backdrop-blur-md shadow-2xl">
          Read Only Editor
        </div>
      </div>
    </section>
  );
};
