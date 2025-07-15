import { useVisualStore } from "../store/visualStore";

export default function CodeViewer() {
  const steps = useVisualStore((s) => s.steps);
  const current = useVisualStore((s) => s.current);

  return (
    <div className="bg-gray-100 p-4 rounded text-sm font-mono mb-4">
      {steps.map((s, i) => (
        <pre
          key={i}
          className={`p-1 rounded ${
            i === current ? "bg-yellow-200" : ""
          }`}
        >
          {s.type === "declaration"
            ? `${s.varType} ${s.name}${s.value !== undefined ? ` = ${s.value}` : ""};`
            : JSON.stringify(s)}
        </pre>
      ))}
    </div>
  );
}
