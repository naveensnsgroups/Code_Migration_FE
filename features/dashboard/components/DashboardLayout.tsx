"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { CodeViewer } from '../../code/components/CodeViewer';
import { Button } from '../../../components/Button';
import { useDashboard } from '../hooks/useDashboard';
import { ProgressionTracker } from './ProgressionTracker';
import { SystemLogs } from './SystemLogs';

export const DashboardLayout = () => {
  const {
    files,
    selectedFile,
    fileContent,
    isInitialLoading,
    isFileLoading,
    handleFileClick,
    refreshFiles,
  } = useDashboard();

  const currentStep = files.length > 0 ? 'analyze' : 'connect';

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
      <Sidebar 
        files={files} 
        selectedFile={selectedFile} 
        onFileClick={handleFileClick} 
        loading={isInitialLoading}
        onRepoCloned={refreshFiles}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/20 shrink-0">
          <ProgressionTracker currentStep={currentStep} />
          
          <div className="flex items-center gap-3">
            <Button label="Analyze Logic" variant="secondary" size="sm" />
            <Button label="Migrate Selected" variant="primary" size="sm" />
          </div>
        </header>

        <main className="flex-1 relative overflow-hidden flex flex-col">
          <CodeViewer 
            selectedFile={selectedFile} 
            fileContent={fileContent} 
            loading={isFileLoading} 
          />
        </main>

        <SystemLogs />
      </div>
    </div>
  );
};
