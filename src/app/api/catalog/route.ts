import { NextRequest, NextResponse } from 'next/server';
import { getCatalog, saveCatalog } from '@/lib/catalog';
import type { CatalogData } from '@/lib/types';

export async function GET() {
  try {
    const data = await getCatalog();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Error al leer el catálogo' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CatalogData;
    await saveCatalog(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al guardar el catálogo' }, { status: 500 });
  }
}
