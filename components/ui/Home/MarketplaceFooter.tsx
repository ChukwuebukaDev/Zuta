"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

export default function MarketplaceFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white dark:bg-[#050505] border-t border-slate-200 dark:border-white/5 pt-20 pb-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Top Section: Brand & Newsletter --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-block">
               <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                Zuta<span className="text-blue-600">.</span>
              </h2>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed font-medium">
              The premium automotive ecosystem. Engineering a seamless experience for buying, selling, and maintaining high-performance vehicles.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={18} />} href="#" label="Instagram" />
              <SocialIcon icon={<Twitter size={18} />} href="#" label="Twitter" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" label="LinkedIn" />
              <SocialIcon icon={<Facebook size={18} />} href="#" label="Facebook" />
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            <FooterGroup title="Showroom">
              <FooterLink href="/cars">Inventory</FooterLink>
              <FooterLink href="/sell">Sell a Car</FooterLink>
              <FooterLink href="/parts">Genuine Parts</FooterLink>
              <FooterLink href="/accessories">Accessories</FooterLink>
            </FooterGroup>

            <FooterGroup title="Assistance">
              <FooterLink href="/services_repairs">Service & Repair</FooterLink>
              <FooterLink href="/verification">Zuta Verified</FooterLink>
              <FooterLink href="/pricing">Pricing Plans</FooterLink>
              <FooterLink href="/support">Concierge</FooterLink>
            </FooterGroup>

            <FooterGroup title="Company">
              <FooterLink href="/about">Our Story</FooterLink>
              <FooterLink href="/terms">Privacy Policy</FooterLink>
              <FooterLink href="/contact">Get in Touch</FooterLink>
            </FooterGroup>
          </div>
        </div>

        {/* --- Bottom Section: Legal & Copyright --- */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            &copy; {currentYear} Zuta Marketplace. Automotive Excellence.
          </p>
          
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors">
              Privacy Vault
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** --- Sub-components for Consistency --- */

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
        {title}
      </h3>
      <nav className="flex flex-col space-y-4">{children}</nav>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all duration-300"
    >
      <span>{children}</span>
      <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
    </Link>
  );
}

function SocialIcon({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
    >
      {icon}
    </a>
  );
}