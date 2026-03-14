'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CreditCard } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { paymentsApi, unwrap } from '@/lib/api';
import { formatDate, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function PaymentsPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentsApi.my()
      .then(res => setItems(unwrap<any>(res) || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">{t('nav.dashboard')}</p>
        <h1 className="font-display text-4xl font-light text-cream">{t('dashboard.payments')}</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="text-gold-500 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-none p-12 text-center">
          <CreditCard size={32} className="text-gold-500/30 mx-auto mb-4" />
          <p className="text-night-300">История платежей пуста</p>
        </div>
      ) : (
        <div className="glass-card rounded-none overflow-hidden">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">Транзакция</th>
                <th className="text-left">Сумма</th>
                <th className="text-left">Метод</th>
                <th className="text-left">Статус</th>
                <th className="text-left">Дата</th>
              </tr>
            </thead>
            <tbody>
              {items.map((pay, i) => (
                <motion.tr
                  key={pay.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="text-night-300 text-xs font-mono">
                    {pay.transactionId || pay.id.slice(0, 16) + '...'}
                  </td>
                  <td className="text-gold-400 font-semibold">
                    {Number(pay.amount).toLocaleString()} {pay.currency}
                  </td>
                  <td className="text-night-300 text-sm">{pay.method || '—'}</td>
                  <td>
                    <span className={cn('text-xs px-2 py-0.5 border font-bold', getStatusColor(pay.status))}>
                      {t(`status.${pay.status}`)}
                    </span>
                  </td>
                  <td className="text-night-300 text-xs">{formatDate(pay.createdAt, lang)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
