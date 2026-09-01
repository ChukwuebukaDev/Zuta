"use client";

import { BodyType } from "@prisma/client";
import { QueryPreviewDialog } from "@/components/ui/Home/queryPreviewDialog";
import CarCard from "@/components/ui/card/CarCard";
import { Car } from "@/types/car/cars.types";

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
  bodyType: BodyType;
};

export default function CarQueryPreview({
  children,
  title,
  description,
  bodyType,
}: Props) {
  return (
    <QueryPreviewDialog<Car>
      title={title}
      description={description}
    query={async () => {
  const response = await fetch(
    `/api/cars/preview?bodyType=${encodeURIComponent(bodyType)}`
  );

  if (!response.ok) {
    console.log('error',await response.json())
    throw new Error("Failed to load car listings");
  }

  const cars: Car[] = await response.json();

  return cars;
}}
      getKey={(car) => car.id}
      renderItem={(car) => <CarCard cars={[car]} />}
    >
      {children}
    </QueryPreviewDialog>
  );
}