import Image from 'next/image';
import Link from 'next/link';
import { PawPrint, ChevronRight, Scissors, Sparkles } from 'lucide-react';
import { getCatalog } from '@/lib/catalog';
import ServiceCard from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const { services, breeds } = await getCatalog();
  const featured = services.filter((s) => s.active).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-lila via-brand-lila to-brand-lila-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <div className="absolute top-10 left-10 text-[8rem]">🐾</div>
          <div className="absolute bottom-10 right-10 text-[6rem]">✂️</div>
          <div className="absolute top-1/2 right-1/4 text-[4rem]">🌸</div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium">
            <PawPrint className="h-4 w-4 text-brand-turquoise" />
            Peluquería Canina Profesional
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Katherine<br />
            <span className="text-brand-turquoise">Groom</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl leading-relaxed">
            Transformamos a tu peludo en la versión más linda de sí mismo.
            Cortes, baños y grooming con amor y técnica profesional.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Button render={<Link href="/servicios" />} nativeButton={false} size="lg" className="bg-white text-brand-lila hover:bg-white/90 font-semibold shadow-lg">
              Ver todos los servicios
            </Button>
            <Button render={<Link href="/razas/poodle" />} nativeButton={false} size="lg" className="bg-white text-brand-lila hover:bg-white/90 font-semibold shadow-lg">
              Cortes especiales
            </Button>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-lila text-sm font-semibold uppercase tracking-widest mb-1">Lo que ofrecemos</p>
            <h2 className="text-3xl font-bold text-foreground">Nuestros Servicios</h2>
          </div>
          <Link href="/servicios" className="flex items-center gap-1 text-sm text-brand-lila font-medium hover:gap-2 transition-all">
            Ver todos <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Cortes de raza */}
      <section className="bg-brand-lila-light py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-brand-lila text-sm font-semibold uppercase tracking-widest mb-1">Especialidad</p>
            <h2 className="text-3xl font-bold text-foreground">Cortes por Raza</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Corte Asiático, Peluche y Simple — cada uno con su propio estilo y precio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {breeds.map((breed) => (
              <Link key={breed.id} href={`/razas/${breed.slug}`} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={breed.image}
                    alt={breed.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold">{breed.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{breed.cuts.length} cortes disponibles</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {breed.cuts.map((cut) => (
                      <span key={cut.id} className="bg-white/20 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full">
                        {cut.name}
                      </span>
                    ))}
                    <Scissors className="h-4 w-4 text-brand-turquoise ml-auto" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner tinturación */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-brand-turquoise/20 to-brand-lila/20 border border-brand-lila/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-brand-lila/15 rounded-full p-4">
              <Sparkles className="h-7 w-7 text-brand-lila" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-foreground">✨ Tinturación disponible</h3>
              <p className="text-muted-foreground text-sm mt-1">Colores seguros para mascotas en orejitas, patas y cola.</p>
            </div>
          </div>
          <Button render={<Link href="/servicios" />} nativeButton={false} className="bg-brand-lila text-white hover:bg-brand-lila-dark shrink-0">
            Ver servicio
          </Button>
        </div>
      </section>
    </>
  );
}
