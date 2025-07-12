import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import VariableBox from '../components/VariavleBox';
import ArrayBox from '../components/ArrayBox';
import StackBox from '../components/StackBox';
import { useVisualStore } from '../store/visualStore';
import QueueBox from '../components/QueueBox';
import LinkedListBox from '../components/LinkedListBox';
import TreeBox from '../components/TreeBox';
import GraphBox from '../components/GraphBox';

export default function Home() {
  const [input, setInput] = useState('');
  const items = useVisualStore((state) => state.items);
  const parseInput = useVisualStore((state) => state.parseInput);

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        DSA Visual Interpreter
      </h1>

      <textarea
        value={input}
        onChange={(e) => {
          const value = e.target.value;
          setInput(value);
          parseInput(value);
        }}
        placeholder="Type DSA code..."
        className="w-full h-40 p-4 border rounded mb-4 resize-none"
      />

      <button
        onClick={() => parseInput(input)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Parse
      </button>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {items.map((item, i) => {
            const animatedBox = (element: React.ReactNode) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                {element}
              </motion.div>
            );

            if (item.type === 'variable') {
              return animatedBox(
                <VariableBox
                  name={item.name}
                  value={item.value}
                  type={item.varType}
                />
              );
            }
            if (item.type === 'array') {
              return animatedBox(
                <ArrayBox name={item.name} values={item.values} />
              );
            }
            if (item.type === 'stack') {
              return animatedBox(
                <StackBox name={item.name} values={item.values} />
              );
            }
            if (item.type === 'queue') {
              return animatedBox(
                <QueueBox name={item.name} values={item.values} />
              );
            }
            if (item.type === 'linkedlist') {
              return animatedBox(
                <LinkedListBox name={item.name} values={item.values} />
              );
            }
            if (item.type === 'tree') {
              return animatedBox(
                <TreeBox name={item.name} root={item.root} />
              );
            }
            if (item.type === 'graph') {
              return animatedBox(
                <GraphBox name={item.name} nodes={item.nodes} />
              );
            }

            return null;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
