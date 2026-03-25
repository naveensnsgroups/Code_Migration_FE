"use client";

import React from 'react';
import Editor from '@monaco-editor/react';
import { Code2, ChevronRight, Database } from 'lucide-react';
import { Skeleton } from '../../../components/Skeleton';

interface CodeViewerProps {
  selectedFile: string | null;
  fileContent: string;
  loading: boolean;
}

export const CodeViewer = ({ selectedFile, fileContent, loading }: CodeViewerProps) => {
  if (!selectedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
        <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl animate-pulse">
          <Database className="w-12 h-12 text-zinc-700" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">No File Selected</h3>
          <p className="text-zinc-500 max-w-xs mx-auto text-sm leading-relaxed">
            Select a file from the explorer to begin analyzing and migrating your code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex-1 relative h-full flex flex-col">
      <header className="h-16 border-b border-zinc-800 flex items-center px-8 bg-zinc-900/20 shrink-0">
        <div className="flex items-center gap-3 text-sm font-medium">
          <Code2 className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-500">Source Viewer</span>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <span className="text-white bg-zinc-800 px-3 py-1 rounded-full text-xs border border-zinc-700">
            {selectedFile}
          </span>
        </div>
      </header>
      
      <div className="flex-1 p-8 overflow-hidden">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[75%]" count={10} />
          </div>
        ) : (
          <Editor
            height="100%"
            theme="vs-dark"
            path={selectedFile}
            defaultLanguage="javascript"
            value={fileContent}
            loading={<div className="flex items-center justify-center h-full text-zinc-500">Loading code engine...</div>}
            options={{
              readOnly: true,
              fontSize: 14,
              minimap: { enabled: true },
              padding: { top: 20 },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        )}
      </div>
    </section>
  );
};
