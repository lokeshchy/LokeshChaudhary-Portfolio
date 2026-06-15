'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { HeroRotatingSubtitle } from './HeroRotatingSubtitle';
import { MagneticLink } from './motion/MagneticLink';
import { AnimatedCounter } from './motion/AnimatedCounter';

type Stat = { value: number; label: string };

/**
 * Animated hero text column: staggered entrance, word-by-word title
 * reveal, magnetic CTAs and count-up stats.
 */
export function HeroIntro({
  title,
  subtitles,
  ctaText,
  ctaLink,
  stats,
}: {
  title: string;
  subtitles: string[];
  ctaText: string;
  ctaLink: string;
  stats: Stat[];
}) {
  const reduce = useReducedMotion();
  const words = title.split(' ');

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 130, damping: 18 },
    },
  };
  const wordVariant: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : '0.5em', rotateX: reduce ? 0 : -40 },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: 'spring', stiffness: 140, damping: 16 },
    },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Availability pill */}
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full border border-[rgba(45,212,191,0.25)] bg-[rgba(45,212,191,0.05)] text-[#2dd4bf] text-xs font-mono tracking-[0.14em] uppercase"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2dd4bf] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2dd4bf]" />
        </span>
        Available for collaboration
      </motion.div>

      {/* Title — word-by-word reveal */}
      <motion.h1
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
        className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.06] mb-6 text-gradient-primary"
        style={{ perspective: 800 }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariant}
            className="inline-block"
            style={{ transformOrigin: 'bottom' }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </motion.h1>

      <motion.div variants={item} className="flex items-center gap-2 text-lg md:text-xl mb-10 font-mono">
        <span className="text-[rgba(45,212,191,0.38)] select-none">~/</span>
        <span className="text-foreground/70">
          <HeroRotatingSubtitle subtitles={subtitles || []} />
        </span>
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap gap-4 mb-12">
        <MagneticLink href={ctaLink || '/projects'} className="btn-cta text-base px-8 py-4">
          {ctaText || 'View Work'}
        </MagneticLink>
        <MagneticLink href="/about" className="btn-outline text-base px-8 py-4">
          About me
        </MagneticLink>
      </motion.div>

      {/* Quick-stat row */}
      <motion.div
        variants={item}
        className="flex items-center gap-7 pt-7 border-t border-[rgba(255,255,255,0.06)]"
      >
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-center gap-7">
            {i > 0 && <div className="w-px h-10 bg-[rgba(255,255,255,0.07)]" aria-hidden />}
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
                <AnimatedCounter value={s.value} suffix="+" />
              </div>
              <div className="text-xs text-muted font-mono uppercase tracking-wider mt-1">
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
