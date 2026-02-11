import CarCard from "@/components/UI/Cards/CarCard";
import { useMarketplace } from "@/context/MarketplaceEngine";
export default function CarsList() {
  const { items } = useMarketplace();
  const cars = items.filter((item) => item.category === "cars");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} {...car} />
      ))}
    </div>
  );
}
