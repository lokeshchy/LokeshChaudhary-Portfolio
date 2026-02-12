import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block bg-background border border-border rounded-card overflow-hidden shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-1"
    >
      {project.imageGallery && project.imageGallery.length > 0 && (
        <div className="relative w-full h-48 bg-muted/10">
          <Image
            src={project.imageGallery[0]}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">
          {project.title}
        </h3>
        <p className="text-muted mb-4 line-clamp-2">{project.overview}</p>
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-1 text-xs text-muted">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
