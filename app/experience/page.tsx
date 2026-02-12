import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/utils'

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

export default async function ExperiencePage() {
  const experiences = await getAllExperience()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-content w-full mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Experience
          </h1>
          <p className="text-lg text-muted mb-12">
            My professional journey and achievements.
          </p>

          {experiences.length === 0 ? (
            <p className="text-muted text-center py-20">
              No experience entries yet.
            </p>
          ) : (
            <ExperienceTimeline experiences={experiences} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
