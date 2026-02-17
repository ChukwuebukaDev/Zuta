"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
        {/* Logo & Description */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-2xl font-bold">Zuta</h2>
          <p className="text-gray-400 max-w-sm transition-colors duration-500">
            The smartest car marketplace. Buy, sell, and discover cars
            effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-semibold text-lg">Quick Links</h3>
          <nav className="flex flex-col space-y-2">
            <Link
              href="/cars"
              className="hover:underline text-gray-300 transition-colors duration-300"
            >
              Cars
            </Link>
            <Link
              href="/parts"
              className="hover:underline text-gray-300 transition-colors duration-300"
            >
              Parts
            </Link>
            <Link
              href="/accessories"
              className="hover:underline text-gray-300 transition-colors duration-300"
            >
              Accessories
            </Link>
            <Link
              href="/services_repairs"
              className="hover:underline text-gray-300 transition-colors duration-300"
            >
              Services & Repairs
            </Link>
          </nav>
        </div>

        {/* Social Links */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-semibold text-lg">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-blue-500 transition transform hover:scale-110 duration-300"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-blue-400 transition transform hover:scale-110 duration-300"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-pink-500 transition transform hover:scale-110 duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-blue-600 transition transform hover:scale-110 duration-300"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm transition-colors duration-500">
        &copy; {new Date().getFullYear()} Zuta Marketplace. All rights reserved.
      </div>
    </footer>
  );
}
