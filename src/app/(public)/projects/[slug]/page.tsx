import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug } from '@/lib/data';
import { certificationImageDisplayUrl, certificationImageImgSrc } from '@/lib/cert-image-url';
import { Reveal, RevealItem } from '@/components/motion/Reveal';

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

  // The narrative journey (Overview is featured separately in the hero).
  const journey = [
    { id: 'problem', label: 'Problem', content: project.problem },
    { id: 'process', label: 'Process', content: project.process },
    { id: 'solution', label: 'Solution', content: project.solution },
    { id: 'result', label: 'Result', content: project.result },
  ].filter((s) => s.content);

  const hasGallery = Boolean(project.imageGallery && project.imageGallery.length > 0);

  const toc = [
    project.overview ? { id: 'overview', label: 'Overview' } : null,
    ...journey.map((s) => ({ id: s.id, label: s.label })),
    hasGallery ? { id: 'gallery', label: 'Gallery' } : null,
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors duration-200 hover:text-primary"
        style={{ color: '#64748b' }}
      >
        ← All Projects
      </Link>

      {/* ── Hero header ───────────────────────────────────── */}
      <Reveal>
        <header
          className="relative overflow-hidden rounded-card mb-10 p-7 md:p-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 140% at 0% 0%, rgba(45,212,191,0.12) 0%, transparent 55%), radial-gradient(ellipse 80% 140% at 100% 100%, rgba(139,92,246,0.10) 0%, transparent 55%), rgba(11, 19, 34, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Dot mesh */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
              backgroundSize: '26px 26px',
            }}
            aria-hidden
          />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(45,212,191,0.6)' }}>
                ~/projects/{project.slug}
              </p>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded-full"
                style={{
                  border: `1px solid ${project.deployed ? 'rgba(45,212,191,0.3)' : 'rgba(139,92,246,0.3)'}`,
                  background: project.deployed ? 'rgba(45,212,191,0.08)' : 'rgba(139,92,246,0.08)',
                  color: project.deployed ? '#5eead4' : '#a78bfa',
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: project.deployed ? '#2dd4bf' : '#8b5cf6' }}
                />
                {project.deployed ? 'Live' : 'In progress'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gradient-primary leading-tight">{project.title}</h1>

            {project.overview && (
              <p id="overview" className="scroll-mt-24 text-base md:text-lg text-foreground/75 leading-relaxed mt-4 max-w-3xl">
                {project.overview}
              </p>
            )}

            <div className="flex flex-wrap gap-2.5 mt-7">
              {project.deployed && project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-cta text-sm px-5 py-2.5">
                  Live Demo ↗
                </a>
              )}
              {project.viewCode && project.codeUrl && (
                <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm px-5 py-2.5">
                  View Code ↗
                </a>
              )}
            </div>
          </div>
        </header>
      </Reveal>

      {/* ── Body: sticky meta rail + case-study timeline ──── */}
      <div className="grid gap-10 md:grid-cols-[230px,1fr]">
        {/* Left rail */}
        <aside className="hidden md:block">
          <div className="md:sticky md:top-24 space-y-7">
            {project.techStack && project.techStack.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(45,212,191,0.7)' }}>
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <span key={t} className="tag-tech">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {toc.length > 1 && (
              <nav>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(45,212,191,0.7)' }}>
                  On this page
                </p>
                <ul className="space-y-1.5 border-l" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className="block -ml-px border-l border-transparent pl-3 py-0.5 text-sm text-muted transition-colors hover:text-primary hover:border-[rgba(45,212,191,0.5)]"
                      >
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </aside>

        {/* Mobile tech stack (rail is hidden on small screens) */}
        <div className="md:hidden -mt-2 mb-2">
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((t) => (
                <span key={t} className="tag-tech">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: numbered journey */}
        <div className="min-w-0">
          {journey.length > 0 ? (
            <Reveal stagger={0.1} className="relative">
              {journey.map((s, i) => {
                const isResult = s.id === 'result';
                const num = String(i + 1).padStart(2, '0');
                return (
                  <RevealItem key={s.id} className="relative pl-14 pb-8 last:pb-0">
                    {/* Connector line */}
                    {i < journey.length - 1 && (
                      <span
                        className="absolute left-[19px] top-11 bottom-0 w-px"
                        style={{ background: 'rgba(255,255,255,0.09)' }}
                        aria-hidden
                      />
                    )}

                    {/* Numbered badge */}
                    <span
                      className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm font-bold"
                      style={
                        isResult
                          ? {
                              background: 'var(--color-primary)',
                              color: '#061018',
                              boxShadow: '0 0 18px rgba(45,212,191,0.4)',
                            }
                          : {
                              border: '1px solid rgba(45,212,191,0.3)',
                              background: 'rgba(45,212,191,0.06)',
                              color: '#5eead4',
                            }
                      }
                    >
                      {isResult ? '✓' : num}
                    </span>

                    {/* Content card */}
                    <article
                      id={s.id}
                      className="scroll-mt-24 rounded-card p-5 md:p-6"
                      style={{
                        background: isResult ? 'rgba(45,212,191,0.06)' : 'rgba(11,19,34,0.75)',
                        border: isResult ? '1px solid rgba(45,212,191,0.28)' : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: 'var(--shadow-soft)',
                      }}
                    >
                      <h2
                        className="text-sm font-semibold uppercase tracking-widest mb-3"
                        style={{ color: isResult ? '#5eead4' : 'rgba(45,212,191,0.85)' }}
                      >
                        {s.label}
                      </h2>
                      <p className="text-foreground/80 text-[15px] leading-relaxed whitespace-pre-wrap">{s.content}</p>
                    </article>
                  </RevealItem>
                );
              })}
            </Reveal>
          ) : (
            !project.overview && <p className="text-muted text-sm">No details added for this project yet.</p>
          )}

          {/* Image gallery */}
          {hasGallery && (
            <Reveal as="section" id="gallery" className="scroll-mt-24 mt-12">
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(45,212,191,0.85)' }}>
                Gallery
              </h2>
              <Reveal stagger={0.07} className="grid gap-4 sm:grid-cols-2">
                {project.imageGallery!.map((url, i) => (
                  <RevealItem key={i} className="relative block aspect-video rounded-card overflow-hidden">
                    <a
                      href={certificationImageDisplayUrl(url) ?? url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-video rounded-card overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                      aria-label={`Open ${project.title} result image ${i + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={certificationImageImgSrc(url) ?? url}
                        alt={`${project.title} image ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </a>
                  </RevealItem>
                ))}
              </Reveal>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
