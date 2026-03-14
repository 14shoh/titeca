'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LanguageContext';
import { reservationsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';

export default function ReservationsPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    reservationsApi.my()
      .then(res => setItems(unwrap<any>(res) || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id: string) => {
    setCancelling(id);
    try {
      await reservationsApi.cancel(id);
      toast.success('Бронирование отменено');
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">{t('nav.dashboard')}</p>
        <h1 className="font-display text-4xl font-light text-cream">{t('dashboard.reservations')}</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="text-gold-500 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-none p-12 text-center">
          <div className="font-display text-4xl text-gold-500/20 mb-4">∅</div>
          <p className="text-night-300">{t('dashboard.no_reservations')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-none p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn('text-xs px-2 py-0.5 border font-bold tracking-wide', getStatusColor(res.status))}>
                    {t(`status.${res.status}`)}
                  </span>
                  <span className={cn('text-xs px-2 py-0.5 border', getStatusColor(res.paymentStatus))}>
                    {t(`status.${res.paymentStatus}`)}
                  </span>
                </div>
                <h3 className="font-display text-xl text-cream mb-1">
                  {res.booth?.exhibition ? getI18nField(res.booth.exhibition.title, lang) : 'Выставка'}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-night-300">
                  <span>Стенд № {res.booth?.number || '—'}</span>
                  {res.booth?.exhibition?.startDate && (
                    <span>{formatDate(res.booth.exhibition.startDate, lang)}</span>
                  )}
                  {res.booth?.price && (
                    <span className="text-gold-400 font-semibold">{Number(res.booth.price).toLocaleString()} TJS</span>
                  )}
                </div>
              </div>
              {res.status === 'PENDING' && (
                <button
                  onClick={() => cancel(res.id)}
                  disabled={cancelling === res.id}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-medium border border-red-400/30 hover:border-red-400/50 px-3 py-2 transition-all disabled:opacity-50"
                >
                  {cancelling === res.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                  {t('common.cancel')}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
