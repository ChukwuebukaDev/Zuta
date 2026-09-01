import Link from "next/link";
import {
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { BodyType } from "@prisma/client";
//import SpecLookupWidget from "./SpecLookupWidget";
import CarQueryPreview from "@/components/ui/Home/CarQueryPreview";


export default function HomePage() {
  // Editorial data for the dynamic fuel efficiency highlight block
  const fuelEfficientCars = [
    {
      brand: "Toyota",
      model: "Camry Hybrid",
      efficiency: "4.5L / 100km",
      type: "Hybrid",
      note: "Best-selling midsize efficiency king",
    },
    {
      brand: "Lexus",
      model: "RX 450h",
      efficiency: "6.1L / 100km",
      type: "Hybrid SUV",
      note: "Luxury space mixed with stellar consumption",
    },
    {
      brand: "Honda",
      model: "Civic i-DTEC",
      efficiency: "4.1L / 100km",
      type: "Diesel",
      note: "Incredible highway range efficiency",
    },
    {
      brand: "Hyundai",
      model: "Elantra Eco",
      efficiency: "5.2L / 100km",
      type: "Petrol Eco",
      note: "Low maintenance budget option",
    },
  ];

 const automobileTypes: {
  title: string;
  description: string;
  query: BodyType;
  count: string;
}[] = [
  {
    title: "SUVs",
    description:
      "High ground clearance, maximum commanding view, and family space.",
    query: BodyType.SUV,
    count: "140+ Listed",
  },
  {
    title: "Sedans",
    description:
      "Traditional executive comfort, isolated luggage trunk, and sleek economy.",
    query: BodyType.SEDAN,
    count: "98+ Listed",
  },
  {
    title: "Coupes",
    description:
      "Aggressive two-door sloping lines, focused dynamics, and performance styling.",
    query: BodyType.COUPE,
    count: "45+ Listed",
  },
  {
    title: "Hatchbacks",
    description:
      "Compact parking dimensions with folding rear capacity for urban agility.",
    query: BodyType.HATCHBACK,
    count: "62+ Listed",
  },
  {
    title: "Trucks",
    description:
      "Rugged performance with powerful 4wheel drive capacity for offroads.",
    query: BodyType.TRUCK,
    count: "82+ Listed",
  },
];

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-black selection:text-white antialiased">
      {/* 1. HERO BRANDING LAYER */}
      <header className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-800">
            <Sparkles size={12} className="text-amber-500 fill-amber-500" />{" "}
            Introducing Zuta Smart Marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-black">
              Perfect Drive.
            </span>
          </h1>
          <p className="text-slate-500 max-w-lg text-sm md:text-base leading-relaxed">
            Verify luxury credentials, review dealership inventory, or locate
            private vehicle listings across Nigeria safely with zero listing
            friction.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/cars"
              className="h-14 px-8 rounded-xl bg-black text-white text-sm font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/10"
            >
              Explore Showroom <ArrowRight size={16} />
            </Link>
            <Link
              href="/valuation"
              className="h-14 px-8 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-bold flex items-center justify-center hover:bg-slate-50 transition-all"
            >
              Check Vehicle Value
            </Link>
          </div>
        </div>

        {/* Hero Banner Feature */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full translate-x-10 translate-y-10" />
          <div className="relative rounded-[2.5rem] border border-slate-100 bg-slate-50 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.04)] p-2">
            <img
              src="https://media.istockphoto.com/id/1167991014/photo/modern-blue-sports-car-in-a-gentle-light-on-black-background.jpg?s=612x612&w=0&k=20&c=szCbC--4de-XfIzSy9Q6vUTknUP9Are6SRRbBo74d0o="
              alt="Premium Sports Car Display"
              className="rounded-[2rem] object-cover w-full h-[380px]"
            />
          </div>
        </div>
      </header>
      {/* <div className="max-w-7xl mx-auto px-4 mt-16">
        <SpecLookupWidget />
      </div> */}
      {/* 2. AUTOMOBILE SEGMENTS EXPLORER SECTION */}
      <section className="bg-slate-50/50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black uppercase italic tracking-tight">
              Browse by Silhouette
            </h2>
            <p className="text-slate-500 text-sm">
              Select a body configuration directly to explore specialized
              filtered matches.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{automobileTypes.map((type) => (
  <CarQueryPreview
  key={type.title}
  title={type.title}
  description={type.description}
  bodyType={type.query}
>
    <div
      className="
        group
        p-8
        rounded-3xl
        bg-white
        border
        border-slate-200/60
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        flex
        flex-col
        justify-between
        h-60
        cursor-pointer
      "
    >
      <div className="space-y-3">
        <span
          className="
            text-[10px]
            font-black
            tracking-widest
            text-blue-600
            bg-blue-50
            px-2.5
            py-1
            rounded-md
            uppercase
          "
        >
          {type.count}
        </span>

        <h3
          className="
            text-xl
            font-bold
            text-slate-900
            group-hover:text-blue-600
            transition-colors
          "
        >
          {type.title}
        </h3>

        <p
          className="
            text-xs
            text-slate-400
            leading-relaxed
          "
        >
          {type.description}
        </p>
      </div>

      <div
        className="
          pt-4
          flex
          items-center
          justify-between
          text-xs
          font-bold
          text-slate-800
          border-t
          border-slate-50
          mt-4
          group-hover:text-blue-600
          transition-colors
        "
      >
        Explore Classification

        <ArrowRight
          size={14}
          className="
            transform
            group-hover:translate-x-1
            transition-transform
          "
        />
      </div>
    </div>
  </CarQueryPreview>
))}
          </div>
        </div>
      </section>

      {/* 3. FUEL EFFICIENCY INTELLIGENCE INDEX */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 space-y-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Zap size={22} className="fill-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight leading-none">
              The Fuel <br />
              Efficiency Index
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              With rising energy expenses, running efficiency takes precedence.
              Here are the top-rated configurations on our marketplace optimized
              to minimize pump trips.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex gap-3 text-amber-800 text-xs leading-relaxed">
              <ShieldAlert size={20} className="shrink-0 text-amber-600" />
              <span>
                Metrics represent generalized highway averages; driving patterns
                and local traffic affect actual fuel range.
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="pb-4">Vehicle Model</th>
                    <th className="pb-4 text-center">Engine Type</th>
                    <th className="pb-4 text-right text-emerald-400">
                      Average Consumption
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {fuelEfficientCars.map((car, index) => (
                    <tr
                      key={index}
                      className="group hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 pr-4">
                        <p className="font-bold text-white">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-xs text-slate-500">{car.note}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-800 text-slate-300 border border-slate-700/30">
                          {car.type}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right font-mono font-bold text-emerald-400 text-base">
                        {car.efficiency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
              <Link
                href="/cars?sort=efficiency"
                className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2"
              >
                View All Fuel Efficient Listings <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
