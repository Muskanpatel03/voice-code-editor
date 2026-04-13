// src/App.js
import React, { useState, useCallback } from "react";
import EditorComponent from "./components/Editor";
import VoiceControl from "./components/VoiceControl";
import FileManager, {
  loadFiles, saveFiles, loadActiveId, saveActiveId
} from "./components/FileManager";
import "./App.css";

// ── Unique ID helper (no package needed) ───────────────────────────────────
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// ── Groq API call → returns code string ───────────────────────────────────
async function askGroq(userMessage, currentCode) {
  const apiKey = process.env.REACT_APP_GROQ_KEY;
  if (!apiKey) throw new Error("REACT_APP_GROQ_KEY missing in .env");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are an AI coding assistant inside a Voice Code Editor.
The user speaks or types a request and you write the code.

RULES:
- Always respond with ONLY a code block — no explanation, no extra text.
- Use the language that fits the request (JS by default).
- If the user says "add" or "append", add to the existing code.
- If the user says "fix" or "debug", fix the existing code.
- Keep code clean and working.
- Reply format: \`\`\`js\n...code...\n\`\`\``
        },
        {
          role: "user",
          content: `Current code in editor:\n\`\`\`\n${currentCode || "(empty)"}\n\`\`\`\n\nRequest: ${userMessage}`
        }
      ]
    })
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  const text = data.choices[0].message.content;

  // Extract code from code block
  const match = text.match(/```(?:\w+)?\n([\s\S]*?)```/);
  return match ? match[1] : text; // fallback: return full text
}

