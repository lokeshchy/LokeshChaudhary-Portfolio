import Link from 'next/link';
import { getBlogList } from '@/lib/data';
import { Reveal, RevealItem } from '@/components/motion/Reveal';

export const metadata = {
  title: 'Blog',
  description: 'Blog posts and articles',
};

export default async function BlogPage() {
  const posts = await getBlogList(true);

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      {/* Page header */}
      <Reveal className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'rgba(45,212,191,0.55)' }}>
          ~/blog
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gradient-primary">Blog</h1>
        <p className="text-muted mt-2">Thoughts and updates.</p>
        <div className="section-divider-glow mt-5" style={{ marginLeft: 0, maxWidth: '8rem' }} />
      </Reveal>

      <Reveal stagger={0.08} className="space-y-4 max-w-2xl">
        {posts.map((post) => (
          <RevealItem key={post.id}>
          <Link href={`/blog/${post.slug}`} className="card-project p-5 flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-muted text-sm mt-1 line-clamp-2 leading-relaxed">{post.excerpt}</p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {post.tags.slice(0, 3).map((t) => (
                    <span key={t} className="tag-tech" style={{ fontSize: '0.62rem' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 text-right">
              {post.publishedAt && (
                <p className="text-xs font-mono" style={{ color: 'rgba(100,116,139,0.7)' }}>
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}
              <span className="text-xs mt-1 block" style={{ color: 'rgba(45,212,191,0.5)' }}>
                Read →
              </span>
            </div>
          </Link>
          </RevealItem>
        ))}
      </Reveal>

      {posts.length === 0 && (
        <p className="text-muted">No posts yet.</p>
      )}
    </div>
  );
}
