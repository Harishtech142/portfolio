'use client'

import { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { useActiveSection, useScrollDirection } from '../hooks';
import { personalInfo } from '../data/profile';

const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Experience', id: 'experience' },
  { label: 'Certificates', id: 'certificates' },
  { label: 'Contact', id: 'contact' },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

export default function Navbar({ scrollProgress }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const scrollDir = useScrollDirection();

  const hideNav = scrolled && scrollDir === 'down' && !open;

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
        style={{
          transform: `scaleX(${scrollProgress / 100})`,
          background: 'linear-gradient(to right, #3B82F6, #8B5CF6, #06B6D4)',
        }}
      />

      <nav
        className={`fixed top-3 left-1/2 z-50 w-[95%] max-w-6xl rounded-2xl -translate-x-1/2 slide-nav ${
          scrolled
            ? 'bg-black/70 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30'
            : 'bg-transparent'
        }`}
        style={{
          transform: `translateX(-50%) translateY(${hideNav ? -100 : 0}px)`,
          opacity: hideNav ? 0 : 1,
        }}
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <button
            onClick={() => scrollTo('home')}
            className="font-mono text-sm font-semibold gradient-text hover:opacity-80 transition-opacity"
          >
            &lt;TrexFlow /&gt;
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                  active === link.id
                    ? 'text-white bg-white/10'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={personalInfo.resumeUrl}
              download
              className="hidden md:flex items-center gap-1.5 btn-primary text-white text-xs px-4 py-2"
            >
              <Download size={13} />
              Resume
            </a>

            <button
              className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed top-20 left-4 right-4 z-40 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 p-4 md:hidden max-h-[calc(100vh-6rem)] overflow-y-auto animate-menu-drop">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-4 py-3 text-sm rounded-xl text-left transition-all ${
                  active === link.id
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
            <a
              href={personalInfo.resumeUrl}
              download
              className="mt-2 flex items-center justify-center gap-1.5 btn-primary text-white text-sm"
            >
              <Download size={14} />
              Download Resume
            </a>
          </div>
        </div>
      )}
    </>
  );
}
