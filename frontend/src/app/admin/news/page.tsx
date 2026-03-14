'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { newsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminNewsPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ titleRu: '', titleTj: '', titleEn: '', contentRu: '', author: '', publishedAt: '' });

  const load = () => {
    setLoading(true);
    newsApi.list({ limit: 50 })
      .then(res => setItems(unwrap<any>(res)?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await newsApi.create({
        title: { ru: form.titleRu, tj: form.titleTj, en: form.titleEn },
        content: { ru: form.contentRu, tj: '', en: '' },
        author: form.author,
        publishedAt: form.publishedAt || undefined,
      });
      toast.success('Новость создана');
      setShowForm(false);
      setForm({ titleRu: '', titleTj: '', titleEn: '', contentRu: '', author: '', publishedAt: '' });
      load();
    } catch { toast.error('Ошибка'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-8">
        <div>
          <p className="section-label mb-2">Администрирование</p>
          <h1 className="font-display text-5xl font-light text-cream">Новости</h1>
          <div className="gold-divider mt-4" />
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gold rounded-none text-xs inline-flex items-center gap-2">
          <Plus size={14} /> Добавить
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-card rounded-none p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-cream">Новая новость</h2>
                <button onClick={() => setShowForm(false)} className="text-night-300 hover:text-cream"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                {[['titleRu', 'Заголовок (RU)'], ['titleTj', 'Заголовок (TJ)'], ['titleEn', 'Заголовок (EN)']].map(([key, label]) => (
                  <div key={key}>
                    <label className="section-label text-[0.6rem] block mb-2">{label}</label>
                    <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none" />
                  </div>
                ))}
                <div>
                  <label className="section-label text-[0.6rem] block mb-2">Содержание (RU)</label>
                  <textarea value={form.contentRu} onChange={e => setForm(f => ({ ...f, contentRu: e.target.value }))} rows={5} className="input-dark w-full px-4 py-2.5 text-sm rounded-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label text-[0.6rem] block mb-2">Автор</label>
                    <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none" />
                  </div>
                  <div>
                    <label className="section-label text-[0.6rem] block mb-2">Дата публикации</label>
                    <input type="date" value={form.publishedAt} onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={save} disabled={saving} className="btn-gold rounded-none text-xs inline-flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  {t('common.save')}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline-gold rounded-none text-xs">{t('common.cancel')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-gold-500 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card rounded-none p-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg text-cream mb-1">{getI18nField(item.title, lang)}</h3>
                <div className="flex items-center gap-4 text-night-300 text-xs">
                  {item.author && <span>{item.author}</span>}
                  {item.publishedAt && <span>{formatDate(item.publishedAt, lang)}</span>}
                </div>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && (
            <div className="glass-card rounded-none p-12 text-center text-night-300">Новостей нет</div>
          )}
        </div>
      )}
    </div>
  );
}
