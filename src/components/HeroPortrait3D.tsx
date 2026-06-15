'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Tilt3D } from './motion/Tilt3D';

/**
 * Hero portrait with a pointer-driven 3D tilt, layered depth, an orbiting
 * accent ring and a breathing ambient glow.
 */
export function HeroPortrait3D({ src, alt }: { src: string; alt: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="justify-self-center md:justify-self-end w-full max-w-[520px]"
      initial={{ opacity: 1, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.15 }}
    >
      <Tilt3D
        className="relative mx-auto h-80 w-80 md:h-[420px] md:w-[420px] lg:h-[500px] lg:w-[500px]"
        max={14}
        glare={false}
        scale={1.03}
      >
        {/* Breathing ambient glow */}
        <motion.div
          className="absolute inset-[-26px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, rgba(45,212,191,0.20) 0%, rgba(139,92,246,0.10) 50%, transparent 72%)',
            filter: 'blur(26px)',
          }}
          animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />

        {/* Rotating dashed accent ring */}
        {!reduce && (
          <motion.div
            className="absolute inset-[-6px] rounded-full pointer-events-none"
            style={{
              border: '1px dashed rgba(45,212,191,0.22)',
              transform: 'translateZ(40px)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            aria-hidden
          />
        )}

        <div
          className="absolute inset-0 rounded-2xl border border-[rgba(45,212,191,0.13)]"
          style={{ transform: 'translateZ(20px)' }}
        />

        <Image
          src={src}
          alt={alt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 768px) 320px, (max-width: 1024px) 420px, 500px"
          className="relative z-10 object-contain object-center scale-[1.18] -translate-y-3 drop-shadow-[0_24px_56px_rgba(0,0,0,0.75)]"
          style={{ transform: 'translateZ(60px)' }}
        />
      </Tilt3D>
    </motion.div>
  );
}
