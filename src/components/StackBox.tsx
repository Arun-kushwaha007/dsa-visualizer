import { AnimatePresence, motion } from 'framer-motion';

type StackBoxProps = {
  name: string;
  values: string[];
};

export default function StackBox({ name, values }: StackBoxProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="border rounded shadow p-4 bg-white"
    >
      <div className="text-gray-500 text-sm mb-2">stack</div>
      <div className="font-bold mb-2">{name}</div>
      <div className="flex flex-col-reverse space-y-2 space-y-reverse">
        <AnimatePresence>
          {values.map((v, i) => (
            <motion.div
              key={v + i}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-20 h-10 flex justify-center items-center border rounded bg-purple-100"
            >
              {v}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
