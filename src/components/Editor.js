import React from "react";
import Editor from "@monaco-editor/react";

function EditorComponent({ code, setCode }) {
  return (
    <Editor
      height="70vh"
      defaultLanguage="javascript"
      value={code}
      onChange={(value) => setCode(value)}
      theme="vs-dark"
    />
  );
}

export default EditorComponent;