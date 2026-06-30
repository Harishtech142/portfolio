'use client'

import { useEffect, useState, useRef } from 'react';
import { ArrowDown, Github, Instagram, Mail, ChevronRight } from 'lucide-react';
import { personalInfo } from '../data/profile';

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

function MouseSpotlight({ containerRef }) {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const sp = spotlightRef.current;
    if (!el || !sp) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = null;
    let mx = -9999, my = -9999;
    let x = -9999, y = -9999;

    const lerp = (a, b, t) => a + (b - a) * t;

    const loop = () => {
      x = lerp(x, mx, 0.1);
      y = lerp(y, my, 0.1);
      sp.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    el.addEventListener('mousemove', handleMove);
    raf = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  return (
    <div
      ref={spotlightRef}
      aria-hidden="true"
      className="pointer-events-none absolute w-[500px] h-[500px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.06) 40%, transparent 70%)',
        willChange: 'transform',
      }}
    />
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
      style={{ willChange: 'opacity' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }}
        />
        <div
          className="absolute top-1/2 -right-40 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>
      <MouseSpotlight containerRef={sectionRef} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-32 text-center">
        <div className="hero-stagger flex flex-col items-center gap-6">
          <span style={{ animationDelay: '0s' }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono border border-green-500/30 bg-green-500/10 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Available for freelance projects
            </span>
          </span>

          <h1 style={{ animationDelay: '0.12s' }} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
            {personalInfo.name.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'gradient-text' : 'text-white'}>
                {word}{i === 0 ? ' ' : ''}
              </span>
            ))}
          </h1>

          <div style={{ animationDelay: '0.24s' }} className="text-2xl md:text-3xl font-semibold text-white/70 h-10">
            <TypewriterText words={personalInfo.taglines} />
          </div>

          <p style={{ animationDelay: '0.36s' }} className="max-w-2xl text-white/50 text-lg leading-relaxed">
            I build intelligent AI agents, automation pipelines, and high-performance web applications
            that help businesses scale without scaling headcount.
          </p>

          <div style={{ animationDelay: '0.48s' }} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={scrollToProjects}
              className="btn-primary text-white flex items-center gap-2"
            >
              View Projects
              <ChevronRight size={16} />
            </button>
            <button
              onClick={scrollToAbout}
              className="btn-secondary text-white/80 flex items-center gap-2"
            >
              About Me
            </button>
          </div>

          <div style={{ animationDelay: '0.6s' }} className="flex items-center gap-4 pt-4">
            {[
              { href: personalInfo.github, icon: Github, label: 'GitHub' },
              { href: personalInfo.instagram, icon: Instagram, label: 'Instagram' },
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
          </div>

          <button
            style={{ animationDelay: '0.72s' }}
            onClick={scrollToAbout}
            className="mt-12 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
          >
            <span className="text-xs font-mono">scroll down</span>
            <div className="animate-bounce">
              <ArrowDown size={16} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
