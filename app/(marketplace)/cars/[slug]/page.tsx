import { getCarBySlug } from "@/lib/engine/marketplace";
import { notFound } from "next/navigation";
import CarDetailsView from "@/components/sell//cars/CarDetailsView";

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function CarDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const car = await getCarBySlug(resolvedParams.slug);

  if (!car) {
    notFound();
  }

  return <CarDetailsView car={car} />;
}