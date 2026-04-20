import { notFound } from 'next/navigation';
import { MarkdownBody } from '@/components/MarkdownBody';
import { getPageBySlug } from '@/lib/data';

const SYSTEM_SLUGS = [
  'home',
  'about',
  'projects',
  'blog',
  'experience',
  'contact',
  'certifications',
  'certification',
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (SYSTEM_SLUGS.includes(slug)) return {};
  const page = await getPageBySlug(slug);
  if (!page) return {};
  const content = page.content as Record<string, unknown>;
  return {
    title: page.seoTitle || page.title,
    description: (page.seoDesc as string) || (content?.body as string)?.slice(0, 160),
  };
}

type MediaItem = { type: 'image' | 'video'; url: string; caption?: string };

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (SYSTEM_SLUGS.includes(slug)) notFound();
  const page = await getPageBySlug(slug);
  if (!page) notFound();
  const content = page.content as Record<string, unknown>;
  const body = (content?.body as string) || '';
  const media = (content?.media as MediaItem[] | undefined) || [];

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">{page.title}</h1>
      <MarkdownBody className="prose prose-neutral max-w-2xl prose-headings:text-primary prose-p:text-muted prose-a:text-primary">
        {body}
      </MarkdownBody>
      {media.length > 0 && (
        <div className="mt-10 space-y-8">
          {media.map((item, i) => (
            <div key={i}>
              {item.type === 'image' && (
                <>
                  <div className="relative aspect-video max-w-3xl rounded-card overflow-hidden bg-surface border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.caption || 'Image'} className="w-full h-full object-cover" />
                  </div>
                  {item.caption && <p className="text-sm text-muted mt-2">{item.caption}</p>}
                </>
              )}
              {item.type === 'video' && (
                <>
                  <div className="relative aspect-video max-w-3xl rounded-card overflow-hidden bg-surface border border-border">
                    <VideoEmbed url={item.url} />
                  </div>
                  {item.caption && <p className="text-sm text-muted mt-2">{item.caption}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const u = url.trim();
  const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (ytMatch) {
    return <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}`} title="Video" className="absolute inset-0 w-full h-full" allowFullScreen />;
  }
  if (vimeoMatch) {
    return <iframe src={`https://player.vimeo.com/video/${vimeoMatch[1]}`} title="Video" className="absolute inset-0 w-full h-full" allowFullScreen />;
  }
  return <video src={u} controls className="w-full h-full object-contain" />;
}
