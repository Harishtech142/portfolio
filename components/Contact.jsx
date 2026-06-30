'use client'

import { Mail, Instagram, Github, Phone } from 'lucide-react';
import { personalInfo } from '../data/profile';
import Reveal, { Stagger } from './ScrollReveal';

const displayUrl = (url) => url.replace(/^https?:\/\//, '');

const socials = [
  {
    label: 'Instagram',
    href: personalInfo.instagram,
    icon: Instagram,
    color: 'text-pink-500',
  },
  {
    label: 'WhatsApp',
    href: personalInfo.whatsapp,
    icon: Phone,
    color: 'text-green-400',
  },
  {
    label: 'Email',
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
    color: 'text-red-400',
  },
  {
    label: 'GitHub',
    href: personalInfo.github,
    icon: Github,
    color: 'text-white',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <Reveal variant="zoomIn" className="text-center mb-6">
          <p className="text-sm font-mono text-blue-400">// let's talk</p>
        </Reveal>
        <Stagger className="text-center mb-16" variant="fadeUp" staggerDelay={0.08}>
          <h2 className="section-title gradient-text">Get In Touch</h2>
          <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm">
            Have a project in mind or want to deploy AI automation for your business? Reach out and I'll respond within 24 hours.
          </p>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </Stagger>

        <Stagger staggerDelay={0.08} variant="scaleIn" className="flex items-center justify-center gap-6">
          {socials.map(({ label, href, icon: Icon, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="glass rounded-2xl p-5 group hover:-translate-y-2 hover:scale-110 transition-all duration-300"
            >
              <div className={`p-3 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} />
              </div>
            </a>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
