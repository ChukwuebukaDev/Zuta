"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

interface NavListProps {
  variant: "desktop" | "mobile";
  setIsMenuOpen?: (val: boolean) => void;
}

export default function NavList({ variant, setIsMenuOpen }: NavListProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const links = [
    { name: "Home", link: "/" },
    { name: "Cars", isMega: true },
    {
      name: "Parts",
      sub: [
        { name: "Engine", link: "/parts?category=engine" },
        { name: "Tyres", link: "/parts?category=tyres" },
        { name: "Batteries", link: "/parts?category=battery" },
      ],
    },
    {
      name: "Services",
      sub: [
        { name: "Mechanics", link: "/services?type=mechanic" },
        { name: "Car Wash", link: "/services?type=carwash" },
      ],
    },
  ];

  if (variant === "desktop") {
    return (
      <nav className="flex items-center gap-6">
        {links.map((li) => (
          <div
            key={li.name}
            className="relative py-4"
            onMouseEnter={() => setOpenDropdown(li.name)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <div className="flex items-center gap-1 cursor-pointer group">
              <span className="text-[14px] font-medium text-gray-600 group-hover:text-black transition-colors">
                {li.name}
              </span>
              {(li.sub || li.isMega) && <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === li.name ? "rotate-180" : ""}`} />}
            </div>

            {/* Desktop Mega Menu for "Cars" */}
            {openDropdown === li.name && li.isMega && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2">
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Condition</h4>
                  <ul className="space-y-3">
                    <li><Link href="/cars?c=new" className="text-sm hover:text-blue-600">New Cars</Link></li>
                    <li><Link href="/cars?c=used" className="text-sm hover:text-blue-600">Foreign Used</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Body Type</h4>
                  <ul className="space-y-3">
                    <li><Link href="/cars?t=suv" className="text-sm hover:text-blue-600">SUV</Link></li>
                    <li><Link href="/cars?t=sedan" className="text-sm hover:text-blue-600">Sedan</Link></li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">Can't find it?</p>
                  <Link href="/cars" className="text-sm font-bold flex items-center gap-2">View All <ArrowRight size={14}/></Link>
                </div>
              </div>
            )}

            {/* Standard Dropdown */}
            {openDropdown === li.name && li.sub && (
              <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-1">
                {li.sub.map(s => (
                  <Link key={s.link} href={s.link} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black">
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className="w-full">
      <ul className="space-y-1">
        {links.map((li) => (
          <li key={li.name} className="border-b border-gray-50 last:border-0">
            <button
              onClick={() => setOpenDropdown(openDropdown === li.name ? null : li.name)}
              className="flex items-center justify-between w-full py-4 text-lg font-medium text-gray-800"
            >
              {li.name}
              {(li.sub || li.isMega) && <ChevronDown className={`transition-transform duration-300 ${openDropdown === li.name ? "rotate-180" : ""}`} />}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${openDropdown === li.name ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
              <ul className="bg-gray-50 rounded-xl p-4 space-y-3">
                {li.isMega ? (
                   <>
                     <li><Link href="/cars?c=new" onClick={() => setIsMenuOpen?.(false)}>New Cars</Link></li>
                     <li><Link href="/cars?c=used" onClick={() => setIsMenuOpen?.(false)}>Used Cars</Link></li>
                   </>
                ) : li.sub?.map(s => (
                  <li key={s.link}><Link href={s.link} onClick={() => setIsMenuOpen?.(false)} className="text-gray-600">{s.name}</Link></li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}