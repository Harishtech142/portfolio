'use client'

import { useState } from 'react';
import { MapPin, Target, User } from 'lucide-react';
import { personalInfo } from '../data/profile';
import { useCountUp } from '../hooks';
import Reveal, { Stagger } from './ScrollReveal';

const STATS = [
  { label: 'Projects Shipped', value: 15, suffix: '+' },
  { label: 'Happy Clients', value: 12, suffix: '+' },
  { label: 'Countries Served', value: 8, suffix: '' },
  { label: 'Hours Saved / Month', value: 500, suffix: '+' },
];

function StatCard({ stat, started }) {
  const count = useCountUp(stat.value, started, 1400);
  return (
    <Reveal className="glass rounded-xl p-5 text-center glass-hover">
      <div className="text-3xl font-black gradient-text mb-1">{count}{stat.suffix}</div>
      <div className="text-xs text-white/40">{stat.label}</div>
    </Reveal>
  );
}

export default function About() {
  const [statsStarted, setStatsStarted] = useState(false);

  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal variant="zoomIn" className="text-center mb-6">
          <p className="text-sm font-mono text-blue-400">// who I am</p>
        </Reveal>
        <Stagger className="text-center mb-16" variant="fadeUp" staggerDelay={0.08}>
          <h2 className="section-title gradient-text">About Me</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </Stagger>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Stagger staggerDelay={0.12} variant="slideIn" className="space-y-6">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <User size={14} />
              <span className="font-mono">My Story</span>
            </div>

            {personalInfo.about.split('\n\n').map((para, i) => (
              <Reveal key={i} variant="fadeUp" className="text-white/60 leading-relaxed text-base">
                {para}
              </Reveal>
            ))}

            <Reveal variant="fadeUp" className="flex items-center gap-2 text-white/40 text-sm pt-2">
              <MapPin size={14} />
              <span>{personalInfo.location}</span>
            </Reveal>
          </Stagger>

          <Stagger staggerDelay={0.1} variant="fadeUp" className="space-y-6">
            <Reveal className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
                <Target size={14} />
                <span className="font-mono">Goals & Vision</span>
              </div>
              <ul className="space-y-3">
                {personalInfo.goals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Stagger
              staggerDelay={0.08}
              variant="fadeUp"
              onReveal={() => setStatsStarted(true)}
              className="grid grid-cols-2 gap-4"
            >
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} started={statsStarted} />
              ))}
            </Stagger>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
