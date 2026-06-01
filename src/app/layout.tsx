import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Katherine Groom — Peluquería Canina',
  description: 'Catálogo de servicios de peluquería canina profesional. Baños, grooming y cortes especiales para Poodle y Bichón Frisé.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-brand-lila-dark text-white/80 py-6 text-center text-sm">
          <p>© 2024 Katherine Groom · Peluquería Canina Profesional</p>
        </footer>
      </body>
    </html>
  );
}
