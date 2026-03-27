"use client";

import { useState, useEffect } from 'react';
import { dashboardApi } from '../apis/dashboard.api';
import { FileItem, LogicUnit } from '../types';
import { LogEntry } from '../components/SystemLogs';

export const useDashboard = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folderContents, setFolderContents] = useState<Record<string, FileItem[]>>({});
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<LogicUnit[]>([]);
  const [projectStack, setProjectStack] = useState<{frontend: string; backend: string; database?: string} | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [activeLogicUnitId, setActiveLogicUnitId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai' = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const fetchFiles = async (path: string = "") => {
    try {
      const response = await dashboardApi.listSourceFiles(path);
      if (path === "") {
        setFiles(response.data);
      } else {
        setFolderContents(prev => ({ ...prev, [path]: response.data }));
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  };

  const handleFileClick = async (file: FileItem) => {
    if (file.isDir) {
      const isExpanded = expandedFolders.has(file.path);
      if (isExpanded) {
        setExpandedFolders(prev => {
          const next = new Set(prev);
          next.delete(file.path);
          return next;
        });
      } else {
        if (!folderContents[file.path]) {
          await fetchFiles(file.path);
        }
        setExpandedFolders(prev => new Set(prev).add(file.path));
      }
    } else {
      setSelectedFile(file.path);
      setIsFileLoading(true);
      setAnalysisResults([]); // Reset on new file
      setActiveLogicUnitId(null);
      try {
        const response = await dashboardApi.readSourceFile(file.path);
        setFileContent(response.data.content);
      } catch (error) {
        setFileContent('Error loading file content');
      } finally {
        setIsFileLoading(false);
      }
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    try {
      const response = await dashboardApi.analyzeSourceFile(selectedFile);
      if (response.data.logic_units) {
        setAnalysisResults(response.data.logic_units);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeProject = async () => {
    setIsAnalyzing(true);
    addLog('Initiating recursive repository scan...', 'info');
    addLog('Gemini 1.5 Flash processing codebase context...', 'ai');
    try {
      const response = await dashboardApi.analyzeProject();
      if (response.data.logic_units) {
        setAnalysisResults(response.data.logic_units);
        setProjectStack(response.data.stack);
        addLog(`Successfully mapped ${response.data.logic_units.length} logic units.`, 'success');
        addLog(`Tech stack detected: ${response.data.stack.frontend} / ${response.data.stack.backend}`, 'info');
      }
    } catch (error) {
      addLog('Project analysis failed. Please check Gemini API status.', 'error');
      console.error('Project analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleLogicSelection = (id: string) => {
    setAnalysisResults(prev => prev.map(unit => 
      unit.id === id ? { ...unit, selected: !unit.selected } : unit
    ));
  };

  const executeMigration = async () => {
    if (!selectedFile) return;
    const selectedIds = analysisResults.filter(u => u.selected).map(u => u.id);
    if (selectedIds.length === 0) return;

    setIsMigrating(true);
    try {
      const response = await dashboardApi.executeMigration(selectedFile, selectedIds);
      console.log('Migration Success:', response.data);
      // We could add a successful log entry here if we exposed setLogs
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsInitialLoading(true);
      await fetchFiles();
      addLog('System initialized. Ready for migration.', 'info');
      addLog('Waiting for repository analysis...', 'ai');
      setIsInitialLoading(false);
    };
    init();
  }, []);

  return {
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
    addLog,
    activeLogicUnitId,
    setActiveLogicUnitId,
    refreshFiles: () => fetchFiles(),
  };
};
