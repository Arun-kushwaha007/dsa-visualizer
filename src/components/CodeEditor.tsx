import React from "react";
import Editor from "@monaco-editor/react";

interface Props {
  code: string;
  setCode: (code: string) => void;
}

const CodeEditor: React.FC<Props> = ({ code, setCode }) => {
  return (
    <Editor
      height="100%"
      language="cpp"
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || "")}
    />
  );
};

export default CodeEditor;
