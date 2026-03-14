'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, FileText, MessageSquare,
  CreditCard, User, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center">
      <div className="text-gold-500 font-display text-2xl animate-pulse">Titeca</div>
    </div>
  );

  const navItems = [
    { href: '/dashboard', label: t('dashboard.overview'), icon: LayoutDashboard, exact: true },
    { href: '/dashboard/reservations', label: t('dashboard.reservations'), icon: Calendar },
    { href: '/dashboard/applications', label: t('dashboard.applications'), icon: FileText },
    { href: '/dashboard/messages', label: t('dashboard.messages'), icon: MessageSquare },
    { href: '/dashboard/payments', label: t('dashboard.payments'), icon: CreditCard },
    { href: '/dashboard/profile', label: t('dashboard.profile'), icon: User },
  ];

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
            <polygon points="18,2 34,10.5 34,25.5 18,34 2,25.5 2,10.5" fill="none" stroke="#C9A870" strokeWidth="1.5"/>
            <circle cx="18" cy="18" r="3" fill="#C9A870"/>
          </svg>
          <span className="font-display text-lg tracking-widest text-cream">TITECA</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-gold-500/30 flex items-center justify-center bg-gold-500/5 flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt="" />
            ) : (
              <span className="font-display text-lg text-gold-500">
                {(user.firstName?.[0] || user.email[0]).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-cream text-sm font-medium truncate">
              {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
            </p>
            <p className="text-night-300 text-xs truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
            <div className={cn('sidebar-item', isActive(item.href, item.exact) && 'active')}>
              <item.icon size={16} />
              <span>{item.label}</span>
              {isActive(item.href, item.exact) && (
                <ChevronRight size={12} className="ml-auto" />
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={logout}
          className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-400/5"
        >
          <LogOut size={16} />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-night-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-night-800 border-r border-white/5">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="relative w-64 bg-night-800 h-full"
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-night-300 hover:text-cream"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </motion.aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center gap-4 px-4 h-16 bg-night-800/95 backdrop-blur border-b border-white/5">
          <button onClick={() => setSidebarOpen(true)} className="text-night-300 hover:text-cream">
            <Menu size={20} />
          </button>
          <span className="font-display text-lg text-cream">Titeca</span>
        </div>

        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 lg:p-8 max-w-6xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
