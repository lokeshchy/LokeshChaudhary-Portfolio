import Link from 'next/link';
import { MarkdownBody } from '@/components/MarkdownBody';
import { SkillsMarquee } from './SkillsMarquee';
import { HeroIntro } from './HeroIntro';
import { HeroPortrait3D } from './HeroPortrait3D';
import { Reveal, RevealItem } from './motion/Reveal';
import { Tilt3D } from './motion/Tilt3D';
import { socialLinkHref, socialLinkLabel } from '@/lib/social-links';
import {
  getExperienceList,
  getProjectsList,
  getBlogList,
  getSkillsList,
  getPageBySlug,
  getSettings,
} from '@/lib/data';

type Section = { id: string; type: string; enabled: boolean; order: number; data?: Record<string, unknown> };
type Hero = { title: string; subtitles: string[]; ctaText: string; ctaLink: string };

/** Preferred landing-page flow: intro → experience → skills → work → writing → CTA */
const HOME_SECTION_RANK: Record<string, number> = {
  hero: 0,
  'about-preview': 1,
  'experience-preview': 2,
  'skills-snapshot': 3,
  'featured-projects': 4,
  'latest-blogs': 5,
  cta: 6,
};

function homeSectionRank(section: Section): number {
  if (section.type in HOME_SECTION_RANK) return HOME_SECTION_RANK[section.type];
  return 100 + section.order;
}

/** Editorial section heading: index number, overline, title, optional link. */
function SectionHeader({
  index,
  overline,
  title,
  href,
  hrefLabel,
}: {
  index?: string;
  overline: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-10">
      <div className="flex items-start gap-4">
        {index && (
          <span className="font-mono text-sm pt-1 select-none" style={{ color: 'rgba(45,212,191,0.35)' }}>
            {index}
          </span>
        )}
        <div>
          <span className="section-overline mb-2">{overline}</span>
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="text-gradient-primary">{title}</span>
          </h2>
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="group hidden sm:flex items-center gap-1.5 text-xs text-muted hover:text-[#2dd4bf] transition-colors font-mono shrink-0"
        >
          {hrefLabel}
          <span className="transform group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Link>
      )}
    </div>
  );
}

