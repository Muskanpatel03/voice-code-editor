import React, { useState } from "react";
import EditorComponent from "./components/Editor";
import VoiceControl from "./components/VoiceControl";
import "./App.css";

function App() {
  const [code, setCode] = useState("// Start coding with voice 🎤\n");
  const [output, setOutput] = useState("");
  // ✅ ADD HERE
  const runCode = () => {
    let outputData = "";

    const originalLog = console.log;

    console.log = (...args) => {
      outputData += args.join(" ") + "\n";
    };

    try {
      // eslint-disable-next-line no-eval
      eval(code);
      setOutput(outputData || "Code executed successfully");
    } catch (err) {
      setOutput(err.message);
    }

    console.log = originalLog; // restore original console
  };

  return (
    <div className="app">
      <div className="header">
        <div className="title">Voice Code Editor</div>

        <div className="controls">
          <VoiceControl setCode={setCode} />

          <button className="run-btn" onClick={runCode}>
            ▶ Run
          </button>
        </div>
      </div>

      <div className="main">
        <div className="editor-container">
          <EditorComponent code={code} setCode={setCode} />
        </div>

        <div className="output-box">
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
        
      </div>
    </div>
  );
}

export default App;
