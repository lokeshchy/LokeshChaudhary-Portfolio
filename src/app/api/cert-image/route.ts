import { NextRequest, NextResponse } from 'next/server';

function driveFileIdFromUrl(url: string): string | null {
  const filePath = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (filePath) return filePath[1];
  const openId = url.match(/drive\.google\.com\/open\?[^#]*id=([a-zA-Z0-9_-]+)/);
  if (openId) return openId[1];
  return null;
}

/**
 * Proxies Google Drive file previews for <img>. Browser direct links often fail
 * (cookies, redirects); server-side thumbnail fetch is more reliable when the file is shared.
 */
export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get('url');
  const idParam = request.nextUrl.searchParams.get('id');
  let id = idParam?.trim() || null;
  if (!id && urlParam) {
    let decoded = urlParam;
    try {
      decoded = decodeURIComponent(urlParam);
    } catch {
      /* use raw */
    }
    id = driveFileIdFromUrl(decoded);
  }
  if (!id) {
    return NextResponse.json({ error: 'Missing url or id' }, { status: 400 });
  }

  const ua =
    'Mozilla/5.0 (compatible; PortfolioCertImage/1.0; +https://localhost) AppleWebKit/537.36 (KHTML, like Gecko)';

  const thumb = `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2000`;
  let res = await fetch(thumb, {
    redirect: 'follow',
    headers: { 'User-Agent': ua },
    next: { revalidate: 86_400 },
  });

  if (!res.ok || !res.headers.get('content-type')?.startsWith('image/')) {
    const uc = `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`;
    res = await fetch(uc, {
      redirect: 'follow',
      headers: { 'User-Agent': ua },
      next: { revalidate: 86_400 },
    });
  }

  if (!res.ok) {
    return NextResponse.json({ error: 'Could not load image' }, { status: 502 });
  }

  const contentType = res.headers.get('content-type') || 'image/jpeg';
  if (!contentType.startsWith('image/')) {
    return NextResponse.json({ error: 'Not an image' }, { status: 502 });
  }

  return new NextResponse(res.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
