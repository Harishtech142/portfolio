import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { personalInfo } from '../data/profile';
import { useShowOnScroll } from '../hooks';

export default function Footer() {
  const showBackToTop = useShowOnScroll(400);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [
    { href: personalInfo.github, icon: Github, label: 'GitHub' },
    { href: personalInfo.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: `mailto:${personalInfo.email}`, icon: Mail, label: 'Email' },
  ];

  return (
    <>
      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="font-mono text-sm text-white/30">
            &lt;SmartFlow /&gt;
          </div>

          {/* Copyright */}
          <p className="text-white/30 text-xs flex items-center gap-1.5">
            © {new Date().getFullYear()} {"SmartFlow"}. Built with
            <Heart size={10} className="text-red-400 fill-red-400" />
            using React + Tailwind
          </p>

          {/* Socials */}
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

      {/* Scroll to top */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all shadow-lg"
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </motion.button>
    </>
  );
}
