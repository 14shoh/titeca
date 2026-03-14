'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, FileText, Map, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { exhibitionsApi, boothsApi, applicationsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getImageUrl, getStatusColor } from '@/lib/utils';
import BoothMap from '@/components/exhibitions/BoothMap';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type Tab = 'info' | 'program' | 'participants' | 'map';

export default function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { lang, t } = useLang();
  const { user } = useAuth();

  const [exhibition, setExhibition] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [booths, setBooths] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    Promise.all([
      exhibitionsApi.get(id),
      exhibitionsApi.getPrograms(id),
      exhibitionsApi.getParticipants(id),
      boothsApi.list(id),
    ]).then(([ex, prog, part, bo]) => {
      setExhibition(unwrap(ex));
      setPrograms(unwrap<any>(prog) || []);
      setParticipants(unwrap<any>(part) || []);
      setBooths(unwrap<any>(bo) || []);
    }).catch(() => {
      setExhibition(MOCK_EXHIBITION);
      setPrograms(MOCK_PROGRAMS);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!user) { router.push('/auth/login'); return; }
    setRegistering(true);
    try {
      await applicationsApi.create({ exhibitionId: id });
      toast.success('Заявка подана успешно!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setRegistering(false);
    }
  };

  const refreshBooths = () => {
    boothsApi.list(id).then(res => setBooths(unwrap<any>(res) || []));
  };

  if (loading) return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center">
      <div className="text-gold-500 font-display text-2xl animate-pulse">Titeca</div>
    </div>
  );

  if (!exhibition) return null;

  const title = getI18nField(exhibition.title, lang);
  const description = getI18nField(exhibition.description, lang);
  const coverImg = getImageUrl(exhibition.coverImage);

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'info', label: t('exhibition.info'), icon: FileText },
    { key: 'program', label: t('exhibition.program'), icon: Clock },
    { key: 'participants', label: t('exhibition.participants'), icon: Users },
    { key: 'map', label: t('exhibition.hall_map'), icon: Map },
  ];

  return (
    <div className="min-h-screen bg-night-900">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[480px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/50 to-transparent" />
        <div className="absolute inset-0 girih-bg opacity-30" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="absolute top-28 left-8 flex items-center gap-2 text-night-300 hover:text-cream transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          {t('common.back')}
        </motion.button>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={cn('text-xs font-bold tracking-widest px-2 py-1 border', getStatusColor(exhibition.status))}>
                {t(`status.${exhibition.status}`)}
              </span>
              {exhibition.industry && (
                <span className="badge-gold">{t(`industries.${exhibition.industry}`)}</span>
              )}
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-cream max-w-4xl mb-6 leading-tight">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-night-300 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gold-500/60" />
                {formatDate(exhibition.startDate, lang)} — {formatDate(exhibition.endDate, lang)}
              </div>
              {exhibition.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gold-500/60" />
                  {exhibition.location}{exhibition.city ? `, ${exhibition.city}` : ''}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gold-500/60" />
                {participants.length} {t('exhibition.participants')}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Tabs */}
          <div className="lg:col-span-2">
            {/* Tab bar */}
            <div className="flex border-b border-white/5 mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all',
                    activeTab === tab.key
                      ? 'border-gold-500 text-gold-400'
                      : 'border-transparent text-night-300 hover:text-cream'
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'info' && (
                <div>
                  {description && (
                    <p className="text-night-300 leading-relaxed text-base mb-6">{description}</p>
                  )}
                  {exhibition.mapImage && (
                    <div className="glass-card rounded-none p-4 mt-6">
                      <img src={getImageUrl(exhibition.mapImage)} alt="Карта" className="w-full" />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'program' && (
                <div className="space-y-4">
                  {programs.length === 0 && (
                    <p className="text-night-300">Программа ещё не опубликована</p>
                  )}
                  {programs.map((prog, i) => (
                    <motion.div
                      key={prog.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card rounded-none p-5 flex gap-4"
                    >
                      <div className="text-center min-w-[80px]">
                        <div className="text-gold-400 font-semibold text-sm">
                          {prog.startTime ? formatDate(prog.startTime, lang) : ''}
                        </div>
                        <div className="text-night-300 text-xs mt-1">
                          {new Date(prog.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                          {' — '}
                          {new Date(prog.endTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex-1 border-l border-white/5 pl-4">
                        <h4 className="font-display text-lg text-cream mb-1">{prog.title}</h4>
                        {prog.speaker && <p className="text-night-300 text-sm">{prog.speaker}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'participants' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {participants.length === 0 && (
                    <p className="text-night-300 col-span-3">Список участников пока не опубликован</p>
                  )}
                  {participants.map((p: any) => (
                    <div key={p.id} className="glass-card rounded-none p-4 flex flex-col items-center gap-2 text-center">
                      <div className="w-14 h-14 bg-night-700 flex items-center justify-center border border-white/10">
                        {p.company?.logo ? (
                          <img src={getImageUrl(p.company.logo)} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="font-display text-xl text-gold-500">
                            {p.company?.name?.[0] || '?'}
                          </span>
                        )}
                      </div>
                      <span className="text-cream text-xs font-medium line-clamp-2">{p.company?.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'map' && (
                <BoothMap booths={booths} exhibitionId={id} onReserved={refreshBooths} />
              )}
            </motion.div>
          </div>

          {/* Right: Sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 glass-card rounded-none p-6">
              <h3 className="font-display text-2xl text-cream mb-6">Участие</h3>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-night-300">Начало</span>
                  <span className="text-cream font-medium">{formatDate(exhibition.startDate, lang)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-night-300">Окончание</span>
                  <span className="text-cream font-medium">{formatDate(exhibition.endDate, lang)}</span>
                </div>
                {exhibition.location && (
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-night-300">Место</span>
                    <span className="text-cream font-medium text-right max-w-[150px]">{exhibition.location}</span>
                  </div>
                )}
                {exhibition.city && (
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-night-300">Город</span>
                    <span className="text-cream font-medium">{exhibition.city}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3">
                  <span className="text-night-300">Свободных стендов</span>
                  <span className="text-gold-400 font-semibold">
                    {booths.filter(b => b.status === 'AVAILABLE').length}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="btn-gold w-full rounded-none text-xs disabled:opacity-50"
                >
                  {registering ? t('common.loading') : t('exhibition.register')}
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className="btn-outline-gold w-full rounded-none text-xs"
                >
                  {t('exhibition.reserve_booth')}
                </button>
              </div>

              {/* Gallery preview */}
              {exhibition.gallery?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="section-label text-[0.6rem] mb-3">Галерея</p>
                  <div className="grid grid-cols-3 gap-1">
                    {exhibition.gallery.slice(0, 6).map((img: string, i: number) => (
                      <div key={i} className="aspect-square bg-night-700 overflow-hidden">
                        <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCK_EXHIBITION = {
  id: '1', status: 'PUBLISHED', industry: 'TECHNOLOGY',
  title: { ru: 'TechExpo Tajikistan 2026', tj: 'TechExpo Тоҷикистон 2026', en: 'TechExpo Tajikistan 2026' },
  description: { ru: 'Международная выставка инновационных технологий и цифровых решений для бизнеса в Таджикистане. Ежегодное мероприятие объединяет ведущих разработчиков ПО, IT-компании и стартапы Центральной Азии. Программа включает пленарные заседания, технические семинары, нетворкинг и B2B встречи.', en: '', tj: '' },
  startDate: '2026-05-15', endDate: '2026-05-18',
  location: 'Кохи Арбоб', city: 'Душанбе', country: 'Таджикистан',
  coverImage: null, mapImage: null, gallery: [],
};

const MOCK_PROGRAMS = [
  { id: '1', title: 'Открытие выставки', startTime: '2026-05-15T09:00:00', endTime: '2026-05-15T10:00:00', speaker: 'Оргкомитет Titeca' },
  { id: '2', title: 'Цифровая трансформация экономики Таджикистана', startTime: '2026-05-15T10:30:00', endTime: '2026-05-15T12:00:00', speaker: 'Министр цифрового развития' },
  { id: '3', title: 'Стартап питч-сессия', startTime: '2026-05-15T14:00:00', endTime: '2026-05-15T17:00:00', speaker: 'Команды финалистов' },
  { id: '4', title: 'Панельная дискуссия: ИИ в бизнесе', startTime: '2026-05-16T11:00:00', endTime: '2026-05-16T13:00:00', speaker: 'Эксперты отрасли' },
];
