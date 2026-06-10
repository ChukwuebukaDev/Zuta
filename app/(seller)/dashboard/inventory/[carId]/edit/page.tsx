import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditCarForm from "@/components/dashboard/EditCarForm";

interface EditCarPageProps {
  params: Promise<{ carId: string }> | { carId: string };
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const resolvedParams = await params;
  const { carId } = resolvedParams;

  // Fetch the car and confirm the logged-in user is the true uploader
  const car = await prisma.car.findUnique({
    where: { id: carId },
  });

  if (!car) notFound();
  
  // Guard clause: Block unauthorized edits
  if (car.userId !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-zinc-950 min-h-screen text-slate-100 rounded-3xl border border-slate-900">
      <div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Modify <span className="text-blue-600">Listing</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Updating critical fields like price or status might require a re-review by Zuta admins.
        </p>
      </div>

      <EditCarForm car={car} />
    </div>
  );
}