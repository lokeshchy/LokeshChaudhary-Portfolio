'use client';

import { useEffect, useState } from 'react';
import { socialLinkHref } from '@/lib/social-links';

export function PublicFooter() {
  const [settings, setSettings] = useState<{
    footerText?: string;
    siteName?: string;
    socialLinks?: Record<string, string>;
  }>({});

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const links = settings.socialLinks
    ? Object.entries(settings.socialLinks).filter(([, v]) => v)
    : [];

  return (
    <footer
      className="mt-auto"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(7, 12, 24, 0.6)',
      }}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: copy + tagline */}
          <div className="text-center sm:text-left">
            <p className="text-xs font-mono" style={{ color: 'rgba(100, 116, 139, 0.8)' }}>
              {settings.footerText ||
                `© ${new Date().getFullYear()} ${settings.siteName || 'Portfolio'}`}
            </p>
            <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(45, 212, 191, 0.3)' }}>
              Geomatics × Software Engineering
            </p>
          </div>

          {/* Right: social links */}
          {links.length > 0 && (
            <div className="flex gap-2">
              {links.map(([key, url]) => {
                const href = socialLinkHref(key, url);
                const external = key !== 'email' && key !== 'phone' && key !== 'tel';
                return (
                  <a
                    key={key}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#64748b',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'rgba(45, 212, 191, 0.3)';
                      el.style.background = 'rgba(45, 212, 191, 0.06)';
                      el.style.color = '#2dd4bf';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                      el.style.background = 'rgba(255, 255, 255, 0.03)';
                      el.style.color = '#64748b';
                    }}
                    aria-label={key}
                    title={key}
                  >
                    <SocialIcon keyName={key} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ keyName }: { keyName: string }) {
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

  const src = logos[k];
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="h-4 w-4 object-contain" loading="lazy" referrerPolicy="no-referrer" />
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

  return <span className="text-xs font-semibold">{k.slice(0, 2).toUpperCase()}</span>;
}

function normalizeSocialKey(key: string): string {
  const k = key.toLowerCase().trim();
  if (k === 'linkein' || k === 'linkdin') return 'linkedin';
  if (k === 'mobile') return 'phone';
  return k;
}
