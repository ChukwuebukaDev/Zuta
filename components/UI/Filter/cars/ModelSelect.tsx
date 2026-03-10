"use client";

import { useEffect, useState } from "react";

type Props = {
  brand: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ModelSelect({ brand, value, onChange }: Props) {
  const [models, setModels] = useState<{ Model_Name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!brand) {
      setModels([]);
      return;
    }

    setLoading(true);

    fetch(`/api/models/${brand}`)
      .then((res) => res.json())
      .then(setModels)
      .finally(() => setLoading(false));
  }, [brand]);

  return (
    <select
      className="border-gray-400 border rounded-4xl p-1 w-full focus:outline-none outline-0"
      disabled={!brand || loading}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Models</option>

      {models.map((m) => (
        <option key={m.Model_Name} value={m.Model_Name}>
          {m.Model_Name}
        </option>
      ))}
    </select>
  );
}
