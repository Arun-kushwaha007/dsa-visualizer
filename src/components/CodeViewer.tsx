import { useVisualStore } from "../store/visualStore";

export default function CodeViewer() {
  const steps = useVisualStore((s) => s.steps);
  const current = useVisualStore((s) => s.currentStep);

  return (
    <div className="bg-gray-100 p-4 rounded text-sm font-mono mb-4">
      {steps.map((s, i) => (
        <pre
          key={i}
          className={`p-1 rounded ${
            i === current ? "bg-yellow-200" : ""
          }`}
        >
          {s.line}
        </pre>
      ))}
    </div>
  );
}
