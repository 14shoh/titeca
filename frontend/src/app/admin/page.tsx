'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Users, FileText, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { adminApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getStatusColor } from '@/lib/utils';
import { useLang } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { lang } = useLang();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard()
      .then(res => setData(unwrap(res)))
      .catch(() => setData(MOCK_DASHBOARD))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || MOCK_DASHBOARD.stats;
  const recent = data?.recentReservations || MOCK_DASHBOARD.recentReservations;

  const cards = [
    { label: 'Пользователи', value: stats.totalUsers, icon: Users, color: 'text-blue-400', href: '/admin/users' },
    { label: 'Выставки', value: stats.totalExhibitions, icon: CalendarDays, color: 'text-gold-400', href: '/admin/exhibitions' },
    { label: 'Бронирования', value: stats.totalReservations, icon: TrendingUp, color: 'text-emerald-400', href: '/admin/reservations' },
    { label: 'Заявки', value: stats.totalApplications, icon: FileText, color: 'text-purple-400', href: '/admin/applications' },
    { label: 'Платежи', value: stats.totalPayments, icon: CreditCard, color: 'text-pink-400', href: '/admin/payments' },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">Административная панель</p>
        <h1 className="font-display text-5xl font-light text-cream">Дашборд</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link href={card.href}>
              <div className="glass-card rounded-none p-4 hover:border-gold-500/25 transition-all group cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <card.icon size={16} className={card.color} />
                  <span className="text-night-300 text-xs">{card.label}</span>
                </div>
                <div className="font-display text-4xl font-light text-cream">{card.value ?? 0}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent reservations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="glass-card rounded-none overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gold-500" />
              <h2 className="font-display text-xl text-cream">Последние бронирования</h2>
            </div>
            <Link href="/admin/reservations" className="text-gold-500 text-xs hover:text-gold-300 transition-colors">
              Все →
            </Link>
          </div>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">Пользователь</th>
                <th className="text-left">Стенд</th>
                <th className="text-left">Выставка</th>
                <th className="text-left">Статус</th>
                <th className="text-left">Дата</th>
                <th className="text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((res: any, i: number) => (
                <motion.tr
                  key={res.id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <td className="text-cream text-sm">
                    {res.user?.firstName ? `${res.user.firstName} ${res.user.lastName || ''}` : res.user?.email || '—'}
                  </td>
                  <td className="text-night-300 text-sm">№ {res.booth?.number || '—'}</td>
                  <td className="text-night-300 text-sm">
                    {res.booth?.exhibition ? getI18nField(res.booth.exhibition.title, lang) : '—'}
                  </td>
                  <td>
                    <span className={cn('text-xs px-2 py-0.5 border font-bold', getStatusColor(res.status))}>
                      {res.status}
                    </span>
                  </td>
                  <td className="text-night-300 text-xs">
                    {res.createdAt ? formatDate(res.createdAt, lang) : '—'}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {res.status === 'PENDING' && (
                        <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Подтвердить</button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

const MOCK_DASHBOARD = {
  stats: { totalUsers: 152, totalExhibitions: 12, totalReservations: 89, totalApplications: 234, totalPayments: 67 },
  recentReservations: [
    { id: '1', status: 'PENDING', createdAt: '2026-03-15T10:00:00', user: { firstName: 'Алишер', lastName: 'Рахимов' }, booth: { number: 'A-12' } },
    { id: '2', status: 'CONFIRMED', createdAt: '2026-03-14T15:30:00', user: { firstName: 'Малика', lastName: 'Юсупова' }, booth: { number: 'B-05' } },
    { id: '3', status: 'PENDING', createdAt: '2026-03-14T11:20:00', user: { email: 'company@biz.tj' }, booth: { number: 'C-18' } },
  ],
};
