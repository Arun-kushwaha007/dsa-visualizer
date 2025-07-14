import React from 'react';

interface UnorderedSetBoxProps {
  name: string;
  values: any[];
}

const UnorderedSetBox: React.FC<UnorderedSetBoxProps> = ({ name, values }) => {
  return (
    <div className="border p-4 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">{name} (Unordered Set)</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <div
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnorderedSetBox;
