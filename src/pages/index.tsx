// src/pages/index.tsx

import { useState } from "react";
import { useVisualStore } from "../store/visualStore";
import { parseCppCode } from "../parser/cppParser";
import QueueBox from "../components/QueueBox";
import VariableBox from "../components/VariavleBox";

export default function Home() {
  const [input, setInput] = useState("");

  const stack = useVisualStore((s) => s.stack);
  const setSteps = useVisualStore((s) => s.setSteps);
  const nextStep = useVisualStore((s) => s.nextStep);
  const queueValues = useVisualStore((s) => s.queueValues);
  const variables = useVisualStore((s) => s.variables);

  function handleParse() {
    const parsed = parseCppCode(input);
    setSteps(parsed);
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        DSA Visual Interpreter
      </h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type C++ code here..."
        className="w-full h-40 p-4 border rounded mb-4 resize-none"
      />

      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleParse}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Parse
        </button>
        <button
          onClick={nextStep}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Next Step
        </button>
      </div>

      {/* CURRENT EXECUTION STATE */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Current Execution
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(variables).map(([name, value]) => (
          <VariableBox
            key={name}
            name={name}
            value={value}
            type={"variable"}
          />
        ))}
        {Object.entries(queueValues).map(([name, values]) => (
          <QueueBox key={name} name={name} values={values} />
        ))}
      </div>

      {/* STACK FRAMES */}
      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
        Call Stack
      </h2>

      <div className="space-y-4">
        {stack.map((frame, level) => (
          <div key={level} className="border rounded p-3 bg-gray-50">
            <div className="text-sm text-gray-500 mb-2">
              Frame {level + 1} {frame.context?.type ? `(${frame.context?.type} loop)` : ""}
            </div>
            <div className="space-y-1">
              {frame.steps.map((step, idx) => {
                const isCurrent = idx === frame.index && level === stack.length - 1;
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded font-mono border ${
                      isCurrent
                        ? "bg-yellow-100 border-yellow-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {formatStep(step)}
                  </div>
                );
              })}
              {frame.steps.length === 0 && (
                <div className="text-gray-400 italic text-sm">
                  (empty block)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatStep(step: any): string {
  switch (step.type) {
    case "declaration":
      return `${step.varType} ${step.name}`;
    case "assignment":
      return `${step.name} = ${step.value}`;
    case "methodCall":
      return `${step.object}.${step.method}(${step.args})`;
    case "forLoop":
      return `for (${step.init}; ${step.condition}; ${step.increment}) {...}`;
    case "whileLoop":
      return `while (${step.condition}) {...}`;
    case "ifBlock":
      return `if (${step.condition}) {...}`;
    case "line":
      return step.line;
    default:
      return JSON.stringify(step);
  }
}
