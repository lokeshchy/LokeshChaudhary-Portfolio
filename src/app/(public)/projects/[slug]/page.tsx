import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug } from '@/lib/data';
import { certificationImageDisplayUrl, certificationImageImgSrc } from '@/lib/cert-image-url';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project' };
  return {
    title: project.title,
    description: project.overview,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <Link href="/projects" className="text-sm text-primary hover:underline mb-6 inline-block">
        ← All projects
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-primary">{project.title}</h1>
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-button border border-secondary/40 bg-secondary/20 px-2.5 py-1 text-sm font-medium text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-neutral max-w-2xl space-y-8 prose-a:text-primary">
        <section>
          <h2 className="text-xl font-semibold text-primary mb-2">Overview</h2>
          <p className="text-muted">{project.overview}</p>
        </section>

        {project.problem && (
          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">Problem</h2>
            <p className="text-muted">{project.problem}</p>
          </section>
        )}

        {project.process && (
          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">Process</h2>
            <p className="text-muted whitespace-pre-wrap">{project.process}</p>
          </section>
        )}

        {project.solution && (
          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">Solution</h2>
            <p className="text-muted">{project.solution}</p>
          </section>
        )}

        {project.result && (
          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">Result</h2>
            <p className="text-muted">{project.result}</p>
          </section>
        )}
      </div>

      {project.imageGallery && project.imageGallery.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-primary mb-4">Result Images</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {project.imageGallery.map((url, i) => (
              <a
                key={i}
                href={certificationImageDisplayUrl(url) ?? url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-video rounded-card overflow-hidden bg-surface border border-border"
                aria-label={`Open ${project.title} result image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={certificationImageImgSrc(url) ?? url}
                  alt={`${project.title} image ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
