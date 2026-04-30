"use client";
import { useEffect, useState } from "react";
import SelectMenu from "@/utilities/SelectMenu";

interface BrandSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BrandSelect({ value, onChange }: BrandSelectProps) {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/brands")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
      })
      .then((data: { Make_Name: string }[][]) =>
        setBrands(data.flat().map((b) => b.Make_Name)),
      )
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SelectMenu
      options={brands}
      value={value}
      placeholder={loading ? "Loading..." : "Make"}
      onChange={onChange}
      disabled={loading}
    />
  );
}
