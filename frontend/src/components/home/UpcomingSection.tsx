'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { exhibitionsApi, unwrap } from '@/lib/api';
import ExhibitionCard from '@/components/exhibitions/ExhibitionCard';

export default function UpcomingSection() {
  const { t } = useLang();
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    exhibitionsApi.list({ status: 'PUBLISHED', limit: 3 })
      .then((res) => {
        const data = unwrap<any>(res);
        setExhibitions(data.items || data || []);
      })
      .catch(() => setExhibitions(MOCK_EXHIBITIONS));
  }, []);

  return (
    <section ref={ref} className="py-24 bg-night-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="section-label mb-3">{t('nav.exhibitions')}</p>
            <h2 className="font-display text-5xl md:text-6xl font-light text-cream">
              {t('sections.upcoming')}
            </h2>
            <div className="gold-divider mt-4" />
            <p className="text-night-300 mt-4 max-w-md">{t('sections.upcoming_sub')}</p>
          </div>
          <Link href="/exhibitions" className="btn-outline-gold rounded-none text-xs inline-flex items-center gap-2 whitespace-nowrap">
            {t('common.view_all')} <ArrowRight size={12} />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(exhibitions.length > 0 ? exhibitions : MOCK_EXHIBITIONS).map((ex, i) => (
            <ExhibitionCard key={ex.id} exhibition={ex} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Mock data for dev/fallback
const MOCK_EXHIBITIONS = [
  {
    id: '1', status: 'PUBLISHED', industry: 'TECHNOLOGY',
    title: { ru: 'TechExpo Tajikistan 2026', tj: 'TechExpo Тоҷикистон 2026', en: 'TechExpo Tajikistan 2026' },
    description: { ru: 'Международная выставка инновационных технологий и цифровых решений для бизнеса', tj: 'Намоишгоҳи байналмилалии технологияҳои инноватсионӣ', en: 'International exhibition of innovative technologies and digital business solutions' },
    startDate: '2026-05-15', endDate: '2026-05-18', city: 'Душанбе', country: 'Таджикистан', location: 'Кохи Арбоб',
  },
  {
    id: '2', status: 'PUBLISHED', industry: 'AGRICULTURE',
    title: { ru: 'АгроФорум 2026', tj: 'АгроФорум 2026', en: 'AgroForum 2026' },
    description: { ru: 'Форум по развитию сельского хозяйства и продовольственной безопасности', tj: 'Форум оид ба рушди кишоварзӣ ва амнияти озуқаворӣ', en: 'Forum on agricultural development and food security' },
    startDate: '2026-06-10', endDate: '2026-06-12', city: 'Худжанд', country: 'Таджикистан',
  },
  {
    id: '3', status: 'PUBLISHED', industry: 'CONSTRUCTION',
    title: { ru: 'BuildTaj 2026', tj: 'BuildTaj 2026', en: 'BuildTaj 2026' },
    description: { ru: 'Выставка строительных материалов, технологий и архитектурных решений', tj: 'Намоишгоҳи маводи сохтмонӣ ва технологияҳо', en: 'Exhibition of construction materials, technologies and architectural solutions' },
    startDate: '2026-07-20', endDate: '2026-07-23', city: 'Душанбе', country: 'Таджикистан',
  },
];
