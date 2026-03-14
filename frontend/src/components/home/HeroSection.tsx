'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { t } = useLang();
  const title = t('hero.title');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-night-900">

      {/* Geometric mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,168,112,0.07) 0%, rgba(201,168,112,0.02) 40%, transparent 70%)' }}
        />
        {/* Girih pattern */}
        <div className="absolute inset-0 girih-bg opacity-60" />
        {/* Diagonal lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lines" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
              <line x1="0" y1="0" x2="0" y2="80" stroke="#C9A870" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)"/>
        </svg>
        {/* Vignette */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(7,9,15,0.8) 100%)' }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: 'linear-gradient(to bottom, transparent, #07090F)' }}
        />
      </div>

      {/* Floating ornamental shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-[10%] w-24 h-24 opacity-10"
      >
        <svg viewBox="0 0 100 100" fill="none">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" stroke="#C9A870" strokeWidth="1"/>
          <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" stroke="#C9A870" strokeWidth="0.8"/>
        </svg>
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/3 left-[8%] w-16 h-16 opacity-10"
      >
        <svg viewBox="0 0 60 60" fill="none">
          <polygon points="30,3 57,17.5 57,42.5 30,57 3,42.5 3,17.5" stroke="#C9A870" strokeWidth="1"/>
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500" />
          <span className="section-label">{t('hero.eyebrow')}</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="font-display text-6xl md:text-7xl lg:text-8xl font-light text-cream leading-[1.0] mb-8"
          style={{ letterSpacing: '-0.02em' }}
        >
          {title.split('\n').map((line, i) => (
            <span key={i} className="block">
              {i === 1 ? <span className="text-gold-gradient italic">{line}</span> : line}
            </span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-2xl mx-auto text-night-300 text-lg leading-relaxed mb-12"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/exhibitions" className="btn-gold inline-flex items-center gap-2 rounded-none group">
            {t('hero.cta_primary')}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/auth/register" className="btn-outline-gold inline-flex items-center gap-2 rounded-none">
            {t('hero.cta_secondary')}
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-gold-500 to-transparent"
          />
          <span className="section-label text-[0.55rem] opacity-40">SCROLL</span>
        </motion.div>
      </div>
    </section>
  );
}
