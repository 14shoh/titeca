'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileText, Plus } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { applicationsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ApplicationsPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsApi.my()
      .then(res => setItems(unwrap<any>(res) || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">{t('nav.dashboard')}</p>
        <h1 className="font-display text-4xl font-light text-cream">{t('dashboard.applications')}</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="text-gold-500 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-none p-12 text-center">
          <FileText size={32} className="text-gold-500/30 mx-auto mb-4" />
          <p className="text-night-300 mb-6">{t('dashboard.no_applications')}</p>
          <a href="/exhibitions" className="btn-outline-gold inline-block rounded-none text-xs">
            <span className="flex items-center gap-2"><Plus size={12} /> Найти выставку</span>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-none p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-xs px-2 py-0.5 border font-bold tracking-wide', getStatusColor(app.status))}>
                      {t(`status.${app.status}`)}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-cream mb-1">
                    {app.exhibition ? getI18nField(app.exhibition.title, lang) : 'Выставка'}
                  </h3>
                  {app.notes && <p className="text-night-300 text-sm mt-2">{app.notes}</p>}
                  <p className="text-night-300 text-xs mt-3">{formatDate(app.createdAt, lang)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
