"use client";

import { MapPin, Globe, Landmark } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  city: string;
  state: string;
  country: string;
  onChange: (field: "city" | "state" | "country", value: string) => void;
};

export default function SellerSection({ city, state, country, onChange }: Props) {
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // 1. Fetch all countries on component mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/states");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const json = await response.json();
        
        
        const countryNames = json.data.map((c: { name: string }) => c.name);
        setAllCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!country) {
      setTimeout(()=>setStates([]),0)
      return;
    }

    async function fetchStates() {
      try {
        setIsLoadingStates(true);
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        });

        if (!response.ok) throw new Error("Failed to fetch states");
        const json = await response.json();
        
        const stateNames = json.data?.states?.map((s: { name: string }) => s.name) || [];
        setStates(stateNames);
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      } finally {
        setIsLoadingStates(false);
      }
    }

    fetchStates();
  }, [country]);

  useEffect(() => {
    if (!state || !country) {
      setTimeout(()=>setCities([]),0)
      
      return;
    }

    async function fetchCities() {
      try {
        setIsLoadingCities(true);
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country, state }),
        });

        if (!response.ok) throw new Error("Failed to fetch cities");
        const json = await response.json();
        setCities(json.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      } finally {
        setIsLoadingCities(false);
      }
    }

    fetchCities();
  }, [state, country]);

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
              <option key={c.iso3} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* State Selector */}
        <div className="relative group">
          <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={18} />
          <select
            value={state || ""}
            disabled={!country || isLoadingStates}
            onChange={(e) => {
              onChange("state", e.target.value);
              onChange("city", "");
            }}
            className="w-full p-4 pl-12 rounded-xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white appearance-none cursor-pointer disabled:opacity-20"
            required
          >
            <option value="" disabled>
              {isLoadingStates ? "Loading States..." : "Select State"}
            </option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* City Selector */}
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={18} />
          <select
            value={city || ""}
            disabled={!state || isLoadingCities}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-full p-4 pl-12 rounded-xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white appearance-none cursor-pointer disabled:opacity-20"
            required
          >
            <option value="" disabled>
              {isLoadingCities ? "Loading Cities..." : "Select City/Area"}
            </option>
            {cities.map((ci) => (
              <option key={ci} value={ci}>{ci}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}