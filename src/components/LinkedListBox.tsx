import { AnimatePresence, motion } from 'framer-motion';

type LinkedListBoxProps = {
  name: string;
  values: string[];
};

export default function LinkedListBox({ name, values }: LinkedListBoxProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="border rounded shadow p-4 bg-white"
    >
      <div className="text-gray-500 text-sm mb-2">linked list</div>
      <div className="font-bold mb-2">{name}</div>
      <div className="flex items-center space-x-2">
        <AnimatePresence>
          {values.map((v, i) => (
            <motion.div
              key={v + i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2"
            >
              <div className="w-14 h-10 flex justify-center items-center border rounded bg-yellow-100">
                {v}
              </div>
              <span className="text-gray-500">→</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <span className="text-gray-400">null</span>
      </div>
    </motion.div>
  );
}
