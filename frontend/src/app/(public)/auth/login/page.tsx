'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { authApi, unwrap } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { t } = useLang();
  const { login } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { accessToken, refreshToken, user } = unwrap<any>(res);
      login({ accessToken, refreshToken, user });
      toast.success(`Добро пожаловать, ${user.firstName || user.email}!`);
      router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Неверные данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-night-900 flex">
      {/* Left decorative panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-night-800 items-center justify-center"
      >
        <div className="absolute inset-0 girih-bg opacity-50" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,112,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 text-center max-w-sm px-8">
          {/* Logo symbol */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="w-28 h-28 mx-auto mb-8 opacity-20"
          >
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" stroke="#C9A870" strokeWidth="1.5"/>
              <polygon points="50,18 82,34.5 82,65.5 50,82 18,65.5 18,34.5" stroke="#C9A870" strokeWidth="1"/>
              <polygon points="50,31 69,41.5 69,58.5 50,69 31,58.5 31,41.5" stroke="#C9A870" strokeWidth="0.8"/>
              <circle cx="50" cy="50" r="4" fill="#C9A870"/>
            </svg>
          </motion.div>

          <h2 className="font-display text-4xl text-cream mb-4">TITECA</h2>
          <p className="text-night-300 text-sm leading-relaxed">
            Национальная платформа выставок и конференций Таджикистана
          </p>

          <div className="mt-12 space-y-3">
            {['240+ выставок', '1850+ компаний', '38 стран'].map((stat) => (
              <div key={stat} className="flex items-center gap-3 text-left">
                <div className="w-1 h-1 rounded-full bg-gold-500" />
                <span className="text-night-300 text-sm">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
              <polygon points="18,2 34,10.5 34,25.5 18,34 2,25.5 2,10.5" fill="none" stroke="#C9A870" strokeWidth="1.5"/>
              <circle cx="18" cy="18" r="3" fill="#C9A870"/>
            </svg>
            <span className="font-display text-xl tracking-widest text-cream">TITECA</span>
          </div>

          <p className="section-label mb-3">{t('auth.login_sub')}</p>
          <h1 className="font-display text-5xl font-light text-cream mb-8">
            {t('auth.login_title')}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              <div className="flex items-center justify-between mb-2">
                <label className="section-label text-[0.6rem]">{t('auth.password')}</label>
                <Link href="/auth/forgot-password" className="text-night-300 hover:text-gold-400 text-xs transition-colors">
                  {t('auth.forgot')}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  {...register('password', { required: true })}
                  placeholder="••••••••"
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
              {errors.password && <p className="text-red-400 text-xs mt-1">Пароль обязателен</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full rounded-none text-xs inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? t('common.loading') : (
                <>{t('auth.login_btn')} <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <p className="text-night-300 text-sm text-center mt-6">
            {t('auth.no_account')}{' '}
            <Link href="/auth/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              {t('auth.register_btn')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
