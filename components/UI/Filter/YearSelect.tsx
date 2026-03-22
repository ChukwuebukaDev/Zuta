"use client";
import SelectMenu from "@/utilities/SelectMenu";

type Props = {
  value: string;
  onChange: (value: string) => void;
  startYear?: number;
  endYear?: number;
};

export default function YearSelect({
  value,
  onChange,
  startYear = 2000,
  endYear = new Date().getFullYear(),
}: Props) {
  // Generate years (descending)
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) =>
    (endYear - i).toString(),
  );

  return (
    <SelectMenu
      options={years}
      value={value}
      placeholder="Year"
      onChange={onChange}
    />
  );
}
