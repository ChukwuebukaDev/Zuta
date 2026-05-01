"use client";

import Link from "next/link";
import { useState, useEffect,useRef } from "react";
import { ChevronDown } from "lucide-react";

interface NavListProps {
  variant: "desktop" | "mobile";
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavList({ variant, setIsMenuOpen }: NavListProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
const menuRef = useRef<HTMLDivElement | null>(null);
  const links = [
    {
      name: "Home",
    },
    {
      name: "Cars",
    },
    {
      name: "Parts",
      sub: [
        { name: "Engine", link: "/parts?category=engine" },
        { name: "Tyres", link: "/parts?category=tyres" },
        { name: "Batteries", link: "/parts?category=battery" },
      ],
    },
    {
      name: "Accessories",
      sub: [
        { name: "Interior", link: "/accessories?type=interior" },
        { name: "Exterior", link: "/accessories?type=exterior" },
      ],
    },
    {
      name: "Services & Repairs",
      sub: [
        { name: "Mechanics", link: "/services-repairs?type=mechanic" },
        { name: "Car Wash", link: "/services-repairs?type=carwash" },
      ],
    },
  ];

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpenDropdown(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

if (variant === "desktop") {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {links.map((li) => (
        <div
          key={li.name}
          className="relative"
          onMouseEnter={() => setOpenDropdown(li.name)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {/* Parent (hover trigger only) */}
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-sm font-medium text-gray-700 hover:text-black">
              {li.name}
            </span>

            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                openDropdown === li.name ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* ===================== CARS MEGA MENU ===================== */}
          {openDropdown === li.name && li.name === "Cars" && (
            <div className="absolute left-0 mt-0 w-100 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50">
              <div className="grid grid-cols-3 gap-6">
                
                {/* Condition */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
                    Condition
                  </p>
                  <div className="space-y-2">
                    <Link href="/cars?condition=NEW" className="block text-sm hover:text-black">
                      New Cars
                    </Link>
                    <Link href="/cars?condition=USED" className="block text-sm hover:text-black">
                      Foreign Used
                    </Link>
                    <Link href="/cars?condition=USED" className="block text-sm hover:text-black">
                      Nigerian Used
                    </Link>
                  </div>
                </div>

                {/* Body Type */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
                    Body Type
                  </p>
                  <div className="space-y-2">
                    <Link href="/cars?type=suv" className="block text-sm hover:text-black">
                      SUV
                    </Link>
                    <Link href="/cars?type=sedan" className="block text-sm hover:text-black">
                      Sedan
                    </Link>
                    <Link href="/cars?type=truck" className="block text-sm hover:text-black">
                      Truck
                    </Link>
                  </div>
                </div>

                {/* Fuel */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
                    Fuel Type
                  </p>
                  <div className="space-y-2">
                    <Link href="/cars?fuel=ELECTRIC" className="block text-sm hover:text-black">
                      Electric
                    </Link>
                    <Link href="/cars?fuel=PETROL" className="block text-sm hover:text-black">
                      Petrol
                    </Link>
                    <Link href="/cars?fuel=HYBRID" className="block text-sm hover:text-black">
                      Hybrid
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                <Link href="/cars" className="text-sm font-medium text-blue-600 hover:underline">
                  View All Cars →
                </Link>

                <Link href="/saved-cars" className="text-sm text-gray-500 hover:text-black">
                  Saved Cars
                </Link>
              </div>
            </div>
          )}

          {/* ===================== NORMAL DROPDOWNS ===================== */}
          {openDropdown === li.name && li.name !== "Cars" && li.sub && (
            <div className="absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {li.sub.map((subItem) => (
                <Link
                  key={subItem.link}
                  href={subItem.link}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black"
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

  /* ===================== MOBILE ===================== */
  return (
    <nav ref={menuRef} className="md:hidden bg-white border-t border-gray-100 shadow-lg">
      <ul className="flex flex-col p-6 space-y-4">
        {links.map((li) => (
          <li key={li.name}>
            <div
              onClick={() => toggleDropdown(li.name)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-base font-medium text-gray-700">
                {li.name}
              </span>

              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  openDropdown === li.name ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Cars (mobile simplified) */}
            {openDropdown === li.name && li.name === "Cars" && (
              <ul className="mt-2 ml-4 space-y-2 border-l pl-4">
                <li><Link href="/cars?condition=NEW">New Cars</Link></li>
                <li><Link href="/cars?condition=USED">Foreign Used</Link></li>
                <li><Link href="/cars?type=suv">SUV</Link></li>
                <li><Link href="/cars?fuel=ELECTRIC">Electric</Link></li>
              </ul>
            )}

            {/* Others */}
            {openDropdown === li.name && li.sub && li.name !== "Cars" && (
              <ul className="mt-2 ml-4 space-y-2 border-l pl-4">
                {li.sub.map((subItem) => (
                  <li key={subItem.link}>
                    <Link
                      href={subItem.link}
                      onClick={() => setIsMenuOpen?.(false)}
                      className="block text-sm text-gray-600 hover:text-black"
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}