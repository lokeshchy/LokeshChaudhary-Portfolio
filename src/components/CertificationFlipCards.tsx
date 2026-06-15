'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { certificationImageImgSrc } from '@/lib/cert-image-url';
import type { CertificationEntry, CertificationItem } from '@/types';

type FullscreenCert = {
  title: string;
  image: string;
};

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

function CertFront({ item, hasImage }: { item: CertificationEntry; hasImage: boolean }) {
  return (
    <div className="cert-flip-face cert-flip-front card-project flex flex-col justify-between h-full p-4">
      <div className="min-w-0 space-y-1.5">
        <h3 className="text-sm font-semibold text-primary leading-snug line-clamp-2">{item.title}</h3>
        {item.issuer && <p className="text-[13px] text-muted leading-snug line-clamp-1">{item.issuer}</p>}
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[12px] text-muted">
          {item.issued && (
            <span>
              Issued <time dateTime={item.issued}>{item.issued}</time>
            </span>
          )}
          {item.credentialId && <span className="truncate max-w-full">ID: {item.credentialId}</span>}
        </div>
        {item.skills && (
          <p className="text-[12px] text-secondary leading-snug line-clamp-1">Skills: {item.skills}</p>
        )}
      </div>
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted/80 mt-2 pt-2 border-t border-border/50">
        {hasImage ? 'Click to view certificate' : 'No image'}
      </p>
    </div>
  );
}

function CertBack({
  item,
  onFullscreen,
}: {
  item: CertificationEntry;
  onFullscreen: () => void;
}) {
  const imgSrc = item.image ? certificationImageImgSrc(item.image) : undefined;

  return (
    <div className="cert-flip-face cert-flip-back card-project flex flex-col h-full overflow-hidden">
      {imgSrc ? (
        <>
          <div className="relative flex-1 min-h-0 bg-background/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={`Certificate for ${item.title}`}
              className="absolute inset-0 h-full w-full object-contain p-2"
            />
          </div>
          <div className="shrink-0 border-t border-border/60 px-2 py-1.5 flex items-center justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFullscreen();
              }}
              className="inline-flex items-center gap-1 rounded-button border border-primary/35 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
              aria-label={`View ${item.title} full screen`}
            >
              <FullscreenIcon />
              Full screen
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center p-3 text-center">
          <p className="text-[11px] text-muted">No certificate image. Click to flip back.</p>
        </div>
      )}
    </div>
  );
}

function FullscreenViewer({
  cert,
  onClose,
}: {
  cert: FullscreenCert;
  onClose: () => void;
}) {
  const imgSrc = certificationImageImgSrc(cert.image);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!imgSrc || !mounted) return null;

  return createPortal(
    <div
      className="cert-fullscreen-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
      onClick={onClose}
    >
      <button
        type="button"
        className="cert-fullscreen-close"
        onClick={onClose}
        aria-label="Close full screen"
      >
        <CloseIcon />
      </button>
      <div className="cert-fullscreen-content" onClick={(e) => e.stopPropagation()}>
        <p className="cert-fullscreen-title">{cert.title}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgSrc} alt={`Certificate for ${cert.title}`} className="cert-fullscreen-image" />
      </div>
    </div>,
    document.body,
  );
}

function CertCard({
  item,
  index,
  isFlipped,
  onToggle,
  onFullscreen,
  hidden,
}: {
  item: CertificationItem;
  index: number;
  isFlipped: boolean;
  onToggle: () => void;
  onFullscreen: (cert: FullscreenCert) => void;
  hidden?: boolean;
}) {
  if (typeof item === 'string') {
    return (
      <article
        className={`cert-marquee-item cert-flip-static card-project flex items-center justify-center p-3 ${flashCardTone(item, index)}`}
        aria-hidden={hidden || undefined}
      >
        <p className="text-sm text-foreground font-medium text-center leading-snug line-clamp-3">{item}</p>
      </article>
    );
  }

  const hasImage = Boolean(item.image?.trim() && certificationImageImgSrc(item.image));

  return (
    <div className="cert-marquee-item cert-flip-scene" aria-hidden={hidden || undefined}>
      <div
        role="button"
        tabIndex={hidden ? -1 : 0}
        className={`cert-flip-card ${isFlipped ? 'is-flipped' : ''} ${flashCardTone(item.title, index)}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-pressed={isFlipped}
        aria-label={`${item.title}. ${isFlipped ? 'Showing certificate image' : 'Show certificate details'}`}
      >
        <CertFront item={item} hasImage={hasImage} />
        <CertBack
          item={item}
          onFullscreen={() => {
            if (item.image?.trim()) {
              onFullscreen({ title: item.title, image: item.image });
            }
          }}
        />
      </div>
    </div>
  );
}

export function CertificationFlipCards({ items }: { items: CertificationItem[] }) {
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [fullscreenCert, setFullscreenCert] = useState<FullscreenCert | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const closeFullscreen = useCallback(() => setFullscreenCert(null), []);

  const pageWidthRef = useRef(1);
  const tickingRef = useRef(false);

  // Measure layout only on mount / resize (reads scrollWidth → forces reflow).
  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pageWidth = el.clientWidth || 1;
    pageWidthRef.current = pageWidth;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setPageCount(Math.max(1, Math.round(maxScroll / pageWidth) + 1));
    setActivePage(Math.max(0, Math.round(el.scrollLeft / pageWidth)));
  }, []);

  // On scroll only read scrollLeft (cheap) and throttle via rAF.
  const onScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) setActivePage(Math.max(0, Math.round(el.scrollLeft / pageWidthRef.current)));
      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    measure();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [measure, onScroll, items.length]);

  const goToPage = (page: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(page, pageCount - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="slider-nav-btn shrink-0"
          onClick={() => goToPage(activePage - 1)}
          disabled={activePage <= 0}
          aria-label="Previous certifications"
        >
          <ChevronIcon dir="left" />
        </button>

        <div ref={scrollRef} className="cert-slider flex-1" aria-label="Certifications">
          {items.map((item, i) => {
            const cardId = `cert-${i}`;
            return (
              <CertCard
                key={cardId}
                item={item}
                index={i}
                isFlipped={flippedId === cardId}
                onToggle={() => setFlippedId((prev) => (prev === cardId ? null : cardId))}
                onFullscreen={setFullscreenCert}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="slider-nav-btn shrink-0"
          onClick={() => goToPage(activePage + 1)}
          disabled={activePage >= pageCount - 1}
          aria-label="Next certifications"
        >
          <ChevronIcon dir="right" />
        </button>
      </div>

      {pageCount > 1 && (
        <div className="cert-dots" role="tablist" aria-label="Certification pages">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`cert-dot ${i === activePage ? 'cert-dot-active' : ''}`}
              onClick={() => goToPage(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === activePage}
            />
          ))}
        </div>
      )}

      {fullscreenCert && <FullscreenViewer cert={fullscreenCert} onClose={closeFullscreen} />}
    </>
  );
}

function ChevronIcon({ dir }: { dir: 'left' | 'right' | 'up' | 'down' }) {
  const paths: Record<typeof dir, string> = {
    left: 'M15 18l-6-6 6-6',
    right: 'M9 18l6-6-6-6',
    up: 'M18 15l-6-6-6 6',
    down: 'M6 9l6 6 6-6',
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={paths[dir]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
