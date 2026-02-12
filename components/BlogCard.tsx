import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import type { Blog } from '@/types'

interface BlogCardProps {
  blog: Blog
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="block bg-background border border-border rounded-card overflow-hidden shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-1"
    >
      {blog.featuredImage && (
        <div className="relative w-full h-48 bg-muted/10">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-muted mb-4 line-clamp-2">{blog.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-sm text-muted">
          {blog.publishedAt && (
            <span>{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
          )}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex gap-2">
              {blog.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-accent/10 text-accent rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
