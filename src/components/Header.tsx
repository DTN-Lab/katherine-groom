import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-brand-lila text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl tracking-wide hover:opacity-90 transition-opacity">
          <PawPrint className="h-6 w-6" />
          <span>Katherine Groom</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-brand-turquoise transition-colors">Inicio</Link>
          <Link href="/servicios" className="hover:text-brand-turquoise transition-colors">Servicios</Link>
          <Link href="/razas/poodle" className="hover:text-brand-turquoise transition-colors">Poodle</Link>
          <Link href="/razas/bichon-frise" className="hover:text-brand-turquoise transition-colors">Bichón Frisé</Link>
          <Link
            href="/admin"
            className="text-white/60 hover:text-white/90 transition-colors text-xs border border-white/20 rounded-full px-3 py-1"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
