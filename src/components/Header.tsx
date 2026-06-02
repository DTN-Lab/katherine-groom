'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PawPrint, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/razas/poodle', label: 'Poodle' },
  { href: '/razas/bichon-frise', label: 'Bichón Frisé' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-lila text-white shadow-md relative z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-xl tracking-wide hover:opacity-90 transition-opacity shrink-0"
          onClick={() => setOpen(false)}
        >
          <PawPrint className="h-6 w-6" />
          <span>Katherine Groom</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-turquoise transition-colors">
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="text-white/60 hover:text-white/90 transition-colors text-xs border border-white/20 rounded-full px-3 py-1"
          >
            Admin
          </Link>
        </nav>

        {/* Mobile: Admin link + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/admin"
            className="text-white/60 hover:text-white/90 transition-colors text-xs border border-white/20 rounded-full px-3 py-1"
            onClick={() => setOpen(false)}
          >
            Admin
          </Link>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav className="md:hidden absolute top-16 left-0 right-0 bg-brand-lila-dark border-t border-white/10 shadow-xl">
          <div className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm font-medium border-b border-white/10 last:border-0 hover:text-brand-turquoise transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
