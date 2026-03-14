'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Save, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { api, uploadApi, unwrap } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: '',
    }
  });

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await api.patch(`/users/${user?.id}`, data);
      toast.success('Профиль обновлён');
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.image(file);
      const { url } = unwrap<any>(res);
      await api.patch(`/users/${user?.id}`, { avatar: url });
      toast.success('Фото обновлено');
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">{t('nav.dashboard')}</p>
        <h1 className="font-display text-4xl font-light text-cream">{t('dashboard.profile')}</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card rounded-none p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full border-2 border-gold-500/30 flex items-center justify-center bg-night-700 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="font-display text-4xl text-gold-500">
                    {(user?.firstName?.[0] || user?.email?.[0] || '?').toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <p className="font-display text-xl text-cream mb-1">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
            </p>
            <p className="text-night-300 text-xs mb-4">{user?.email}</p>
            <label className="btn-outline-gold rounded-none text-xs inline-flex items-center gap-2 cursor-pointer">
              <Upload size={12} />
              {uploading ? t('common.loading') : 'Загрузить фото'}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </label>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <div className="glass-card rounded-none p-6">
            <h3 className="font-display text-xl text-cream mb-6">Личные данные</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="section-label text-[0.6rem] block mb-2">{t('auth.first_name')}</label>
                  <input {...register('firstName')} className="input-dark w-full px-4 py-3 text-sm rounded-none" />
                </div>
                <div>
                  <label className="section-label text-[0.6rem] block mb-2">{t('auth.last_name')}</label>
                  <input {...register('lastName')} className="input-dark w-full px-4 py-3 text-sm rounded-none" />
                </div>
              </div>
              <div>
                <label className="section-label text-[0.6rem] block mb-2">{t('auth.phone')}</label>
                <input {...register('phone')} placeholder="+992 ..." className="input-dark w-full px-4 py-3 text-sm rounded-none" />
              </div>
              <div>
                <label className="section-label text-[0.6rem] block mb-2">{t('auth.email')}</label>
                <input value={user?.email} disabled className="input-dark w-full px-4 py-3 text-sm rounded-none opacity-50 cursor-not-allowed" />
              </div>
              <button type="submit" disabled={saving} className="btn-gold rounded-none text-xs inline-flex items-center gap-2 disabled:opacity-50">
                <Save size={13} />
                {saving ? t('common.loading') : t('common.save')}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
