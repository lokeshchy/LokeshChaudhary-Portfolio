import Link from 'next/link';
import { getBlogList } from '@/lib/data';

export const metadata = {
  title: 'Blog',
  description: 'Blog posts and articles',
};

export default async function BlogPage() {
  const posts = await getBlogList(true);

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-primary mb-2">Blog</h1>
      <p className="text-muted mb-12">Thoughts and updates.</p>

      <div className="space-y-6 max-w-2xl">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className={`card-project p-6 ${flashCardTone(post.title)}`}
          >
            <h2 className="text-xl font-semibold text-primary">{post.title}</h2>
            {post.excerpt && (
              <p className="text-muted mt-2 line-clamp-2">{post.excerpt}</p>
            )}
            <p className="text-sm text-muted mt-3">
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
                  <span key={t} className="text-xs text-secondary">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-muted">No posts yet.</p>
      )}
    </div>
  );
}

function flashCardTone(seed: string): string {
  const tones = [
    'from-primary/20 via-surface to-surface border-primary/35',
    'from-secondary/20 via-surface to-surface border-secondary/35',
    'from-accent/20 via-surface to-surface border-accent/35',
    'from-indigo-500/20 via-surface to-surface border-indigo-400/35',
    'from-cyan-500/20 via-surface to-surface border-cyan-400/35',
    'from-fuchsia-500/20 via-surface to-surface border-fuchsia-400/35',
  ];
  const idx = Array.from(seed).reduce((a, ch) => a + ch.charCodeAt(0), 0) % tones.length;
  return `bg-gradient-to-br ${tones[idx]}`;
}
