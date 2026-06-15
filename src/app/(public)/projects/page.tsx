import Link from 'next/link';
import { getProjectsList } from '@/lib/data';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { Tilt3D } from '@/components/motion/Tilt3D';

export const metadata = {
  title: 'Projects',
  description: 'Projects and case studies',
};

export default async function ProjectsPage() {
  const projects = await getProjectsList();

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      {/* Page header */}
      <Reveal className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'rgba(45,212,191,0.55)' }}>
          ~/projects
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gradient-primary">Projects</h1>
        <p className="text-muted mt-2">Selected work and case studies.</p>
        <div className="section-divider-glow mt-5" style={{ marginLeft: 0, maxWidth: '12rem' }} />
      </Reveal>

      <Reveal stagger={0.09} className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <RevealItem key={p.id} className="h-full">
          <Tilt3D className="h-full" max={7} glare={false} scale={1.02}>
          <article className="card-project p-6 flex flex-col h-full">
            <Link href={`/projects/${p.slug}`} className="group">
              <h2 className="text-xl font-semibold transition-colors duration-200" style={{ color: '#e2e8f0' }}>
                {p.title}
              </h2>
            </Link>
            <p className="text-muted mt-2 text-sm leading-relaxed line-clamp-2 flex-1">{p.overview}</p>

            {p.techStack && p.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.techStack.slice(0, 5).map((t) => (
                  <span key={t} className="tag-tech">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 flex flex-wrap gap-2 items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Link
                href={`/projects/${p.slug}`}
                className="text-xs font-medium transition-colors duration-200 hover:text-primary"
                style={{ color: '#64748b' }}
              >
                Details →
              </Link>
              {p.deployed && p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium px-2.5 py-1 rounded-md transition-all duration-200"
                  style={{
                    border: '1px solid rgba(45,212,191,0.25)',
                    background: 'rgba(45,212,191,0.06)',
                    color: '#2dd4bf',
                  }}
                >
                  Live ↗
                </a>
              )}
              {p.viewCode && p.codeUrl && (
                <a
                  href={p.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium px-2.5 py-1 rounded-md transition-all duration-200"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#64748b',
                  }}
                >
                  Code ↗
                </a>
              )}
            </div>
          </article>
          </Tilt3D>
          </RevealItem>
        ))}
      </Reveal>

      {projects.length === 0 && (
        <p className="text-muted">No projects yet.</p>
      )}
    </div>
  );
}
