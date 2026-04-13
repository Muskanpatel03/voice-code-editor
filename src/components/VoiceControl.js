// src/components/VoiceControl.js
import React, { useState } from "react";

function VoiceControl({ onSpeech, onRun, disabled }) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      alert("Your browser doesn't support voice. Use Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend   = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript.toLowerCase().trim();
      console.log("🎤 Heard:", speech);

      // ── Voice commands ──────────────────────────────────────────
      if (speech === "run" || speech === "run code" || speech === "execute") {
        onRun();                  // ▶ runs the code immediately
      } else if (speech === "clear") {
        onSpeech("clear the editor"); // AI clears
      } else {
        onSpeech(speech);         // everything else → AI writes code
      }
    };

    recognition.start();
  };

  return (
    <button
      className={`voice-btn ${listening ? "listening" : ""}`}
      onClick={startListening}
      disabled={disabled}
      title='Say "run" to execute • Say anything else to write code with AI'
    >
      {listening ? "🔴 Listening..." : "🎤 Speak"}
    </button>
  );
}

export default VoiceControl;