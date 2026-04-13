// src/components/FileManager.js
import React, { useState } from "react";

// ── Persistent storage helpers ──────────────────────────────────────────────
const STORAGE_KEY = "vce_files";
const ACTIVE_KEY  = "vce_active";

export function loadFiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Default first file
  return [{ id: "1", name: "main.js", content: "// Start coding with voice 🎤\n" }];
}

export function saveFiles(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

export function loadActiveId(files) {
  const saved = localStorage.getItem(ACTIVE_KEY);
  if (saved && files.find(f => f.id === saved)) return saved;
  return files[0].id;
}

export function saveActiveId(id) {
  localStorage.setItem(ACTIVE_KEY, id);
}

// ── FileManager UI ──────────────────────────────────────────────────────────
function FileManager({ files, activeFileId, onSelect, onCreate, onDelete, onRename }) {
  const [showInput, setShowInput] = useState(false);
  const [inputName, setInputName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  const handleCreate = () => {
    const name = inputName.trim();
    if (!name) return;
    onCreate(name);
    setInputName("");
    setShowInput(false);
  };

  const startRename = (file) => {
    setRenamingId(file.id);
    setRenameVal(file.name);
  };

  const confirmRename = () => {
    if (renameVal.trim()) onRename(renamingId, renameVal.trim());
    setRenamingId(null);
  };

  return (
    <div className="file-manager">
      <div className="file-manager-title">📁 Files</div>

      {files.map(file => (
        <div
          key={file.id}
          className={`file-item ${file.id === activeFileId ? "active" : ""}`}
        >
          {renamingId === file.id ? (
            // ── Rename input ──
            <input
              className="file-rename-input"
              value={renameVal}
              onChange={e => setRenameVal(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenamingId(null); }}
              onBlur={confirmRename}
              autoFocus
            />
          ) : (
            // ── Normal row ──
            <>
              <span
                className="file-name"
                onClick={() => onSelect(file.id)}
                onDoubleClick={() => startRename(file)}
                title="Click to open • Double-click to rename"
              >
                📄 {file.name}
              </span>
              {files.length > 1 && (
                <button
                  className="file-delete-btn"
                  onClick={() => onDelete(file.id)}
                  title="Delete file"
                >✕</button>
              )}
            </>
          )}
        </div>
      ))}

      {/* New file input */}
      {showInput && (
        <div className="file-input-row">
          <input
            className="file-input"
            value={inputName}
            onChange={e => setInputName(e.target.value)}
            placeholder="filename.js"
            onKeyDown={e => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setShowInput(false); }}
            autoFocus
          />
          <button className="file-add-confirm" onClick={handleCreate}>✓</button>
        </div>
      )}

      <button className="file-new-btn" onClick={() => setShowInput(s => !s)}>
        + New File
      </button>
    </div>
  );
}

export default FileManager;