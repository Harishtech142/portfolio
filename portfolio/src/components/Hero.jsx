import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, ChevronRight } from 'lucide-react';
import { personalInfo } from '../data/profile';
import { fadeUp, stagger } from '../utils/animations';
import RippleButton from './RippleButton';

/* Animated typing tagline */
function TypewriterText({ words }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const word = words[wordIndex];
    const delay = deleting ? 50 : charIndex === word.length ? 1500 : 80;

    const timer = setTimeout(() => {
      if (!deleting && charIndex < word.length) {
        setText(word.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      } else if (deleting && charIndex > 0) {
        setText(word.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      } else if (!deleting && charIndex === word.length) {
        setDeleting(true);
      } else {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, wordIndex, words]);

  return (
    <span className="gradient-text">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}

/* Mouse-following spotlight — uses motion values (no React re-render per
   mousemove) so it stays cheap. Skipped entirely on touch devices, where
   there's no cursor to follow. */
function MouseSpotlight({ containerRef }) {
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const x = useSpring(mx, { stiffness: 120, damping: 25, mass: 0.4 });
  const y = useSpring(my, { stiffness: 120, damping: 25, mass: 0.4 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // no cursor on touch

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    };
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, [containerRef, mx, my]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute w-[500px] h-[500px] rounded-full"
      style={{
        left: x,
        top: y,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.06) 40%, transparent 70%)',
      }}
    />
  );
}

/* Floating orbs background */
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large gradient orbs */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }}
      />
      <div
        className="absolute top-1/2 -right-40 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', animationDelay: '2s' }}
      />
      <div
        className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-10 blur-3xl animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #06B6D4, transparent)', animationDelay: '4s' }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient"
    >
      <AnimatedBackground />
      <MouseSpotlight containerRef={sectionRef} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-32 text-center">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Status badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono border border-green-500/30 bg-green-500/10 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Available for freelance projects
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
            {personalInfo.name.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'gradient-text' : 'text-white'}>
                {word}{i === 0 ? ' ' : ''}
              </span>
            ))}
          </motion.h1>

          {/* Animated tagline */}
          <motion.div variants={fadeUp} className="text-2xl md:text-3xl font-semibold text-white/70 h-10">
            <TypewriterText words={personalInfo.taglines} />
          </motion.div>

          {/* Description */}
          <motion.p variants={fadeUp} className="max-w-2xl text-white/50 text-lg leading-relaxed">
            I build intelligent AI agents, automation pipelines, and high-performance web applications
            that help businesses scale without scaling headcount.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <RippleButton
              onClick={scrollToProjects}
              className="btn-primary text-white flex items-center gap-2"
            >
              View Projects
              <ChevronRight size={16} />
            </RippleButton>
            <RippleButton
              onClick={scrollToAbout}
              className="btn-secondary text-white/80 flex items-center gap-2"
            >
              About Me
            </RippleButton>
          </motion.div>

          {/* Social links */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 pt-4">
            {[
              { href: personalInfo.github, icon: Github, label: 'GitHub' },
              { href: personalInfo.linkedin, icon: Linkedin, label: 'LinkedIn' },
              { href: `mailto:${personalInfo.email}`, icon: Mail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-3 rounded-xl glass glass-hover text-white/50 hover:text-white transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            variants={fadeUp}
            onClick={scrollToAbout}
            className="mt-12 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
          >
            <span className="text-xs font-mono">scroll down</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown size={16} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
