import SelectMenu from "@/utilities/SelectMenu";

interface CarConditionProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function CarCondition({ value, onChange }: CarConditionProps) {
  return (
    <SelectMenu
      options={["New", "Used", "Foreign Used", "Nigerian Used"]}
      value={value}
      placeholder="Condition"
      onChange={onChange}
    />
  );
}
