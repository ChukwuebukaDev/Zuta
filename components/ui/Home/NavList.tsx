"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

interface NavListProps {
  variant: "desktop" | "mobile";
  setIsMenuOpen?: (val: boolean) => void;
}

export default function NavList({ variant, setIsMenuOpen }: NavListProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const links = [
    { name: "Home", link: "/home" },
    { name: "Cars", link: "/cars", isMega: true },
    { name: "About", link: "/about" },
  ];

  // Helper to check if link or child query is active
  const isActive = (path: string) => {
    if (path === "/home" && (pathname === "/home" || pathname === "/")) return true;
    return pathname.startsWith(path) && path !== "/home";
  };

  if (variant === "desktop") {
    return (
      <nav className="flex items-center gap-6">
        {links.map((li) => {
          const active = isActive(li.link);

          return (
            <div
              key={li.name}
              className="relative py-4"
              onMouseEnter={() => setOpenDropdown(li.name)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={li.link}
                className={`flex items-center gap-1 group text-[14px] font-medium transition-colors ${
                  active
                    ? "text-amber-400 font-bold"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <span>{li.name}</span>
                {li.isMega && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      active ? "text-amber-400" : "text-gray-400 group-hover:text-black"
                    } ${openDropdown === li.name ? "rotate-180" : ""}`}
                  />
                )}
              </Link>


              {/* Desktop Mega Menu for "Cars" */}
              {openDropdown === li.name && li.isMega && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 z-50">
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Condition
                    </h4>
                    <ul className="space-y-3">
                      <li>
                        <Link
                          href="/cars?c=new"
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          New Cars
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/cars?c=used"
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          Foreign Used
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Body Type
                    </h4>
                    <ul className="space-y-3">
                      <li>
                        <Link
                          href="/cars?t=suv"
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          SUV
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/cars?t=sedan"
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          Sedan
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 flex flex-col justify-center">
                    <p className="text-xs text-gray-500 mb-2">Configure filters natively</p>
                    <Link
                      href="/cars"
                      className="text-sm font-bold flex items-center gap-2 text-black hover:text-blue-600 transition-colors"
                    >
                      Go to Showroom <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }

  // ==========================================
  // 📱 MOBILE LAYOUT VARIANT
  // ==========================================
  return (
    <nav className="w-full">
      <ul className="space-y-1">
        {links.map((li) => {
          const hasChildren = !!li.isMega;
          const active = isActive(li.link);

          return (
            <li key={li.name} className="border-b border-gray-50 last:border-0">
              <div className="flex items-center justify-between w-full py-4">
                <Link
                  href={li.link}
                  onClick={() => setIsMenuOpen?.(false)}
                  className={`text-lg font-medium flex-1 transition-colors ${
                    active ? "text-blue-600 font-bold" : "text-gray-800"
                  }`}
                >
                  {li.name}
                </Link>

                {hasChildren && (
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === li.name ? null : li.name)
                    }
                    className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
                  >
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openDropdown === li.name ? "rotate-180 text-black" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {hasChildren && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openDropdown === li.name
                      ? "max-h-96 opacity-100 mb-4"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <li>
                      <Link
                        href="/cars?c=new"
                        onClick={() => setIsMenuOpen?.(false)}
                        className="text-sm font-medium text-gray-600 block py-1 hover:text-blue-600 transition-colors"
                      >
                        New Cars
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/cars?c=used"
                        onClick={() => setIsMenuOpen?.(false)}
                        className="text-sm font-medium text-gray-600 block py-1 hover:text-blue-600 transition-colors"
                      >
                        Used Cars
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}