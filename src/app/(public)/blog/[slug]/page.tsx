import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MarkdownBody } from '@/components/MarkdownBody';
import { getBlogBySlug } from '@/lib/data';

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
      <Link href="/blog" className="text-sm text-primary hover:underline mb-6 inline-block">
        ← All posts
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-primary">{post.title}</h1>
          <p className="text-muted mt-2">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {post.tags.map((t) => (
                <span key={t} className="text-sm text-secondary">#{t}</span>
              ))}
            </div>
          )}
        </header>

        {post.featuredImage && (
          <div className="relative aspect-video rounded-card overflow-hidden bg-surface border border-border mb-8">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <MarkdownBody className="prose prose-neutral max-w-2xl prose-headings:text-primary prose-p:text-muted prose-a:text-primary">
          {post.content}
        </MarkdownBody>
      </article>
    </div>
  );
}
