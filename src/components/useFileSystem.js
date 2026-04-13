// src/components/useFileSystem.js
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useFileSystem() {
  const [files, setFiles] = useState([
    { id: uuidv4(), name: 'main.js', content: '// Start coding here\n' }
  ]);
  const [activeFileId, setActiveFileId] = useState(files[0].id);

  // Get the currently open file
  const activeFile = files.find(f => f.id === activeFileId);

  // Create a new file
  const createFile = (name) => {
    const newFile = { id: uuidv4(), name, content: '' };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  // Update content when user types
  const updateFileContent = (content) => {
    setFiles(prev =>
      prev.map(f => f.id === activeFileId ? { ...f, content } : f)
    );
  };

  // Delete a file
  const deleteFile = (id) => {
    const remaining = files.filter(f => f.id !== id);
    setFiles(remaining);
    if (activeFileId === id && remaining.length > 0) {
      setActiveFileId(remaining[0].id);
    }
  };

  return {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    createFile,
    updateFileContent,
    deleteFile
  };
}