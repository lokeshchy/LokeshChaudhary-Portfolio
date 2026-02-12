import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'

async function getBlog(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: { slug, published: true },
  })

  if (!blog) return null

  return {
    ...blog,
    tags: parseJson<string[]>(blog.tags, []),
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const blog = await getBlog(params.slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDesc || blog.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const blog = await getBlog(params.slug)

  if (!blog) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <article className="max-w-content w-full mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-muted mb-8">
            {blog.publishedAt && (
              <time dateTime={blog.publishedAt.toISOString()}>
                {format(new Date(blog.publishedAt), 'MMMM d, yyyy')}
              </time>
            )}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex gap-2">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-accent/10 text-accent rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {blog.featuredImage && (
            <div className="relative w-full h-96 mb-8 rounded-card overflow-hidden">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
