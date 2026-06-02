'use client';

import { useState, useEffect, useRef } from 'react';
import { PawPrint, Save, Lock, Plus, Eye, EyeOff, ImageIcon, AlertCircle, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import type { CatalogData, Service, Cut } from '@/lib/types';

const ADMIN_PASSWORD = 'katherine2024';

const IMAGE_HINTS: Record<string, { label: string; w: number; h: number }> = {
  service:   { label: 'Servicio',       w: 600, h: 400 },
  breedHero: { label: 'Raza (portada)', w: 800, h: 500 },
  cut:       { label: 'Corte',          w: 600, h: 500 },
};

/* ─── Textarea con estilos consistentes ──────────────────────────────────────── */
function Textarea({ value, onChange, rows = 2 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
    />
  );
}

/* ─── Lista editable de "includes" ───────────────────────────────────────────── */
function IncludesList({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  function updateItem(idx: number, val: string) {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  }
  function removeItem(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function addItem() {
    onChange([...items, '']);
  }

  return (
    <div className="space-y-1.5">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-brand-turquoise text-sm shrink-0">✓</span>
          <Input
            value={item}
            onChange={(e) => updateItem(idx, e.target.value)}
            className="h-8 text-sm"
            placeholder="Elemento incluido…"
          />
          <button
            type="button"
            onClick={() => removeItem(idx)}
            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
            aria-label="Eliminar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-xs text-brand-lila hover:underline mt-1"
      >
        <Plus className="h-3.5 w-3.5" /> Agregar ítem
      </button>
    </div>
  );
}

/* ─── Subida de imagen ───────────────────────────────────────────────────────── */
function ImageInput({ value, onChange, type }: { value: string; onChange: (url: string) => void; type: keyof typeof IMAGE_HINTS }) {
  const hint = IMAGE_HINTS[type];
  const [imgError, setImgError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Error al subir');
      setImgError(false);
      onChange(json.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
        <ImageIcon className="h-3.5 w-3.5" />
        Imagen — {hint.label} ({hint.w}×{hint.h}px recomendado)
      </Label>
      <div className="flex gap-3 items-center">
        <div className="shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center relative">
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {value && !imgError
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={value} alt="preview" className="w-full h-full object-cover" onError={() => setImgError(true)} />
            : <ImageIcon className="h-7 w-7 text-muted-foreground/30" />}
        </div>
        <div className="flex-1 space-y-1.5">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-lila border border-brand-lila/40 rounded-lg px-3 py-2 hover:bg-brand-lila/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Subiendo…' : value ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
          {uploadError && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {uploadError}</p>}
          {imgError && !uploadError && <p className="text-xs text-muted-foreground">La imagen actual no se puede previsualizar</p>}
          <p className="text-[11px] text-muted-foreground">JPG, PNG o WebP · máx. 5 MB</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Inputs de precio ───────────────────────────────────────────────────────── */
function PriceInputs({ prices, onChange }: { prices: Service['prices']; onChange: (p: Service['prices']) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <div key={size}>
          <Label className="text-xs text-muted-foreground">{size === 'small' ? 'Pequeño' : size === 'medium' ? 'Mediano' : 'Grande'}</Label>
          <Input type="number" value={prices[size]} onChange={(e) => onChange({ ...prices, [size]: Number(e.target.value) })} className="mt-1" />
        </div>
      ))}
    </div>
  );
}

/* ─── Página principal ───────────────────────────────────────────────────────── */
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
      fetch('/api/catalog').then((r) => r.json()).then(setCatalog).catch(() => setError('Error al cargar el catálogo'));
    }
  }, [authenticated]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuthenticated(true); setError(''); }
    else setError('Contraseña incorrecta');
  }

  async function save() {
    if (!catalog) return;
    setSaving(true); setSaved(false); setError('');
    try {
      const res = await fetch('/api/catalog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(catalog) });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  /* ── Helpers de actualización ─────────────────────────────────────────────── */
  function updateServiceField<K extends keyof Service>(id: string, field: K, value: Service[K]) {
    setCatalog((prev) => prev ? { ...prev, services: prev.services.map((s) => s.id === id ? { ...s, [field]: value } : s) } : prev);
  }

  function updateBreedImage(breedId: string, image: string) {
    setCatalog((prev) => prev ? { ...prev, breeds: prev.breeds.map((b) => b.id === breedId ? { ...b, image } : b) } : prev);
  }

  function updateCutField<K extends keyof Cut>(breedId: string, cutIdx: number, field: K, value: Cut[K]) {
    setCatalog((prev) => {
      if (!prev) return prev;
      const breeds = prev.breeds.map((b) => {
        if (b.id !== breedId) return b;
        const cuts = b.cuts.map((c, i) => i === cutIdx ? { ...c, [field]: value } : c);
        return { ...b, cuts };
      });
      return { ...prev, breeds };
    });
  }

  function updateExtraPrices(breedId: string, extraIdx: number, prices: Service['prices']) {
    setCatalog((prev) => {
      if (!prev) return prev;
      const breeds = prev.breeds.map((b) => {
        if (b.id !== breedId) return b;
        const extras = b.extras.map((e, i) => i === extraIdx ? { ...e, prices } : e);
        return { ...b, extras };
      });
      return { ...prev, breeds };
    });
  }

  /* ─── Login ──────────────────────────────────────────────────────────────────── */
  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="bg-brand-lila/10 rounded-full p-3"><PawPrint className="h-7 w-7 text-brand-lila" /></div>
              <h1 className="text-xl font-bold">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground">Katherine Groom</p>
            </div>
            <form onSubmit={login} className="space-y-4">
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-1">
                  <Input id="password" type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" className="pr-10" />
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
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
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-muted-foreground animate-pulse">Cargando catálogo...</p></div>;
  }

  /* ─── Panel ──────────────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <p className="text-sm text-muted-foreground mt-1">Editá servicios, cortes e imágenes del catálogo</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <p className="text-sm text-green-600 font-medium">✓ Guardado</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={save} disabled={saving} className="bg-brand-lila hover:bg-brand-lila-dark text-white">
            <Save className="h-4 w-4 mr-2" />{saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      {/* ── Servicios ────────────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PawPrint className="h-5 w-5 text-brand-lila" /> Servicios
        </h2>
        <div className="space-y-4">
          {catalog.services.map((service) => (
            <Card key={service.id} className={service.active ? '' : 'opacity-60'}>
              <CardContent className="p-4 space-y-4">
                {/* Nombre + toggle activo */}
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{service.name}</p>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${service.id}`} className="text-sm text-muted-foreground">{service.active ? 'Activo' : 'Oculto'}</Label>
                    <Switch id={`active-${service.id}`} checked={service.active} onCheckedChange={(v) => updateServiceField(service.id, 'active', v)} />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Descripción</Label>
                  <Textarea value={service.description} onChange={(v) => updateServiceField(service.id, 'description', v)} />
                </div>

                {/* Duración */}
                <div className="w-40">
                  <Label className="text-xs text-muted-foreground mb-1 block">Duración (minutos)</Label>
                  <Input
                    type="number"
                    value={service.duration}
                    onChange={(e) => updateServiceField(service.id, 'duration', Number(e.target.value))}
                  />
                </div>

                {/* Incluye */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Qué incluye</Label>
                  <IncludesList
                    items={service.includes}
                    onChange={(items) => updateServiceField(service.id, 'includes', items)}
                  />
                </div>

                {/* Imagen */}
                <ImageInput value={service.image} onChange={(url) => updateServiceField(service.id, 'image', url)} type="service" />

                {/* Precios */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Precios (CLP)</Label>
                  <PriceInputs prices={service.prices} onChange={(prices) => updateServiceField(service.id, 'prices', prices)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Cortes por raza ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-brand-lila" /> Cortes por Raza
        </h2>
        {catalog.breeds.map((breed) => (
          <div key={breed.id} className="mb-8">
            {/* Portada de raza */}
            <Card className="mb-3">
              <CardContent className="p-4 space-y-3">
                <p className="font-semibold flex items-center gap-2">🐩 {breed.name} — Imagen de portada</p>
                <ImageInput value={breed.image} onChange={(url) => updateBreedImage(breed.id, url)} type="breedHero" />
              </CardContent>
            </Card>

            {/* Cortes */}
            <div className="space-y-3 pl-2">
              {breed.cuts.map((cut, ci) => (
                <Card key={cut.id}>
                  <CardContent className="p-4 space-y-3">
                    <p className="font-medium">{cut.name}</p>

                    {/* Descripción del corte */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Descripción</Label>
                      <Textarea
                        value={cut.description}
                        onChange={(v) => updateCutField(breed.id, ci, 'description', v)}
                      />
                    </div>

                    {/* Duración del corte */}
                    <div className="w-40">
                      <Label className="text-xs text-muted-foreground mb-1 block">Duración (minutos)</Label>
                      <Input
                        type="number"
                        value={cut.duration}
                        onChange={(e) => updateCutField(breed.id, ci, 'duration', Number(e.target.value))}
                      />
                    </div>

                    {/* Imagen */}
                    <ImageInput value={cut.image} onChange={(url) => updateCutField(breed.id, ci, 'image', url)} type="cut" />

                    {/* Precios */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Precios (CLP)</Label>
                      <PriceInputs prices={cut.prices} onChange={(prices) => updateCutField(breed.id, ci, 'prices', prices)} />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Extras */}
              {breed.extras.map((extra, ei) => (
                <Card key={extra.id} className="border-brand-turquoise/30">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-sm">{extra.name} <span className="text-muted-foreground">(Extra)</span></p>
                    <PriceInputs prices={extra.prices} onChange={(prices) => updateExtraPrices(breed.id, ei, prices)} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Nota */}
      <div className="mt-6 p-4 bg-muted rounded-xl text-xs text-muted-foreground space-y-1.5">
        <p><strong>Guardar cambios:</strong> guarda el catálogo directamente en Vercel Blob. Los cambios se ven en el sitio de inmediato.</p>
        <p><strong>Imágenes:</strong> subí una foto desde tu computador y se almacena en la nube automáticamente.</p>
      </div>
    </div>
  );
}
