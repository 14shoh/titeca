'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { messagesApi, unwrap } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const [inbox, setInbox] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesApi.inbox()
      .then(res => setInbox(unwrap<any>(res) || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    const otherId = selected.senderId === user?.id ? selected.receiverId : selected.senderId;
    messagesApi.conversation(otherId)
      .then(res => {
        setConversation(unwrap<any>(res) || []);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      });
    if (!selected.isRead && selected.receiverId === user?.id) {
      messagesApi.markRead(selected.id).catch(() => {});
    }
  }, [selected]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !selected || sending) return;
    const otherId = selected.senderId === user?.id ? selected.receiverId : selected.senderId;
    setSending(true);
    try {
      await messagesApi.send({ receiverId: otherId, content: newMsg.trim() });
      setNewMsg('');
      const res = await messagesApi.conversation(otherId);
      setConversation(unwrap<any>(res) || []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      toast.error('Ошибка отправки');
    } finally {
      setSending(false);
    }
  };

  const getOther = (msg: any) => {
    if (msg.senderId === user?.id) return msg.receiver;
    return msg.sender;
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="section-label mb-2">{t('nav.dashboard')}</p>
        <h1 className="font-display text-4xl font-light text-cream">{t('dashboard.messages')}</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      <div className="glass-card rounded-none overflow-hidden" style={{ height: 'calc(100vh - 260px)', minHeight: 500 }}>
        <div className="flex h-full">
          {/* Inbox list */}
          <div className="w-72 flex-shrink-0 border-r border-white/5 flex flex-col">
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-night-300" />
                <input
                  type="text"
                  placeholder={t('common.search')}
                  className="input-dark w-full pl-8 pr-3 py-2 text-xs rounded-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {inbox.length === 0 ? (
                <p className="text-center text-night-300 text-sm py-8">{t('dashboard.no_messages')}</p>
              ) : (
                inbox.map((msg) => {
                  const other = getOther(msg);
                  return (
                    <button
                      key={msg.id}
                      onClick={() => setSelected(msg)}
                      className={cn(
                        'w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/3',
                        selected?.id === msg.id && 'bg-gold-500/5 border-l-2 border-l-gold-500'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 flex-shrink-0 bg-night-700 border border-white/10 flex items-center justify-center">
                          <span className="font-display text-sm text-gold-500">
                            {(other?.firstName?.[0] || other?.email?.[0] || '?').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-cream text-xs font-medium truncate">
                            {other?.firstName ? `${other.firstName} ${other.lastName || ''}` : other?.email || '?'}
                          </p>
                          <p className="text-night-300 text-xs truncate mt-0.5">{msg.content}</p>
                        </div>
                        {!msg.isRead && msg.receiverId === user?.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 flex flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-night-300 text-sm">
                Выберите диалог
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-night-700 border border-white/10 flex items-center justify-center">
                    <span className="font-display text-sm text-gold-500">
                      {(getOther(selected)?.firstName?.[0] || '?').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-cream text-sm font-medium">
                      {getOther(selected)?.firstName
                        ? `${getOther(selected).firstName} ${getOther(selected).lastName || ''}`
                        : getOther(selected)?.email}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence>
                    {conversation.map((msg) => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
                        >
                          <div className={cn(
                            'max-w-xs px-4 py-2.5 text-sm',
                            isMe
                              ? 'bg-gold-500/15 border border-gold-500/20 text-cream'
                              : 'glass-card-light text-cream'
                          )}>
                            <p>{msg.content}</p>
                            <p className="text-[10px] mt-1 opacity-50 text-right">
                              {new Date(msg.createdAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-white/5 flex gap-2">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Написать сообщение..."
                    className="input-dark flex-1 px-4 py-2.5 text-sm rounded-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMsg.trim()}
                    className="btn-gold px-4 rounded-none text-xs disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
