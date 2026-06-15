'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import type { ReactNode, PointerEvent } from 'react';

/**
 * Pointer-tracking 3D tilt. Wraps children in a perspective container and
 * rotates them toward the cursor with a glare highlight. Falls back to a
 * static container when reduced-motion is requested.
 */
export function Tilt3D({
  children,
  className,
  max = 12,
  glare = true,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  scale?: number;
}) {
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const rotateX = useSpring(rx, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 18 });
  const glareX = useSpring(gx, { stiffness: 200, damping: 25 });
  const glareY = useSpring(gy, { stiffness: 200, damping: 25 });

  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(45,212,191,0.18), transparent 55%)`;

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * max * 2);
    rx.set((0.5 - py) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function reset() {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{ perspective: 1000 }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
        {glare && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg, mixBlendMode: 'screen' }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
