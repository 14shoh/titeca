'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { adminApi, reservationsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminReservationsPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.reservations({ limit: 50 })
      .then(res => setItems(unwrap<any>(res)?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const confirm = async (id: string) => {
    setConfirming(id);
    try {
      await reservationsApi.confirm(id);
      toast.success('Бронирование подтверждено');
      load();
    } catch { toast.error('Ошибка'); }
    finally { setConfirming(null); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">Администрирование</p>
        <h1 className="font-display text-5xl font-light text-cream">Бронирования</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-gold-500 animate-spin" /></div>
      ) : (
        <div className="glass-card rounded-none overflow-hidden">
          <table className="data-table w-full">
            <thead><tr>
              <th className="text-left">Пользователь</th>
              <th className="text-left">Стенд</th>
              <th className="text-left">Выставка</th>
              <th className="text-left">Сумма</th>
              <th className="text-left">Статус</th>
              <th className="text-left">Дата</th>
              <th className="text-left">Действия</th>
            </tr></thead>
            <tbody>
              {items.map((res, i) => (
                <motion.tr key={res.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td className="text-cream text-sm">{res.user?.firstName ? `${res.user.firstName} ${res.user.lastName || ''}` : res.user?.email || '—'}</td>
                  <td className="text-night-300 text-sm">№ {res.booth?.number || '—'}</td>
                  <td className="text-night-300 text-sm">{res.booth?.exhibition ? getI18nField(res.booth.exhibition.title, lang) : '—'}</td>
                  <td className="text-gold-400 font-semibold text-sm">{res.booth?.price ? `${Number(res.booth.price).toLocaleString()} TJS` : '—'}</td>
                  <td><span className={cn('text-xs px-2 py-0.5 border font-bold', getStatusColor(res.status))}>{t(`status.${res.status}`)}</span></td>
                  <td className="text-night-300 text-xs">{formatDate(res.createdAt, lang)}</td>
                  <td>
                    {res.status === 'PENDING' && (
                      <button onClick={() => confirm(res.id)} disabled={confirming === res.id} className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50">
                        {confirming === res.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                        Подтвердить
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="text-center py-12 text-night-300">Бронирований нет</div>}
        </div>
      )}
    </div>
  );
}
