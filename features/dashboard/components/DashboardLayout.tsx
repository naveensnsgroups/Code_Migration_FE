"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { ActivityBar } from './ActivityBar';
import { CodeViewer } from '../../code/components/CodeViewer';
import { Button } from '../../../components/Button';
import { useDashboard } from '../hooks/useDashboard';
import { useGitHub } from '../hooks/useGitHub';
import { ProgressionTracker } from './ProgressionTracker';
import { SystemLogs } from './SystemLogs';
import { Zap } from 'lucide-react';

import { AnalysisPanel } from './AnalysisPanel';
import { LogicUnitDetail } from './LogicUnitDetail';

export const DashboardLayout = () => {
  const [activeTab, setActiveTab] = React.useState<'explorer' | 'git'>('git');

  const {
    files,
    folderContents,
    expandedFolders,
    selectedFile,
    fileContent,
    analysisResults,
    projectStack,
    isInitialLoading,
    isFileLoading,
    isAnalyzing,
    isMigrating,
    handleFileClick,
    analyzeFile,
    analyzeProject,
    toggleLogicSelection,
    executeMigration,
    logs,
    activeLogicUnitId,
    setActiveLogicUnitId,
    refreshFiles,
  } = useDashboard();

  const activeLogicUnit = analysisResults.find(u => u.id === activeLogicUnitId);

  const github = useGitHub(refreshFiles);

  const currentStep = analysisResults.length > 0 ? 'migrate' : files.length > 0 ? 'analyze' : 'connect';
  const selectedCount = analysisResults.filter(r => r.selected).length;

  return (
    <div className="flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans overflow-hidden transition-colors duration-300">
      <ActivityBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        authState={github.authState}
        onLogout={github.logout}
        badgeCount={github.repos.length}
      />
      <Sidebar
        activeTab={activeTab}
        files={files}
        selectedFile={selectedFile}
        onFileClick={handleFileClick}
        loading={isInitialLoading}
        github={github}
        folderContents={folderContents}
        expandedFolders={expandedFolders}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-workspace)]">
        <header className="h-12 border-b border-zinc-900/50 flex items-center justify-between px-4 bg-zinc-900/10 backdrop-blur-md shrink-0">
          <div className="scale-90 origin-left">
            <ProgressionTracker currentStep={currentStep} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              label="Analyze Logic"
              variant="secondary"
              size="sm"
              onClick={analyzeProject}
              loading={isAnalyzing}
              disabled={isAnalyzing}
              className="px-3 py-1 font-medium text-[11px] bg-zinc-900 border-zinc-800 hover:border-brand-yellow/50 transition-colors disabled:opacity-50"
            />
            <Button
              label={`Migrate ${selectedCount > 0 ? selectedCount : ''}`}
              variant="primary"
              size="sm"
              onClick={executeMigration}
              loading={isMigrating}
              disabled={selectedCount === 0 || isMigrating}
              className="px-3 py-1 font-medium text-[11px] bg-brand-yellow text-black hover:bg-white transition-all shadow-sm disabled:opacity-30 disabled:grayscale"
            />
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.02),transparent)]">
          <div className="flex-1 p-6 overflow-hidden">
            <div className="h-full rounded-sm border border-zinc-800/50 bg-zinc-900/10 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col relative">
              {activeLogicUnit ? (
                <LogicUnitDetail
                  unit={activeLogicUnit}
                  onMigrate={() => {
                    toggleLogicSelection(activeLogicUnit.id);
                    executeMigration();
                  }}
                  onBack={() => setActiveLogicUnitId(null)}
                />
              ) : selectedFile ? (
                <CodeViewer
                  selectedFile={selectedFile}
                  fileContent={fileContent}
                  loading={isFileLoading}
                />
              ) : analysisResults.length > 0 ? (
                <AnalysisPanel
                  results={analysisResults}
                  onToggleSelection={toggleLogicSelection}
                  isAnalyzing={isAnalyzing}
                  projectStack={projectStack}
                  activeId={activeLogicUnitId}
                  onSelectUnit={setActiveLogicUnitId}
                />
              ) : projectStack ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(250,204,21,0.1)]">
                    <Zap className="w-10 h-10 text-brand-yellow animate-pulse" />
                  </div>
                  <h2 className="text-xl font-medium text-zinc-100 mb-2">Project Intelligence Blueprint</h2>
                  <p className="text-zinc-500 text-sm max-w-md mb-8">
                    Gemini has successfully mapped your repository architecture. You can now select cross-file logic units for migration.
                  </p>

                  <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                    <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-900 text-left">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Detected Frontend</span>
                      <span className="text-sm font-medium text-brand-yellow">{projectStack.frontend}</span>
                    </div>
                    <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-900 text-left">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Detected Backend</span>
                      <span className="text-sm font-medium text-zinc-300">{projectStack.backend}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <CodeViewer
                  selectedFile={selectedFile}
                  fileContent={fileContent}
                  loading={isFileLoading}
                />
              )}
            </div>
          </div>
        </main>

        <SystemLogs logs={logs} />
      </div>
    </div>
  );
};
