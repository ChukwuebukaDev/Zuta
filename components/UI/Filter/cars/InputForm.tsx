export default function Input({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-gray-400 border rounded-4xl p-1 w-full focus:outline-none focus:ring-2 focus:ring-black"
    />
  );
}
