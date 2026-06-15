'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import type { ReactNode, PointerEvent } from 'react';

/**
 * Link with a magnetic pull toward the cursor on hover. Used for the hero
 * CTAs to give them a tactile, premium feel.
 */
export function MagneticLink({
  href,
  children,
  className,
  strength = 0.4,
  target,
  rel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  target?: string;
  rel?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 15, mass: 0.4 });

  function handleMove(e: PointerEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: sx, y: sy, display: 'inline-flex' }}>
      <Link
        href={href}
        target={target}
        rel={rel}
        className={className}
        onPointerMove={handleMove}
        onPointerLeave={reset}
      >
        {children}
      </Link>
    </motion.div>
  );
}
