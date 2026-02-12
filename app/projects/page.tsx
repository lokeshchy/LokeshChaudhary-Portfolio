import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/utils'

async function getAllProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  })

  return projects.map(p => ({
    ...p,
    techStack: parseJson<string[]>(p.techStack, []),
    imageGallery: parseJson<string[]>(p.imageGallery, []),
  }))
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-content w-full mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Projects
          </h1>
          <p className="text-lg text-muted mb-12">
            A collection of my work and case studies.
          </p>

          {projects.length === 0 ? (
            <p className="text-muted text-center py-20">
              No projects yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
