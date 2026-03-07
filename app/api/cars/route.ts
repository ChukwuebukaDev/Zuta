import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Save the car listing
    const car = await prisma.car.create({
      data: {
        title: `${data.brand} ${data.model}`,
        brand: data.brand,
        model: data.model,
        year: Number(data.year),
        mileage: data.mileage ? Number(data.mileage) : undefined,
        transmission: data.transmission,
        fuelType: data.fuelType,
        price: Number(data.price),
        description: data.description || "",
        sellerName: data.sellerName,
        sellerPhone: data.sellerPhone,
        sellerEmail: data.sellerEmail || null,
      },
    });

    return new Response(JSON.stringify(car), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create car" }), {
      status: 500,
    });
  }
}
