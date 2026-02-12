import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import ProjectCard from '@/components/ProjectCard'
import BlogCard from '@/components/BlogCard'
import SkillsGrid from '@/components/SkillsGrid'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/utils'
import type { PageContent, HeroData } from '@/types'
import Link from 'next/link'

async function getHomePageData() {
  const page = await prisma.page.findUnique({
    where: { slug: 'home' },
  })

  if (!page) {
    return null
  }

  const content = parseJson<PageContent>(page.content, { sections: [] })
  return { page, content }
}

async function getFeaturedProjects() {
  const projects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { order: 'asc' },
    take: 3,
  })

  return projects.map(p => ({
    ...p,
    techStack: parseJson<string[]>(p.techStack, []),
    imageGallery: parseJson<string[]>(p.imageGallery, []),
  }))
}

async function getLatestBlogs() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return blogs.map(b => ({
    ...b,
    tags: parseJson<string[]>(b.tags, []),
  }))
}

async function getSkills() {
  return await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  })
}

async function getExperiencePreview() {
  const experiences = await prisma.experience.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
    take: 3,
  })

  return experiences.map(exp => ({
    ...exp,
    description: parseJson<string[]>(exp.description, []),
  }))
}

export default async function HomePage() {
  const pageData = await getHomePageData()
  const featuredProjects = await getFeaturedProjects()
  const latestBlogs = await getLatestBlogs()
  const skills = await getSkills()
  const experiencePreview = await getExperiencePreview()

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Home page not configured. Please set it up in the admin panel.</p>
      </div>
    )
  }

  const { content } = pageData
  const enabledSections = content.sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order)

  // Find hero section
  const heroSection = enabledSections.find(s => s.type === 'hero')
  const heroData = heroSection?.data as HeroData | undefined

  return (
    <>
      <Navbar />
      <main>
        {heroData && <Hero data={heroData} />}

        {/* Featured Projects Section */}
        {enabledSections.some(s => s.type === 'featured-projects') && (
          <section className="max-w-content w-full mx-auto px-4 py-20">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/projects"
                className="text-primary hover:underline"
              >
                View all projects →
              </Link>
            </div>
          </section>
        )}

        {/* About Preview Section */}
        {enabledSections.some(s => s.type === 'about-preview') && (
          <section className="bg-muted/5 py-20">
            <div className="max-w-content w-full mx-auto px-4">
              <h2 className="text-4xl font-bold text-foreground mb-8 text-center">
                About Me
              </h2>
              <p className="text-lg text-muted text-center max-w-2xl mx-auto mb-8">
                {/* This would come from page content */}
                Welcome to my portfolio. I'm a passionate developer and engineer.
              </p>
              <div className="text-center">
                <Link
                  href="/about"
                  className="inline-block px-6 py-3 bg-primary text-white rounded-card hover:opacity-90 transition-opacity"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {enabledSections.some(s => s.type === 'skills') && skills.length > 0 && (
          <section className="py-20">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
              Skills
            </h2>
            <SkillsGrid skills={skills} />
          </section>
        )}

        {/* Experience Preview */}
        {enabledSections.some(s => s.type === 'experience-preview') && experiencePreview.length > 0 && (
          <section className="bg-muted/5 py-20">
            <div className="max-w-content w-full mx-auto px-4">
              <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
                Experience
              </h2>
              <ExperienceTimeline experiences={experiencePreview} />
              <div className="text-center mt-8">
                <Link
                  href="/experience"
                  className="text-primary hover:underline"
                >
                  View full experience →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Latest Blogs */}
        {enabledSections.some(s => s.type === 'blogs') && latestBlogs.length > 0 && (
          <section className="py-20">
            <div className="max-w-content w-full mx-auto px-4">
              <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
                Latest Blog Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/blog"
                  className="text-primary hover:underline"
                >
                  View all posts →
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
