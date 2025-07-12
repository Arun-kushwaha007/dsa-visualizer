type StackBoxProps = {
  name: string;
  values: string[];
};

export default function StackBox({ name, values }: StackBoxProps) {
  return (
    <div className="border rounded shadow p-4 bg-white">
      <div className="text-gray-500 text-sm mb-2">stack</div>
      <div className="font-bold mb-2">{name}</div>
      <div className="flex flex-col-reverse space-y-2 space-y-reverse">
        {values.map((v, i) => (
          <div
            key={i}
            className="w-20 h-10 flex justify-center items-center border rounded bg-purple-100"
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}
