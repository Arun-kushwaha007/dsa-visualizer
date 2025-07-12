import React from "react";

interface Props {
  name: string;
  values: any[];
}

const StackBox: React.FC<Props> = ({ name, values }) => {
  return (
    <div className="border rounded p-3 bg-gray-50">
      <div className="text-sm text-gray-500 mb-2">{name} (stack)</div>
      <div className="flex flex-col-reverse space-y-2 space-y-reverse">
        {values.map((value, index) => (
          <div
            key={index}
            className="p-2 border rounded bg-white w-full h-12 flex items-center justify-center"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackBox;
