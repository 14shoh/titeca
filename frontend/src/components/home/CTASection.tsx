'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Building2, Users } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';

export default function CTASection() {
  const { t } = useLang();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-night-800/50 relative overflow-hidden">
      {/* Background ornament */}
      <div className="absolute inset-0 girih-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,168,112,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: For companies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="glass-card rounded-none p-10 h-full flex flex-col justify-between hover:border-gold-500/25 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:bg-gold-500/5 transition-colors">
                  <Building2 size={22} className="text-gold-500" />
                </div>
                <h3 className="font-display text-3xl font-light text-cream mb-4">
                  Для компаний
                </h3>
                <p className="text-night-300 leading-relaxed mb-8">
                  Создайте профиль компании, представьте продукцию, забронируйте стенд и участвуйте в международных выставках Таджикистана.
                </p>
              </div>
              <Link href="/auth/register" className="btn-gold inline-flex items-center gap-2 rounded-none self-start">
                {t('auth.register_btn')} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: For visitors */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card rounded-none p-10 h-full flex flex-col justify-between hover:border-gold-500/25 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:bg-gold-500/5 transition-colors">
                  <Users size={22} className="text-gold-500" />
                </div>
                <h3 className="font-display text-3xl font-light text-cream mb-4">
                  Для посетителей
                </h3>
                <p className="text-night-300 leading-relaxed mb-8">
                  Изучайте каталог выставок, регистрируйтесь на мероприятия и следите за актуальными новостями бизнес-сообщества.
                </p>
              </div>
              <Link href="/exhibitions" className="btn-outline-gold inline-flex items-center gap-2 rounded-none self-start">
                {t('hero.cta_primary')} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
