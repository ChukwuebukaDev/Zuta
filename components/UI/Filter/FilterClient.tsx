"use client";
import FilterEngine from "./FilterEngine";
import { FilterField } from "@/types/filter-types";
import { useState } from "react";
export default function FilterClient() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const carFilterFields: FilterField[] = [
    {
      type: "text",
      name: "search",
      label: "Search",
      placeholder: "Search brand or model",
    },
    {
      type: "number",
      name: "minPrice",
      label: "Min Price",
      placeholder: "0",
    },
    {
      type: "number",
      name: "maxPrice",
      label: "Max Price",
      placeholder: "10000000",
    },
    {
      type: "select",
      name: "condition",
      label: "Condition",
      options: [
        { label: "New", value: "new" },
        { label: "Used", value: "used" },
      ],
    },
  ];
  return <FilterEngine fields={carFilterFields} onFilterChange={setFilters} />;
}
