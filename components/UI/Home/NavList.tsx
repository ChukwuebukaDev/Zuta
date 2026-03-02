"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface NavListProps {
  variant: "desktop" | "mobile";
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavList({ variant, setIsMenuOpen }: NavListProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const links = [
    {
      name: "Cars",
      link: "/cars",
      sub: [
        { name: "Saved Cars", link: "/saved-cars" }, // 👈 moved here
        { name: "SUV", link: "/cars?type=suv" },
        { name: "Sedan", link: "/cars?type=sedan" },
        { name: "Truck", link: "/cars?type=truck" },
        { name: "Electric", link: "/cars?fuel=electric" },
      ],
    },
    {
      name: "Parts",
      link: "/parts",
      sub: [
        { name: "Engine", link: "/parts?category=engine" },
        { name: "Tyres", link: "/parts?category=tyres" },
        { name: "Batteries", link: "/parts?category=battery" },
      ],
    },
    {
      name: "Accessories",
      link: "/accessories",
      sub: [
        { name: "Interior", link: "/accessories?type=interior" },
        { name: "Exterior", link: "/accessories?type=exterior" },
      ],
    },
    {
      name: "Services & Repairs",
      link: "/services-repairs",
      sub: [
        { name: "Mechanics", link: "/services-repairs?type=mechanic" },
        { name: "Car Wash", link: "/services-repairs?type=carwash" },
      ],
    },
  ];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  /* ===================== DESKTOP ===================== */
  if (variant === "desktop") {
    return (
      <nav className="hidden md:flex items-center gap-8">
        {links.map((li) => (
          <div key={li.name} className="relative">
            <div className="flex items-center gap-1">
              <Link
                href={li.link}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                {li.name}
              </Link>

              <button
                onClick={() => toggleDropdown(li.name)}
                className="p-1"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    openDropdown === li.name ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {openDropdown === li.name && (
              <div className="absolute left-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                {li.sub.map((subItem) => (
                  <Link
                    key={subItem.link}
                    href={subItem.link}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
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
    <nav className="md:hidden bg-white border-t border-gray-100 shadow-lg">
      <ul className="flex flex-col p-6 space-y-4">
        {links.map((li) => (
          <li key={li.name}>
            <div className="flex items-center justify-between">
              <Link
                href={li.link}
                onClick={() => setIsMenuOpen?.(false)}
                className="text-base font-medium text-gray-700 hover:text-black transition-colors"
              >
                {li.name}
              </Link>

              <button onClick={() => toggleDropdown(li.name)}>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    openDropdown === li.name ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Mobile Dropdown */}
            {openDropdown === li.name && (
              <ul className="mt-2 ml-4 space-y-2 border-l border-gray-200 pl-4">
                {li.sub.map((subItem) => (
                  <li key={subItem.link}>
                    <Link
                      href={subItem.link}
                      onClick={() => setIsMenuOpen?.(false)}
                      className="block text-sm text-gray-600 hover:text-black transition-colors"
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