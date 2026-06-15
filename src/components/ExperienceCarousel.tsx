'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

export type ExperienceItem = {
  id: string;
  role: string;
  organization: string;
  location?: string | null;
  workMode?: string | null;
  startDate: string;
  endDate: string;
  description: string[];
  type: string;
};

function ExperienceCard({ e }: { e: ExperienceItem }) {
  return (
    <div className="relative">
      <span className="absolute -left-[29px] top-1.5 timeline-dot" />
      <div
        className="rounded-card p-5"
        style={{
          background: 'rgba(11,19,34,0.6)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="font-semibold text-[17px]" style={{ color: '#2dd4bf' }}>
            {e.role}
          </h3>
          <span className="text-[15px] text-muted">{e.organization}</span>
          {e.location && <span className="text-[15px] text-muted">· {e.location}</span>}
        </div>
        <p className="text-[13px] font-mono mt-2 flex flex-wrap items-center gap-2" style={{ color: 'rgba(100,116,139,0.85)' }}>
          <span>
            {e.startDate} — {e.endDate}
          </span>
          {e.workMode && <span className="work-mode-badge">{e.workMode}</span>}
          <span
            className="px-2 py-0.5 rounded text-[11px]"
            style={{
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.2)',
              color: '#a78bfa',
            }}
          >
            {e.type}
          </span>
        </p>
        {e.description.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {e.description.slice(0, 2).map((d, i) => (
              <li key={i} className="text-[15px] text-muted flex gap-2 leading-relaxed line-clamp-2">
                <span style={{ color: 'rgba(45,212,191,0.45)', flexShrink: 0 }}>›</span>
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ChevronIcon({ dir }: { dir: 'up' | 'down' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === 'up' ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExperienceCarousel({ items }: { items: ExperienceItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const pageHeightRef = useRef(1);
  const tickingRef = useRef(false);

  // Measure layout only on mount / resize (reads scrollHeight → forces reflow).
  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pageHeight = el.clientHeight || 1;
    pageHeightRef.current = pageHeight;
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    setPageCount(Math.max(1, Math.round(maxScroll / pageHeight) + 1));
    setActivePage(Math.max(0, Math.round(el.scrollTop / pageHeight)));
  }, []);

  // On scroll only read scrollTop (cheap) and throttle via rAF.
  const onScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) setActivePage(Math.max(0, Math.round(el.scrollTop / pageHeightRef.current)));
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
    el.scrollTo({ top: clamped * el.clientHeight, behavior: 'smooth' });
  };

  if (items.length === 0) {
    return <p className="text-sm text-muted">No experience added yet.</p>;
  }

  const borderStyle = { borderLeft: '2px solid rgba(45,212,191,0.15)' } as CSSProperties;

  // Few entries — show them all statically, nothing to scroll through.
  if (items.length <= 3) {
    return (
      <div className="relative pl-6 space-y-4" style={borderStyle}>
        {items.map((e) => (
          <ExperienceCard key={e.id} e={e} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-stretch gap-3">
      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
        <button
          type="button"
          className="slider-nav-btn"
          onClick={() => goToPage(activePage - 1)}
          disabled={activePage <= 0}
          aria-label="Previous experience"
        >
          <ChevronIcon dir="up" />
        </button>

        <div ref={scrollRef} className="exp-slider w-full" aria-label="Experience">
          <div className="relative pl-6 space-y-4 pb-1" style={borderStyle}>
            {items.map((e) => (
              <ExperienceCard key={e.id} e={e} />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="slider-nav-btn"
          onClick={() => goToPage(activePage + 1)}
          disabled={activePage >= pageCount - 1}
          aria-label="Next experience"
        >
          <ChevronIcon dir="down" />
        </button>
      </div>

      {pageCount > 1 && (
        <div className="exp-dots shrink-0" role="tablist" aria-label="Experience pages">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`exp-dot ${i === activePage ? 'exp-dot-active' : ''}`}
              onClick={() => goToPage(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === activePage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
