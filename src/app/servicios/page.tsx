import { Suspense } from 'react';
import { getCatalog } from '@/lib/catalog';
import ServiceCard from '@/components/ServiceCard';
import CoatFilter from '@/components/CoatFilter';
import type { CoatType } from '@/lib/types';

const COAT_LABELS: Record<CoatType, string> = {
  short: 'Pelo Corto',
  medium: 'Pelo Mediano',
  long: 'Pelo Largo',
  curly: 'Rizado/Lana',
};

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ pelo?: string }>;
}) {
  const { pelo } = await searchParams;
  const { services } = await getCatalog();

  const filtered = services.filter((s) => {
    if (!s.active) return false;
    if (!pelo || pelo === 'all') return true;
    return s.coatTypes.includes(pelo as CoatType);
  });

  const title = pelo && pelo !== 'all' && COAT_LABELS[pelo as CoatType]
    ? `Servicios para ${COAT_LABELS[pelo as CoatType]}`
    : 'Todos los Servicios';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-brand-lila text-sm font-semibold uppercase tracking-widest mb-1">Catálogo</p>
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-2">Precios orientativos · El costo final depende del trabajo realizado</p>
      </div>

      <Suspense>
        <CoatFilter />
      </Suspense>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted-foreground">
            No hay servicios disponibles para este tipo de pelaje.
          </div>
        )}
      </div>
    </div>
  );
}
