"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../../components/Button';
import { Sidebar } from './Sidebar';
import { ActivityBar } from './ActivityBar';
import { useGitHub } from '../hooks/useGitHub';
import { ProgressionTracker } from './ProgressionTracker';
import { SystemLogs } from './SystemLogs';
import { Zap, Layers, X, Cpu, Activity, Layout, FileCode, Search, Database, RotateCcw, Laptop, Terminal } from 'lucide-react';

import { AnalysisPanel } from './AnalysisPanel';
import { LogicUnitDetail } from './LogicUnitDetail';
import { CodeViewer } from '../../code/components/CodeViewer';
import { MigrationWizard } from './MigrationWizard';
import { useDashboard } from '../hooks/useDashboard';

export const DashboardLayout = () => {
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
    purpose, 
    architecture, 
    blueprint, 
    mappedStructure, 
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
    activeTab, 
    setActiveTab 
  } = useDashboard();

  const github = useGitHub(refreshFiles);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showBlueprint, setShowBlueprint] = useState(false);

  useEffect(() => {
    if (selectedFile && activeTab !== 'explorer') {
      setActiveTab('explorer');
    }
  }, [selectedFile, activeTab, setActiveTab]);

  const startResizing = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX - 64;
      if (newWidth >= 160 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const activeLogicUnit = analysisResults.find(u => u.id === activeLogicUnitId);
  const currentStep = analysisResults.length > 0 ? 'migrate' : files.length > 0 ? 'analyze' : 'connect';
  const selectedCount = analysisResults.filter(r => r.selected).length;

  return (
    <div className={`flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans overflow-hidden ${isResizing ? '' : 'transition-colors duration-300'}`}>
      <ActivityBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        authState={github.authState}
        onLogout={github.logout}
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

          <div className="flex items-center gap-3">
            {analysisResults.length > 0 && (
              <Button
                label="View Blueprint"
                variant="secondary"
                size="sm"
                onClick={() => setShowBlueprint(true)}
                className="px-3 py-1 font-semibold text-[11px] bg-[var(--bg-card)] border-[var(--border-main)] hover:border-[var(--accent-primary)] transition-colors text-[var(--text-main)] flex items-center gap-2"
              />
            )}
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
              onClick={() => setShowWizard(true)}
              loading={isMigrating}
              disabled={selectedCount === 0 || isMigrating}
              className="px-3 py-1 font-bold text-[11px] bg-[var(--accent-primary)] text-white hover:brightness-110 transition-all shadow-sm disabled:opacity-30 disabled:grayscale"
            />
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex">
          <div className="flex-1 p-6 overflow-hidden">
            <div className="h-full rounded-sm border border-[var(--border-main)] bg-[var(--bg-card)]/30 backdrop-blur-sm shadow-xl overflow-hidden flex flex-col relative">
              {activeTab === 'migration_hub' ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                   {activeLogicUnit ? (
                    <LogicUnitDetail
                      unit={activeLogicUnit}
                      onMigrate={() => {
                        toggleLogicSelection(activeLogicUnit.id);
                        executeMigration();
                      }}
                      onBack={() => setActiveLogicUnitId(null)}
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
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-16 h-16 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-main)] flex items-center justify-center mb-6">
                        <Zap className="w-8 h-8 text-[var(--accent-primary)]" />
                      </div>
                      <h2 className="text-xl font-bold uppercase tracking-wider text-[var(--text-main)]">Migration Hub</h2>
                      <p className="text-[var(--text-secondary)] text-sm max-w-md mb-8">
                        Analyze repository structure to identify modernization-ready logic units and architectural patterns.
                      </p>

                      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                        <div className="p-4 rounded-lg bg-[var(--bg-sidebar)]/50 border border-[var(--border-main)]">
                          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Frontend</span>
                          <span className="text-sm font-semibold text-[var(--text-main)]">
                            {projectStack.frontend || 'Detected...'}
                          </span>
                        </div>
                        <div className="p-4 rounded-lg bg-[var(--bg-sidebar)]/50 border border-[var(--border-main)]">
                          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Backend</span>
                          <span className="text-sm font-semibold text-[var(--text-main)]">
                            {projectStack.backend || 'Detected...'}
                          </span>
                        </div>
                      </div>

                      <Button
                        label="Analyze Logic Units"
                        variant="primary"
                        size="md"
                        loading={isAnalyzing}
                        onClick={analyzeProject}
                        className="px-10 py-3 bg-[var(--accent-primary)] text-white hover:brightness-110 transition-all text-xs font-bold uppercase tracking-widest rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                      <Zap className="w-10 h-10 text-[var(--border-main)] mb-4" />
                      <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Ready for Migration Analysis</h2>
                    </div>
                  )}
                </div>
              ) : selectedFile ? (
                <CodeViewer
                  selectedFile={selectedFile}
                  fileContent={fileContent}
                  loading={isFileLoading}
                  onClose={closeFile}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  
                  
                  <h2 className="text-2xl font-bold text-[var(--text-main)] uppercase tracking-[0.3em] mb-3">
                    Editor Mode
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm max-w-sm font-medium leading-relaxed mb-8">
                    Select a source file from the repository explorer to begin surgical modernization or tactical refactoring.
                  </p>
                  <div className="w-full max-w-xs h-[1px] bg-[var(--border-main)] mb-8" />
                </div>
              )}
            </div>
          </div>
        </main>

        <SystemLogs logs={logs} />
      </div>

      {showBlueprint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 p-8">
          <div className="bg-[#0c0c0c] border border-zinc-800 w-full max-w-6xl h-full max-h-[90vh] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20">
                  <Layers className="text-brand-yellow" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white">Project Intelligence Blueprint</h2>
                  <p className="text-[11px] text-zinc-500 font-medium font-mono uppercase tracking-widest mt-1">AI-Mapped Architectural Deep Mapping</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBlueprint(false)} 
                title="Close Blueprint"
                aria-label="Close Blueprint"
                className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              <div className="w-1/3 border-r border-zinc-800 p-8 space-y-10 overflow-y-auto bg-zinc-950/30">
                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow mb-4">Core Mission & Purpose</h3>
                  <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 border-l-brand-yellow border-l-2">
                    <p className="text-sm text-zinc-300 leading-relaxed italic">
                      "{purpose}"
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow mb-4">Architectural Pattern</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-4 group hover:border-brand-yellow/30 transition-all">
                      <div className="p-2 rounded-lg bg-zinc-800 text-brand-yellow group-hover:scale-110 transition-transform">
                        <Layout size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block uppercase tracking-wider">{architecture}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">System Global Pattern</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow mb-4">Target Integration Hub</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-900">
                      <div className="flex items-center gap-3">
                        <FileCode size={14} className="text-blue-400" />
                        <span className="text-[11px] text-zinc-400 font-medium">Frontend Stack</span>
                      </div>
                      <span className="text-[11px] font-bold text-white uppercase">{projectStack?.frontend}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-900">
                      <div className="flex items-center gap-3">
                        <Database size={14} className="text-emerald-400" />
                        <span className="text-[11px] text-zinc-400 font-medium">Backend Stack</span>
                      </div>
                      <span className="text-[11px] font-bold text-white uppercase">{projectStack?.backend}</span>
                    </div>
                  </div>
                </section>

                {blueprint?.hotspots && (
                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-4">Architectural Hotspots</h3>
                    <div className="flex flex-wrap gap-2">
                      {blueprint.hotspots.map((h, i) => (
                        <div key={i} className="px-3 py-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] font-bold flex items-center gap-2">
                          <Search size={12} />
                          {h}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="flex-1 p-8 overflow-hidden flex flex-col bg-[#050505]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow">Deep Structural Mapping</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Live Architectural Sync</span>
                  </div>
                </div>
                <div className="flex-1 rounded-2xl border border-zinc-800 bg-black/40 p-10 font-mono text-emerald-400/90 leading-relaxed overflow-y-auto shadow-inner text-sm whitespace-pre-wrap scrollbar-hide">
                  {mappedStructure || "Synthesizing deep repository context..."}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-zinc-800 bg-zinc-950/50 flex justify-end gap-4">
              <button 
                onClick={() => setShowBlueprint(false)}
                className="px-8 py-3 rounded-xl bg-zinc-800 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-700 transition-all border border-zinc-700"
              >
                Close Blueprint
              </button>
              <button 
                onClick={() => { setShowBlueprint(false); setShowWizard(true); }}
                className="px-8 py-3 rounded-xl bg-brand-yellow text-black text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)] border border-brand-yellow"
              >
                Proceed to Migration
              </button>
            </div>
          </div>
        </div>
      )}

      {showWizard && (
        <MigrationWizard 
          onClose={() => setShowWizard(false)} 
          architecture={architecture || 'General Pattern'}
          purpose={purpose || 'Codebase Refactor'}
          onPlanGenerated={(stack) => {
            console.log('Plan generated for:', stack);
            setShowWizard(false);
          }}
        />
      )}
    </div>
  );
};
