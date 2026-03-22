"use client";
import { useState } from "react";
import Link from "next/link";
import NavList from "./NavList";
import { AuthButtons } from "./User";

export default function MarketplaceHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-3xl text-black">
          Zuta
        </Link>

        {/* Desktop Navigation  */}
        <NavList variant="desktop" />

        <AuthButtons />

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
        className={`md:hidden fixed right-0 overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <NavList variant="mobile" setIsMenuOpen={setIsMenuOpen} />
      </div>
    </header>
  );
}
