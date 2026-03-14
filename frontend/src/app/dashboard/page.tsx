'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, FileText, MessageSquare, CreditCard, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { reservationsApi, applicationsApi, messagesApi, paymentsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const [stats, setStats] = useState({ reservations: 0, applications: 0, messages: 0, payments: 0 });
  const [recentRes, setRecentRes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      reservationsApi.my(),
      applicationsApi.my(),
      messagesApi.inbox(),
      paymentsApi.my(),
    ]).then(([res, apps, msgs, pays]) => {
      const r = res.status === 'fulfilled' ? (unwrap<any>(res.value) || []) : [];
      const a = apps.status === 'fulfilled' ? (unwrap<any>(apps.value) || []) : [];
      const m = msgs.status === 'fulfilled' ? (unwrap<any>(msgs.value) || []) : [];
      const p = pays.status === 'fulfilled' ? (unwrap<any>(pays.value) || []) : [];
      setStats({ reservations: r.length, applications: a.length, messages: m.filter((x: any) => !x.isRead).length, payments: p.length });
      setRecentRes(r.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: t('dashboard.reservations'), value: stats.reservations, icon: Calendar, href: '/dashboard/reservations', color: 'text-gold-400' },
    { label: t('dashboard.applications'), value: stats.applications, icon: FileText, href: '/dashboard/applications', color: 'text-blue-400' },
    { label: 'Непрочитанных', value: stats.messages, icon: MessageSquare, href: '/dashboard/messages', color: 'text-emerald-400' },
    { label: t('dashboard.payments'), value: stats.payments, icon: CreditCard, href: '/dashboard/payments', color: 'text-purple-400' },
  ];

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="section-label mb-2">{t('dashboard.overview')}</p>
        <h1 className="font-display text-4xl md:text-5xl font-light text-cream">
          {t('dashboard.welcome')},<br />
          <span className="text-gold-gradient">{user?.firstName || user?.email}</span>
        </h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={card.href}>
              <div className="glass-card rounded-none p-5 hover:border-gold-500/25 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('p-2 bg-current/10 rounded-none', card.color.replace('text-', 'bg-') + '/10')}>
                    <card.icon size={16} className={card.color} />
                  </div>
                  <ChevronRight size={14} className="text-night-300 group-hover:text-gold-400 transition-colors" />
                </div>
                <div className="font-display text-3xl font-light text-cream">{card.value}</div>
                <div className="text-night-300 text-xs mt-1 font-medium">{card.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent reservations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-none overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-display text-xl text-cream">{t('dashboard.reservations')}</h2>
          <Link href="/dashboard/reservations" className="text-gold-500 text-xs hover:text-gold-300 transition-colors flex items-center gap-1">
            {t('common.view_all')} <ArrowRight size={12} />
          </Link>
        </div>

        {recentRes.length === 0 ? (
          <div className="px-6 py-12 text-center text-night-300 text-sm">
            {t('dashboard.no_reservations')}
          </div>
        ) : (
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">Выставка</th>
                <th className="text-left">Стенд</th>
                <th className="text-left">Сумма</th>
                <th className="text-left">Статус</th>
                <th className="text-left">Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentRes.map((res) => (
                <tr key={res.id}>
                  <td className="text-cream text-sm">
                    {res.booth?.exhibition ? getI18nField(res.booth.exhibition.title, lang) : '—'}
                  </td>
                  <td className="text-night-300 text-sm">№ {res.booth?.number || '—'}</td>
                  <td className="text-gold-400 text-sm font-medium">
                    {res.booth?.price ? `${Number(res.booth.price).toLocaleString()} TJS` : '—'}
                  </td>
                  <td>
                    <span className={cn('text-xs px-2 py-0.5 border rounded-sm font-medium', getStatusColor(res.status))}>
                      {t(`status.${res.status}`)}
                    </span>
                  </td>
                  <td className="text-night-300 text-xs">{formatDate(res.createdAt, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
