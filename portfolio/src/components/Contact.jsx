import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, MessageCircle, Send, CheckCircle, AlertCircle, Phone, Loader2 } from 'lucide-react';
import { personalInfo } from '../data/profile';
import RippleButton from './RippleButton';
import { fadeUp, slideIn, stagger, viewportConfig } from '../utils/animations';

// Primary path: your own Nodemailer backend (see /server).
// If VITE_CONTACT_API_URL isn't set (e.g. you haven't deployed it yet),
// the form automatically falls back to Formspree so it never breaks.
const BACKEND_ENDPOINT = import.meta.env.VITE_CONTACT_API_URL || '';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgylgjk';

const SERVICE_OPTIONS = ['AI Automation', 'AI Agent Development', 'Web Development', 'N8N Workflow', 'Consulting', 'Other'];
const BUDGET_OPTIONS = ['Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000+', 'Not sure yet'];

// Basic RFC-5322-ish email check — good enough for client-side validation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimum gap (ms) the form must be visible before a submission is accepted.
// Bots that submit instantly on page-load get silently rejected.
const MIN_FILL_TIME_MS = 1500;

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', service: '', budget: '', message: '', _gotcha: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const mountedAt = useRef(Date.now());
  const lastSubmitAt = useRef(0);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'Please enter your name.';
    }
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      next.message = 'Message should be at least 10 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Prevent duplicate/rapid-fire submissions.
    if (status === 'sending') return;
    const now = Date.now();
    if (now - lastSubmitAt.current < 4000) return;

    // Honeypot — real users never fill this hidden field; bots often do.
    if (form._gotcha) {
      // Silently "succeed" so the bot doesn't learn the field is a trap.
      setStatus('success');
      setTimeout(() => setStatus(null), 5000);
      return;
    }

    // Basic timing check — guards against scripted instant-submits.
    if (now - mountedAt.current < MIN_FILL_TIME_MS) {
      setStatus('error');
      setErrorMessage('Please take a moment to fill out the form.');
      setTimeout(() => setStatus(null), 5000);
      return;
    }

    if (!validate()) return;

    lastSubmitAt.current = now;
    setStatus('sending');
    setErrorMessage('');

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      service: form.service.trim(),
      budget: form.budget.trim(),
      message: form.message.trim(),
    };

    const resetForm = () => setForm({ name:'', email:'', company:'', service:'', budget:'', message:'', _gotcha:'' });

    // 1) Try the real backend (Nodemailer → Gmail + auto-reply) if configured.
    if (BACKEND_ENDPOINT) {
      try {
        const res = await fetch(BACKEND_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => null);

        if (res.ok && data?.ok) {
          setStatus('success');
          resetForm();
          setTimeout(() => setStatus(null), 6000);
          return;
        }
        // Backend reachable but rejected/failed — don't silently fall through
        // to Formspree here, since that would double-guess a real validation error.
        if (res.status === 400 && data?.fieldErrors) {
          setStatus('error');
          setErrorMessage(Object.values(data.fieldErrors)[0] || 'Please check the form and try again.');
          setTimeout(() => setStatus(null), 6000);
          return;
        }
        // Server error (502/500) — fall through to Formspree as a backup path.
      } catch {
        // Backend unreachable (not deployed yet, DNS, offline) — fall through to Formspree.
      }
    }

    // 2) Formspree fallback — used when no backend URL is configured, or the
    // backend request failed for an infrastructure reason (not a validation error).
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          subject: `New inquiry from ${payload.name}${payload.company ? ` (${payload.company})` : ''}`,
          message:
            `Company: ${payload.company || '—'}\n` +
            `Service: ${payload.service || '—'}\n` +
            `Budget: ${payload.budget || '—'}\n\n` +
            payload.message,
        }),
      });

      if (res.ok) {
        setStatus('success');
        resetForm();
      } else {
        let detail = '';
        try {
          const data = await res.json();
          detail = data?.errors?.[0]?.message || '';
        } catch { /* response wasn't JSON — ignore */ }
        setStatus('error');
        setErrorMessage(detail || 'The server rejected the message. Please try again or email me directly.');
      }
    } catch {
      // Genuine network failure (offline, blocked, DNS, etc.) — offer a real fallback
      // instead of silently failing or pretending it succeeded.
      setStatus('error');
      setErrorMessage('Network error — your message was not sent. You can email me directly instead.');
    }
    setTimeout(() => setStatus(null), 6000);
  };

  const mailtoFallback = `mailto:${personalInfo.email}?subject=${encodeURIComponent('Portfolio contact')}&body=${encodeURIComponent(form.message)}`;

  // Strip the protocol for clean display labels — keeps these in sync with
  // personalInfo automatically instead of hardcoding a second copy.
  const displayUrl = (url) => url.replace(/^https?:\/\//, '');

  const socials = [
    {
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      icon: Mail,
      color: 'text-red-400',
      description: 'Send me an email',
    },
    {
      label: 'GitHub',
      value: displayUrl(personalInfo.github),
      href: personalInfo.github,
      icon: Github,
      color: 'text-white',
      description: 'View my projects',
    },
    {
      label: 'WhatsApp',
      value: '+91 6230 931 639',
      href: personalInfo.whatsapp,
      icon: Phone,
      color: 'text-green-400',
      description: 'Quick chat on WhatsApp',
    },
    {
      label: 'LinkedIn',
      value: displayUrl(personalInfo.linkedin),
      href: personalInfo.linkedin,
      icon: Linkedin,
      color: 'text-blue-500',
      description: 'Connect on LinkedIn',
    },
  ];

  return (
    <section id="contact" className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div variants={stagger()} initial="hidden" whileInView="visible" viewport={viewportConfig}
          className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-mono text-blue-400 mb-3">// let's talk</motion.p>
          <motion.h2 variants={fadeUp} className="section-title gradient-text">Get In Touch</motion.h2>
          <motion.p variants={fadeUp} className="text-white/40 mt-4 max-w-lg mx-auto text-sm">
            Have a project in mind or want to deploy AI automation for your business? Reach out and I'll respond within 24 hours.
          </motion.p>
          <motion.div variants={fadeUp}
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </motion.div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Left — contact info */}
          <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={viewportConfig}
            className="md:col-span-2 space-y-4">
            {socials.map(({ label, value, href, icon:Icon, color, description }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                variants={slideIn} whileHover={{ x:4 }}
                className="flex items-center gap-4 glass rounded-xl p-4 group border border-white/8 hover:border-white/18 transition-all cursor-pointer block">
                <div className={`p-2.5 rounded-lg bg-white/5 ${color} shrink-0`}>
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-white/30 mb-0.5">{label}</div>
                  <div className="text-sm text-white/70 group-hover:text-white transition-colors truncate">{value}</div>
                  <div className="text-[10px] text-white/25 mt-0.5">{description}</div>
                </div>
              </motion.a>
            ))}

            {/* Quick CTA */}
            <motion.div variants={fadeUp}
              className="rounded-2xl p-5 border border-green-500/20 mt-2"
              style={{ background:'rgba(34,197,94,0.06)' }}>
              <p className="text-sm font-semibold text-white mb-1">Ready to automate?</p>
              <p className="text-xs text-white/40 mb-3">WhatsApp me for a quick 15-minute consultation — free of charge.</p>
              <a href={personalInfo.whatsapp} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                style={{ background:'linear-gradient(135deg,#22c55e,#16a34a)' }}>
                <MessageCircle size={13} /> Chat on WhatsApp
              </a>
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={viewportConfig}
            className="md:col-span-3">
            <form onSubmit={handleSubmit} noValidate className="glass rounded-2xl p-6 space-y-4 border border-white/8">
              {/* Honeypot — hidden from real users, irresistible to bots */}
              <input type="text" name="_gotcha" value={form._gotcha} onChange={handleChange}
                tabIndex="-1" autoComplete="off"
                style={{ position:'absolute', left:'-9999px', width:'1px', height:'1px', opacity:0 }}
                aria-hidden="true" />

              <div className="grid sm:grid-cols-2 gap-4">
                <motion.div variants={fadeUp}>
                  <label className="text-xs text-white/30 block mb-1.5">Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="John Doe" aria-invalid={!!errors.name}
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white text-sm placeholder-white/20 focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500/60 focus:border-red-500/80' : 'border-white/10 focus:border-blue-500/50'
                    }`} />
                  {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                </motion.div>
                <motion.div variants={fadeUp}>
                  <label className="text-xs text-white/30 block mb-1.5">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="john@example.com" aria-invalid={!!errors.email}
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white text-sm placeholder-white/20 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500/60 focus:border-red-500/80' : 'border-white/10 focus:border-blue-500/50'
                    }`} />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </motion.div>
              </div>
              <motion.div variants={fadeUp}>
                <label className="text-xs text-white/30 block mb-1.5">Company <span className="text-white/15">(optional)</span></label>
                <input type="text" name="company" value={form.company} onChange={handleChange}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors" />
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.div variants={fadeUp}>
                  <label className="text-xs text-white/30 block mb-1.5">Service <span className="text-white/15">(optional)</span></label>
                  <select name="service" value={form.service} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors appearance-none">
                    <option value="" className="bg-[#0a0a0a]">Select a service</option>
                    {SERVICE_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
                  </select>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <label className="text-xs text-white/30 block mb-1.5">Budget <span className="text-white/15">(optional)</span></label>
                  <select name="budget" value={form.budget} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors appearance-none">
                    <option value="" className="bg-[#0a0a0a]">Select a range</option>
                    {BUDGET_OPTIONS.map(b => <option key={b} value={b} className="bg-[#0a0a0a]">{b}</option>)}
                  </select>
                </motion.div>
              </div>
              <motion.div variants={fadeUp}>
                <label className="text-xs text-white/30 block mb-1.5">Message</label>
                <textarea name="message" rows={5} value={form.message} onChange={handleChange}
                  placeholder="Describe your automation needs..." aria-invalid={!!errors.message}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white text-sm placeholder-white/20 focus:outline-none transition-colors resize-none ${
                    errors.message ? 'border-red-500/60 focus:border-red-500/80' : 'border-white/10 focus:border-blue-500/50'
                  }`} />
                {errors.message && <p className="text-[11px] text-red-400 mt-1">{errors.message}</p>}
              </motion.div>
              <motion.div variants={fadeUp}>
                <RippleButton type="submit" disabled={status==='sending'}
                  className="w-full text-white flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-[1.01] hover:opacity-90"
                  style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
                  {status==='sending' ? (
                    <><Loader2 size={15} className="animate-spin" />Sending...</>
                  ) : (<><Send size={15} />Send Message</>)}
                </RippleButton>
                {status==='success' && (
                  <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                    className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle size={15} /> Message sent! I'll reply within 24 hours.
                  </motion.div>
                )}
                {status==='error' && (
                  <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                    className="mt-3 flex flex-col gap-1.5 text-red-400 text-sm">
                    <span className="flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" /> {errorMessage || 'Something went wrong. Try emailing directly.'}
                    </span>
                    <a href={mailtoFallback}
                      className="text-xs text-white/50 hover:text-white underline underline-offset-2 ml-[23px]">
                      Open email client instead →
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
