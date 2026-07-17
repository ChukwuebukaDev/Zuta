import CarValuator from '@/components/valuation/CarValuator';

export default function ValuationPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-slate-100 p-4 lg:p-8 max-w-2xl mx-auto pt-24 space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase italic tracking-tight text-white">
          Zuta Valuation Engine
        </h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-black mt-1">
          Instant market price estimation tailored to local trade patterns in Nigeria
        </p>
      </div>

      <CarValuator />
    </main>
  );
}