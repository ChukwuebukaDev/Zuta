"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-3xl text-black">
          Zuta
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link className="hover:underline" href="/Cars">
            Cars
          </Link>
          <Link className="hover:underline" href="/Parts">
            Parts
          </Link>
          <Link className="hover:underline" href="/Accessories">
            Accessories
          </Link>
          <Link className="hover:underline" href="/Services & Repairs">
            Services & Repairs
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-around w-8 h-8 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-full h-1 rounded bg-black transition-all duration-500 ${isMenuOpen ? "rotate-45 translate-y-2.5" : ""}`}
          />
          <span
            className={`w-full h-1 rounded bg-black transition-all duration-500 ${isMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`w-full h-1 rounded bg-black transition-all duration-500 ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="bg-gray-100 rounded-b-2xl">
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link className="hover:underline" href="/Cars">
                Cars
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/Parts">
                Parts
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/Accessories">
                Accessories
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/Services & Repairs">
                Services & Repairs
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
