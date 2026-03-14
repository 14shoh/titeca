'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/contexts/LanguageContext';
import { reservationsApi, unwrap } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { X, MapPin, DollarSign, Maximize2 } from 'lucide-react';

interface Booth {
  id: string;
  number: string;
  size?: string;
  price: number;
  posX?: number;
  posY?: number;
  status: 'AVAILABLE' | 'RESERVED' | 'PAID';
}

interface Props {
  booths: Booth[];
  exhibitionId: string;
  onReserved?: () => void;
}

const STATUS_COLORS = {
  AVAILABLE: { fill: 'rgba(201,168,112,0.08)', stroke: 'rgba(201,168,112,0.35)', hover: 'rgba(201,168,112,0.25)' },
  RESERVED:  { fill: 'rgba(239,68,68,0.12)',   stroke: 'rgba(239,68,68,0.4)',    hover: '' },
  PAID:      { fill: 'rgba(34,197,94,0.12)',   stroke: 'rgba(34,197,94,0.4)',    hover: '' },
};

export default function BoothMap({ booths, exhibitionId, onReserved }: Props) {
  const { t } = useLang();
  const { user } = useAuth();
  const [selected, setSelected] = useState<Booth | null>(null);
  const [reserving, setReserving] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Auto layout if no positions
  const laidOut = booths.map((b, i) => ({
    ...b,
    posX: b.posX ?? (i % 8) * 90 + 20,
    posY: b.posY ?? Math.floor(i / 8) * 80 + 20,
  }));

  const maxX = Math.max(...laidOut.map(b => (b.posX || 0) + 70), 740);
  const maxY = Math.max(...laidOut.map(b => (b.posY || 0) + 60), 400);

  const handleReserve = async () => {
    if (!user) { toast.error('Войдите для бронирования'); return; }
    if (!selected) return;
    setReserving(true);
    try {
      await reservationsApi.create({ boothId: selected.id });
      toast.success('Стенд успешно забронирован!');
      setSelected(null);
      onReserved?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка бронирования');
    } finally {
      setReserving(false);
    }
  };

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 text-xs">
        {Object.entries(STATUS_COLORS).map(([status, colors]) => (
          <div key={status} className="flex items-center gap-2">
            <div className="w-4 h-3 border" style={{ background: colors.fill, borderColor: colors.stroke }} />
            <span className="text-night-300">{t(`exhibition.${status.toLowerCase()}`)}</span>
          </div>
        ))}
      </div>

      {/* SVG Map */}
      <div className="glass-card rounded-none p-4 overflow-auto">
        <svg
          viewBox={`0 0 ${maxX + 20} ${maxY + 20}`}
          className="w-full"
          style={{ minHeight: 300 }}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="45" height="40" patternUnits="userSpaceOnUse">
              <path d="M 45 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Stage / main area */}
          <rect x={maxX / 2 - 100} y={10} width={200} height={30} rx={2}
            fill="rgba(201,168,112,0.05)" stroke="rgba(201,168,112,0.2)" strokeWidth="0.8"/>
          <text x={maxX / 2} y={29} textAnchor="middle"
            fill="rgba(201,168,112,0.5)" fontSize="10" fontFamily="var(--font-jakarta)" letterSpacing="0.1em">
            СЦЕНА
          </text>

          {/* Booths */}
          {laidOut.map((booth) => {
            const colors = STATUS_COLORS[booth.status];
            const isHovered = hoveredId === booth.id;
            const isSelected = selected?.id === booth.id;
            return (
              <g key={booth.id}
                onClick={() => booth.status === 'AVAILABLE' && setSelected(booth)}
                onMouseEnter={() => setHoveredId(booth.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: booth.status === 'AVAILABLE' ? 'pointer' : 'not-allowed' }}
              >
                <rect
                  x={booth.posX} y={booth.posY}
                  width={75} height={55} rx={2}
                  fill={isSelected ? 'rgba(201,168,112,0.2)' : isHovered && booth.status === 'AVAILABLE' ? colors.hover : colors.fill}
                  stroke={isSelected ? '#C9A870' : colors.stroke}
                  strokeWidth={isSelected ? 1.5 : 1}
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text
                  x={(booth.posX || 0) + 37.5} y={(booth.posY || 0) + 28}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={booth.status === 'AVAILABLE' ? '#E3BE6E' : booth.status === 'RESERVED' ? '#EF4444' : '#22C55E'}
                  fontSize="11" fontWeight="600" fontFamily="var(--font-jakarta)"
                >
                  {booth.number}
                </text>
                {booth.size && (
                  <text
                    x={(booth.posX || 0) + 37.5} y={(booth.posY || 0) + 42}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="var(--font-jakarta)"
                  >
                    {booth.size}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Booth detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-16 right-0 glass-card rounded-none p-6 w-72 z-10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="section-label text-[0.6rem] mb-1">Стенд</p>
                <h4 className="font-display text-2xl text-cream">№ {selected.number}</h4>
              </div>
              <button onClick={() => setSelected(null)} className="text-night-300 hover:text-cream transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 mb-5">
              {selected.size && (
                <div className="flex items-center gap-2 text-sm text-night-300">
                  <Maximize2 size={13} className="text-gold-500/60" />
                  <span>{selected.size}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-night-300">
                <DollarSign size={13} className="text-gold-500/60" />
                <span className="text-gold-300 font-semibold">{Number(selected.price).toLocaleString()} TJS</span>
              </div>
            </div>
            <button
              onClick={handleReserve}
              disabled={reserving}
              className="btn-gold w-full rounded-none text-xs disabled:opacity-50"
            >
              {reserving ? t('common.loading') : t('exhibition.reserve_booth')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
