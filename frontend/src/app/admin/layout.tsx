'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, Users, Building2,
  FileText, Newspaper, CreditCard, Settings, ChevronRight, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') return null;

  const navItems = [
    { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
    { href: '/admin/exhibitions', label: 'Выставки', icon: CalendarDays },
    { href: '/admin/users', label: 'Пользователи', icon: Users },
    { href: '/admin/companies', label: 'Компании', icon: Building2 },
    { href: '/admin/applications', label: 'Заявки', icon: FileText },
    { href: '/admin/reservations', label: 'Бронирования', icon: ShieldCheck },
    { href: '/admin/payments', label: 'Платежи', icon: CreditCard },
    { href: '/admin/news', label: 'Новости', icon: Newspaper },
  ];

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-night-950 flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-night-900 border-r border-white/5">
        <div className="sticky top-0 h-screen flex flex-col">
          {/* Brand */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                <polygon points="18,2 34,10.5 34,25.5 18,34 2,25.5 2,10.5" fill="none" stroke="#C9A870" strokeWidth="1.5"/>
                <circle cx="18" cy="18" r="3" fill="#C9A870"/>
              </svg>
              <span className="font-display tracking-widest text-cream">TITECA</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck size={10} className="text-gold-500" />
              <span className="section-label text-[0.55rem] text-gold-500">ADMIN PANEL</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={cn('sidebar-item', isActive(item.href, item.exact) && 'active')}>
                  <item.icon size={15} />
                  <span>{item.label}</span>
                  {isActive(item.href, item.exact) && (
                    <ChevronRight size={11} className="ml-auto" />
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                <span className="font-display text-xs text-gold-500">
                  {(user.firstName?.[0] || 'A').toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-cream text-xs font-medium truncate">{user.firstName || 'Admin'}</p>
                <Link href="/" className="text-night-300 text-[10px] hover:text-gold-400 transition-colors">← На сайт</Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-auto">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
