"use client";

type Props = {
  price: number;
  negotiable: boolean;
  onChange: (field: "price" | "negotiable", value: string | boolean) => void;
};

export default function PriceSection({ price, negotiable, onChange }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 items-center">
      <input
        type="number"
        placeholder="Price (₦)"
        value={price}
        onChange={(e) => onChange("price", e.target.value)}
        className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
        required
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={negotiable}
          onChange={(e) => onChange("negotiable", e.target.checked)}
        />
        Negotiable
      </label>
    </div>
  );
}
