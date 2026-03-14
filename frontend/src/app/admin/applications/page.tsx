'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Check, X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { adminApi, applicationsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminApplicationsPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.applications({ limit: 50 })
      .then(res => setItems(unwrap<any>(res)?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setProcessing(id + status);
    try {
      await applicationsApi.update(id, { status });
      toast.success(`Статус обновлён: ${t(`status.${status}`)}`);
      load();
    } catch { toast.error('Ошибка'); }
    finally { setProcessing(null); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">Администрирование</p>
        <h1 className="font-display text-5xl font-light text-cream">Заявки</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-gold-500 animate-spin" /></div>
      ) : (
        <div className="glass-card rounded-none overflow-hidden">
          <table className="data-table w-full">
            <thead><tr>
              <th className="text-left">Заявитель</th>
              <th className="text-left">Выставка</th>
              <th className="text-left">Статус</th>
              <th className="text-left">Дата</th>
              <th className="text-left">Действия</th>
            </tr></thead>
            <tbody>
              {items.map((app, i) => (
                <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td className="text-cream text-sm">{app.user?.firstName ? `${app.user.firstName} ${app.user.lastName || ''}` : app.user?.email || '—'}</td>
                  <td className="text-night-300 text-sm">{app.exhibition ? getI18nField(app.exhibition.title, lang) : '—'}</td>
                  <td><span className={cn('text-xs px-2 py-0.5 border font-bold', getStatusColor(app.status))}>{t(`status.${app.status}`)}</span></td>
                  <td className="text-night-300 text-xs">{formatDate(app.createdAt, lang)}</td>
                  <td>
                    {app.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateStatus(app.id, 'APPROVED')} disabled={!!processing} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Check size={11} /> Одобрить
                        </button>
                        <button onClick={() => updateStatus(app.id, 'REJECTED')} disabled={!!processing} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                          <X size={11} /> Отклонить
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="text-center py-12 text-night-300">Заявок нет</div>}
        </div>
      )}
    </div>
  );
}
