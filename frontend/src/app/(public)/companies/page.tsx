'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { companiesApi, unwrap } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export default function CompaniesPage() {
  const { t } = useLang();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    companiesApi.list({ page, limit: 12 })
      .then(res => {
        const data = unwrap<any>(res);
        setCompanies(data.items || []);
        setTotal(data.total || 0);
      })
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-night-900 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12">
          <p className="section-label mb-3">{t('nav.companies')}</p>
          <h1 className="font-display text-6xl md:text-7xl font-light text-cream">
            Компании<br /><span className="text-gold-gradient italic">участники</span>
          </h1>
          <div className="gold-divider mt-6" />
          <p className="text-night-300 mt-4">{total} компаний</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="text-gold-500 animate-spin" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-24">
            <Building2 size={40} className="text-gold-500/20 mx-auto mb-4" />
            <p className="text-night-300">Компании не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {companies.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/companies/${company.id}`} className="group block">
                  <div className="glass-card rounded-none p-6 flex flex-col items-center text-center exhibition-card">
                    <div className="w-20 h-20 mb-4 bg-night-700 border border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-gold-500/30">
                      {company.logo ? (
                        <img src={getImageUrl(company.logo)} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="font-display text-3xl text-gold-500">
                          {company.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg text-cream group-hover:text-gold-300 transition-colors line-clamp-2">
                      {company.name}
                    </h3>
                    {company.industry && (
                      <span className="badge-gold mt-2 text-[0.6rem]">{t(`industries.${company.industry}`)}</span>
                    )}
                    <span className="flex items-center gap-1 text-gold-500/60 text-xs mt-3 group-hover:text-gold-500 transition-colors">
                      {t('common.read_more')} <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
