"use client";
import { useEffect, useState } from "react";

interface BrandSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BrandSelect({ value, onChange }: BrandSelectProps) {
  const [brands, setBrands] = useState<{ Make_Name: string }[]>([]);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then(setBrands)
      .catch(() => setBrands([]));
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-gray-400 border rounded-4xl p-1 w-full focus:outline-none outline-0"
    >
      <option value="">All Brands</option>
      {brands.map((b) => (
        <option key={b.Make_Name} value={b.Make_Name}>
          {b.Make_Name}
        </option>
      ))}
    </select>
  );
}
