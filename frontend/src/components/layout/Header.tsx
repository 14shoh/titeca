'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const LANGS = [
  { code: 'ru', label: 'Русский', flag: 'РУ' },
  { code: 'tj', label: 'Тоҷикӣ', flag: 'ТҶ' },
  { code: 'en', label: 'English', flag: 'EN' },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/exhibitions', label: t('nav.exhibitions') },
    { href: '/companies', label: t('nav.companies') },
    { href: '/news', label: t('nav.news') },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-night-900/95 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_40px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                <polygon points="18,2 34,10.5 34,25.5 18,34 2,25.5 2,10.5"
                  fill="none" stroke="#C9A870" strokeWidth="1.5"/>
                <polygon points="18,8 28,13.5 28,22.5 18,28 8,22.5 8,13.5"
                  fill="rgba(201,168,112,0.1)" stroke="#C9A870" strokeWidth="1"/>
                <circle cx="18" cy="18" r="3" fill="#C9A870"/>
              </svg>
            </div>
            <div>
              <span className="font-display text-2xl font-semibold tracking-[0.06em] text-cream group-hover:text-gold-300 transition-colors">
                TITECA
              </span>
              <div className="section-label text-[0.55rem] opacity-60 -mt-0.5 tracking-[0.2em]">
                {lang === 'ru' ? 'ТАДЖИКИСТАН' : lang === 'tj' ? 'ТОҶИКИСТОН' : 'TAJIKISTAN'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'link-gold text-sm font-medium transition-colors',
                  pathname === link.href ? 'text-gold-400' : 'text-night-300 hover:text-cream'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-night-300 hover:text-cream transition-colors text-sm font-medium"
              >
                <Globe size={14} className="text-gold-500" />
                <span className="tracking-wide">{LANGS.find(l => l.code === lang)?.flag}</span>
                <ChevronDown size={12} className={cn('transition-transform', langOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 glass-card rounded-lg overflow-hidden min-w-[140px]"
                    onMouseLeave={() => setLangOpen(false)}
                  >
                    {LANGS.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors',
                          lang === l.code
                            ? 'text-gold-400 bg-gold-500/10'
                            : 'text-night-300 hover:text-cream hover:bg-white/5'
                        )}
                      >
                        <span className="font-bold text-xs tracking-widest">{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link href="/admin" className="text-xs font-semibold tracking-widest text-gold-500 hover:text-gold-300 uppercase transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="btn-outline-gold rounded-none text-xs">
                  {t('nav.dashboard')}
                </Link>
                <button onClick={logout} className="text-night-300 hover:text-red-400 transition-colors text-xs font-medium tracking-wide uppercase">
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-night-300 hover:text-cream transition-colors text-sm font-medium">
                  {t('nav.login')}
                </Link>
                <Link href="/auth/register" className="btn-gold rounded-none text-xs">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-night-300 hover:text-cream transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden overflow-hidden bg-night-800/98 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'block py-3 text-base font-medium border-b border-white/5 transition-colors',
                      pathname === link.href ? 'text-gold-400' : 'text-night-300'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 flex items-center gap-3">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={cn(
                      'text-xs font-bold tracking-widest px-2 py-1 rounded transition-colors',
                      lang === l.code ? 'text-gold-400 bg-gold-500/10' : 'text-night-300'
                    )}
                  >
                    {l.flag}
                  </button>
                ))}
              </div>
              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard" className="btn-gold text-center rounded-none text-xs">
                      {t('nav.dashboard')}
                    </Link>
                    <button onClick={logout} className="text-red-400 text-sm font-medium">
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="btn-outline-gold text-center rounded-none text-xs">
                      {t('nav.login')}
                    </Link>
                    <Link href="/auth/register" className="btn-gold text-center rounded-none text-xs">
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
