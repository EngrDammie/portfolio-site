'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering icon after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-900/60 border border-slate-800" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative p-2 rounded-xl bg-slate-900/60 dark:bg-slate-900 border border-slate-700/60 dark:border-slate-800 text-slate-300 dark:text-slate-300 hover:text-white dark:hover:text-emerald-400 transition-all duration-300 cursor-pointer active:scale-90 shadow-sm"
      aria-label="Toggle Dark and Light Mode"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      <div className="relative w-4 h-4">
        {/* Sun Icon (Rotates and scales smoothly) */}
        <Sun
          className={`w-4 h-4 absolute inset-0 text-amber-400 transition-all duration-300 ${
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />

        {/* Moon Icon (Rotates and scales smoothly) */}
        <Moon
          className={`w-4 h-4 absolute inset-0 text-cyan-400 transition-all duration-300 ${
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
}