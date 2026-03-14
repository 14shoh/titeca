'use client';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative bg-night-950 border-t border-gold-500/10 overflow-hidden">
      {/* Girih background */}
      <div className="absolute inset-0 girih-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
                <polygon points="18,2 34,10.5 34,25.5 18,34 2,25.5 2,10.5"
                  fill="none" stroke="#C9A870" strokeWidth="1.5"/>
                <circle cx="18" cy="18" r="3" fill="#C9A870"/>
              </svg>
              <span className="font-display text-xl tracking-[0.06em] text-cream">TITECA</span>
            </div>
            <p className="text-night-300 text-sm leading-relaxed max-w-xs mb-6">
              {t('footer.tagline')}
            </p>
            <div className="space-y-2">
              <a href="mailto:info@titeca.tj" className="flex items-center gap-2 text-night-300 hover:text-gold-400 transition-colors text-sm">
                <Mail size={14} className="text-gold-500/60" /> info@titeca.tj
              </a>
              <a href="tel:+992000000000" className="flex items-center gap-2 text-night-300 hover:text-gold-400 transition-colors text-sm">
                <Phone size={14} className="text-gold-500/60" /> +992 (000) 00-00-00
              </a>
              <div className="flex items-center gap-2 text-night-300 text-sm">
                <MapPin size={14} className="text-gold-500/60" /> Душанбе, Таджикистан
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="section-label mb-5">{t('footer.links')}</h4>
            <ul className="space-y-3">
              {[
                { href: '/exhibitions', label: t('nav.exhibitions') },
                { href: '/companies', label: t('nav.companies') },
                { href: '/news', label: t('nav.news') },
                { href: '/auth/register', label: t('nav.register') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-gold text-sm text-night-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="section-label mb-5">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {[
                { href: '/privacy', label: t('footer.privacy') },
                { href: '/terms', label: t('footer.terms') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-gold text-sm text-night-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-night-300 text-xs">{t('footer.rights')}</p>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-night-300 text-xs ml-1">
              {new Date().getFullYear()} · Dushanbe, Tajikistan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
