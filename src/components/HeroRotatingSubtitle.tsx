'use client';

import { useState, useEffect } from 'react';

interface HeroRotatingSubtitleProps {
  subtitles: string[];
  className?: string;
  intervalMs?: number;
}

/** Rotating subtitle with fade. All subtitles remain in DOM for SEO. */
export function HeroRotatingSubtitle({
  subtitles,
  className = '',
  intervalMs = 3000,
}: HeroRotatingSubtitleProps) {
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState(false);

  const list = Array.isArray(subtitles) && subtitles.length > 0 ? subtitles : [''];

  useEffect(() => {
    const t = setInterval(() => {
      setExit(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % list.length);
        setExit(false);
      }, 400);
    }, intervalMs);
    return () => clearInterval(t);
  }, [list.length, intervalMs]);

  return (
    <div className={`hero-subtitle-rotator ${className}`} aria-live="polite">
      {/* SEO: all subtitles in DOM but visually hidden except active */}
      {list.map((text, i) => (
        <span
          key={i}
          className={`hero-subtitle-item ${i === index ? (exit ? 'exit' : 'active') : ''}`}
          aria-hidden={i !== index}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
