'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2, ExternalLink } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { companiesApi, unwrap } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export default function AdminCompaniesPage() {
  const { t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    companiesApi.list({ limit: 50 })
      .then(res => { const d = unwrap<any>(res); setItems(d.items || []); setTotal(d.total || 0); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">Администрирование</p>
        <h1 className="font-display text-5xl font-light text-cream">Компании</h1>
        <div className="gold-divider mt-4" />
        <p className="text-night-300 mt-3 text-sm">{total} компаний</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-gold-500 animate-spin" /></div>
      ) : (
        <div className="glass-card rounded-none overflow-hidden">
          <table className="data-table w-full">
            <thead><tr>
              <th className="text-left">Компания</th>
              <th className="text-left">Отрасль</th>
              <th className="text-left">Email</th>
              <th className="text-left">Сайт</th>
              <th className="text-left">Действия</th>
            </tr></thead>
            <tbody>
              {items.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-night-700 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {c.logo ? <img src={getImageUrl(c.logo)} className="w-full h-full object-cover" alt="" />
                          : <span className="font-display text-sm text-gold-500">{c.name?.[0]?.toUpperCase()}</span>}
                      </div>
                      <span className="text-cream text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="text-night-300 text-sm">{c.industry ? t(`industries.${c.industry}`) : '—'}</td>
                  <td className="text-night-300 text-sm">{c.email || '—'}</td>
                  <td className="text-night-300 text-sm">{c.website ? <a href={c.website} target="_blank" className="text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">{c.website}<ExternalLink size={10}/></a> : '—'}</td>
                  <td>
                    <Link href={`/companies/${c.id}`} target="_blank" className="text-xs text-gold-500 hover:text-gold-300 transition-colors">Открыть</Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="text-center py-12 text-night-300">Компаний нет</div>}
        </div>
      )}
    </div>
  );
}
