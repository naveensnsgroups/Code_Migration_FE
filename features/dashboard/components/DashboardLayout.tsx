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
  const [sidebarWidth, setSidebarWidth] = React.useState(320);
  const [isResizing, setIsResizing] = React.useState(false);

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
    closeFile,
  } = useDashboard();

  const startResizing = React.useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = React.useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      // Activity Bar width is 64px
      const newWidth = mouseMoveEvent.clientX - 64;
      if (newWidth >= 160 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const activeLogicUnit = analysisResults.find(u => u.id === activeLogicUnitId);
  const github = useGitHub(refreshFiles);

  const currentStep = analysisResults.length > 0 ? 'migrate' : files.length > 0 ? 'analyze' : 'connect';
  const selectedCount = analysisResults.filter(r => r.selected).length;

  return (
    <div className={`flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans overflow-hidden ${isResizing ? '' : 'transition-colors duration-300'}`}>
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
        width={sidebarWidth}
        clonedRepo={github.selectedRepo?.name}
      />

      {/* Resize Handle */}
      <div 
        onMouseDown={startResizing}
        className={`w-[1px] h-full cursor-col-resize hover:bg-[var(--accent-primary)] hover:shadow-[0_0_8px_var(--accent-primary)] transition-all z-50 ${isResizing ? 'bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]' : 'bg-[var(--border-main)]'}`}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-workspace)] transition-colors duration-300">
        <header className="h-12 border-b border-[var(--border-main)] flex items-center justify-between px-4 bg-[var(--bg-sidebar)]/50 backdrop-blur-md shrink-0">
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
              className="px-3 py-1 font-semibold text-[11px] bg-[var(--bg-card)] border-[var(--border-main)] hover:border-[var(--accent-primary)] transition-colors disabled:opacity-50 text-[var(--text-main)]"
            />
            <Button
              label={`Migrate ${selectedCount > 0 ? selectedCount : ''}`}
              variant="primary"
              size="sm"
              onClick={executeMigration}
              loading={isMigrating}
              disabled={selectedCount === 0 || isMigrating}
              className="px-3 py-1 font-bold text-[11px] bg-[var(--accent-primary)] text-white hover:brightness-110 transition-all shadow-sm disabled:opacity-30 disabled:grayscale"
            />
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex">
          <div className="flex-1 p-6 overflow-hidden">
            <div className="h-full rounded-sm border border-[var(--border-main)] bg-[var(--bg-card)]/30 backdrop-blur-sm shadow-xl overflow-hidden flex flex-col relative">
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
                  onClose={closeFile}
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
