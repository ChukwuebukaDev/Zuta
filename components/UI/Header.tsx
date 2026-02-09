"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    { name: "Cars", link: "/cars" },
    { name: "Parts", link: "/parts" },
    { name: "Accessories", link: "/accessories" },
    { name: "Services & Repairs", link: "/services&repairs" },
  ];
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-3xl text-black">
          Zuta
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {links.map((li, i) => (
            <Link
              key={i}
              className="hover:bg-gray-600 hover:p-1 hover:rounded hover:text-white transition-all duration-700"
              href={li.link}
            >
              {li.name}
            </Link>
          ))}
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
              <Link className="hover:underline" href="/cars">
                Cars
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/parts">
                Parts
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/accessories">
                Accessories
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/services-repairs">
                Services & Repairs
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
