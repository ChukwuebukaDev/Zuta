import BrandSelect from "@/components/UI/Filter/cars/BrandSelect";
import ModelSelect from "@/components/UI/Filter/cars/ModelSelect";
import Dropdown from "@/utilities/Dropdown";
type Props = {
  brand: string;
  model: string;
  year: number;
  onChange: (field: "brand" | "model" | "year", value: string) => void;
};

export default function VehicleIdentity({
  brand,
  model,
  year,
  onChange,
}: Props) {
  const handleBrandChange = (value: string) => {
    onChange("brand", value);
    onChange("model", "");
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1990 + 1 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <BrandSelect value={brand} onChange={handleBrandChange} />

      <ModelSelect
        brand={brand}
        value={model}
        onChange={(value) => onChange("model", value)}
      />

      <Dropdown
        options={years.map(String)}
        value={year}
        placeholder="Select Year"
        onChange={(val) => onChange("year", val)}
      />
    </div>
  );
}
