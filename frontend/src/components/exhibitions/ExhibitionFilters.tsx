'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, X, Search } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const INDUSTRIES = [
  'AGRICULTURE', 'TECHNOLOGY', 'MANUFACTURING', 'CONSTRUCTION',
  'HEALTHCARE', 'EDUCATION', 'FINANCE', 'TOURISM', 'ENERGY',
  'FOOD', 'TEXTILE', 'MINING', 'TRANSPORT', 'OTHER',
];
const STATUSES = ['PUBLISHED', 'ONGOING', 'COMPLETED'];

interface Filters {
  industry?: string;
  status?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export default function ExhibitionFilters({ filters, onChange }: Props) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);

  const hasActive = Object.values(filters).some(Boolean);

  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const clear = () => onChange({});

  return (
    <div className="glass-card rounded-none p-6 mb-8">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-night-300" />
          <input
            type="text"
            placeholder={`${t('common.search')}...`}
            value={filters.search || ''}
            onChange={(e) => update('search', e.target.value)}
            className="input-dark w-full pl-9 pr-4 py-2.5 text-sm rounded-none"
          />
        </div>

        {/* Toggle filters */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'flex items-center gap-2 text-sm font-medium px-4 py-2.5 border transition-all',
            expanded || hasActive
              ? 'border-gold-500/50 text-gold-400 bg-gold-500/5'
              : 'border-white/10 text-night-300 hover:border-gold-500/30 hover:text-cream'
          )}
        >
          <Filter size={14} />
          {t('exhibition.filter_industry')}
          {hasActive && <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />}
          <ChevronDown size={12} className={cn('transition-transform', expanded && 'rotate-180')} />
        </button>

        {/* Clear */}
        {hasActive && (
          <button onClick={clear} className="p-2.5 text-night-300 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/30">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Industry */}
              <div>
                <label className="section-label text-[0.6rem] block mb-2">{t('exhibition.filter_industry')}</label>
                <select
                  value={filters.industry || ''}
                  onChange={(e) => update('industry', e.target.value)}
                  className="input-dark w-full px-3 py-2.5 text-sm rounded-none"
                >
                  <option value="">{t('exhibition.all_industries')}</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{t(`industries.${ind}`)}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="section-label text-[0.6rem] block mb-2">Статус</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => update('status', e.target.value)}
                  className="input-dark w-full px-3 py-2.5 text-sm rounded-none"
                >
                  <option value="">Все статусы</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{t(`status.${s}`)}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="section-label text-[0.6rem] block mb-2">Город</label>
                <input
                  type="text"
                  placeholder="Душанбе, Худжанд..."
                  value={filters.city || ''}
                  onChange={(e) => update('city', e.target.value)}
                  className="input-dark w-full px-3 py-2.5 text-sm rounded-none"
                />
              </div>

              {/* Date from */}
              <div>
                <label className="section-label text-[0.6rem] block mb-2">{t('exhibition.filter_date')}</label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => update('startDate', e.target.value)}
                  className="input-dark w-full px-3 py-2.5 text-sm rounded-none"
                />
              </div>
            </div>

            {/* Industry chips */}
            <div className="pt-4 flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => update('industry', filters.industry === ind ? '' : ind)}
                  className={cn(
                    'text-xs px-3 py-1 border transition-all',
                    filters.industry === ind
                      ? 'border-gold-500/50 text-gold-400 bg-gold-500/10'
                      : 'border-white/10 text-night-300 hover:border-gold-500/20 hover:text-cream'
                  )}
                >
                  {t(`industries.${ind}`)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
