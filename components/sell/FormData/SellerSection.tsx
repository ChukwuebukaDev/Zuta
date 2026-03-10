"use client";

type Props = {
  sellerName: string;
  sellerPhone: string;
  location: string;
  onChange: (
    field: "sellerName" | "sellerPhone" | "location",
    value: string,
  ) => void;
};

export default function SellerSection({
  sellerName,
  sellerPhone,
  location,
  onChange,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <input
        type="text"
        placeholder="Your Name"
        value={sellerName}
        onChange={(e) => onChange("sellerName", e.target.value)}
        className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={sellerPhone}
        onChange={(e) => onChange("sellerPhone", e.target.value)}
        className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => onChange("location", e.target.value)}
        className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
        required
      />
    </div>
  );
}
