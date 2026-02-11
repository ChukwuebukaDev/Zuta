export type FilterField =
  | {
      type: "text";
      name: string;
      label: string;
      placeholder?: string;
    }
  | {
      type: "number";
      name: string;
      label: string;
      placeholder?: string;
    }
  | {
      type: "select";
      name: string;
      label: string;
      options: { label: string; value: string }[];
    };
