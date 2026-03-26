"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { ActivityBar } from './ActivityBar';
import { CodeViewer } from '../../code/components/CodeViewer';
import { Button } from '../../../components/Button';
import { useDashboard } from '../hooks/useDashboard';
import { ProgressionTracker } from './ProgressionTracker';
import { SystemLogs } from './SystemLogs';

export const DashboardLayout = () => {
  const [activeTab, setActiveTab] = React.useState<'explorer' | 'git'>('git');

  const {
    files,
    selectedFile,
    fileContent,
    isInitialLoading,
    isFileLoading,
    isAnalyzing,
    handleFileClick,
    analyzeFile,
    refreshFiles,
  } = useDashboard();

  const currentStep = files.length > 0 ? 'analyze' : 'connect';

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
      <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />
      <Sidebar 
        activeTab={activeTab}
        files={files} 
        selectedFile={selectedFile} 
        onFileClick={handleFileClick} 
        loading={isInitialLoading}
        onRepoCloned={refreshFiles}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950/40">
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-900/10 backdrop-blur-md shrink-0">
          <ProgressionTracker currentStep={currentStep} />
          
          <div className="flex items-center gap-3">
            <Button 
              label="Analyze Logic" 
              variant="secondary" 
              size="sm" 
              onClick={analyzeFile}
              loading={isAnalyzing}
              disabled={!selectedFile || isAnalyzing}
              className="font-medium bg-zinc-900 border-zinc-800 hover:border-brand-yellow/50 transition-colors disabled:opacity-50"
            />
            <Button 
              label="Migrate Selected" 
              variant="primary" 
              size="sm" 
              className="font-medium bg-brand-yellow text-black hover:bg-white transition-all shadow-sm"
            />
          </div>
        </header>

        <main className="flex-1 overflow-hidden p-6 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.02),transparent)]">
          <div className="h-full rounded-sm border border-zinc-800/50 bg-zinc-900/10 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col">
            <CodeViewer 
              selectedFile={selectedFile} 
              fileContent={fileContent} 
              loading={isFileLoading} 
            />
          </div>
        </main>

        <SystemLogs />
      </div>
    </div>
  );
};
