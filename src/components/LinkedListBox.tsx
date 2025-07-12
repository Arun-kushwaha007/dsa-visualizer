type LinkedListBoxProps = {
  name: string;
  values: string[];
};

export default function LinkedListBox({ name, values }: LinkedListBoxProps) {
  return (
    <div className="border rounded shadow p-4 bg-white">
      <div className="text-gray-500 text-sm mb-2">linked list</div>
      <div className="font-bold mb-2">{name}</div>
      <div className="flex items-center space-x-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-14 h-10 flex justify-center items-center border rounded bg-yellow-100">
              {v}
            </div>
            <span className="text-gray-500">→</span>
          </div>
        ))}
        <span className="text-gray-400">null</span>
      </div>
    </div>
  );
}
