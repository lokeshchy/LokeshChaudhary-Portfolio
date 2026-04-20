import { getPageBySlug, getSettings } from '@/lib/data';
import { socialLinkHref, socialLinkLabel } from '@/lib/social-links';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch',
};

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPageBySlug('contact'), getSettings()]);
  const content = page?.content as Record<string, string> | undefined;
  const formTitle = content?.formTitle || 'Get in Touch';
  const formDesc = content?.formDesc || '';

  const social = settings?.socialLinks ?? {};
  const linkEntries = Object.entries(social).filter(([, v]) => v && String(v).trim());

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-primary mb-2">Contact</h1>
      <p className="text-muted mb-8">{formDesc || 'Reach out for collaboration or questions.'}</p>

      <section className="max-w-3xl rounded-card border border-border bg-surface/70 shadow-card p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-primary mb-2">{formTitle}</h2>
        <p className="text-sm text-muted mb-6">Open to collaboration and product-focused engineering work.</p>

        {linkEntries.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {linkEntries.map(([key, value]) => {
              const str = String(value);
              const href = socialLinkHref(key, str);
              const external = key !== 'email' && key !== 'phone' && key !== 'tel';
              const display =
                key === 'email'
                  ? str.replace(/^mailto:/i, '')
                  : key === 'phone' || key === 'tel'
                    ? str.replace(/^tel:/i, '')
                    : str;
              return (
                <a
                  key={key}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group rounded-button border border-border bg-background/70 px-4 py-3 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-border bg-surface">
                      <SocialIcon keyName={key} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-wide text-muted">{socialLinkLabel(key)}</span>
                      <span className="block text-sm text-primary truncate">{display}</span>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-muted text-sm">
            Add email, phone, and social URLs in Admin → Settings → Social links.
          </p>
        )}
      </section>
    </div>
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
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 text-primary">
        <path
          fill="currentColor"
          d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.7.6 4 .6.7 0 1.2.6 1.2 1.2V20c0 .7-.6 1.2-1.2 1.2C11.8 21.2 2.8 12.2 2.8 3.4 2.8 2.7 3.4 2.2 4 2.2h3.3c.7 0 1.2.6 1.2 1.2 0 1.4.2 2.7.6 4 .1.4 0 .9-.3 1.2l-2.2 2.2Z"
        />
      </svg>
    );
  }
  return <span className="text-xs font-semibold text-primary">{k.slice(0, 2).toUpperCase()}</span>;
}

function normalizeSocialKey(key: string): string {
  const k = key.toLowerCase().trim();
  if (k === 'linkein' || k === 'linkdin') return 'linkedin';
  if (k === 'mobile') return 'phone';
  return k;
}
