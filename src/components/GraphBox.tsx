type GraphNode = {
  id: string;
  connections: string[];
};

type GraphBoxProps = {
  name: string;
  nodes: GraphNode[];
};

export default function GraphBox({ name, nodes }: GraphBoxProps) {
  return (
    <div className="border rounded shadow p-4 bg-white">
      <div className="text-gray-500 text-sm mb-2">graph</div>
      <div className="font-bold mb-4">{name}</div>
      <div className="space-y-4">
        {nodes.map((node) => (
          <div key={node.id} className="flex flex-col">
            <div className="w-12 h-12 flex justify-center items-center rounded-full bg-blue-100 border">
              {node.id}
            </div>
            {node.connections.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                connects to: {node.connections.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
