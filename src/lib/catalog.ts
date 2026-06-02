import fs from 'fs/promises';
import path from 'path';
import { put, list } from '@vercel/blob';
import { unstable_cache } from 'next/cache';
import type { CatalogData } from '@/lib/types';

const LOCAL_PATH = path.join(process.cwd(), 'data', 'catalog.json');
const BLOB_PATHNAME = 'catalog/catalog.json';
const CACHE_TAG = 'catalog';

/** Lee el catálogo desde Blob (sin caché — para uso interno). */
async function fetchCatalog(): Promise<CatalogData> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url, { cache: 'no-store' });
        if (res.ok) return (await res.json()) as CatalogData;
      }
    } catch {
      // Fallback al archivo local
    }
  }
  const raw = await fs.readFile(LOCAL_PATH, 'utf-8');
  return JSON.parse(raw) as CatalogData;
}

/**
 * Lee el catálogo con caché de Next.js.
 * Se invalida automáticamente cada vez que se guarda (revalidateTag).
 */
export const getCatalog = unstable_cache(fetchCatalog, [CACHE_TAG], {
  tags: [CACHE_TAG],
  revalidate: 60, // fallback: revalida cada 60s como máximo
});

/**
 * Guarda el catálogo en Vercel Blob e invalida la caché.
 */
export async function saveCatalog(data: CatalogData): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
  } else {
    await fs.writeFile(LOCAL_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Invalida la caché para que el próximo request lea los datos nuevos
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAG, 'default');
}
