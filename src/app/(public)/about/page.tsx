import { CertificationList } from '@/components/CertificationList';
import { getPageBySlug, getExperienceList, getProjectsList, getSettings, getSkillsList } from '@/lib/data';
import { normalizeCertifications } from '@/lib/certifications';
import { socialLinkHref } from '@/lib/social-links';

export const metadata = {
  title: 'About',
  description: 'About me',
};

/** Always read fresh CMS content from SQLite (avoid stale static shell). */
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [page, experience, projects, skills, settings] = await Promise.all([
    getPageBySlug('about'),
    getExperienceList(),
    getProjectsList(),
    getSkillsList(),
    getSettings(),
  ]);

  const content = page?.content as Record<string, unknown> | undefined;
  const bio = (content?.bio as string) || '';
  const story = (content?.story as string) || '';
  const educationRaw = (content?.education as Array<string | { name: string; year?: string }>) || [];
  const education = educationRaw.map((e) =>
    typeof e === 'string' ? { name: e, year: undefined as string | undefined } : e,
  );
  const certifications = normalizeCertifications(content?.certifications);
  const cvUrl = (content?.cvUrl as string) || '';
  const showEducation = (content?.showEducation as boolean | undefined) ?? true;
  const showCertifications = (content?.showCertifications as boolean | undefined) ?? true;
  const showExperience = (content?.showExperience as boolean | undefined) ?? true;
  const showSkills = (content?.showSkills as boolean | undefined) ?? true;
  const showCv = (content?.showCv as boolean | undefined) ?? true;

  const resumeOrder = ['Language', 'Framework/ Tools', 'GIS & ML', 'Soft Skills'] as const;
  const byCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    const c = normalizeResumeSkillCategory(s.name, s.category);
    if (!acc[c]) acc[c] = [];
    acc[c].push(s);
    return acc;
  }, {});
  const orderedCategories = [
    ...resumeOrder.filter((c) => byCategory[c]?.length),
    ...Object.keys(byCategory).filter((c) => !resumeOrder.includes(c as (typeof resumeOrder)[number])),
  ];
  const totalSkills = skills.length;
  const totalExperience = experience.length;
  const totalProjects = projects.length;
  const totalCertifications = certifications.length;
  const social = settings?.socialLinks ?? {};
  const contactEntries = Object.entries(social).filter(([, value]) => value && String(value).trim());

  return (
    <div className="max-w-frame mx-auto px-6 py-10">
      <section className="rounded-card border border-primary/45 bg-gradient-to-br from-primary/35 via-surface to-secondary/28 shadow-card p-6 md:p-8 mb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">About</h1>
            {bio && <p className="text-muted mt-3 max-w-3xl">{bio}</p>}
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto md:min-w-[320px]">
            <StatChip label="Experience" value={String(totalExperience)} />
            <StatChip label="Skills" value={String(totalSkills)} />
            <StatChip label="Certs" value={String(totalCertifications)} />
          </div>
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-[280px,1fr] lg:grid-cols-[300px,1fr] xl:grid-cols-[320px,1fr]">
        <aside className="space-y-6 md:sticky md:top-20 self-start">
          {contactEntries.length > 0 && (
            <CvBlock title="Contact" toneClass="border-cyan-400/45 bg-gradient-to-br from-cyan-500/35 via-surface to-surface">
              <div className="flex flex-wrap gap-2">
                {contactEntries.map(([key, value]) => {
                  const href = socialLinkHref(key, String(value));
                  const external = key !== 'email' && key !== 'phone' && key !== 'tel';
                  return (
                    <a
                      key={key}
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-border bg-background text-muted hover:text-primary hover:border-primary/40 transition-colors"
                      aria-label={key}
                      title={key}
                    >
                      <SidebarContactIcon keyName={key} />
                    </a>
                  );
                })}
              </div>
            </CvBlock>
          )}

          {showEducation && education.length > 0 && (
            <CvBlock title="Education" toneClass="border-indigo-400/45 bg-gradient-to-br from-indigo-500/40 via-surface to-surface">
              <ul className="space-y-3">
                {education.map((e, i) => (
                  <li
                    key={i}
                    className="rounded-button border border-indigo-300/45 bg-gradient-to-br from-indigo-500/35 via-background/70 to-surface/80 p-3"
                  >
                    <p className="font-medium text-foreground">{e.name}</p>
                    {e.year && <p className="text-xs text-muted mt-0.5">{e.year}</p>}
                  </li>
                ))}
              </ul>
            </CvBlock>
          )}

          {showSkills && (
            <CvBlock title="Core Skill" toneClass="border-fuchsia-400/45 bg-gradient-to-br from-fuchsia-500/40 via-surface to-surface">
              <div className="space-y-4">
                {orderedCategories.map((category) => {
                  const list = byCategory[category] || [];
                  if (!list.length) return null;
                  return (
                    <div key={category}>
                      <h3 className="text-xs uppercase tracking-wide text-secondary mb-2">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {list.slice(0, 8).map((s) => (
                          <span
                            key={s.id}
                            className={`inline-flex items-center gap-2 rounded-button border px-2.5 py-1.5 text-xs text-muted ${skillCardTone(s.name)}`}
                          >
                            <SkillIcon name={s.name} icon={s.icon} />
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CvBlock>
          )}

          {(showExperience || showCertifications) && (
            <CvBlock title="Quick Summary" toneClass="border-secondary/50 bg-gradient-to-br from-secondary/40 via-surface to-surface">
              <div className="space-y-3">
                <div className="rounded-button border border-cyan-400/45 bg-gradient-to-br from-cyan-500/34 via-background/70 to-surface/80 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Projects</p>
                    <span className="text-sm font-semibold text-primary">{totalProjects}</span>
                  </div>
                  <p className="text-xs text-muted mt-1">Showcased builds and case studies</p>
                </div>
                {showExperience && (
                  <div className="rounded-button border border-secondary/45 bg-gradient-to-br from-secondary/34 via-background/70 to-surface/80 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Experience</p>
                      <span className="text-sm font-semibold text-primary">{totalExperience}</span>
                    </div>
                    <p className="text-xs text-muted mt-1">Roles and timeline entries</p>
                  </div>
                )}
                {showCertifications && (
                  <div className="rounded-button border border-primary/45 bg-gradient-to-br from-primary/34 via-background/70 to-surface/80 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Certifications</p>
                      <span className="text-sm font-semibold text-primary">{totalCertifications}</span>
                    </div>
                    <p className="text-xs text-muted mt-1">Credentials and achievements</p>
                  </div>
                )}
              </div>
            </CvBlock>
          )}

          {showCv && cvUrl && (
            <CvBlock title="Resume" toneClass="border-accent/45 bg-gradient-to-br from-accent/35 via-surface to-surface">
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn-cta w-full">
                Download Resume
              </a>
            </CvBlock>
          )}
        </aside>

        <main className="space-y-8">
          {story && (
            <CvBlock title="Professional Summary" toneClass="border-primary/50 bg-gradient-to-br from-primary/40 via-surface to-surface">
              <div
                className="prose prose-neutral max-w-none text-muted prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: story.replace(/\n/g, '<br />') }}
              />
            </CvBlock>
          )}

          {showExperience && (
            <CvBlock title="Experience" id="experience" toneClass="border-indigo-400/45 bg-gradient-to-br from-indigo-500/40 via-surface to-surface">
              <ExperienceTimeline items={experience} />
            </CvBlock>
          )}

          {showCertifications && certifications.length > 0 && (
            <CvBlock title="Certifications" id="certifications" toneClass="border-primary/50 bg-gradient-to-br from-primary/40 via-surface to-surface">
              <CertificationList
                items={certifications}
                showImages={false}
                cardCtaHref="/certifications"
                cardCtaLabel="Go to certifications"
                compactSquare
              />
            </CvBlock>
          )}

          {showSkills && (
            <CvBlock title="Skills Matrix" id="skills" toneClass="border-fuchsia-400/45 bg-gradient-to-br from-fuchsia-500/40 via-surface to-surface">
              <div className="space-y-8">
                {orderedCategories.map((category) => {
                  const list = byCategory[category] || [];
                  if (!list.length) return null;
                  return (
                    <section key={category}>
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-primary/90">{category}</h3>
                        <div className="mt-2 h-0.5 w-20 rounded-full bg-gradient-to-r from-primary via-fuchsia-400 to-cyan-400" />
                      </div>
                      <div className="skills-matrix-grid grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {list.map((s, idx) => (
                          <article
                            key={s.id}
                            className={`rounded-card border p-4 min-h-[104px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${skillCardTone(
                              s.name,
                            )}`}
                            style={{ animationDelay: `${(idx % 10) * 90}ms` }}
                          >
                            <div className="flex flex-col items-center justify-center text-center gap-3 h-full">
                              <SkillIcon name={s.name} icon={s.icon} />
                              <span className="text-sm font-semibold text-muted leading-tight group-hover:text-foreground transition-colors">
                                {s.name}
                              </span>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </CvBlock>
          )}
        </main>
      </div>
    </div>
  );
}

function CvBlock({
  title,
  children,
  id,
  toneClass = '',
}: {
  title: string;
  children: import('react').ReactNode;
  id?: string;
  toneClass?: string;
}) {
  return (
    <section id={id} className={`rounded-card border border-border bg-surface/80 shadow-card p-5 md:p-6 scroll-mt-24 ${toneClass}`}>
      <h2 className="text-xl font-semibold text-primary mb-4">{title}</h2>
      {children}
    </section>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-button border border-border bg-background/60 px-3 py-2 text-center">
      <p className="text-lg font-semibold text-primary leading-none">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-muted mt-1">{label}</p>
    </div>
  );
}

function SidebarContactIcon({ keyName }: { keyName: string }) {
  const k = normalizeSocialKey(keyName);
  const logos: Record<string, string> = {
    github: 'https://cdn.simpleicons.org/github/FFFFFF',
    facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
    instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
    twitter: 'https://cdn.simpleicons.org/x/FFFFFF',
    email: 'https://cdn.simpleicons.org/gmail/EA4335',
  };
  if (k === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
        <path
          fill="#0A66C2"
          d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.53V9H7.1v11.45Z"
        />
      </svg>
    );
  }
  if (k === 'phone' || k === 'tel') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
        <path
          fill="currentColor"
          d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.7.6 4 .6.7 0 1.2.6 1.2 1.2V20c0 .7-.6 1.2-1.2 1.2C11.8 21.2 2.8 12.2 2.8 3.4 2.8 2.7 3.4 2.2 4 2.2h3.3c.7 0 1.2.6 1.2 1.2 0 1.4.2 2.7.6 4 .1.4 0 .9-.3 1.2l-2.2 2.2Z"
        />
      </svg>
    );
  }
  const src = logos[k];
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="h-4 w-4 object-contain" loading="lazy" referrerPolicy="no-referrer" />
    );
  }
  return <span className="text-xs font-semibold">{k.slice(0, 2).toUpperCase()}</span>;
}

function normalizeSocialKey(key: string): string {
  const k = key.toLowerCase().trim();
  if (k === 'linkein' || k === 'linkdin') return 'linkedin';
  if (k === 'mobile') return 'phone';
  return k;
}

function SkillIcon({ name, icon }: { name: string; icon?: string | null }) {
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
        className="w-6 h-6 object-contain"
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
    const t = trimmed.slice(0, 3);
    return <span className="text-xs font-bold text-secondary">{t}</span>;
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase() ?? '')
    .join('');
  return <span className="text-xs font-bold text-primary">{initials || '?'}</span>;
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

function normalizeResumeSkillCategory(name: string, currentCategory?: string | null): string {
  const key = normalizeSkillKey(name);

  const languageKeys = new Set([
    'typescript',
    'javascript',
    'c',
    'cplusplus',
    'cpp',
    'python',
    'html',
    'html5',
    'css',
    'css3',
    'nodejs',
    'node',
    'postgresql',
  ]);
  const frameworkToolsKeys = new Set([
    'react',
    'reactjs',
    'nextjs',
    'tailwindcss',
    'tailwind',
    'express',
    'expressjs',
    'git',
    'github',
    'figma',
    'mongodb',
    'postman',
    'restapi',
    'restapis',
    'langchain',
    'mcp',
    'webgis',
    'cloudflare',
    'cloudflarecdn',
    'kafka',
    'redis',
    'docker',
  ]);
  const gisMlKeys = new Set([
    'arcgis',
    'qgis',
    'webgis',
    'remotesensing',
    'machinelearning',
    'sentinel2',
    'leaflet',
    'ml',
    'gis',
  ]);
  const softSkillKeys = new Set([
    'teamwork',
    'problemsolving',
    'decisionmaking',
    'communication',
    'leadership',
    'collaboration',
  ]);

  if (languageKeys.has(key)) return 'Language';
  if (gisMlKeys.has(key)) return 'GIS & ML';
  if (softSkillKeys.has(key)) return 'Soft Skills';
  if (frameworkToolsKeys.has(key)) return 'Framework/ Tools';

  const c = (currentCategory || '').toLowerCase();
  if (c.includes('gis') || c.includes('ml')) return 'GIS & ML';
  if (c.includes('soft')) return 'Soft Skills';
  if (c.includes('language')) return 'Language';
  return 'Framework/ Tools';
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

function ExperienceTimeline({
  items,
}: {
  items: Array<{
    id: string;
    role: string;
    organization: string;
    location?: string | null;
    startDate: string;
    endDate: string;
    description: string[];
    type: string;
  }>;
}) {
  return (
    <div className="relative pl-6 border-l-2 border-border space-y-8">
      {items.map((e) => (
        <div key={e.id} className="relative">
          <span className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
          <div className={`rounded-card shadow-soft p-5 border ${skillCardTone(`${e.role}-${e.organization}`)}`}>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-semibold text-primary">{e.role}</h3>
              <span className="text-sm text-muted">{e.organization}</span>
              {e.location && <span className="text-sm text-muted">· {e.location}</span>}
            </div>
            <p className="text-sm text-muted mt-1">
              {e.startDate} – {e.endDate} · {e.type}
            </p>
            {e.description.length > 0 && (
              <ul className="mt-3 list-disc list-inside text-muted text-sm space-y-1">
                {e.description.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
