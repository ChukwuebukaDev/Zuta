"use client";

import { useEffect, useState } from "react";
import Dropdown from "@/utilities/Dropdown";

type Props = {
  brand: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ModelSelect({ brand, value, onChange }: Props) {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!brand) {
      setModels([]);
      return;
    }

    setLoading(true);

    fetch(`/api/models/${brand}`)
      .then((res) => res.json())
      .then((data: { Model_Name: string }[][]) =>
        setModels(data.flat().map((m) => m.Model_Name)),
      )
      .finally(() => setLoading(false));
  }, [brand]);

  return (
    <Dropdown
      options={models}
      value={value}
      placeholder={loading ? "Loading models..." : "Select Model"}
      onChange={onChange}
    />
  );
}
