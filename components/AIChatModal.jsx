'use client'

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, MessageCircle, Mail, Phone } from 'lucide-react';

/* ─── Typing dots ──────────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex gap-1 items-center py-1 px-1">
      {[0,1,2].map(i => (
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
          animate={{ y: [0,-5,0] }}
          transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.13 }} />
      ))}
    </div>
  );
}

/* ─── Timestamp ────────────────────────────────────────────────────────────── */
function Ts({ date }) {
  return (
    <span className="text-[9px] text-white/25 mt-0.5 block">
      {date instanceof Date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
    </span>
  );
}

/* ─── Trial exhausted CTA ──────────────────────────────────────────────────── */
function TrialCTA() {
  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
      className="mx-4 mb-4 rounded-2xl p-4 border border-blue-500/30 text-center"
      style={{ background: 'rgba(59,130,246,0.08)' }}>
      <p className="text-sm font-semibold text-white mb-0.5">Need unlimited access?</p>
      <p className="text-xs text-white/50 mb-3">Contact TrexFlow today to deploy this AI automation for your business.</p>
      <div className="flex gap-2 justify-center flex-wrap">
        <a href="https://wa.me/916230931639" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
          <Phone size={11} /> WhatsApp
        </a>
        <a href="mailto:hs4096883@gmail.com"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
          <Mail size={11} /> Email
        </a>
        <a href="https://github.com/Harishtech142" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/70 border border-white/15 hover:border-white/30 transition-all">
          <MessageCircle size={11} /> GitHub
        </a>
      </div>
    </motion.div>
  );
}

/* ─── Main modal ───────────────────────────────────────────────────────────── */
export default function AIChatModal({
  onClose,
  title,
  subtitle,
  accentColor = '#3B82F6',
  accentColor2 = '#8B5CF6',
  avatarIcon: AvatarIcon = Bot,
  initialMessage,
  suggestions = [],
  projectId,
  getReply,
}) {
  // Import hook inline to keep this file self-contained via dynamic import alternative
  const [messages, setMessages] = useState(() => initialMessage
    ? [{ id: 'init', role: 'assistant', content: initialMessage, ts: new Date() }]
    : []);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [usage, setUsage] = useState(() => {
    try { return parseInt(localStorage.getItem(`sf_demo_${projectId}`) || '0', 10); } catch { return 0; }
  });
  const [isFocused, setIsFocused] = useState(false);

  const MAX = 5;
  const exhausted = usage >= MAX;
  const remaining = MAX - usage;
  const bottomRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = async (text) => {
    const msg = text.trim();
    if (!msg || exhausted || thinking) return;
    setInput('');
    setMessages(m => [...m, { id: Date.now(), role: 'user', content: msg, ts: new Date() }]);
    setThinking(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    const reply = getReply(msg, messages);
    setMessages(m => [...m, { id: Date.now()+1, role: 'assistant', content: reply, ts: new Date() }]);
    const newUsage = usage + 1;
    setUsage(newUsage);
    try { localStorage.setItem(`sf_demo_${projectId}`, String(newUsage)); } catch {}
    setThinking(false);
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ scale:0.9, opacity:0, y:28 }}
        animate={{ scale:1, opacity:1, y:0 }}
        exit={{ scale:0.9, opacity:0, y:28 }}
        transition={{ type:'spring', damping:22, stiffness:270 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-lg flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/70"
        style={{ background:'rgba(8,8,18,0.98)', height:'min(640px,90vh)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0"
          style={{ background:'rgba(255,255,255,0.025)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg,${accentColor},${accentColor2})` }}>
              <AvatarIcon size={17} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{title}</p>
              <p className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                {subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!exhausted && (
              <span className="text-[10px] font-mono px-2 py-1 rounded-full border border-white/10 text-white/40">
                {remaining}/{MAX} free
              </span>
            )}
            <button onClick={onClose}
              className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => (
            <motion.div key={msg.id}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.25 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              {msg.role === 'assistant' ? (
                <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: `linear-gradient(135deg,${accentColor},${accentColor2})` }}>
                  <AvatarIcon size={13} className="text-white" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5 bg-white/10 border border-white/20 text-xs">
                  👤
                </div>
              )}
              <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' ? 'text-white rounded-tr-sm' : 'text-white/85 rounded-tl-sm border border-white/8'
                }`} style={msg.role === 'user'
                  ? { background: `linear-gradient(135deg,${accentColor},${accentColor2})` }
                  : { background: 'rgba(255,255,255,0.05)' }}>
                  {msg.content}
                </div>
                <Ts date={msg.ts} />
              </div>
            </motion.div>
          ))}

          {/* Thinking */}
          {thinking && (
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                style={{ background:`linear-gradient(135deg,${accentColor},${accentColor2})` }}>
                <AvatarIcon size={13} className="text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 border border-white/8"
                style={{ background:'rgba(255,255,255,0.05)' }}>
                <TypingDots />
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {!exhausted && suggestions.length > 0 && messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)}
                className="px-3 py-1 rounded-full text-xs border border-white/12 text-white/55 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Trial CTA */}
        {exhausted && <TrialCTA />}

        {/* Input */}
        {!exhausted && (
          <div className="px-4 py-3 border-t border-white/8 shrink-0"
            style={{ background:'rgba(255,255,255,0.02)' }}>
            <div className="flex gap-2 items-end">
              <textarea ref={textRef} rows={1} value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 96)+'px';
                }}
                onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(input); }}}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={thinking}
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none transition-all disabled:opacity-40"
                style={{ background:'rgba(255,255,255,0.06)',
                  border: isFocused ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)',
                  minHeight:'40px' }} />
              <button onClick={() => send(input)} disabled={!input.trim() || thinking}
                className="p-2.5 rounded-xl transition-all disabled:opacity-30 shrink-0 hover:scale-105 active:scale-95"
                style={{ background:`linear-gradient(135deg,${accentColor},${accentColor2})` }}>
                <Send size={15} className="text-white" />
              </button>
            </div>
            <p className="text-[9px] text-white/20 text-center mt-1.5">
              TrexFlow AI Demo · {remaining} interaction{remaining!==1?'s':''} remaining
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
