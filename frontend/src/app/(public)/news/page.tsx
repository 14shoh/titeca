'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Loader2, ArrowRight } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { newsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getImageUrl } from '@/lib/utils';

export default function NewsPage() {
  const { lang, t } = useLang();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    newsApi.list({ page, limit: 9 })
      .then(res => {
        const data = unwrap<any>(res);
        setNews(data.items || []);
        setTotal(data.total || 0);
      })
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-night-900 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12">
          <p className="section-label mb-3">{t('nav.news')}</p>
          <h1 className="font-display text-6xl md:text-7xl font-light text-cream">
            {t('sections.news')}
          </h1>
          <div className="gold-divider mt-6" />
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="text-gold-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/news/${item.id}`} className="group block">
                  <article className="glass-card rounded-none overflow-hidden exhibition-card">
                    <div className="relative h-44 bg-night-700 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${getImageUrl(item.image)})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-night-900/80 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl font-medium text-cream group-hover:text-gold-300 transition-colors line-clamp-2 mb-3">
                        {getI18nField(item.title, lang)}
                      </h3>
                      <p className="text-night-300 text-sm line-clamp-2 mb-4">
                        {getI18nField(item.content, lang)}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-night-300 text-xs">
                          <Clock size={11} className="text-gold-500/60" />
                          {item.publishedAt ? formatDate(item.publishedAt, lang) : ''}
                        </div>
                        <span className="flex items-center gap-1 text-gold-500 text-xs font-semibold group-hover:gap-2 transition-all">
                          {t('common.read_more')} <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
