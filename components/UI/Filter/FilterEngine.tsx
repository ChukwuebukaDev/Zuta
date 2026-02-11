"use client";

import { useState } from "react";
import { FilterField } from "@/types/filter-types";
interface FilterEngineProps {
  fields: FilterField[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export default function FilterEngine({
  fields,
  onFilterChange,
}: FilterEngineProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };

    setFilters(updated);
    onFilterChange(updated);
  }

  return (
    <aside className="bg-white p-6 rounded-2xl shadow-md space-y-6 w-full md:w-64">
      <h2 className="text-xl font-semibold">Filters</h2>

      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium mb-1">
            {field.label}
          </label>

          {field.type === "select" ? (
            <select
              name={field.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">All</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}
        </div>
      ))}
    </aside>
  );
}
