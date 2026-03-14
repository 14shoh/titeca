'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { adminApi, unwrap } from '@/lib/api';
import { formatDate, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.payments({ limit: 50 })
      .then(res => setItems(unwrap<any>(res)?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">Администрирование</p>
        <h1 className="font-display text-5xl font-light text-cream">Платежи</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-gold-500 animate-spin" /></div>
      ) : (
        <div className="glass-card rounded-none overflow-hidden">
          <table className="data-table w-full">
            <thead><tr>
              <th className="text-left">Пользователь</th>
              <th className="text-left">Сумма</th>
              <th className="text-left">Метод</th>
              <th className="text-left">Транзакция</th>
              <th className="text-left">Статус</th>
              <th className="text-left">Дата</th>
            </tr></thead>
            <tbody>
              {items.map((pay, i) => (
                <motion.tr key={pay.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td className="text-cream text-sm">{pay.user?.firstName ? `${pay.user.firstName} ${pay.user.lastName || ''}` : pay.user?.email || '—'}</td>
                  <td className="text-gold-400 font-semibold">{Number(pay.amount).toLocaleString()} {pay.currency}</td>
                  <td className="text-night-300 text-sm">{pay.method || '—'}</td>
                  <td className="text-night-300 text-xs font-mono">{pay.transactionId || '—'}</td>
                  <td><span className={cn('text-xs px-2 py-0.5 border font-bold', getStatusColor(pay.status))}>{t(`status.${pay.status}`)}</span></td>
                  <td className="text-night-300 text-xs">{formatDate(pay.createdAt, lang)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="text-center py-12 text-night-300">Платежей нет</div>}
        </div>
      )}
    </div>
  );
}
