import { motion } from 'framer-motion';

type VariableBoxProps = {
  name: string;
  value: string;
  type: string;
};

export default function VariableBox({ name, value, type }: VariableBoxProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="border border-gray-300 p-4 rounded shadow bg-white"
    >
      <div className="text-gray-500 text-sm mb-1">{type}</div>
      <div className="text-lg font-semibold text-blue-700">
        {name} = {value}
      </div>
    </motion.div>
  );
}
