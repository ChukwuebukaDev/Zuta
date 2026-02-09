import Link from "next/link";
import SuspenseWrapper from "@/components/UI/Wrapper/SuspenseWrapper";

export default function PartsPage() {
  return (
    <section className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Buy Parts In Nigeria</h1>
          <p className="text-gray-600">Explore Parts from trusted sellers</p>
        </div>

        <SuspenseWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </SuspenseWrapper>
      </div>
    </section>
  );
}
