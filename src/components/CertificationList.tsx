import { certificationImageDisplayUrl, certificationImageImgSrc } from '@/lib/cert-image-url';
import type { CertificationItem } from '@/types';
import Link from 'next/link';

export function CertificationList({
  items,
  showImages = true,
  cardCtaHref,
  cardCtaLabel = 'View certifications',
  compactSquare = false,
}: {
  items: CertificationItem[];
  showImages?: boolean;
  cardCtaHref?: string;
  cardCtaLabel?: string;
  compactSquare?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${compactSquare ? 'auto-rows-fr' : ''}`}>
      {items.map((item, i) => (
        <article
          key={i}
          className={`card-project group flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background ${compactSquare ? 'h-full min-h-[290px]' : ''} ${flashCardTone(typeof item === 'string' ? item : item.title, i)}`}
        >
          {typeof item === 'string' ? (
            <div className="p-4 flex-1 flex items-center">
              <p className="text-sm text-foreground font-medium text-center w-full">{item}</p>
            </div>
          ) : (
            <>
              {showImages && item.image && certificationImageImgSrc(item.image) ? (
                <a
                  href={certificationImageDisplayUrl(item.image) ?? item.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[4/3] bg-background border-b border-border outline-none"
                  aria-label={`Open certificate for ${item.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-supplied HTTPS / proxy */}
                  <img
                    src={certificationImageImgSrc(item.image)}
                    alt=""
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </a>
              ) : compactSquare ? (
                <div className="h-[22%] min-h-[56px] border-b border-border px-3 py-2 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary text-center leading-snug line-clamp-2 break-words">
                    {item.title}
                  </span>
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-surface to-secondary/10 border-b border-border flex items-center justify-center px-4">
                  <span className="text-xs font-semibold text-primary text-center leading-snug">{item.title}</span>
                </div>
              )}
              <div className={`p-3.5 flex-1 flex flex-col gap-1 ${compactSquare ? 'overflow-hidden' : ''}`}>
                {!compactSquare && (
                  <h3 className="text-sm font-semibold text-primary leading-snug">{item.title}</h3>
                )}
                {item.issuer && <p className="text-sm text-muted leading-snug line-clamp-2">{item.issuer}</p>}
                {item.issued && (
                  <p className="text-sm text-muted">
                    Issued <time dateTime={item.issued}>{item.issued}</time>
                  </p>
                )}
                {item.credentialId && (
                  <p className="text-sm text-muted line-clamp-1">Credential ID: {item.credentialId}</p>
                )}
                {item.skills && (
                  <p className={`text-sm text-secondary mt-0.5 leading-snug ${compactSquare ? 'line-clamp-2' : ''}`}>
                    Skills: {item.skills}
                  </p>
                )}
                {cardCtaHref && (
                  <div className="mt-1 pt-1">
                    <Link
                      href={cardCtaHref}
                      className="inline-flex items-center justify-center rounded-button border border-primary/35 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                    >
                      {cardCtaLabel}
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
}

function flashCardTone(seed: string, i: number): string {
  const tones = [
    'from-primary/20 via-surface to-surface border-primary/35',
    'from-secondary/20 via-surface to-surface border-secondary/35',
    'from-accent/20 via-surface to-surface border-accent/35',
    'from-indigo-500/20 via-surface to-surface border-indigo-400/35',
    'from-cyan-500/20 via-surface to-surface border-cyan-400/35',
    'from-fuchsia-500/20 via-surface to-surface border-fuchsia-400/35',
  ];
  const hash = Array.from(seed).reduce((a, ch) => a + ch.charCodeAt(0), 0) + i;
  return `bg-gradient-to-br ${tones[hash % tones.length]}`;
}
