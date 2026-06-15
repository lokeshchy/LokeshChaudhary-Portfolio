import { CertificationFlipCards } from '@/components/CertificationFlipCards';
import { ExperienceCarousel } from '@/components/ExperienceCarousel';
import { SkillsMarquee } from '@/components/SkillsMarquee';
import { Reveal } from '@/components/motion/Reveal';
import { getPageBySlug, getExperienceList, getProjectsList, getSettings, getSkillsList } from '@/lib/data';
import { normalizeCertifications } from '@/lib/certifications';
import { socialLinkHref } from '@/lib/social-links';

export const metadata = {
  title: 'About',
  description: 'About me',
};

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
  const certificationsVisible = showCertifications && totalCertifications > 0;
  const social = settings?.socialLinks ?? {};
  const contactEntries = Object.entries(social).filter(([, value]) => value && String(value).trim());

  return (
    <div className="max-w-frame mx-auto px-4 md:px-6 pt-6 pb-12">
      {/* Compact resume-style header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'rgba(45,212,191,0.55)' }}>
            ~/about
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-primary leading-tight">About Me</h1>
          {bio && <p className="text-muted mt-2.5 max-w-2xl text-base leading-relaxed">{bio}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          {showExperience && <StatChip label="Experience" value={String(totalExperience)} />}
          {showSkills && <StatChip label="Skills" value={String(totalSkills)} />}
          {certificationsVisible && <StatChip label="Certs" value={String(totalCertifications)} />}
        </div>
      </header>

      {/* Resume two-column layout — sidebar is viewport-locked */}
      <div className="grid gap-6 md:grid-cols-[256px,1fr] lg:grid-cols-[280px,1fr]">
        {/* Sidebar — sticky at top, no independent scroll */}
        <aside className="md:sticky md:top-20 self-start space-y-4">
          {contactEntries.length > 0 && (
            <CvBlock title="Contact">
              <div className="flex flex-wrap gap-2">
                {contactEntries.map(([key, value]) => {
                  const href = socialLinkHref(key, String(value));
                  const external = key !== 'email' && key !== 'phone' && key !== 'tel';
                  return (
                    <a
                      key={key}
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 text-muted hover:text-primary"
                      style={{
                        border: '1px solid rgba(255,255,255,0.07)',
                        background: 'rgba(255,255,255,0.03)',
                      }}
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
            <CvBlock title="Education">
              <ul className="space-y-2">
                {education.map((e, i) => (
                  <li
                    key={i}
                    className="rounded-lg p-3"
                    style={{
                      border: '1px solid rgba(255,255,255,0.07)',
                      background: 'rgba(11,19,34,0.5)',
                    }}
                  >
                    <p className="font-medium text-[15px] text-foreground leading-snug">{e.name}</p>
                    {e.year && (
                      <p className="text-[13px] font-mono mt-1" style={{ color: 'rgba(45,212,191,0.6)' }}>
                        {e.year}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </CvBlock>
          )}

          {(showExperience || certificationsVisible) && (
            <CvBlock title="Quick Summary" immediate>
              <div className="space-y-2">
                <SummaryRow
                  label="Projects"
                  value={totalProjects}
                  desc="Showcased builds"
                  borderColor="rgba(45,212,191,0.2)"
                  bgColor="rgba(45,212,191,0.05)"
                />
                {showExperience && (
                  <SummaryRow
                    label="Experience"
                    value={totalExperience}
                    desc="Roles and timeline"
                    borderColor="rgba(139,92,246,0.2)"
                    bgColor="rgba(139,92,246,0.05)"
                  />
                )}
                {certificationsVisible && (
                  <SummaryRow
                    label="Certifications"
                    value={totalCertifications}
                    desc="Credentials earned"
                    borderColor="rgba(255,255,255,0.07)"
                    bgColor="rgba(11,19,34,0.4)"
                  />
                )}
              </div>
            </CvBlock>
          )}

          {showCv && cvUrl && (
            <div className="hidden md:block">
              <CvBlock title="Resume">
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn-cta w-full text-center">
                  Download PDF
                </a>
              </CvBlock>
            </div>
          )}
        </aside>

        {/* Main content — scrolls with page */}
        <main className="space-y-6 min-w-0">
          {story && (
            <CvBlock title="Professional Summary" id="summary">
              <div
                className="text-muted text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: story.replace(/\n/g, '<br />') }}
              />
            </CvBlock>
          )}

          {showExperience && (
            <CvBlock title="Experience" id="experience">
              <ExperienceCarousel items={experience} />
            </CvBlock>
          )}

          {showSkills && (
            <CvBlock title="Skills" id="skills">
              <div className="space-y-6">
                {orderedCategories.map((category, i) => {
                  const list = byCategory[category] || [];
                  if (!list.length) return null;
                  return (
                    <section key={category}>
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="tag-category">{category}</h3>
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <span className="text-[13px] font-mono" style={{ color: 'rgba(100,116,139,0.6)' }}>
                          {list.length}
                        </span>
                      </div>
                      <SkillsMarquee
                        skills={list}
                        ariaLabel={`${category} skills`}
                        reverse={i % 2 === 1}
                      />
                    </section>
                  );
                })}
              </div>
            </CvBlock>
          )}

          {certificationsVisible && (
            <CvBlock title="Certifications" id="certifications">
              <CertificationFlipCards items={certifications} />
            </CvBlock>
          )}

          {showCv && cvUrl && (
            <div className="md:hidden">
              <CvBlock title="Resume">
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn-cta w-full text-center">
                  Download PDF
                </a>
              </CvBlock>
            </div>
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
  immediate,
}: {
  title: string;
  children: import('react').ReactNode;
  id?: string;
  immediate?: boolean;
}) {
  return (
    <Reveal
      as="section"
      id={id}
      immediate={immediate}
      className="rounded-card p-5 md:p-6 scroll-mt-24"
      style={{
        background: 'rgba(11, 19, 34, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <h2 className="text-base font-semibold uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: 'rgba(45,212,191,0.85)' }}>
        <span className="inline-block h-4 w-1 rounded-full" style={{ background: 'var(--color-primary)' }} aria-hidden />
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg px-4 py-3 text-center"
      style={{
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(11,19,34,0.5)',
      }}
    >
      <p className="text-2xl font-bold leading-none text-gradient-primary">{value}</p>
      <p className="text-xs uppercase tracking-wide mt-1.5" style={{ color: '#64748b' }}>
        {label}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  desc,
  borderColor,
  bgColor,
}: {
  label: string;
  value: number;
  desc: string;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div
      className="rounded-lg p-3 flex items-center justify-between"
      style={{ border: `1px solid ${borderColor}`, background: bgColor }}
    >
      <div>
        <p className="text-[15px] font-medium text-foreground">{label}</p>
        <p className="text-[13px] text-muted mt-0.5">{desc}</p>
      </div>
      <span className="text-2xl font-bold font-mono text-gradient-primary">{value}</span>
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

function SkillIcon({ name, icon, size = 'md' }: { name: string; icon?: string | null; size?: 'sm' | 'md' }) {
  const trimmed = icon?.trim();
  const logoFromName = getSkillLogoUrl(name);
  const logoFromIcon = trimmed ? getSkillLogoUrl(trimmed) : null;
  const logoFromMap = logoFromName || logoFromIcon;
  const directUrl = trimmed && /^https?:\/\//i.test(trimmed) ? toDisplayImageSrc(trimmed) : null;
  const imgClass = size === 'sm' ? 'w-3.5 h-3.5 object-contain' : 'w-5 h-5 object-contain';

  if (directUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={directUrl} alt="" className={imgClass} loading="lazy" referrerPolicy="no-referrer" />
    );
  }

  if (logoFromMap) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoFromMap} alt="" className={imgClass} loading="lazy" />
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

function normalizeSkillKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeResumeSkillCategory(name: string, currentCategory?: string | null): string {
  const key = normalizeSkillKey(name);

  const languageKeys = new Set([
    'typescript', 'javascript', 'c', 'cplusplus', 'cpp', 'python',
    'html', 'html5', 'css', 'css3', 'nodejs', 'node', 'postgresql',
  ]);
  const frameworkToolsKeys = new Set([
    'react', 'reactjs', 'nextjs', 'tailwindcss', 'tailwind', 'express', 'expressjs',
    'git', 'github', 'figma', 'mongodb', 'postman', 'restapi', 'restapis',
    'langchain', 'mcp', 'webgis', 'cloudflare', 'cloudflarecdn', 'kafka', 'redis', 'docker',
  ]);
  const gisMlKeys = new Set([
    'arcgis', 'qgis', 'webgis', 'remotesensing', 'machinelearning',
    'sentinel2', 'leaflet', 'ml', 'gis',
  ]);
  const softSkillKeys = new Set([
    'teamwork', 'problemsolving', 'decisionmaking', 'communication', 'leadership', 'collaboration',
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

