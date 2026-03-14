'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Clock } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { newsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getImageUrl } from '@/lib/utils';

export default function NewsSection() {
  const { lang, t } = useLang();
  const [news, setNews] = useState<any[]>([]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    newsApi.list({ limit: 4 })
      .then((res) => {
        const data = unwrap<any>(res);
        setNews(data.items || data || []);
      })
      .catch(() => setNews(MOCK_NEWS));
  }, []);

  const items = news.length > 0 ? news : MOCK_NEWS;
  const [featured, ...rest] = items;

  return (
    <section ref={ref} className="py-24 bg-night-800/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="section-label mb-3">{t('nav.news')}</p>
            <h2 className="font-display text-5xl md:text-6xl font-light text-cream">
              {t('sections.news')}
            </h2>
            <div className="gold-divider mt-4" />
          </div>
          <Link href="/news" className="btn-outline-gold rounded-none text-xs inline-flex items-center gap-2 whitespace-nowrap">
            {t('common.view_all')} <ArrowRight size={12} />
          </Link>
        </motion.div>

        {/* Layout: big left + stack right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <Link href={`/news/${featured.id}`} className="group block h-full">
                <article className="glass-card rounded-none overflow-hidden h-full flex flex-col">
                  <div className="relative h-72 lg:h-80 overflow-hidden bg-night-700">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${getImageUrl(featured.image)})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="badge-gold mb-3 inline-block">{t('nav.news')}</span>
                      <h3 className="font-display text-2xl font-medium text-cream group-hover:text-gold-300 transition-colors">
                        {getI18nField(featured.title, lang)}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <p className="text-night-300 text-sm leading-relaxed line-clamp-3">
                      {getI18nField(featured.content, lang)}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-night-300 text-xs">
                        <Clock size={11} className="text-gold-500/60" />
                        {featured.publishedAt ? formatDate(featured.publishedAt, lang) : ''}
                      </div>
                      <span className="flex items-center gap-1 text-gold-500 text-xs font-semibold group-hover:gap-2 transition-all">
                        {t('common.read_more')} <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          )}

          {/* Stack */}
          <div className="lg:col-span-2 space-y-4">
            {rest.slice(0, 3).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                <Link href={`/news/${item.id}`} className="group block">
                  <article className="glass-card rounded-none p-4 flex gap-4 hover:border-gold-500/25 transition-colors">
                    <div
                      className="w-20 h-20 flex-shrink-0 bg-cover bg-center bg-night-700"
                      style={{ backgroundImage: `url(${getImageUrl(item.image)})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-base font-medium text-cream group-hover:text-gold-300 transition-colors line-clamp-2 leading-tight mb-2">
                        {getI18nField(item.title, lang)}
                      </h4>
                      <div className="flex items-center gap-1.5 text-night-300 text-xs">
                        <Clock size={10} className="text-gold-500/60" />
                        {item.publishedAt ? formatDate(item.publishedAt, lang) : ''}
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const MOCK_NEWS = [
  {
    id: '1', author: 'Titeca',
    title: { ru: 'Таджикистан примет 15 международных выставок в 2026 году', en: 'Tajikistan to Host 15 International Exhibitions in 2026', tj: 'Тоҷикистон дар соли 2026 15 намоишгоҳи байналмилалиро қабул мекунад' },
    content: { ru: 'Министерство экономики Таджикистана объявило о запуске масштабной программы международных выставок на 2026 год. В рамках программы планируется провести мероприятия в сферах технологий, сельского хозяйства, строительства и туризма.', en: 'The Ministry of Economy announced a major international exhibition program for 2026.', tj: '' },
    publishedAt: '2026-02-15', image: null,
  },
  {
    id: '2', author: 'Titeca',
    title: { ru: 'Открыта регистрация на TechExpo Tajikistan 2026', en: 'Registration Open for TechExpo Tajikistan 2026', tj: 'Бақайдгирӣ барои TechExpo Тоҷикистон 2026 кушода шуд' },
    content: { ru: 'Начат приём заявок от компаний для участия в крупнейшей технологической выставке страны.', en: 'Registration is now open for the country\'s largest technology exhibition.', tj: '' },
    publishedAt: '2026-02-20', image: null,
  },
  {
    id: '3', author: 'Titeca',
    title: { ru: 'Новые возможности для малого бизнеса', en: 'New Opportunities for Small Business', tj: 'Имкониятҳои нав барои бизнеси хурд' },
    content: { ru: 'Платформа Titeca запускает специальную программу поддержки малого и среднего бизнеса.', en: 'Titeca launches a special support program for small and medium businesses.', tj: '' },
    publishedAt: '2026-03-01', image: null,
  },
  {
    id: '4', author: 'Titeca',
    title: { ru: 'Расширение возможностей платформы', en: 'Platform Capabilities Expansion', tj: 'Васеъ кардани имкониятҳои платформа' },
    content: { ru: 'Titeca добавляет новые инструменты для организаторов выставок и участников.', en: 'Titeca adds new tools for exhibition organizers and participants.', tj: '' },
    publishedAt: '2026-03-10', image: null,
  },
];
