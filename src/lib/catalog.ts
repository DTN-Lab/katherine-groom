import fs from 'fs/promises';
import path from 'path';
import type { CatalogData } from '@/lib/types';

const CATALOG_PATH = path.join(process.cwd(), 'data', 'catalog.json');

export async function getCatalog(): Promise<CatalogData> {
  const raw = await fs.readFile(CATALOG_PATH, 'utf-8');
  return JSON.parse(raw) as CatalogData;
}

export async function saveCatalog(data: CatalogData): Promise<void> {
  await fs.writeFile(CATALOG_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
