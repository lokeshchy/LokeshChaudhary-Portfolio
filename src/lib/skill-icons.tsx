function normalizeSkillKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getSkillLogoUrl(raw: string): string | null {
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
    prisma: 'https://cdn.simpleicons.org/prisma/FFFFFF',
    prismaorm: 'https://cdn.simpleicons.org/prisma/FFFFFF',
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

export function toDisplayImageSrc(url: string): string {
  const filePath = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const openId = url.match(/drive\.google\.com\/open\?[^#]*id=([a-zA-Z0-9_-]+)/);
  const id = filePath?.[1] || openId?.[1];
  if (id) return `/api/cert-image?id=${encodeURIComponent(id)}`;
  return url;
}

export function HomeSkillIcon({ name, icon }: { name: string; icon?: string | null }) {
  const trimmed = icon?.trim();
  const logoFromName = getSkillLogoUrl(name);
  const logoFromIcon = trimmed ? getSkillLogoUrl(trimmed) : null;
  const logoFromMap = logoFromName || logoFromIcon;
  const directUrl = trimmed && /^https?:\/\//i.test(trimmed) ? toDisplayImageSrc(trimmed) : null;

  if (directUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={directUrl} alt="" className="w-4 h-4 object-contain" loading="lazy" referrerPolicy="no-referrer" />
    );
  }
  if (logoFromMap) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoFromMap} alt="" className="w-4 h-4 object-contain" loading="lazy" />
    );
  }
  if (trimmed) {
    return <span className="text-[9px] font-bold" style={{ color: '#2dd4bf' }}>{trimmed.slice(0, 2)}</span>;
  }
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase() ?? '')
    .join('');
  return <span className="text-[9px] font-bold" style={{ color: '#2dd4bf' }}>{initials || '?'}</span>;
}
