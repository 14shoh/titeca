'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLang } from '@/contexts/LanguageContext';

const PARTNERS = [
  { name: 'Tajikistan Chamber of Commerce', abbr: 'ТТП' },
  { name: 'Ministry of Economy', abbr: 'МЭ РТ' },
  { name: 'Invest Tajikistan', abbr: 'IT' },
  { name: 'Tojiksodirot', abbr: 'ТС' },
  { name: 'UNDP Tajikistan', abbr: 'UNDP' },
  { name: 'ADB', abbr: 'ADB' },
  { name: 'Eskhata Bank', abbr: 'ESK' },
  { name: 'Alif Bank', abbr: 'ALIF' },
];

export default function PartnersSection() {
  const { t } = useLang();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-night-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-3">{t('sections.partners')}</p>
          <h2 className="font-display text-4xl font-light text-cream">{t('sections.partners')}</h2>
          <div className="gold-divider mx-auto mt-4" />
        </motion.div>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #07090F, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #07090F, transparent)' }} />

          <div className="marquee-track">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-8 glass-card rounded-none px-8 py-6 flex flex-col items-center gap-2 min-w-[160px] hover:border-gold-500/30 transition-colors"
              >
                <div className="font-display text-2xl font-semibold text-gold-gradient">{p.abbr}</div>
                <div className="text-night-300 text-xs text-center leading-tight">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
