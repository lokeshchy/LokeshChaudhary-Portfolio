import Link from 'next/link';
import { getProjectsList } from '@/lib/data';

export const metadata = {
  title: 'Projects',
  description: 'Projects and case studies',
};

export default async function ProjectsPage() {
  const projects = await getProjectsList();

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-primary mb-2">Projects</h1>
      <p className="text-muted mb-12">Selected work and case studies.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <article key={p.id} className={`card-project p-6 ${flashCardTone(p.title)}`}>
            <h2 className="text-xl font-semibold text-primary">
              <Link href={`/projects/${p.slug}`} className="hover:underline">
                {p.title}
              </Link>
            </h2>
            <p className="text-muted mt-2 line-clamp-2">{p.overview}</p>
            {p.techStack && p.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {p.techStack.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-button border border-secondary/40 bg-secondary/20 px-2.5 py-1 text-xs font-medium text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {p.deployed && p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-button border border-primary/35 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  Demo
                </a>
              )}
              {p.viewCode && p.codeUrl && (
                <a
                  href={p.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-button border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-primary hover:border-primary/35 transition-colors"
                >
                  View Code
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-muted">No projects yet.</p>
      )}
    </div>
  );
}

function flashCardTone(seed: string): string {
  const tones = [
    'from-primary/20 via-surface to-surface border-primary/35',
    'from-secondary/20 via-surface to-surface border-secondary/35',
    'from-accent/20 via-surface to-surface border-accent/35',
    'from-indigo-500/20 via-surface to-surface border-indigo-400/35',
    'from-cyan-500/20 via-surface to-surface border-cyan-400/35',
    'from-fuchsia-500/20 via-surface to-surface border-fuchsia-400/35',
  ];
  const idx = Array.from(seed).reduce((a, ch) => a + ch.charCodeAt(0), 0) % tones.length;
  return `bg-gradient-to-br ${tones[idx]}`;
}
