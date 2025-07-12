import { AnimatePresence, motion } from 'framer-motion';

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
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="border rounded shadow p-4 bg-white"
    >
      <div className="text-gray-500 text-sm mb-2">graph</div>
      <div className="font-bold mb-4">{name}</div>
      <div className="space-y-4">
        <AnimatePresence>
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="w-12 h-12 flex justify-center items-center rounded-full bg-blue-100 border">
                {node.id}
              </div>
              {node.connections.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  connects to: {node.connections.join(', ')}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