// ═══════════════════════════════════════════════════════════════════════════
function App() {
  // ── File system state — loaded from localStorage ───────────────────────
  const [files, setFiles] = useState(() => loadFiles());
  const [activeFileId, setActiveFileId] = useState(() => loadActiveId(loadFiles()));
  const [output, setOutput] = useState("");
  const [aiStatus, setAiStatus] = useState(""); // status bar message
  const [aiLoading, setAiLoading] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const activeFile = files.find(f => f.id === activeFileId);
  const code = activeFile?.content || "";

  const persistFiles = (newFiles) => {
    setFiles(newFiles);
    saveFiles(newFiles);
  };

  const updateCode = useCallback((newContent) => {
    setFiles(prev => {
      const updated = prev.map(f =>
        f.id === activeFileId ? { ...f, content: newContent } : f
      );
      saveFiles(updated);
      return updated;
    });
  }, [activeFileId]);

  // ── File operations ──────────────────────────────────────────────────────
  const createFile = (name) => {
    const newFile = { id: uid(), name, content: "" };
    const updated = [...files, newFile];
    persistFiles(updated);
    setActiveFileId(newFile.id);
    saveActiveId(newFile.id);
  };

  const deleteFile = (id) => {
    const remaining = files.filter(f => f.id !== id);
    if (remaining.length === 0) return;
    persistFiles(remaining);
    if (activeFileId === id) {
      setActiveFileId(remaining[0].id);
      saveActiveId(remaining[0].id);
    }
  };

  const renameFile = (id, newName) => {
    const updated = files.map(f => f.id === id ? { ...f, name: newName } : f);
    persistFiles(updated);
  };

  const switchFile = (id) => {
    setActiveFileId(id);
    saveActiveId(id);
    setOutput("");
  };

  // ── AI handler — called by voice OR manual prompt ────────────────────────
  const handleAIRequest = async (userMessage) => {
    if (!userMessage.trim()) return;
    setAiLoading(true);
    setAiStatus(`🤖 AI writing: "${userMessage}"...`);

    try {
      const result = await askGroq(userMessage, code);
      updateCode(result);
      setAiStatus("✅ Done!");
    } catch (err) {
      setAiStatus("❌ " + err.message);
    }

    setAiLoading(false);
    setTimeout(() => setAiStatus(""), 3000);
  };

  // ── Voice handler — raw speech goes straight to AI ───────────────────────
  const handleSpeech = (speech) => {
    handleAIRequest(speech);
  };

  // ── Run code (your original logic, unchanged) ────────────────────────────
  const runCode = () => {
    try {
      const isUI = /<[^>]+>/.test(code) || code.includes("document.");
      if (isUI) {
        const newWindow = window.open();
        newWindow.document.open();
        if (/<[^>]+>/.test(code)) {
          newWindow.document.write(code);
        } else {
          newWindow.document.write(`<html><head><title>Output</title></head><body></body></html>`);
          const script = newWindow.document.createElement("script");
          script.innerHTML = `try { ${code} } catch(e) {
            document.body.innerHTML = "<h3 style='color:red'>Error: " + e.message + "</h3>";
          }`;
          newWindow.document.body.appendChild(script);
        }
        newWindow.document.close();
        return;
      }

      let outputData = "";
      const originalLog = console.log;
      console.log = (...args) => { outputData += args.join(" ") + "\n"; };
      // eslint-disable-next-line no-eval
      eval(code);
      setOutput(outputData || "✅ Code executed successfully");
      console.log = originalLog;
    } catch (err) {
      setOutput("❌ Error: " + err.message);
    }
  };

  // ── Download (your original logic) ──────────────────────────────────────
  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = activeFile?.name || "code.js";
    link.click();
  };

  // ── Manual AI prompt box ─────────────────────────────────────────────────
  const [manualPrompt, setManualPrompt] = useState("");

  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="app">

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div className="header">
        <div className="title">🎤 Voice Code Editor</div>

        <div className="controls">
          {/* 🎤 Voice → AI */}
          <VoiceControl onSpeech={handleSpeech} onRun={runCode} disabled={aiLoading} />
          {/* ▶ Run */}
          <button className="run-btn" onClick={runCode}>▶ Run</button>

          {/* ⋮ Menu */}
          <div className="menu">
            <button className="menu-btn">⋮</button>
            <div className="dropdown">
              <button onClick={() => { updateCode(""); setOutput(""); }}>🗑 Clear</button>
              <button onClick={downloadCode}>⬇ Save</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI STATUS BAR ─────────────────────────────────────────────── */}
      {aiStatus && (
        <div className="ai-status-bar">{aiStatus}</div>
      )}

      {/* ── MANUAL AI PROMPT BAR ──────────────────────────────────────── */}
      <div className="ai-prompt-bar">
        <span className="ai-prompt-label">🤖 AI:</span>
        <input
          className="ai-prompt-input"
          value={manualPrompt}
          onChange={e => setManualPrompt(e.target.value)}
          placeholder='Type what you want... e.g. "write a bubble sort", "fix my code", "add input validation"'
          onKeyDown={e => {
            if (e.key === "Enter" && manualPrompt.trim()) {
              handleAIRequest(manualPrompt);
              setManualPrompt("");
            }
          }}
          disabled={aiLoading}
        />
        <button
          className="ai-prompt-btn"
          disabled={aiLoading || !manualPrompt.trim()}
          onClick={() => { handleAIRequest(manualPrompt); setManualPrompt(""); }}
        >
          {aiLoading ? "⏳" : "✨ Ask"}
        </button>
      </div>

      {/* ── MAIN ──────────────────────────────────────────────────────── */}
      <div className="main">

        {/* LEFT: Files */}
        <FileManager
          files={files}
          activeFileId={activeFileId}
          onSelect={switchFile}
          onCreate={createFile}
          onDelete={deleteFile}
          onRename={renameFile}
        />

        {/* MIDDLE: Editor */}
        <div className="editor-container">
          <div className="file-tab">✏️ {activeFile?.name}</div>
          <EditorComponent code={code} setCode={updateCode} />
        </div>

        {/* RIGHT: Output */}
        <div className="output-box">
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>

      </div>
    </div>
  );
}

export default App;