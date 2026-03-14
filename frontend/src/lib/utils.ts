import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, lang = 'ru'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const locale = lang === 'ru' ? ru : undefined;
  return format(d, 'dd MMMM yyyy', { locale });
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd.MM.yyyy');
}

export function getI18nField(
  field: { tj?: string; ru?: string; en?: string } | string | null | undefined,
  lang: string
): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang as 'tj' | 'ru' | 'en'] || field.ru || field.en || field.tj || '';
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'}/${path}`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    PUBLISHED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    ONGOING: 'text-gold-400 bg-gold-400/10 border-gold-400/20',
    COMPLETED: 'text-night-300 bg-night-600/40 border-night-600',
    DRAFT: 'text-night-300 bg-night-700/40 border-night-600',
    PENDING: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    CONFIRMED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/20',
    APPROVED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    REJECTED: 'text-red-400 bg-red-400/10 border-red-400/20',
    SUCCESS: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    FAILED: 'text-red-400 bg-red-400/10 border-red-400/20',
    AVAILABLE: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    RESERVED: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    PAID: 'text-gold-400 bg-gold-400/10 border-gold-400/20',
  };
  return map[status] || 'text-night-300 bg-night-600/40 border-night-600';
}
