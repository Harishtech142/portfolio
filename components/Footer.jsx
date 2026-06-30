'use client'

import { Github, Instagram, Mail, Heart, ArrowUp } from 'lucide-react';
import { personalInfo } from '../data/profile';
import { useShowOnScroll } from '../hooks';

export default function Footer() {
  const showBackToTop = useShowOnScroll(400);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [
    { href: personalInfo.github, icon: Github, label: 'GitHub' },
    { href: personalInfo.instagram, icon: Instagram, label: 'Instagram' },
    { href: `mailto:${personalInfo.email}`, icon: Mail, label: 'Email' },
  ];

  return (
    <>
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-sm text-white/30">
            &lt;TrexFlow /&gt;
          </div>

          <p className="text-white/30 text-xs flex items-center gap-1.5">
            © {new Date().getFullYear()} {"TrexFlow"}. Built with
            <Heart size={10} className="text-red-400 fill-red-400" />
            using Next.js + Tailwind CSS
          </p>

          <div className="flex items-center gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all shadow-lg ${
          showBackToTop ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ transform: showBackToTop ? 'scale(1)' : 'scale(0.8)', transition: 'opacity 0.3s, transform 0.3s' }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}