export async function HomeSections({
  sections,
  hero,
}: {
  sections: Section[];
  hero: Hero;
}) {
  const enabled = (sections || [])
    .filter((s) => s.enabled)
    .sort((a, b) => homeSectionRank(a) - homeSectionRank(b) || a.order - b.order);

  const [experience, projects, blogs, skills, aboutPage, settings] = await Promise.all([
    getExperienceList(),
    getProjectsList(),
    getBlogList(true),
    getSkillsList(),
    getPageBySlug('about'),
    getSettings(),
  ]);

  // Spotlight + a balanced row of 3. Fill from the most recent non-featured
  // projects if there aren't enough featured ones to complete the row.
  const showcaseProjects = [
    ...projects.filter((p) => p.featured),
    ...projects.filter((p) => !p.featured),
  ].slice(0, 4);
  const latestBlogs = blogs.slice(0, 4);

  const aboutContent = aboutPage?.content as Record<string, unknown> | undefined;
  const bio = (aboutContent?.bio as string) || '';
  const social = (settings?.socialLinks ?? {}) as Record<string, string>;
  const contactEntries = Object.entries(social).filter(([, v]) => v && String(v).trim());

  // Editorial index numbers for the major content sections (hero excluded).
  const numberFor: Record<string, string> = {};
  let counter = 0;
  enabled.forEach((s) => {
    if (s.type !== 'hero') {
      counter += 1;
      numberFor[s.id] = String(counter).padStart(2, '0');
    }
  });

  return (
    <>
      <div className="space-y-28">
        {enabled.map((sec) => {
          /* ── Hero ──────────────────────────────────────────── */
          if (sec.type === 'hero') {
            return (
              <section
                key={sec.id}
                className="hero-backdrop-glow relative overflow-hidden flex flex-col justify-center min-h-[calc(100vh-4rem)] py-12 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-6 md:px-10 lg:px-16 xl:px-24 -mt-12"
              >
                <div className="hero-orb hero-orb-1" aria-hidden />
                <div className="hero-orb hero-orb-2" aria-hidden />

                <div className="grid gap-14 md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_520px] items-center relative z-10 flex-1">
                  <HeroIntro
                    title={hero.title}
                    subtitles={hero.subtitles || []}
                    ctaText={hero.ctaText}
                    ctaLink={hero.ctaLink}
                    stats={[
                      { value: projects.length, label: 'Projects' },
                      { value: experience.length, label: 'Roles' },
                      { value: skills.length, label: 'Skills' },
                    ]}
                  />
                  <HeroPortrait3D src="/hero-photo-3d.png" alt="Lokesh Chaudhary portrait" />
                </div>

                <div className="scroll-cue mt-8 flex justify-center" aria-hidden>
                  <span className="scroll-cue-mouse">
                    <span className="scroll-cue-dot" />
                  </span>
                </div>
              </section>
            );
          }

          /* ── Featured Projects — spotlight + grid ──────────── */
          if (sec.type === 'featured-projects') {
            const [spotlight, ...rest] = showcaseProjects;
            return (
              <Reveal as="section" key={sec.id}>
                <div className="section-divider-glow mb-14" aria-hidden />
                <SectionHeader
                  index={numberFor[sec.id]}
                  overline="Selected Work"
                  title="Featured Projects"
                  href="/projects"
                  hrefLabel="view all"
                />

                {!spotlight ? (
                  <p className="text-muted text-sm">No featured projects yet.</p>
                ) : (
                  <div className="space-y-5">
                    {/* Spotlight */}
                    <Tilt3D max={5} glare={false} scale={1.005}>
                      <article
                        className="card-project card-gradient-border relative overflow-hidden grid md:grid-cols-[1.4fr_1fr] gap-6 p-7 md:p-9 group"
                        style={{ position: 'relative' }}
                      >
                        <span
                          className="absolute -top-6 -right-2 text-[7rem] font-black leading-none select-none pointer-events-none"
                          style={{ color: 'rgba(255,255,255,0.025)' }}
                        >
                          01
                        </span>
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="tag-category">Spotlight</span>
                            {spotlight.deployed && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full border border-[rgba(45,212,191,0.25)] text-[#5eead4] bg-[rgba(45,212,191,0.06)]">
                                ● Live
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-[#2dd4bf] transition-colors leading-tight mb-3">
                            {spotlight.title}
                          </h3>
                          <p className="text-sm text-muted leading-relaxed line-clamp-4 mb-5 max-w-xl">
                            {spotlight.overview}
                          </p>
                          {spotlight.techStack?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-6">
                              {spotlight.techStack.slice(0, 7).map((t) => (
                                <span key={t} className="tag-tech">{t}</span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            {spotlight.deployed && spotlight.demoUrl && (
                              <a
                                href={spotlight.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#2dd4bf] hover:text-[#5eead4] transition-colors font-medium"
                              >
                                ↗ Live Demo
                              </a>
                            )}
                            {spotlight.viewCode && spotlight.codeUrl && (
                              <a
                                href={spotlight.codeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted hover:text-foreground transition-colors"
                              >
                                Code
                              </a>
                            )}
                            <Link
                              href={`/projects/${spotlight.slug}`}
                              className="ml-auto text-sm text-muted hover:text-[#2dd4bf] transition-colors flex items-center gap-1 group/link"
                            >
                              Case study
                              <span className="transform group-hover/link:translate-x-0.5 transition-transform inline-block">→</span>
                            </Link>
                          </div>
                        </div>

                        {/* Decorative meta panel */}
                        <div
                          className="relative z-10 hidden md:flex flex-col justify-center rounded-2xl p-6"
                          style={{
                            background:
                              'radial-gradient(ellipse 100% 100% at 100% 0%, rgba(45,212,191,0.08), transparent 60%), rgba(7,12,24,0.4)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'rgba(45,212,191,0.5)' }}>
                            ~/featured
                          </p>
                          <p className="text-4xl font-bold text-gradient-primary tabular-nums">
                            {spotlight.techStack?.length ?? 0}
                          </p>
                          <p className="text-[11px] text-muted font-mono uppercase tracking-wider mb-5">technologies</p>
                          <div className="h-px w-full mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />
                          <p className="text-sm text-muted leading-relaxed">
                            A flagship build showcasing end-to-end product thinking.
                          </p>
                        </div>
                      </article>
                    </Tilt3D>

                    {/* Remaining featured */}
                    {rest.length > 0 && (
                      <Reveal stagger={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {rest.map((p, idx) => (
                          <RevealItem key={p.id} className="h-full">
                            <Tilt3D className="h-full" max={9} glare={false} scale={1.025}>
                              <article className="card-project card-gradient-border p-6 flex flex-col group h-full" style={{ position: 'relative' }}>
                                <span
                                  className="absolute top-4 right-5 text-[3rem] font-black leading-none select-none pointer-events-none"
                                  style={{ color: 'rgba(255,255,255,0.028)' }}
                                >
                                  {String(idx + 2).padStart(2, '0')}
                                </span>
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <h3 className="font-semibold text-foreground text-sm group-hover:text-[#2dd4bf] transition-colors leading-snug">
                                    {p.title}
                                  </h3>
                                </div>
                                <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-5 flex-1">{p.overview}</p>
                                {p.techStack?.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mb-5">
                                    {p.techStack.slice(0, 4).map((t) => (
                                      <span key={t} className="tag-tech">{t}</span>
                                    ))}
                                    {p.techStack.length > 4 && (
                                      <span className="tag-tech opacity-50">+{p.techStack.length - 4}</span>
                                    )}
                                  </div>
                                )}
                                <div className="flex items-center gap-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                                  {p.deployed && p.demoUrl && (
                                    <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#2dd4bf] hover:text-[#5eead4] transition-colors font-medium">
                                      ↗ Live
                                    </a>
                                  )}
                                  {p.viewCode && p.codeUrl && (
                                    <a href={p.codeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted hover:text-foreground transition-colors">
                                      Code
                                    </a>
                                  )}
                                  <Link href={`/projects/${p.slug}`} className="ml-auto text-xs text-muted hover:text-[#2dd4bf] transition-colors group/link flex items-center gap-1">
                                    Details
                                    <span className="transform group-hover/link:translate-x-0.5 transition-transform inline-block">→</span>
                                  </Link>
                                </div>
                              </article>
                            </Tilt3D>
                          </RevealItem>
                        ))}
                      </Reveal>
                    )}
                  </div>
                )}
              </Reveal>
            );
          }

          /* ── About Preview — bio + focus + stats ───────────── */
          if (sec.type === 'about-preview') {
            return (
              <Reveal as="section" key={sec.id}>
                <div className="section-divider-glow mb-14" aria-hidden />
                <SectionHeader
                  index={numberFor[sec.id]}
                  overline="Who I am"
                  title="About"
                  href="/about"
                  hrefLabel="full resume"
                />

                <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
                  <div className="card-glass rounded-2xl p-8 md:p-10 flex flex-col">
                    <p className="text-base text-foreground/80 leading-relaxed mb-7 max-w-2xl">
                      {bio ||
                        'Geomatics engineer and software developer — bridging spatial intelligence with modern web systems.'}
                    </p>

                    {contactEntries.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-7">
                        {contactEntries.slice(0, 5).map(([key, value]) => (
                          <a
                            key={key}
                            href={socialLinkHref(key, value)}
                            target={key === 'email' || key === 'phone' ? undefined : '_blank'}
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-muted hover:border-[rgba(45,212,191,0.3)] hover:text-[#2dd4bf] transition-all duration-200"
                          >
                            {socialLinkLabel(key)}
                          </a>
                        ))}
                      </div>
                    )}

                    <Link
                      href="/about"
                      className="group inline-flex items-center gap-2 text-sm text-[#2dd4bf]/70 hover:text-[#2dd4bf] transition-colors font-mono mt-auto"
                    >
                      Read full resume
                      <span className="transform group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </Link>
                  </div>

                  {/* Stat bento */}
                  <div className="grid grid-cols-2 gap-5">
                    {[
                      { value: projects.length, label: 'Projects', accent: 'rgba(45,212,191,0.1)' },
                      { value: experience.length, label: 'Roles', accent: 'rgba(139,92,246,0.1)' },
                      { value: skills.length, label: 'Skills', accent: 'rgba(6,182,212,0.1)' },
                      { value: blogs.length, label: 'Articles', accent: 'rgba(45,212,191,0.08)' },
                    ].map(({ value, label, accent }) => (
                      <div
                        key={label}
                        className="card-glass rounded-2xl p-6 flex flex-col justify-center"
                        style={{ background: `radial-gradient(ellipse 120% 120% at 0% 0%, ${accent}, transparent 70%), rgba(11,19,34,0.6)` }}
                      >
                        <div className="text-3xl md:text-4xl font-bold tabular-nums text-gradient-primary">{value}+</div>
                        <div className="text-[11px] text-muted font-mono uppercase tracking-wider mt-1">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          }

          /* ── Skills Snapshot ───────────────────────────────── */
          if (sec.type === 'skills-snapshot') {
            return (
              <Reveal as="section" key={sec.id}>
                <div className="section-divider-glow mb-14" aria-hidden />
                <SectionHeader
                  index={numberFor[sec.id]}
                  overline="Tech Stack"
                  title="Skills"
                  href="/about#skills"
                  hrefLabel="view all"
                />
                <SkillsMarquee skills={skills} />
              </Reveal>
            );
          }

          /* ── Experience Preview — timeline ─────────────────── */
          if (sec.type === 'experience-preview') {
            const items = experience.slice(0, 4);
            return (
              <Reveal as="section" key={sec.id}>
                <div className="section-divider-glow mb-14" aria-hidden />
                <SectionHeader
                  index={numberFor[sec.id]}
                  overline="Career"
                  title="Experience"
                  href="/about#experience"
                  hrefLabel="full timeline"
                />

                <Reveal
                  stagger={0.1}
                  className="relative pl-7"
                  style={{ borderLeft: '2px solid rgba(45,212,191,0.14)' }}
                >
                  {items.map((e) => (
                    <RevealItem key={e.id} className="relative pb-6 last:pb-0">
                      <span className="absolute -left-[34px] top-1 timeline-dot" />
                      <div className="exp-card-home px-6 py-5 flex items-start gap-5 group">
                        <div className="shrink-0 flex flex-col items-center pt-0.5 w-12">
                          <span className="text-[11px] font-mono font-semibold" style={{ color: 'rgba(45,212,191,0.6)' }}>
                            {e.startDate?.slice(0, 4) ?? '----'}
                          </span>
                          <div className="w-px h-5 bg-[rgba(45,212,191,0.18)] my-1" />
                          <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.22)' }}>
                            {e.endDate?.slice(0, 4) ?? 'now'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-[15px] group-hover:text-[#2dd4bf] transition-colors mb-0.5">
                            {e.role}
                          </p>
                          <p className="text-xs text-muted">
                            {e.organization}
                            {e.location ? ` · ${e.location}` : ''}
                          </p>
                          {e.description?.[0] && (
                            <p className="text-[13px] mt-2 line-clamp-1" style={{ color: 'rgba(100,116,139,0.8)' }}>
                              {e.description[0]}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1.5 mt-0.5">
                          {e.workMode && <span className="work-mode-badge">{e.workMode}</span>}
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[rgba(139,92,246,0.2)] text-[rgba(139,92,246,0.55)] bg-[rgba(139,92,246,0.05)]">
                            {e.type}
                          </span>
                        </div>
                      </div>
                    </RevealItem>
                  ))}
                </Reveal>
              </Reveal>
            );
          }

          /* ── Latest Blogs — featured first + list ──────────── */
          if (sec.type === 'latest-blogs') {
            const [lead, ...restBlogs] = latestBlogs;
            const fmt = (d?: string | Date | null) =>
              d
                ? `${new Date(d).toLocaleDateString('en-US', { month: 'short' })} ${new Date(d).getFullYear()}`
                : '—';
            return (
              <Reveal as="section" key={sec.id}>
                <div className="section-divider-glow mb-14" aria-hidden />
                <SectionHeader
                  index={numberFor[sec.id]}
                  overline="Thoughts"
                  title="Latest Writing"
                  href="/blog"
                  hrefLabel="all posts"
                />

                {!lead ? (
                  <p className="text-muted text-sm">No posts published yet.</p>
                ) : (
                  <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
                    {/* Lead post */}
                    <Link
                      href={`/blog/${lead.slug}`}
                      className="card-project card-gradient-border p-7 md:p-8 flex flex-col group hover:no-underline justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="tag-category">Latest</span>
                          <span className="text-[11px] font-mono text-muted">{fmt(lead.publishedAt)}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-[#2dd4bf] transition-colors leading-snug mb-3">
                          {lead.title}
                        </h3>
                        {lead.excerpt && <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-5">{lead.excerpt}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {lead.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="tag-tech">{tag}</span>
                        ))}
                        <span className="ml-auto text-sm text-[#2dd4bf]/70 group-hover:text-[#2dd4bf] flex items-center gap-1 transition-colors">
                          Read <span className="transform group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                        </span>
                      </div>
                    </Link>

                    {/* Compact list */}
                    {restBlogs.length > 0 && (
                      <Reveal stagger={0.09} className="flex flex-col gap-3">
                        {restBlogs.map((b) => (
                          <RevealItem key={b.id} className="h-full">
                            <Link
                              href={`/blog/${b.slug}`}
                              className="card-project flex items-start gap-4 px-5 py-4 group hover:no-underline h-full"
                            >
                              <div className="shrink-0 w-12 pt-0.5">
                                <div className="text-[10px] font-mono font-semibold uppercase" style={{ color: 'rgba(45,212,191,0.55)' }}>
                                  {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString('en-US', { month: 'short' }) : '—'}
                                </div>
                                <div className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                                  {b.publishedAt ? new Date(b.publishedAt).getFullYear() : ''}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-foreground text-sm group-hover:text-[#2dd4bf] transition-colors leading-snug mb-1 line-clamp-2">
                                  {b.title}
                                </h3>
                                {b.excerpt && <p className="text-[11px] text-muted line-clamp-1">{b.excerpt}</p>}
                              </div>
                              <span className="text-muted group-hover:text-[#2dd4bf] transition-colors transform group-hover:translate-x-1 inline-block text-sm self-center">
                                →
                              </span>
                            </Link>
                          </RevealItem>
                        ))}
                      </Reveal>
                    )}
                  </div>
                )}
              </Reveal>
            );
          }

          /* ── CTA ───────────────────────────────────────────── */
          if (sec.type === 'cta') {
            return (
              <Reveal as="section" key={sec.id} className="py-6">
                <div
                  className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.07)] p-12 md:p-16 text-center"
                  style={{
                    background:
                      'radial-gradient(ellipse 70% 120% at 50% 100%, rgba(45,212,191,0.11) 0%, rgba(139,92,246,0.08) 40%, rgba(7,12,24,0.96) 100%)',
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)',
                      backgroundSize: '28px 28px',
                    }}
                    aria-hidden
                  />
                  <span className="absolute top-4 left-5 text-[9px] font-mono text-[rgba(45,212,191,0.2)] select-none">
                    01 / contact
                  </span>
                  <span className="absolute bottom-4 right-5 text-[9px] font-mono text-[rgba(139,92,246,0.2)] select-none">
                    open_to_work
                  </span>
                  <div className="relative">
                    <p className="tag-category mb-5">Open to opportunities</p>
                    <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                      Let&apos;s build something together
                    </h2>
                    <p className="text-sm text-muted mb-10 max-w-md mx-auto leading-relaxed">
                      Geospatial systems, full-stack platforms, or something at the intersection — I&apos;m interested in meaningful work.
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <Link href="/about" className="btn-cta">Get in touch</Link>
                      <Link href="/projects" className="btn-outline">See my work</Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          }

          /* ── Custom Markdown page section ─────────────────── */
          if (sec.type === 'custom' && sec.data) {
            const title = (sec.data.title as string) || 'Section';
            const content = (sec.data.content as string) || '';
            return (
              <Reveal as="section" key={sec.id}>
                <div className="section-divider-glow mb-14" aria-hidden />
                <h2 className="text-2xl font-bold mb-6">
                  <span className="text-gradient-primary">{title}</span>
                </h2>
                <MarkdownBody className="prose prose-neutral max-w-2xl prose-headings:text-foreground prose-p:text-muted prose-a:text-[#2dd4bf]">
                  {content}
                </MarkdownBody>
              </Reveal>
            );
          }

          /* ── Image section ─────────────────────────────────── */
          if (sec.type === 'image' && sec.data?.url) {
            const url = sec.data.url as string;
            const caption = (sec.data.caption as string) || '';
            return (
              <Reveal as="section" key={sec.id}>
                <div className="max-w-3xl">
                  <div className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden border border-[rgba(255,255,255,0.07)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={caption || 'Section image'} className="w-full h-full object-cover" />
                  </div>
                  {caption && <p className="text-xs text-muted mt-2 text-center font-mono">{caption}</p>}
                </div>
              </Reveal>
            );
          }

          /* ── Video section ─────────────────────────────────── */
          if (sec.type === 'video' && sec.data?.url) {
            const url = (sec.data.url as string).trim();
            const caption = (sec.data.caption as string) || '';
            const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
            const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
            return (
              <Reveal as="section" key={sec.id}>
                <div className="max-w-3xl">
                  <div className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden border border-[rgba(255,255,255,0.07)]">
                    {ytMatch ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                        title="Video"
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    ) : vimeoMatch ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                        title="Video"
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={url} controls className="w-full h-full object-contain" />
                    )}
                  </div>
                  {caption && <p className="text-xs text-muted mt-2 text-center font-mono">{caption}</p>}
                </div>
              </Reveal>
            );
          }

          return null;
        })}
      </div>
    </>
  );
}
