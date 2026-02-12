import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/utils'

async function getAllPublishedBlogs() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return blogs.map(b => ({
    ...b,
    tags: parseJson<string[]>(b.tags, []),
  }))
}

export default async function BlogPage() {
  const blogs = await getAllPublishedBlogs()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-content w-full mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted mb-12">
            Thoughts, tutorials, and insights.
          </p>

          {blogs.length === 0 ? (
            <p className="text-muted text-center py-20">
              No blog posts yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
