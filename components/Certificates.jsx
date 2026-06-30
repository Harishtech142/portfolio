'use client'

import { ExternalLink } from 'lucide-react';
import { certificates } from '../data/profile';
import Reveal, { Stagger } from './ScrollReveal';

export default function Certificates() {
  return (
    <section id="certificates" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal variant="zoomIn" className="text-center mb-6">
          <p className="text-sm font-mono text-blue-400">// credentials</p>
        </Reveal>
        <Stagger className="text-center mb-16" variant="fadeUp" staggerDelay={0.08}>
          <h2 className="section-title gradient-text">Certificates</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </Stagger>

        <Stagger staggerDelay={0.08} variant="scaleIn" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <a
              key={cert.id}
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-hover rounded-2xl p-5 group cursor-pointer block hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-2xl`}
                >
                  {cert.icon}
                </div>
                <ExternalLink
                  size={14}
                  className="text-white/20 group-hover:text-white/60 transition-colors mt-1"
                />
              </div>

              <h3 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:gradient-text transition-all">
                {cert.title}
              </h3>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-white/40 text-xs">{cert.issuer}</span>
                <span className="text-white/30 text-xs font-mono">{cert.date}</span>
              </div>
            </a>
          ))}
        </Stagger>

        <Reveal variant="fadeUp" className="text-center text-white/20 text-xs font-mono mt-10">
          Click any certificate to verify credential
        </Reveal>
      </div>
    </section>
  );
}
