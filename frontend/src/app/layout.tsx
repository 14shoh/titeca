import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from 'react-hot-toast';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Titeca — Национальная платформа выставок Таджикистана',
    template: '%s | Titeca',
  },
  description: 'Онлайн-платформа для организации, продвижения и управления международными и национальными выставками, форумами и бизнес-мероприятиями в Таджикистане.',
  keywords: ['выставки', 'конференции', 'Таджикистан', 'бизнес', 'намоишгоҳ', 'Titeca'],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://titeca.tj',
    siteName: 'Titeca',
    title: 'Titeca — Национальная платформа выставок Таджикистана',
    description: 'Онлайн-платформа для организации международных и национальных выставок Таджикистана',
  },
  robots: { index: true, follow: true },
  themeColor: '#07090F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#131C2E',
                  color: '#E8E1D6',
                  border: '1px solid rgba(201,168,112,0.2)',
                  fontFamily: 'var(--font-jakarta)',
                  fontSize: '0.875rem',
                },
                success: { iconTheme: { primary: '#C9A870', secondary: '#07090F' } },
                error: { iconTheme: { primary: '#EF4444', secondary: '#07090F' } },
              }}
            />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
