import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/utils'
import type { PageContent } from '@/types'

async function getAboutPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'about' },
  })

  if (!page) return null

  const content = parseJson<PageContent>(page.content, { sections: [] })
  return { page, content }
}

async function getAllExperience() {
  const experiences = await prisma.experience.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })

  return experiences.map(exp => ({
    ...exp,
    description: parseJson<string[]>(exp.description, []),
  }))
}

export default async function AboutPage() {
  const pageData = await getAboutPage()
  const experiences = await getAllExperience()

  if (!pageData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p>About page not configured.</p>
        </div>
        <Footer />
      </>
    )
  }

  const { page, content } = pageData

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-content w-full mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-foreground mb-8">
            {page.title}
          </h1>

          {/* Bio sections from page content */}
          {content.sections
            .filter(s => s.enabled && s.type === 'custom')
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div key={section.id} className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {section.data.title}
                </h2>
                <div
                  className="prose prose-lg max-w-none text-muted"
                  dangerouslySetInnerHTML={{
                    __html: section.data.content || '',
                  }}
                />
              </div>
            ))}

          {/* Full Experience Timeline */}
          <section className="mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-12">
              Experience
            </h2>
            <ExperienceTimeline experiences={experiences} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
