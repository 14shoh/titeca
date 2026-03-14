'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Phone, Mail, MapPin, ExternalLink, ArrowLeft, MessageSquare, Play } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { companiesApi, unwrap } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export default function CompanyProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      companiesApi.get(id),
      companiesApi.getProducts(id),
    ]).then(([c, p]) => {
      setCompany(unwrap(c));
      setProducts(unwrap<any>(p) || []);
    }).catch(() => setCompany(MOCK_COMPANY))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center">
      <div className="text-gold-500 font-display text-2xl animate-pulse">Titeca</div>
    </div>
  );

  if (!company) return null;

  const getYoutubeId = (url: string) => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return m?.[1] || null;
  };

  const youtubeId = company.videoUrl ? getYoutubeId(company.videoUrl) : null;

  return (
    <div className="min-h-screen bg-night-900 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-night-300 hover:text-cream transition-colors text-sm mb-8">
          <ArrowLeft size={16} />
          {t('common.back')}
        </button>

        {/* Company header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-none p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Logo */}
            <div className="w-28 h-28 flex-shrink-0 border-2 border-gold-500/30 flex items-center justify-center bg-night-700 overflow-hidden">
              {company.logo ? (
                <img src={getImageUrl(company.logo)} className="w-full h-full object-cover" alt={company.name} />
              ) : (
                <span className="font-display text-5xl text-gold-500">{company.name?.[0]?.toUpperCase()}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-light text-cream mb-2">{company.name}</h1>
                  {company.industry && (
                    <span className="badge-gold">{t(`industries.${company.industry}`)}</span>
                  )}
                </div>
                {user && (
                  <button className="btn-outline-gold rounded-none text-xs inline-flex items-center gap-2">
                    <MessageSquare size={13} />
                    Написать
                  </button>
                )}
              </div>

              {company.description && (
                <p className="text-night-300 leading-relaxed max-w-2xl mb-6">{company.description}</p>
              )}

              {/* Contacts */}
              <div className="flex flex-wrap gap-5">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm transition-colors">
                    <Globe size={14} /> {company.website}
                    <ExternalLink size={11} />
                  </a>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2 text-night-300 text-sm">
                    <Phone size={14} className="text-gold-500/60" /> {company.phone}
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2 text-night-300 text-sm">
                    <Mail size={14} className="text-gold-500/60" /> {company.email}
                  </div>
                )}
                {company.address && (
                  <div className="flex items-center gap-2 text-night-300 text-sm">
                    <MapPin size={14} className="text-gold-500/60" /> {company.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            {products.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <p className="section-label mb-5">Продукция</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((prod, i) => (
                    <motion.div
                      key={prod.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="glass-card rounded-none overflow-hidden"
                    >
                      {prod.image && (
                        <div className="h-36 bg-night-700 overflow-hidden">
                          <img src={getImageUrl(prod.image)} className="w-full h-full object-cover" alt={prod.name} />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-display text-lg text-cream mb-1">{prod.name}</h4>
                        {prod.description && <p className="text-night-300 text-sm line-clamp-2">{prod.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Video */}
          <div>
            {youtubeId && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <p className="section-label mb-4">Видео о компании</p>
                <div className="relative aspect-video glass-card rounded-none overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="Company video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCK_COMPANY = {
  id: '1',
  name: 'TechSolutions Tajikistan',
  description: 'Ведущая IT-компания Таджикистана, специализирующаяся на разработке программного обеспечения, внедрении ERP-систем и цифровой трансформации бизнеса.',
  industry: 'TECHNOLOGY',
  website: 'https://techsolutions.tj',
  phone: '+992 44 600-00-00',
  email: 'info@techsolutions.tj',
  address: 'Душанбе, ул. Рудаки, 30',
  logo: null,
  videoUrl: null,
};
