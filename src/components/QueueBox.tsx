type QueueBoxProps = {
  name: string;
  values: string[];
};

export default function QueueBox({ name, values }: QueueBoxProps) {
  return (
    <div className="border rounded shadow p-4 bg-white">
      <div className="text-gray-500 text-sm mb-2">queue</div>
      <div className="font-bold mb-2">{name}</div>
      <div className="flex space-x-2">
        {values.map((v, i) => (
          <div
            key={i}
            className="w-12 h-12 flex justify-center items-center border rounded bg-green-100"
          >
            {v}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
        <span>Front</span>
        <span>Rear</span>
      </div>
    </div>
  );
}
