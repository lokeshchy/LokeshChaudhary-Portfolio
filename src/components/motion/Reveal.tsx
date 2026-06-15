'use client';

import { motion, useReducedMotion, useInView, type Variants } from 'motion/react';
import { useRef, type ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 34 },
  down: { x: 0, y: -34 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered reveal with spring physics. Replaces the old CSS
 * `[data-animate]` system. When `stagger` is set, direct `Reveal.Item`
 * children animate in sequence.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  stagger,
  className,
  style,
  id,
  as = 'div',
  amount = 0.18,
  once = true,
  immediate = false,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  as?: 'div' | 'section' | 'span' | 'ul' | 'li';
  amount?: number;
  once?: boolean;
  /** Reveal on mount instead of waiting to scroll into view (for below-the-fold content that should still show on load). */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // `useInView` evaluates intersection on mount, so content already on-screen
  // at load reveals immediately instead of waiting for the first scroll event
  // (which `whileInView` can require). Far-down content still reveals on scroll.
  const inView = useInView(ref, { once, amount });
  const show = immediate || inView;
  const { x, y } = offset[direction];

  const variants: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : x, y: reduce ? 0 : y, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
        mass: 0.6,
        delay,
        ...(stagger ? { staggerChildren: stagger, delayChildren: delay } : {}),
      },
    },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      id={id}
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
    >
      {children}
    </MotionTag>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(5px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 130, damping: 18, mass: 0.5 },
  },
};

/**
 * Child of a `Reveal` with `stagger` set — animates in sequence with its
 * siblings. Exported separately (not as `Reveal.Item`) so it survives the
 * server/client component boundary in the App Router.
 */
export function RevealItem({
  children,
  className,
  style,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'span' | 'li' | 'article';
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag className={className} style={style} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
