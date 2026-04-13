// src/components/AIAssistant.js
import React, { useState } from "react";

function AIAssistant({ currentCode, onApplyCode }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const askAI = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    const apiKey = process.env.REACT_APP_GROQ_KEY;
    if (!apiKey) {
      setResponse("❌ API key missing! Add REACT_APP_GROQ_KEY to your .env file");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",  // Free & powerful
          max_tokens: 1024,
          messages: [
            {
              role: "system",
              content: "You are a coding assistant inside a Voice Code Editor. Help the user with their code. If you write code, always wrap it in a code block with triple backticks."
            },
            {
              role: "user",
              content: `Current code in editor:
\`\`\`
${currentCode || "(empty)"}
\`\`\`

User request: ${prompt}`
            }
          ]
        })
      });

      const data = await res.json();

      if (data.error) {
        setResponse("❌ " + data.error.message);
      } else {
        setResponse(data.choices[0].message.content);
      }

    } catch (err) {
      setResponse("❌ Network error: " + err.message);
    }

    setLoading(false);
  };

  const handleApply = () => {
    const match = response.match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (match) {
      onApplyCode(match[1]);
    } else {
      alert("No code block found in AI response to apply.");
    }
  };

  return (
    <>
      <button className="ai-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        🤖 AI {isOpen ? "▼" : "▲"}
      </button>

      {isOpen && (
        <div className="ai-panel">
          <div className="ai-panel-title">🤖 AI Assistant (Free)</div>

          <textarea
            className="ai-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI anything...
- Fix the bug in my code
- Add a sort function
- Explain this code
- Convert to Python"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) askAI();
            }}
          />

          <div className="ai-btn-row">
            <button className="ai-ask-btn" onClick={askAI} disabled={loading}>
              {loading ? "⏳ Thinking..." : "✨ Ask AI (Ctrl+Enter)"}
            </button>
          </div>

          {response && (
            <div className="ai-response">
              <pre>{response}</pre>
              {response.includes("```") && (
                <button className="ai-apply-btn" onClick={handleApply}>
                  ⬇ Apply Code to Editor
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AIAssistant;