'use client';

import React, { useState } from 'react';
import { Video, Menu, X, Sparkles } from 'lucide-react';
import { BrandLogo } from './DOMonogram';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Name & DO Monogram */}
        <a href="#" className="flex items-center gap-3 group cursor-pointer">
          <BrandLogo className="w-10 h-10 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
              Dammie Optimus
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-1">
              Solutions
            </span>
          </div>
        </a>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <a href="#projects" className="hover:text-white transition-colors">
            Case Studies
          </a>
          <a href="#process" className="hover:text-white transition-colors">
            How I Work
          </a>
          <a href="#estimator" className="hover:text-white transition-colors flex items-center gap-1.5 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scope Estimator</span>
          </a>
        </nav>

        {/* Action Controls: Animated Theme Toggle + Google Meet */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Video className="w-4 h-4 text-slate-950" />
            <span>Book Google Meet</span>
          </a>
        </div>

        {/* Mobile Hamburger & Mobile Theme Toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-4 space-y-3">
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            Case Studies
          </a>
          <a
            href="#process"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            How I Work
          </a>
          <a
            href="#estimator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-emerald-400 hover:bg-slate-900 font-medium"
          >
            Scope Estimator
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md"
          >
            <Video className="w-4 h-4" />
            <span>Book Google Meet</span>
          </a>
        </div>
      )}
    </header>
  );
}