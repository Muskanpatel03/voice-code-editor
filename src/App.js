import React, { useState, useEffect } from "react";

import EditorComponent from "./components/Editor";
import VoiceControl from "./components/VoiceControl";
import "./App.css";
function App() {
  const [code, setCode] = useState("// Start coding with voice 🎤\n");
  const [output, setOutput] = useState("");
  // ✅ ADD HERE

  const runCode = () => {
    try {
      //  Detect HTML/UI code
      const isUI = /<[^>]+>/.test(code) || code.includes("document.");

      if (isUI) {
        const newWindow = window.open();
        newWindow.document.open();

        if (/<[^>]+>/.test(code)) {
          // HTML case
          newWindow.document.write(code);
        } else {
          // JS UI case
          newWindow.document.write(`
      <html>
        <head>
          <title>Output</title>
        </head>
        <body>
        </body>
      </html>
    `);

          //  Inject script separately (NO </script> issue)
          const script = newWindow.document.createElement("script");
          script.innerHTML = `
      try {
        ${code}
      } catch(e) {
        document.body.innerHTML = "<h3 style='color:red'>Error: " + e.message + "</h3>";
      }
    `;

          newWindow.document.body.appendChild(script);
        }

        newWindow.document.close();
        return;
      }

      //  CASE 2: NORMAL JS → OUTPUT BOX
      let outputData = "";
      const originalLog = console.log;

      console.log = (...args) => {
        outputData += args.join(" ") + "\n";
      };

      // eslint-disable-next-line no-eval
      eval(code);

      setOutput(outputData || "Code executed successfully");

      console.log = originalLog;
    } catch (err) {
      setOutput("❌ Error: " + err.message);
    }
  };
  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "code.js";
    link.click();
  };

  //  AUTO SAVE
  useEffect(() => {
    const savedCode = localStorage.getItem("code");
    if (savedCode) setCode(savedCode);
  }, []);

  useEffect(() => {
    localStorage.setItem("code", code);
  }, [code]);
  return (
    <div className="app">
      <div className="header">
        <div className="title">Voice Code Editor</div>

        <div className="controls">
          {/* 🎤 Speak */}
          <VoiceControl setCode={setCode} runCode={runCode} />

          {/* ▶ Run */}
          <button className="run-btn" onClick={runCode}>
            ▶ Run
          </button>

          {/* ⋮ MENU */}
          <div className="menu">
            <button className="menu-btn">⋮</button>

            <div className="dropdown">
              <button
                onClick={() => {
                  setCode("");
                  setOutput("");
                }}
              >
                Clear
              </button>
              <button onClick={downloadCode}>⬇ Save</button>
            </div>
          </div>
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
