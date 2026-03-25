"use client";

import { useState, useEffect } from 'react';
import { dashboardApi } from '../apis/dashboard.api';
import { FileItem } from '../types';

export const useDashboard = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFileLoading, setIsFileLoading] = useState(false);

  const fetchFiles = async (path: string = "") => {
    setIsInitialLoading(true);
    try {
      const response = await dashboardApi.listSourceFiles(path);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleFileClick = async (file: FileItem) => {
    if (file.isDir) {
      fetchFiles(file.path);
    } else {
      setSelectedFile(file.path);
      setIsFileLoading(true);
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

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    selectedFile,
    fileContent,
    isInitialLoading,
    isFileLoading,
    handleFileClick,
    refreshFiles: () => fetchFiles(),
  };
};
