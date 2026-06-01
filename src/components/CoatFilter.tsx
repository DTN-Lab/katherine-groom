'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { CoatType } from '@/lib/types';

const FILTERS: { value: CoatType | 'all'; label: string; emoji: string }[] = [
  { value: 'all',   label: 'Todos',       emoji: '🐾' },
  { value: 'short', label: 'Pelo Corto',  emoji: '🐕' },
  { value: 'medium',label: 'Pelo Mediano',emoji: '🦮' },
  { value: 'long',  label: 'Pelo Largo',  emoji: '🐩' },
  { value: 'curly', label: 'Rizado/Lana', emoji: '🌀' },
];

export default function CoatFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('pelo') ?? 'all';

  function setFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('pelo');
    } else {
      params.set('pelo', value);
    }
    router.push(`/servicios?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {FILTERS.map((f) => {
        const active = current === f.value;
        return (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${active
                ? 'bg-brand-lila text-white shadow-md scale-105'
                : 'bg-white text-muted-foreground border border-border hover:border-brand-lila hover:text-brand-lila'
              }
            `}
          >
            <span>{f.emoji}</span>
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
