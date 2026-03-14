'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export default function RegisterPage() {
  const { t } = useLang();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await authApi.register(data);
      setDone(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-none p-12 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-gold-500" />
        </div>
        <h2 className="font-display text-3xl text-cream mb-4">Готово!</h2>
        <p className="text-night-300 mb-8 text-sm leading-relaxed">
          Мы отправили письмо с подтверждением на ваш email. Проверьте папку «Входящие».
        </p>
        <Link href="/auth/login" className="btn-gold inline-block rounded-none text-xs">
          {t('auth.login_btn')}
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-night-900 flex">
      {/* Decorative panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-night-800 items-center justify-center"
      >
        <div className="absolute inset-0 girih-bg opacity-50" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,112,0.07) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 text-center max-w-sm px-8">
          <div className="font-display text-8xl font-light text-gold-gradient opacity-30 mb-8 leading-none">T</div>
          <h2 className="font-display text-4xl text-cream mb-4">Titeca</h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-night-300 text-sm leading-relaxed">
            Присоединитесь к ведущей платформе выставок и конференций Таджикистана
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <p className="section-label mb-3">{t('auth.register_sub')}</p>
          <h1 className="font-display text-5xl font-light text-cream mb-8">
            {t('auth.register_title')}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="section-label text-[0.6rem] block mb-2">{t('auth.first_name')}</label>
                <input
                  {...register('firstName', { required: true })}
                  placeholder="Имя"
                  className="input-dark w-full px-4 py-3 text-sm rounded-none"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">Обязательное поле</p>}
              </div>
              <div>
                <label className="section-label text-[0.6rem] block mb-2">{t('auth.last_name')}</label>
                <input
                  {...register('lastName', { required: true })}
                  placeholder="Фамилия"
                  className="input-dark w-full px-4 py-3 text-sm rounded-none"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">Обязательное поле</p>}
              </div>
            </div>

            <div>
              <label className="section-label text-[0.6rem] block mb-2">{t('auth.email')}</label>
              <input
                type="email"
                {...register('email', { required: true })}
                placeholder="example@email.com"
                className="input-dark w-full px-4 py-3 text-sm rounded-none"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">Email обязателен</p>}
            </div>

            <div>
              <label className="section-label text-[0.6rem] block mb-2">{t('auth.phone')}</label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="+992 ..."
                className="input-dark w-full px-4 py-3 text-sm rounded-none"
              />
            </div>

            <div>
              <label className="section-label text-[0.6rem] block mb-2">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  {...register('password', { required: true, minLength: 6 })}
                  placeholder="Минимум 6 символов"
                  className="input-dark w-full px-4 py-3 text-sm rounded-none pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-night-300 hover:text-cream transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">Минимум 6 символов</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full rounded-none text-xs inline-flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? t('common.loading') : (
                <>{t('auth.register_btn')} <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <p className="text-night-300 text-sm text-center mt-6">
            {t('auth.has_account')}{' '}
            <Link href="/auth/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              {t('auth.login_btn')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
