import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, PawPrint } from 'lucide-react';
import { getCatalog } from '@/lib/catalog';
import CutCard from '@/components/CutCard';

export default async function RazaPage(props: PageProps<'/razas/[slug]'>) {
  const { slug } = await props.params;
  const { breeds } = await getCatalog();
  const breed = breeds.find((b) => b.slug === slug);

  if (!breed) notFound();

  return (
    <div>
      {/* Hero de la raza */}
      <div className="relative h-72 md:h-96 w-full">
        <Image
          src={breed.image}
          alt={breed.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-4 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-brand-lila/80 backdrop-blur rounded-full p-2">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Cortes especiales para</p>
              <h1 className="text-4xl font-bold text-white">{breed.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Descripción */}
        <div className="bg-brand-lila-light rounded-2xl p-6 mb-10 max-w-3xl">
          <p className="text-muted-foreground leading-relaxed">{breed.description}</p>
          <p className="text-xs text-muted-foreground mt-3 italic">
            * Los precios son orientativos. El costo final depende del trabajo, estado del pelaje y extras elegidos.
          </p>
        </div>

        {/* Cortes */}
        <div className="mb-6">
          <p className="text-brand-lila text-sm font-semibold uppercase tracking-widest mb-1">Opciones disponibles</p>
          <h2 className="text-2xl font-bold text-foreground">Elegí tu corte</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {breed.cuts.map((cut) => (
            <CutCard key={cut.id} cut={cut} extras={breed.extras} />
          ))}
        </div>

        {/* Nota extras */}
        {breed.extras.length > 0 && (
          <div className="mt-8 bg-brand-turquoise/10 border border-brand-turquoise/20 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-foreground text-sm">Extras opcionales</p>
              <p className="text-muted-foreground text-sm mt-1">
                Podés agregar opciones como <strong>motas</strong> desde cada tarjeta de corte. El precio se actualiza automáticamente.
              </p>
            </div>
          </div>
        )}

        {/* Otras razas */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Ver también:</p>
          <div className="flex gap-3">
            {breeds.filter((b) => b.slug !== slug).map((b) => (
              <Link
                key={b.id}
                href={`/razas/${b.slug}`}
                className="flex items-center gap-2 bg-white border border-border rounded-full px-4 py-2 text-sm font-medium text-foreground hover:border-brand-lila hover:text-brand-lila transition-colors"
              >
                <PawPrint className="h-3.5 w-3.5" />
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
