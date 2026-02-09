import { getItemsByCategory } from "@/lib/marketplace-engine";
import CarCard from "@/components/UI/Cards/CarCard";
export default async function CarsList() {
  const cars = await getItemsByCategory("cars");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} {...car} />
      ))}
    </div>
  );
}
