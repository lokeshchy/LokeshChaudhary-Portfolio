'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';

/**
 * Counts up from 0 to `value` the first time it scrolls into view.
 * Renders an optional suffix (e.g. "+").
 */
export function AnimatedCounter({
  value,
  suffix = '',
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 22, mass: 0.8 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    return spring.on('change', (v) => setDisplay(Math.round(v)));
  }, [spring, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {reduce ? value : display}
      {suffix}
    </span>
  );
}
