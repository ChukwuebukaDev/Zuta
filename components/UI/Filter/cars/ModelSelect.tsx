"use client";

import { useEffect, useState } from "react";
import SelectMenu from "@/utilities/SelectMenu";

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
    <SelectMenu
      options={models}
      value={value}
      placeholder={!brand ? "👈 select make" : loading ? "Loading..." : "Model"}
      onChange={onChange}
    />
  );
}
