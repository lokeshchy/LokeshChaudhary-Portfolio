import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MarkdownBody } from '@/components/MarkdownBody';
import { getBlogBySlug } from '@/lib/data';
import { Reveal } from '@/components/motion/Reveal';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: 'Blog' };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors duration-200 hover:text-primary"
        style={{ color: '#64748b' }}
      >
        ← All Posts
      </Link>

      <article>
        {/* Article header */}
        <Reveal>
        <header
          className="rounded-card mb-8 p-6 md:p-8"
          style={{
            background: 'rgba(11, 19, 34, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderTop: '2px solid rgba(45, 212, 191, 0.35)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'rgba(45,212,191,0.55)' }}>
            ~/blog/{post.slug}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary leading-snug">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {post.publishedAt && (
              <p className="text-xs font-mono" style={{ color: 'rgba(100,116,139,0.7)' }}>
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {post.tags.map((t) => (
                  <span key={t} className="tag-tech" style={{ fontSize: '0.62rem' }}>
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
        </Reveal>

        {post.featuredImage && (
          <Reveal
            className="relative aspect-video rounded-card overflow-hidden mb-8"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </Reveal>
        )}

        <Reveal
          className="rounded-card p-6 md:p-8"
          style={{
            background: 'rgba(11,19,34,0.75)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <MarkdownBody className="prose prose-neutral max-w-2xl prose-headings:text-primary prose-p:text-muted prose-a:text-primary prose-p:leading-relaxed">
            {post.content}
          </MarkdownBody>
        </Reveal>
      </article>
    </div>
  );
}
