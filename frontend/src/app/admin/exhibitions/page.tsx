'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { exhibitionsApi, unwrap } from '@/lib/api';
import { getI18nField, formatDate, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminExhibitionsPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    titleRu: '', titleTj: '', titleEn: '',
    startDate: '', endDate: '', city: '', location: '',
    country: 'Tajikistan', status: 'DRAFT', industry: '',
  });

  const load = () => {
    setLoading(true);
    exhibitionsApi.list({ limit: 50 })
      .then(res => setItems(unwrap<any>(res)?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ titleRu: '', titleTj: '', titleEn: '', startDate: '', endDate: '', city: '', location: '', country: 'Tajikistan', status: 'DRAFT', industry: '' }); setShowForm(true); };
  const openEdit = (ex: any) => {
    setEditing(ex);
    setForm({
      titleRu: ex.title?.ru || '', titleTj: ex.title?.tj || '', titleEn: ex.title?.en || '',
      startDate: ex.startDate?.slice(0, 10) || '', endDate: ex.endDate?.slice(0, 10) || '',
      city: ex.city || '', location: ex.location || '', country: ex.country || 'Tajikistan',
      status: ex.status || 'DRAFT', industry: ex.industry || '',
    });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      title: { ru: form.titleRu, tj: form.titleTj, en: form.titleEn },
      startDate: form.startDate, endDate: form.endDate,
      city: form.city, location: form.location, country: form.country,
      status: form.status, industry: form.industry || undefined,
    };
    try {
      if (editing) {
        await exhibitionsApi.update(editing.id, payload);
        toast.success('Выставка обновлена');
      } else {
        await exhibitionsApi.create(payload);
        toast.success('Выставка создана');
      }
      setShowForm(false);
      load();
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const deleteEx = async (id: string) => {
    if (!confirm('Удалить выставку?')) return;
    try {
      await exhibitionsApi.delete(id);
      toast.success('Удалено');
      load();
    } catch { toast.error('Ошибка'); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-8">
        <div>
          <p className="section-label mb-2">Администрирование</p>
          <h1 className="font-display text-5xl font-light text-cream">Выставки</h1>
          <div className="gold-divider mt-4" />
        </div>
        <button onClick={openNew} className="btn-gold rounded-none text-xs inline-flex items-center gap-2">
          <Plus size={14} /> Создать
        </button>
      </motion.div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-none p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-cream">{editing ? 'Редактировать' : 'Новая выставка'}</h2>
                <button onClick={() => setShowForm(false)} className="text-night-300 hover:text-cream"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {[['titleRu', 'Название (RU)'], ['titleTj', 'Название (TJ)'], ['titleEn', 'Название (EN)']].map(([key, label]) => (
                    <div key={key}>
                      <label className="section-label text-[0.6rem] block mb-2">{label}</label>
                      <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label text-[0.6rem] block mb-2">Дата начала</label>
                    <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none" />
                  </div>
                  <div>
                    <label className="section-label text-[0.6rem] block mb-2">Дата окончания</label>
                    <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label text-[0.6rem] block mb-2">Город</label>
                    <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none" />
                  </div>
                  <div>
                    <label className="section-label text-[0.6rem] block mb-2">Место проведения</label>
                    <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label text-[0.6rem] block mb-2">Статус</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none">
                      {['DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED'].map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="section-label text-[0.6rem] block mb-2">Отрасль</label>
                    <select value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className="input-dark w-full px-4 py-2.5 text-sm rounded-none">
                      <option value="">—</option>
                      {['AGRICULTURE','TECHNOLOGY','MANUFACTURING','CONSTRUCTION','HEALTHCARE','EDUCATION','FINANCE','TOURISM','ENERGY','FOOD','TEXTILE','MINING','TRANSPORT','OTHER'].map(i => <option key={i} value={i}>{t(`industries.${i}`)}</option>)}
                    </select>
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

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-gold-500 animate-spin" /></div>
      ) : (
        <div className="glass-card rounded-none overflow-hidden">
          <table className="data-table w-full">
            <thead><tr>
              <th className="text-left">Название</th>
              <th className="text-left">Дата</th>
              <th className="text-left">Город</th>
              <th className="text-left">Статус</th>
              <th className="text-left">Действия</th>
            </tr></thead>
            <tbody>
              {items.map((ex, i) => (
                <motion.tr key={ex.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td className="text-cream font-medium">{getI18nField(ex.title, lang)}</td>
                  <td className="text-night-300 text-xs">{formatDate(ex.startDate, lang)}</td>
                  <td className="text-night-300 text-sm">{ex.city || '—'}</td>
                  <td><span className={cn('text-xs px-2 py-0.5 border font-bold', getStatusColor(ex.status))}>{t(`status.${ex.status}`)}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(ex)} className="p-1.5 text-night-300 hover:text-gold-400 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => deleteEx(ex.id)} className="p-1.5 text-night-300 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="text-center py-12 text-night-300">Выставок нет</div>}
        </div>
      )}
    </div>
  );
}
