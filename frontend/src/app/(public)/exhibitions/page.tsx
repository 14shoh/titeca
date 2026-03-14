'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LanguageContext';
import { exhibitionsApi, unwrap } from '@/lib/api';
import ExhibitionCard from '@/components/exhibitions/ExhibitionCard';
import ExhibitionFilters from '@/components/exhibitions/ExhibitionFilters';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExhibitionsPage() {
  const { t } = useLang();
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<any>({});
  const limit = 9;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await exhibitionsApi.list({ ...filters, page, limit });
      const data = unwrap<any>(res);
      setExhibitions(data.items || []);
      setTotal(data.total || 0);
    } catch {
      setExhibitions([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const onFilterChange = (f: any) => {
    setFilters(f);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-night-900 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="section-label mb-3">{t('nav.exhibitions')}</p>
          <h1 className="font-display text-6xl md:text-7xl font-light text-cream">
            Каталог<br />
            <span className="text-gold-gradient italic">выставок</span>
          </h1>
          <div className="gold-divider mt-6" />
          {!loading && (
            <p className="text-night-300 mt-4 text-sm">
              {total > 0 ? `${total} ${total === 1 ? 'мероприятие' : 'мероприятий'}` : 'Нет мероприятий'}
            </p>
          )}
        </motion.div>

        {/* Filters */}
        <ExhibitionFilters filters={filters} onChange={onFilterChange} />

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-gold-500 animate-spin" />
          </div>
        ) : exhibitions.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-display text-6xl text-gold-500/20 mb-4">∅</div>
            <p className="text-night-300">Выставки не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitions.map((ex, i) => (
              <ExhibitionCard key={ex.id} exhibition={ex} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-white/10 text-night-300 hover:border-gold-500/30 hover:text-cream disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-10 h-10 text-sm font-medium border transition-all',
                  p === page
                    ? 'border-gold-500/50 text-gold-400 bg-gold-500/10'
                    : 'border-white/10 text-night-300 hover:border-gold-500/30 hover:text-cream'
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-white/10 text-night-300 hover:border-gold-500/30 hover:text-cream disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
