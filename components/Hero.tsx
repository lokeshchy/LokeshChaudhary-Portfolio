'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { HeroData } from '@/types'

interface HeroProps {
  data: HeroData
}

export default function Hero({ data }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (data.subtitles.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.subtitles.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [data.subtitles.length])

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-content w-full mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-foreground"
        >
          {data.title}
        </motion.h1>

        <div className="h-16 md:h-20 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-4xl text-muted font-medium"
            >
              {data.subtitles[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SEO: All subtitles visible to search engines but hidden visually */}
        <div className="sr-only">
          {data.subtitles.map((subtitle, idx) => (
            <span key={idx}>{subtitle}</span>
          ))}
        </div>

        {data.ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href={data.ctaLink || '/projects'}
              className="inline-block px-8 py-4 bg-primary text-white rounded-card font-medium hover:opacity-90 transition-opacity shadow-soft"
            >
              {data.ctaText}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
