'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

/**
 * Fixed, full-viewport ambient layer that sits behind all page content.
 * Renders drifting aurora blobs plus a soft glow that follows the cursor.
 *
 * Performance note: the cursor glow is moved with a GPU-composited `transform`
 * (x/y) instead of re-painting a CSS gradient string each frame, which keeps
 * mouse movement smooth. Blur radii are kept moderate to avoid heavy repaints.
 */
export function AuroraBackground() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const x = useSpring(mx, { stiffness: 50, damping: 20 });
  const y = useSpring(my, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    function onMove(e: MouseEvent) {
      // Center the 600px glow on the cursor.
      mx.set(e.clientX - 300);
      my.set(e.clientY - 300);
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my, reduce]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Cursor-following glow — moved via transform (cheap) */}
      {!reduce && (
        <motion.div
          className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full"
          style={{
            x,
            y,
            background: 'radial-gradient(circle, rgba(45,212,191,0.10), transparent 70%)',
            willChange: 'transform',
          }}
        />
      )}

      {/* Drifting aurora blobs */}
      <motion.div
        className="absolute -left-32 -top-40 h-[40rem] w-[40rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 68%)',
          filter: 'blur(48px)',
          willChange: 'transform',
        }}
        animate={reduce ? undefined : { x: [0, 70, -30, 0], y: [0, 50, 90, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-40 top-1/3 h-[36rem] w-[36rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 68%)',
          filter: 'blur(48px)',
          willChange: 'transform',
        }}
        animate={reduce ? undefined : { x: [0, -60, 20, 0], y: [0, 70, -40, 0], scale: [1, 0.94, 1.1, 1] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top vignette so the header reads cleanly */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{ background: 'linear-gradient(to bottom, rgba(7,12,24,0.7), transparent)' }}
      />
    </div>
  );
}
