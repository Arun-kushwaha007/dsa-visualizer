import React from "react";

interface Props {
  name: string;
  value: any;
  type: string;
  scopeLevel: number;
}

const VariableBox: React.FC<Props> = ({ name, value, type, scopeLevel }) => {
  return (
    <div className="border rounded p-3 bg-gray-50">
      <div className="text-sm text-gray-500 mb-2">
        {name} ({type}) - Scope: {scopeLevel}
      </div>
      <div className="p-2 border rounded bg-white flex items-center justify-center">
        {String(value)}
      </div>
    </div>
  );
};

export default VariableBox;
