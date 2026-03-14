'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Users } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { adminApi, unwrap } from '@/lib/api';
import { formatDate, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    adminApi.users({ limit: 50 })
      .then(res => { const d = unwrap<any>(res); setItems(d.items || []); setTotal(d.total || 0); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">Администрирование</p>
        <h1 className="font-display text-5xl font-light text-cream">Пользователи</h1>
        <div className="gold-divider mt-4" />
        <p className="text-night-300 mt-3 text-sm">{total} пользователей</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-gold-500 animate-spin" /></div>
      ) : (
        <div className="glass-card rounded-none overflow-hidden">
          <table className="data-table w-full">
            <thead><tr>
              <th className="text-left">Имя</th>
              <th className="text-left">Email</th>
              <th className="text-left">Роль</th>
              <th className="text-left">Статус email</th>
              <th className="text-left">Дата регистрации</th>
            </tr></thead>
            <tbody>
              {items.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-night-700 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-sm text-gold-500">{(u.firstName?.[0] || u.email[0]).toUpperCase()}</span>
                      </div>
                      <span className="text-cream text-sm">{u.firstName ? `${u.firstName} ${u.lastName || ''}` : '—'}</span>
                    </div>
                  </td>
                  <td className="text-night-300 text-sm">{u.email}</td>
                  <td>
                    <span className={cn('text-xs px-2 py-0.5 border font-bold tracking-wide',
                      u.role === 'ADMIN' ? 'text-gold-400 bg-gold-400/10 border-gold-400/20'
                      : u.role === 'COMPANY' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                      : 'text-night-300 bg-night-600/40 border-night-600'
                    )}>{u.role}</span>
                  </td>
                  <td>
                    <span className={cn('text-xs px-2 py-0.5 border', u.isEmailVerified ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20')}>
                      {u.isEmailVerified ? 'Подтверждён' : 'Ожидание'}
                    </span>
                  </td>
                  <td className="text-night-300 text-xs">{formatDate(u.createdAt, lang)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="text-center py-12 text-night-300">Пользователей нет</div>}
        </div>
      )}
    </div>
  );
}
