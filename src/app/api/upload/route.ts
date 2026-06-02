import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 });
  }

  const MAX_MB = 5;
  if (file.size > MAX_MB * 1024 * 1024) {
    return NextResponse.json({ error: `La imagen no puede superar ${MAX_MB} MB` }, { status: 400 });
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `catalog/${Date.now()}.${ext}`;

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
