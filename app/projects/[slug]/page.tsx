import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

async function getProject(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
  })

  if (!project) return null

  return {
    ...project,
    techStack: parseJson<string[]>(project.techStack, []),
    imageGallery: parseJson<string[]>(project.imageGallery, []),
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = await getProject(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.seoTitle || project.title,
    description: project.seoDesc || project.overview,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <article className="max-w-content w-full mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {project.title}
          </h1>

          {project.imageGallery && project.imageGallery.length > 0 && (
            <div className="relative w-full h-96 mb-8 rounded-card overflow-hidden">
              <Image
                src={project.imageGallery[0]}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Overview
              </h2>
              <p className="text-muted text-lg">{project.overview}</p>
            </section>

            {project.problem && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Problem
                </h2>
                <p className="text-muted text-lg">{project.problem}</p>
              </section>
            )}

            {project.process && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Process
                </h2>
                <p className="text-muted text-lg">{project.process}</p>
              </section>
            )}

            {project.solution && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Solution
                </h2>
                <p className="text-muted text-lg">{project.solution}</p>
              </section>
            )}

            {project.result && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Result
                </h2>
                <p className="text-muted text-lg">{project.result}</p>
              </section>
            )}

            {project.imageGallery && project.imageGallery.length > 1 && (
              <section className="mt-12">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.imageGallery.slice(1).map((image, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-64 rounded-card overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${project.title} - Image ${idx + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
