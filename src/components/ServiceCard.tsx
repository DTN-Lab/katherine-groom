import Image from 'next/image';
import { Clock, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Service } from '@/lib/types';

const LEVEL_LABELS: Record<Service['level'], string> = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  premium: 'Premium',
};

const LEVEL_COLORS: Record<Service['level'], string> = {
  basic:        'bg-secondary text-secondary-foreground border-transparent',
  intermediate: 'bg-brand-turquoise text-white border-transparent',
  premium:      'bg-brand-lila text-white border-transparent',
};

const SIZE_LABELS = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CL')}`;
}

export default function ServiceCard({ service }: { service: Service }) {
  const minPrice = Math.min(...Object.values(service.prices));

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 border-border">
      <div className="relative h-48 w-full">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge className={`text-xs font-medium border ${LEVEL_COLORS[service.level]}`}>
            {LEVEL_LABELS[service.level]}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
          <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{service.description}</p>
        </div>

        <ul className="space-y-1">
          {service.includes.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-brand-turquoise shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-3 border-t border-border space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>~{service.duration} min</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            {(Object.entries(service.prices) as [keyof Service['prices'], number][]).map(([size, price]) => (
              <div key={size} className="bg-muted rounded-md p-1.5 text-center">
                <p className="text-muted-foreground">{SIZE_LABELS[size]}</p>
                <p className="font-semibold text-foreground">{formatPrice(price)}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-right">Desde {formatPrice(minPrice)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
