'use client';

import { useState, useEffect } from 'react';
import { PawPrint, Save, Lock, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import type { CatalogData, Service } from '@/lib/types';

const ADMIN_PASSWORD = 'katherine2024';

function PriceInputs({
  prices,
  onChange,
}: {
  prices: Service['prices'];
  onChange: (prices: Service['prices']) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <div key={size}>
          <Label className="text-xs text-muted-foreground capitalize">
            {size === 'small' ? 'Pequeño' : size === 'medium' ? 'Mediano' : 'Grande'}
          </Label>
          <Input
            type="number"
            value={prices[size]}
            onChange={(e) => onChange({ ...prices, [size]: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetch('/api/catalog')
        .then((r) => r.json())
        .then(setCatalog)
        .catch(() => setError('Error al cargar el catálogo'));
    }
  }, [authenticated]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      setError('Contraseña incorrecta');
    }
  }

  async function save() {
    if (!catalog) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catalog),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Error al guardar. Verificá que el servidor esté corriendo localmente.');
    } finally {
      setSaving(false);
    }
  }

  function updateServiceField<K extends keyof Service>(
    id: string,
    field: K,
    value: Service[K],
  ) {
    setCatalog((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        services: prev.services.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      };
    });
  }

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="bg-brand-lila/10 rounded-full p-3">
                <PawPrint className="h-7 w-7 text-brand-lila" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground text-center">Katherine Groom</p>
            </div>
            <form onSubmit={login} className="space-y-4">
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full bg-brand-lila hover:bg-brand-lila-dark text-white">
                <Lock className="h-4 w-4 mr-2" /> Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground animate-pulse">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-sm text-muted-foreground mt-1">Editá precios y servicios del catálogo</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <p className="text-sm text-green-600 font-medium">✓ Guardado</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            onClick={save}
            disabled={saving}
            className="bg-brand-lila hover:bg-brand-lila-dark text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      {/* Servicios */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <PawPrint className="h-5 w-5 text-brand-lila" /> Servicios
        </h2>
        <div className="space-y-4">
          {catalog.services.map((service) => (
            <Card key={service.id} className={service.active ? '' : 'opacity-60'}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">Duración: {service.duration} min</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${service.id}`} className="text-sm text-muted-foreground">
                      {service.active ? 'Activo' : 'Oculto'}
                    </Label>
                    <Switch
                      id={`active-${service.id}`}
                      checked={service.active}
                      onCheckedChange={(v) => updateServiceField(service.id, 'active', v)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Descripción</Label>
                  <Input
                    value={service.description}
                    onChange={(e) => updateServiceField(service.id, 'description', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Precios (CLP)</Label>
                  <PriceInputs
                    prices={service.prices}
                    onChange={(prices) => updateServiceField(service.id, 'prices', prices)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Precios por raza */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-brand-lila" /> Precios de Cortes por Raza
        </h2>
        {catalog.breeds.map((breed) => (
          <div key={breed.id} className="mb-6">
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              🐩 {breed.name}
            </h3>
            <div className="space-y-3">
              {breed.cuts.map((cut, ci) => (
                <Card key={cut.id}>
                  <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-sm text-foreground">{cut.name}</p>
                    <PriceInputs
                      prices={cut.prices}
                      onChange={(prices) => {
                        setCatalog((prev) => {
                          if (!prev) return prev;
                          const breeds = [...prev.breeds];
                          const breedIdx = breeds.findIndex((b) => b.id === breed.id);
                          const cuts = [...breeds[breedIdx].cuts];
                          cuts[ci] = { ...cuts[ci], prices };
                          breeds[breedIdx] = { ...breeds[breedIdx], cuts };
                          return { ...prev, breeds };
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
              {breed.extras.map((extra, ei) => (
                <Card key={extra.id} className="border-brand-turquoise/30">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-sm text-foreground">{extra.name} (Extra)</p>
                    <PriceInputs
                      prices={extra.prices}
                      onChange={(prices) => {
                        setCatalog((prev) => {
                          if (!prev) return prev;
                          const breeds = [...prev.breeds];
                          const breedIdx = breeds.findIndex((b) => b.id === breed.id);
                          const extras = [...breeds[breedIdx].extras];
                          extras[ei] = { ...extras[ei], prices };
                          breeds[breedIdx] = { ...breeds[breedIdx], extras };
                          return { ...prev, breeds };
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="mt-6 p-4 bg-muted rounded-xl text-xs text-muted-foreground">
        <strong>Nota:</strong> El botón "Guardar cambios" escribe el archivo <code>data/catalog.json</code> del servidor local.
        Para publicar los cambios en producción, hacé commit y redesplegá.
      </div>
    </div>
  );
}
