'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/**
 * Thin gradient progress bar pinned to the top of the viewport that fills
 * as the page is scrolled.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left"
    >
      <div
        className="h-full w-full"
        style={{ background: 'linear-gradient(90deg, #2dd4bf 0%, #06b6d4 50%, #8b5cf6 100%)' }}
      />
    </motion.div>
  );
}
