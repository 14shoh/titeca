import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import UpcomingSection from '@/components/home/UpcomingSection';
import NewsSection from '@/components/home/NewsSection';
import PartnersSection from '@/components/home/PartnersSection';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Titeca — Национальная платформа выставок Таджикистана',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <UpcomingSection />
      <NewsSection />
      <CTASection />
      <PartnersSection />
    </>
  );
}
