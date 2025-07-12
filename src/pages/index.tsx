import { useState } from "react";
import { parseCppCode } from "../parser/cppParser";
import { useVisualStore } from "../store/visualStore";
import CodeViewer from "../components/CodeViewer";
import QueueBox from "../components/QueueBox";
// import VariableBox from "../components/VariableBox";
import VariableBox from "../components/VariavleBox";

export default function Home() {
  const [input, setInput] = useState("");

  const setSteps = useVisualStore((s) => s.setSteps);
  const nextStep = useVisualStore((s) => s.nextStep);
  const queues = useVisualStore((s) => s.queueValues);
  const variables = useVisualStore((s) => s.variables);

  const handleParse = () => {
    const steps = parseCppCode(input);
    setSteps(steps);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        DSA Visualizer (C++ Mode)
      </h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your C++ code here..."
        className="w-full h-40 p-4 border rounded mb-4"
      />

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleParse}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Parse
        </button>
        <button
          onClick={nextStep}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next Step
        </button>
      </div>

      <CodeViewer />

      <h2 className="text-lg font-bold mb-2">Variables</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(variables).map(([name, value]) => (
          <VariableBox key={name} name={name} value={value} type="variable" />
        ))}
      </div>

      <h2 className="text-lg font-bold mt-8 mb-2">Queues</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(queues).map(([name, values]) => (
          <QueueBox key={name} name={name} values={values} />
        ))}
      </div>
    </div>
  );
}
