import React from "react";

interface Props {
  name: string;
  values: any[];
}

const QueueBox: React.FC<Props> = ({ name, values }) => {
  return (
    <div className="border rounded p-3 bg-gray-50">
      <div className="text-sm text-gray-500 mb-2">{name} (queue)</div>
      <div className="flex space-x-2">
        {values.map((value, index) => (
          <div
            key={index}
            className="p-2 border rounded bg-white w-12 h-12 flex items-center justify-center"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueBox;
