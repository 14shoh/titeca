'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { getI18nField, formatDate, getStatusColor, getImageUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Exhibition {
  id: string;
  title: { tj?: string; ru?: string; en?: string } | string;
  description?: { tj?: string; ru?: string; en?: string } | string;
  startDate: string;
  endDate: string;
  location?: string;
  city?: string;
  country?: string;
  industry?: string;
  status: string;
  coverImage?: string;
}

interface Props {
  exhibition: Exhibition;
  index?: number;
}

const industryColors: Record<string, string> = {
  TECHNOLOGY: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  AGRICULTURE: 'text-green-400 bg-green-400/10 border-green-400/20',
  CONSTRUCTION: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  HEALTHCARE: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  EDUCATION: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  ENERGY: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  TOURISM: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
};

export default function ExhibitionCard({ exhibition, index = 0 }: Props) {
  const { lang, t } = useLang();
  const title = getI18nField(exhibition.title, lang);
  const desc = getI18nField(exhibition.description, lang);
  const imgSrc = getImageUrl(exhibition.coverImage);
  const industryColor = industryColors[exhibition.industry || ''] || 'text-gold-400 bg-gold-400/10 border-gold-400/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/exhibitions/${exhibition.id}`} className="group block">
        <article className="exhibition-card glass-card rounded-none overflow-hidden">
          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-night-700">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${imgSrc})` }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/20 to-transparent" />
            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <span className={cn('badge-gold border text-[0.6rem]', getStatusColor(exhibition.status))}>
                {t(`status.${exhibition.status}`)}
              </span>
            </div>
            {/* Industry badge */}
            {exhibition.industry && (
              <div className="absolute top-4 right-4">
                <span className={cn('text-[0.6rem] font-bold tracking-widest uppercase px-2 py-1 border rounded-sm', industryColor)}>
                  {t(`industries.${exhibition.industry}`)}
                </span>
              </div>
            )}
            {/* Card hover line */}
            <div className="card-overlay absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="card-title font-display text-xl font-medium text-cream leading-tight mb-3 transition-colors duration-300 group-hover:text-gold-300 line-clamp-2">
              {title}
            </h3>
            {desc && (
              <p className="text-night-300 text-sm leading-relaxed line-clamp-2 mb-4">{desc}</p>
            )}

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-night-300 text-xs">
                <Calendar size={12} className="text-gold-500/60 flex-shrink-0" />
                <span>{formatDate(exhibition.startDate, lang)} — {formatDate(exhibition.endDate, lang)}</span>
              </div>
              {(exhibition.city || exhibition.location) && (
                <div className="flex items-center gap-2 text-night-300 text-xs">
                  <MapPin size={12} className="text-gold-500/60 flex-shrink-0" />
                  <span>{[exhibition.city, exhibition.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="section-label text-[0.6rem] text-gold-500/60">Titeca</span>
              <span className="flex items-center gap-1 text-gold-500 text-xs font-semibold group-hover:gap-2 transition-all">
                {t('common.read_more')}
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
