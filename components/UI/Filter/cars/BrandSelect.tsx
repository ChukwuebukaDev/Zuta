"use client";
import Dropdown from "@/utilities/Dropdown";
import { useEffect, useState } from "react";

interface BrandSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BrandSelect({ value, onChange }: BrandSelectProps) {
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data: { Make_Name: string }[][]) =>
        setBrands(data.flat().map((b) => b.Make_Name)),
      )
      .catch(() => setBrands([]));
  }, []);

  return (
    <Dropdown
      options={brands}
      value={value}
      placeholder="Select Brand"
      onChange={onChange}
    />
  );
}
