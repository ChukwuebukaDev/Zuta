export type PartCondition = "new" | "used" | "refurbished";

export type Part = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  compatibleCars: string[]; // List of car brands/models it fits
  category: string; // engine, suspension, tires, etc.
  condition: PartCondition;
  price: number;
  currency: string;
  negotiable: boolean;
  images: string[];
  thumbnail: string;
  sellerId: string;
  status: "available" | "sold";
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
};
