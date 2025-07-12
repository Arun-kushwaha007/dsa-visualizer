type ArrayBoxProps = {
  name: string;
  values: string[];
};

export default function ArrayBox({ name, values }: ArrayBoxProps) {
  return (
    <div className="border rounded shadow p-4 bg-white">
      <div className="text-gray-500 text-sm">array</div>
      <div className="font-bold mb-2">{name}</div>
      <div className="flex space-x-2">
        {values.map((v, i) => (
          <div
            key={i}
            className="w-12 h-12 flex justify-center items-center border rounded bg-blue-100"
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}
