import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const secret =
      req.headers.get('x-revalidate-secret') ||
      req.nextUrl.searchParams.get('secret');

    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Invalid secret token' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const tag = req.nextUrl.searchParams.get('tag') || body.tag;
    const path = req.nextUrl.searchParams.get('path') || body.path;
    const type = body._type; // Sanity webhook format

    const revalidated: string[] = [];

    if (tag) {
      revalidateTag(tag);
      revalidated.push(`tag:${tag}`);
    }

    if (path) {
      revalidatePath(path);
      revalidated.push(`path:${path}`);
    }

    // Auto-revalidation for Sanity document publish webhooks
    if (type === 'journalPost') {
      revalidateTag('journal');
      if (body.slug?.current) {
        revalidateTag(`journal-${body.slug.current}`);
      }
      revalidatePath('/fr/journal');
      revalidatePath('/en/journal');
      revalidated.push('journal-all');
    } else if (type === 'page') {
      revalidateTag('maison');
      revalidatePath('/fr/maison');
      revalidatePath('/en/maison');
      revalidated.push('maison-all');
    }

    if (revalidated.length === 0) {
      // Default revalidate journal and maison tags
      revalidateTag('journal');
      revalidateTag('maison');
      revalidated.push('journal', 'maison');
    }

    return NextResponse.json({
      revalidated: true,
      targets: revalidated,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('[Revalidate API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to trigger revalidation' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const tag = req.nextUrl.searchParams.get('tag');
  const path = req.nextUrl.searchParams.get('path');

  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid secret token' }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  }

  revalidateTag('journal');
  revalidateTag('maison');
  return NextResponse.json({ revalidated: true, defaultTags: ['journal', 'maison'] });
}
