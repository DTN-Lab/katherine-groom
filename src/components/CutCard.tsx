'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Clock, Scissors, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Cut, Extra } from '@/lib/types';

const LEVEL_LABELS: Record<Cut['level'], string> = {
  basic: 'Económico',
  intermediate: 'Recomendado',
  premium: 'Premium',
};

const LEVEL_BADGE: Record<Cut['level'], string> = {
  basic: 'bg-secondary text-secondary-foreground border-border',
  intermediate: 'bg-brand-turquoise/20 text-accent-foreground border-brand-turquoise/40',
  premium: 'bg-brand-lila/15 text-primary border-brand-lila/30',
};

const TOOL_LABELS: Record<Cut['tools'], string> = {
  machine: 'Máquina',
  scissors: 'Tijera',
  both: 'Máquina + Tijera',
};

const SIZE_LABELS = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CL')}`;
}

interface CutCardProps {
  cut: Cut;
  extras: Extra[];
}

export default function CutCard({ cut, extras }: CutCardProps) {
  const [activeExtras, setActiveExtras] = useState<Record<string, boolean>>({});

  function toggleExtra(id: string) {
    setActiveExtras((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function totalPrice(size: keyof Cut['prices']) {
    let total = cut.prices[size];
    for (const extra of extras) {
      if (activeExtras[extra.id]) total += extra.prices[size];
    }
    return total;
  }

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-200 border-border">
      <div className="relative h-56 w-full">
        <Image
          src={cut.image}
          alt={cut.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-xl drop-shadow">{cut.name}</h3>
          <Badge className={`text-xs font-medium border mt-1 ${LEVEL_BADGE[cut.level]}`}>
            {LEVEL_LABELS[cut.level]}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col flex-1 p-4 gap-4">
        <p className="text-muted-foreground text-sm leading-relaxed">{cut.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Scissors className="h-3.5 w-3.5 text-brand-lila" />
            {TOOL_LABELS[cut.tools]}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-lila" />
            ~{cut.duration} min
          </span>
        </div>

        {extras.length > 0 && (
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-turquoise" />
              Extras opcionales
            </p>
            {extras.map((extra) => (
              <div key={extra.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`extra-${cut.id}-${extra.id}`}
                    checked={!!activeExtras[extra.id]}
                    onCheckedChange={() => toggleExtra(extra.id)}
                  />
                  <Label htmlFor={`extra-${cut.id}-${extra.id}`} className="text-sm cursor-pointer">
                    {extra.name}
                  </Label>
                </div>
                <span className="text-xs text-brand-lila font-medium">
                  +{formatPrice(extra.prices.small)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Precio según tamaño:</p>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(SIZE_LABELS) as (keyof Cut['prices'])[]).map((size) => (
              <div key={size} className="bg-brand-lila-light rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground">{SIZE_LABELS[size]}</p>
                <p className="font-bold text-primary text-sm">{formatPrice(totalPrice(size))}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
