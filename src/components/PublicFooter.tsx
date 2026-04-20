'use client';

import { useEffect, useState } from 'react';
import { socialLinkHref } from '@/lib/social-links';

export function PublicFooter() {
  const [settings, setSettings] = useState<{ footerText?: string; siteName?: string; socialLinks?: Record<string, string> }>({});

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
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-content mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">{settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName || 'Portfolio'}`}</p>
          {links.length > 0 && (
            <div className="flex gap-4">
              {links.map(([key, url]) => {
                const href = socialLinkHref(key, url);
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
