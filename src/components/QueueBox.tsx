import { AnimatePresence, motion } from 'framer-motion';

type QueueBoxProps = {
  name: string;
  values: string[];
};

export default function QueueBox({ name, values }: QueueBoxProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="border rounded shadow p-4 bg-white"
    >
      <div className="text-gray-500 text-sm mb-2">queue</div>
      <div className="font-bold mb-2">{name}</div>
      <div className="flex space-x-2">
        <AnimatePresence>
          {values.map((v, i) => (
            <motion.div
              key={v + i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 flex justify-center items-center border rounded bg-green-100"
            >
              {v}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
        <span>Front</span>
        <span>Rear</span>
      </div>
    </motion.div>
  );
}
