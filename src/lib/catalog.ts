import fs from 'fs/promises';
import path from 'path';
import { put, list } from '@vercel/blob';
import type { CatalogData } from '@/lib/types';

const LOCAL_PATH = path.join(process.cwd(), 'data', 'catalog.json');
const BLOB_PATHNAME = 'catalog/catalog.json';

/**
 * Lee el catálogo.
 * Si hay token de Blob, intenta leer la versión guardada en Blob.
 * Si no existe todavía en Blob, lee el catalog.json bundleado con el deploy.
 */
export async function getCatalog(): Promise<CatalogData> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url, { cache: 'no-store' });
        if (res.ok) return (await res.json()) as CatalogData;
      }
    } catch {
      // Si Blob falla, cae al archivo local
    }
  }
  // Fallback: catalog.json incluido en el repositorio
  const raw = await fs.readFile(LOCAL_PATH, 'utf-8');
  return JSON.parse(raw) as CatalogData;
}

/**
 * Guarda el catálogo.
 * Con token de Blob: guarda en Vercel Blob (funciona en producción).
 * Sin token: escribe en el archivo local (dev sin Blob configurado).
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
}
