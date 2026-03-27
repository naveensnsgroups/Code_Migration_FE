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
  
  const [activeTab, setActiveTab] = useState<'explorer' | 'git' | 'migration_hub'>('explorer');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Sync selectedFile to localStorage
  useEffect(() => {
    const savedFile = localStorage.getItem('gh_selected_file');
    if (savedFile) {
      setSelectedFile(savedFile);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (selectedFile) {
        localStorage.setItem('gh_selected_file', selectedFile);
      } else {
        localStorage.removeItem('gh_selected_file');
      }
    }
  }, [selectedFile, isMounted]);

  // Restore file content if selectedFile exists on mount
  useEffect(() => {
    if (isMounted && selectedFile && !fileContent && !isFileLoading) {
      const restoreFile = async () => {
        setIsFileLoading(true);
        try {
          const response = await dashboardApi.readSourceFile(selectedFile);
          setFileContent(response.data.content);
        } catch (error) {
          console.error('Failed to restore file content:', error);
        } finally {
          setIsFileLoading(false);
        }
      };
      restoreFile();
    }
  }, [isMounted, selectedFile]);

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

  const [purpose, setPurpose] = useState('');
  const [architecture, setArchitecture] = useState('');
  const [mappedStructure, setMappedStructure] = useState('');
  const [blueprint, setBlueprint] = useState<{core_logic: string; hotspots: string[]} | null>(null);

  const analyzeProject = async () => {
    setIsAnalyzing(true);
    addLog('Starting Deep Gitingest-style Project Analysis...', 'info');
    try {
      const response = await dashboardApi.analyzeProject();
      const data = response.data;
      
      setPurpose(data.purpose || 'General Codebase');
      setArchitecture(data.architecture || 'Standard Web App');
      setMappedStructure(data.mapped_structure || '');
      setBlueprint(data.blueprint || null);
      setProjectStack(data.stack || null);
      setAnalysisResults(data.logic_units || []);
      
      addLog(`Deep Analysis Complete! Detected ${data.architecture || 'Standard'} architecture.`, 'success');
      addLog(`AI Intel: ${data.purpose || 'Project purpose mapped.'}`, 'ai');
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
    const selectedUnits = analysisResults.filter(u => u.selected);
    if (selectedUnits.length === 0) return;

    setIsMigrating(true);
    addLog(`Executing migration for ${selectedUnits.length} logic units...`, 'info');
    try {
      const response = await dashboardApi.executeMigration(selectedUnits);
      console.log('Migration Success:', response.data);
      addLog('Migration completed successfully!', 'success');
    } catch (error) {
      addLog('Migration failed. Check backend logs.', 'error');
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
    purpose,
    architecture,
    blueprint,
    mappedStructure,
    activeTab,
    setActiveTab,
    closeFile: () => {
      setSelectedFile(null);
      setFileContent('');
      setAnalysisResults([]);
      setActiveLogicUnitId(null);
      addLog('Closed active file.', 'info');
    }
  };
};
