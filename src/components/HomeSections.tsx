import Link from 'next/link';
import Image from 'next/image';
import { MarkdownBody } from '@/components/MarkdownBody';
import { HeroRotatingSubtitle } from './HeroRotatingSubtitle';
import { getExperienceList, getProjectsList, getBlogList, getSkillsList } from '@/lib/data';

type Section = { id: string; type: string; enabled: boolean; order: number; data?: Record<string, unknown> };
type Hero = { title: string; subtitles: string[]; ctaText: string; ctaLink: string };

export async function HomeSections({
  sections,
  hero,
}: {
  sections: Section[];
  hero: Hero;
}) {
  const enabled = (sections || [])
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const [experience, projects, blogs, skills] = await Promise.all([
    getExperienceList(),
    getProjectsList(),
    getBlogList(true),
    getSkillsList(),
  ]);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const latestBlogs = blogs.slice(0, 3);

  return (
    <div className="space-y-20">
      {enabled.map((sec) => {
        if (sec.type === 'hero') {
          return (
            <section key={sec.id} className="hero-backdrop-glow py-16 md:py-24">
              <div className="grid gap-8 md:grid-cols-[1fr,320px] lg:grid-cols-[1fr,360px] items-center">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-3 leading-tight">
                    {hero.title}
                  </h1>
                  <div className="text-xl md:text-2xl text-secondary font-medium min-h-[2rem] mb-6">
                    <HeroRotatingSubtitle subtitles={hero.subtitles || []} />
                  </div>
                  <Link href={hero.ctaLink || '/projects'} className="btn-cta">
                    {hero.ctaText || 'View Work'}
                  </Link>
                </div>
                {/* <div className="justify-self-center md:justify-self-end w-full max-w-[360px]">
                  <div className="translate-x-[20px] -translate-y-[50px] relative mx-auto h-72 w-72 md:h-80 md:w-80">
                    <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-full bg-gradient-to-br from-secondary/35 via-primary/20 to-cyan-400/30 blur-[2px]" />
                    <div className="relative h-full w-full overflow-visible rounded-full border-2 border-primary/70 shadow-card bg-background/30">
                      <Image
                        src="/hero-photo-3d.png"
                        alt="Lokesh Chaudhary portrait"
                        fill
                        className="scale-[1.28] -translate-y-3 object-cover object-center mix-blend-multiply"
                        sizes="(max-width: 768px) 100vw, 360px"
                        priority
                      />
                    </div>
                  </div>
                </div> */}
                <div className="justify-self-center md:justify-self-end w-full max-w-[420px]">
                  <div className="relative mx-auto h-72 w-72 md:h-80 md:w-[380px] group overflow-visible">
                    {/* Elongated blue gradient behind portrait */}
                    <div
                      className="absolute inset-y-8 left-8 right-0 z-0 rounded-[999px] bg-gradient-to-r from-primary/45 via-secondary/35 to-cyan-400/30 blur-lg"
                      aria-hidden
                    />

                    <Image
                      src="/hero-photo-3d.png"
                      alt="Lokesh Chaudhary portrait"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="
          relative z-10 object-contain object-center
          scale-[1.2] md:scale-[1.32]
          -translate-y-4
          transition-all duration-500 ease-out
          group-hover:scale-[1.38] group-hover:-translate-y-6
          drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]
        "
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }
        if (sec.type === 'featured-projects') {
          return (
            <section key={sec.id}>
              <div className="section-divider-glow mb-12" aria-hidden />
              <h2 className="text-2xl font-semibold text-primary mb-6">Featured Projects</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {featuredProjects.map((p) => (
                  <article key={p.id} className={`card-project p-6 ${flashCardTone(p.title)}`}>
                    <h3 className="font-semibold text-primary">{p.title}</h3>
                    <p className="text-sm text-muted mt-1 line-clamp-2">{p.overview}</p>
                    {p.techStack && p.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {p.techStack.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2 py-0.5 rounded-button border border-secondary/35 bg-secondary/10 text-secondary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
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
                      <Link
                        href={`/projects/${p.slug}`}
                        className="inline-flex items-center justify-center rounded-button border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-primary hover:border-primary/35 transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              <Link
                href="/projects"
                className="inline-block mt-4 text-primary font-medium hover:underline"
              >
                View all →
              </Link>
              {featuredProjects.length === 0 && (
                <p className="text-muted">No featured projects yet.</p>
              )}
            </section>
          );
        }
        if (sec.type === 'about-preview') {
          return (
            <section key={sec.id}>
              <h2 className="text-2xl font-semibold text-primary mb-6">About</h2>
              <div className="max-w-2xl">
                <p className="text-muted">
                  Learn more about my background and approach.
                </p>
                <Link href="/about" className="inline-block mt-4 text-primary font-medium hover:underline">
                  Read more →
                </Link>
              </div>
            </section>
          );
        }
        if (sec.type === 'skills-snapshot') {
          return (
            <section key={sec.id}>
              <h2 className="text-2xl font-semibold text-primary mb-6">Skills</h2>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {skills.slice(0, 12).map((s) => (
                  <article
                    key={s.id}
                    className={`rounded-button border p-3 min-h-[82px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${skillCardTone(
                      s.name,
                    )}`}
                  >
                    <div className="flex flex-col items-center justify-center text-center gap-2 h-full">
                      <span className="w-8 h-8 rounded-button bg-background/55 border border-white/10 flex items-center justify-center overflow-hidden">
                        <HomeSkillIcon name={s.name} icon={s.icon} />
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-muted leading-tight group-hover:text-foreground transition-colors">
                        {s.name}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
              <Link
                href="/about#skills"
                className="inline-block mt-4 text-primary font-medium hover:underline"
              >
                View all →
              </Link>
            </section>
          );
        }
        if (sec.type === 'experience-preview') {
          return (
            <section key={sec.id}>
              <h2 className="text-2xl font-semibold text-primary mb-6">Experience</h2>
              <ul className="space-y-4">
                {experience.slice(0, 3).map((e) => (
                  <li key={e.id}>
                    <p className="font-medium text-primary">{e.role}</p>
                    <p className="text-sm text-muted">{e.organization} · {e.startDate} – {e.endDate}</p>
                  </li>
                ))}
              </ul>
              <Link
                href="/experience"
                className="inline-block mt-4 text-primary font-medium hover:underline"
              >
                Full timeline →
              </Link>
            </section>
          );
        }
        if (sec.type === 'latest-blogs') {
          return (
            <section key={sec.id}>
              <h2 className="text-2xl font-semibold text-primary mb-6">Latest from the Blog</h2>
              <div className="space-y-3">
                {latestBlogs.map((b) => (
                  <Link
                    key={b.id}
                    href={`/blog/${b.slug}`}
                    className={`card-project p-4 hover:border-primary/35 ${flashCardTone(b.title)}`}
                  >
                    <h3 className="font-medium text-primary">{b.title}</h3>
                    <p className="text-sm text-muted">
                      {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : ''}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                href="/blog"
                className="inline-block mt-4 text-primary font-medium hover:underline"
              >
                All posts →
              </Link>
            </section>
          );
        }
        if (sec.type === 'cta') {
          return (
            <section key={sec.id} className="py-12 text-center">
              <h2 className="text-2xl font-semibold text-primary mb-3">Let&apos;s work together</h2>
              <p className="text-muted mb-6 max-w-md mx-auto">
                Have a project in mind? Get in touch.
              </p>
              <Link href="/contact" className="btn-cta">
                Contact
              </Link>
            </section>
          );
        }
        if (sec.type === 'custom' && sec.data) {
          const title = (sec.data.title as string) || 'Section';
          const content = (sec.data.content as string) || '';
          return (
            <section key={sec.id}>
              <h2 className="text-2xl font-semibold text-primary mb-4">{title}</h2>
              <MarkdownBody className="prose prose-neutral max-w-2xl prose-headings:text-primary prose-p:text-muted prose-a:text-primary">
                {content}
              </MarkdownBody>
            </section>
          );
        }
        if (sec.type === 'image' && sec.data?.url) {
          const url = sec.data.url as string;
          const caption = (sec.data.caption as string) || '';
          return (
            <section key={sec.id}>
              <div className="max-w-3xl">
                <div className="relative aspect-video rounded-card overflow-hidden bg-surface border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={caption || 'Section image'} className="w-full h-full object-cover" />
                </div>
                {caption && <p className="text-sm text-muted mt-2 text-center">{caption}</p>}
              </div>
            </section>
          );
        }
        if (sec.type === 'video' && sec.data?.url) {
          const url = (sec.data.url as string).trim();
          const caption = (sec.data.caption as string) || '';
          const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
          const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
          return (
            <section key={sec.id}>
              <div className="max-w-3xl">
                <div className="relative aspect-video rounded-card overflow-hidden bg-surface border border-border">
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
                {caption && <p className="text-sm text-muted mt-2 text-center">{caption}</p>}
              </div>
            </section>
          );
        }
        return null;
      })}
    </div>
  );
}

function HomeSkillIcon({ name, icon }: { name: string; icon?: string | null }) {
  const trimmed = icon?.trim();
  const logoFromName = getSkillLogoUrl(name);
  const logoFromIcon = trimmed ? getSkillLogoUrl(trimmed) : null;
  const logoFromMap = logoFromName || logoFromIcon;
  const directUrl = trimmed && /^https?:\/\//i.test(trimmed) ? toDisplayImageSrc(trimmed) : null;

  if (directUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={directUrl}
        alt=""
        className="w-5 h-5 object-contain"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  if (logoFromMap) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoFromMap} alt="" className="w-5 h-5 object-contain" loading="lazy" />
    );
  }

  if (trimmed) {
    return <span className="text-[10px] font-bold text-secondary">{trimmed.slice(0, 3)}</span>;
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase() ?? '')
    .join('');
  return <span className="text-[10px] font-bold text-primary">{initials || '?'}</span>;
}

function skillCardTone(name: string): string {
  const tones = [
    'border-primary/35 bg-gradient-to-br from-primary/20 via-surface to-surface',
    'border-secondary/35 bg-gradient-to-br from-secondary/20 via-surface to-surface',
    'border-accent/35 bg-gradient-to-br from-accent/20 via-surface to-surface',
    'border-indigo-400/35 bg-gradient-to-br from-indigo-500/20 via-surface to-surface',
    'border-cyan-400/35 bg-gradient-to-br from-cyan-500/20 via-surface to-surface',
    'border-fuchsia-400/35 bg-gradient-to-br from-fuchsia-500/20 via-surface to-surface',
  ];
  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return tones[hash % tones.length];
}

function normalizeSkillKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
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

function getSkillLogoUrl(raw: string): string | null {
  const key = normalizeSkillKey(raw);
  const logos: Record<string, string> = {
    c: 'https://skillicons.dev/icons?i=c',
    cpp: 'https://skillicons.dev/icons?i=cpp',
    cplusplus: 'https://skillicons.dev/icons?i=cpp',
    html: 'https://cdn.simpleicons.org/html5/E34F26',
    html5: 'https://cdn.simpleicons.org/html5/E34F26',
    css: 'https://cdn.simpleicons.org/css/1572B6',
    css3: 'https://cdn.simpleicons.org/css/1572B6',
    tailwind: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
    tailwindcss: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
    javascript: 'https://cdn.simpleicons.org/javascript/F7DF1E',
    react: 'https://cdn.simpleicons.org/react/61DAFB',
    reactjs: 'https://cdn.simpleicons.org/react/61DAFB',
    nextjs: 'https://cdn.simpleicons.org/nextdotjs/FFFFFF',
    typescript: 'https://cdn.simpleicons.org/typescript/3178C6',
    redux: 'https://cdn.simpleicons.org/redux/764ABC',
    node: 'https://cdn.simpleicons.org/nodedotjs/339933',
    nodejs: 'https://cdn.simpleicons.org/nodedotjs/339933',
    express: 'https://cdn.simpleicons.org/express/FFFFFF',
    expressjs: 'https://cdn.simpleicons.org/express/FFFFFF',
    mongodb: 'https://cdn.simpleicons.org/mongodb/47A248',
    kafka: 'https://skillicons.dev/icons?i=kafka',
    postgresql: 'https://cdn.simpleicons.org/postgresql/4169E1',
    prisma: 'https://cdn.simpleicons.org/prisma/2D3748',
    prismaorm: 'https://cdn.simpleicons.org/prisma/2D3748',
    postman: 'https://skillicons.dev/icons?i=postman',
    restapi: 'https://cdn.simpleicons.org/postman/FF6C37',
    restapis: 'https://cdn.simpleicons.org/postman/FF6C37',
    websocket: 'https://cdn.simpleicons.org/socketdotio/FFFFFF',
    websockets: 'https://cdn.simpleicons.org/socketdotio/FFFFFF',
    jwt: 'https://cdn.simpleicons.org/jsonwebtokens/FFFFFF',
    oauth: 'https://cdn.simpleicons.org/auth0/EB5424',
    git: 'https://cdn.simpleicons.org/git/F05032',
    github: 'https://cdn.simpleicons.org/github/FFFFFF',
    cloudflare: 'https://skillicons.dev/icons?i=cloudflare',
    cloudflarecdn: 'https://skillicons.dev/icons?i=cloudflare',
    vercel: 'https://cdn.simpleicons.org/vercel/FFFFFF',
    netlify: 'https://cdn.simpleicons.org/netlify/00C7B7',
    render: 'https://cdn.simpleicons.org/render/46E3B7',
    railway: 'https://cdn.simpleicons.org/railway/FFFFFF',
    docker: 'https://cdn.simpleicons.org/docker/2496ED',
    figma: 'https://cdn.simpleicons.org/figma/F24E1E',
    twilio: 'https://cdn.simpleicons.org/twilio/F22F46',
    twilioapi: 'https://cdn.simpleicons.org/twilio/F22F46',
    stripe: 'https://cdn.simpleicons.org/stripe/635BFF',
    stripeapi: 'https://cdn.simpleicons.org/stripe/635BFF',
    openai: 'https://cdn.simpleicons.org/openai/10A37F',
    openaiapi: 'https://cdn.simpleicons.org/openai/10A37F',
    gemini: 'https://cdn.simpleicons.org/googlegemini/8E75B2',
    geminiapi: 'https://cdn.simpleicons.org/googlegemini/8E75B2',
    firebase: 'https://cdn.simpleicons.org/firebase/FFCA28',
    aws: 'https://cdn.simpleicons.org/amazonwebservices/FF9900',
    langchain: 'https://cdn.simpleicons.org/langchain/1C3C3C',
    python: 'https://cdn.simpleicons.org/python/3776AB',
    mcp: '/logos/mcp.svg',
    arcgis: 'https://cdn.simpleicons.org/esri/FFFFFF',
    qgis: 'https://cdn.simpleicons.org/qgis/589632',
    webgis: 'https://cdn.simpleicons.org/openstreetmap/7EBC6F',
    remotesensing: 'https://cdn.simpleicons.org/googleearth/4285F4',
    machinelearning: 'https://cdn.simpleicons.org/tensorflow/FF6F00',
    sentinel2: '/logos/sentinel2.svg',
    leaflet: 'https://cdn.simpleicons.org/leaflet/199900',
    leafletjs: 'https://cdn.simpleicons.org/leaflet/199900',
  };
  return logos[key] ?? null;
}

function toDisplayImageSrc(url: string): string {
  const filePath = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const openId = url.match(/drive\.google\.com\/open\?[^#]*id=([a-zA-Z0-9_-]+)/);
  const id = filePath?.[1] || openId?.[1];
  if (id) return `/api/cert-image?id=${encodeURIComponent(id)}`;
  return url;
}
