"use client";

import { Country, State, City } from "country-state-city";
import { MapPin, Globe, Landmark } from "lucide-react";

type Props = {
  city: string;
  state: string;
  country: string;
  onChange: (field: "city" | "state" | "country", value: string) => void;
};

export default function SellerSection({ city, state, country, onChange }: Props) {
  // 1. Get all countries
  const allCountries = Country.getAllCountries();

  // 2. Find selected country object to get its ISO code for state lookup
  const selectedCountry = allCountries.find((c) => c.name === country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];

  // 3. Find selected state object to get its ISO code for city lookup
  const selectedState = states.find((s) => s.name === state);
  const cities = (selectedCountry && selectedState) 
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) 
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4 text-blue-500">
        <MapPin size={18} />
        <span className="text-sm font-bold uppercase tracking-widest">Showroom Location</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Country Selector */}
        <div className="relative group">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={18} />
          <select
            value={country || ""}
            onChange={(e) => {
              onChange("country", e.target.value);
              onChange("state", "");
              onChange("city", "");
            }}
            className="w-full p-4 pl-12 rounded-xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white appearance-none cursor-pointer"
            required
          >
            <option value="" disabled>Select Country</option>
            {allCountries.map((c) => (
              <option key={c.isoCode} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* State Selector */}
        <div className="relative group">
          <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={18} />
          <select
            value={state || ""}
            disabled={!country}
            onChange={(e) => {
              onChange("state", e.target.value);
              onChange("city", "");
            }}
            className="w-full p-4 pl-12 rounded-xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white appearance-none cursor-pointer disabled:opacity-20"
            required
          >
            <option value="" disabled>Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* City Selector */}
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={18} />
          <select
            value={city || ""}
            disabled={!state}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-full p-4 pl-12 rounded-xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white appearance-none cursor-pointer disabled:opacity-20"
            required
          >
            <option value="" disabled>Select City/Area</option>
            {cities.map((ci) => (
              <option key={ci.name} value={ci.name}>{ci.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}