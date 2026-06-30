'use client'

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Bot, Globe, Code2, Database, Wrench } from 'lucide-react';
import { skillGroups } from '../data/profile';
import Reveal, { Stagger } from './ScrollReveal';

const iconMap = { Zap, Bot, Globe, Code2, Database, Wrench };

const cardStyle = (color) => {
  const shadow = {
    'from-yellow-500 to-orange-500': 'rgba(234,179,8,0.25)',
    'from-blue-500 to-cyan-500': 'rgba(59,130,246,0.25)',
    'from-purple-500 to-pink-500': 'rgba(168,85,247,0.25)',
    'from-green-500 to-emerald-500': 'rgba(34,197,94,0.25)',
    'from-red-500 to-rose-500': 'rgba(239,68,68,0.25)',
    'from-indigo-500 to-violet-500': 'rgba(99,102,241,0.25)',
  }[color];
  return {
    '--card-glow': shadow,
  };
};

export default function Skills() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.children;
    if (!cards.length) return;
    gsap.set(cards, { y: 40, opacity: 0, scale: 0.92 });
    const ctx = gsap.context(() => {
      gsap.to(cards, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: grid, start: 'top 85%' },
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal variant="zoomIn" className="text-center mb-6">
          <p className="text-sm font-mono text-blue-400">// what I work with</p>
        </Reveal>
        <Stagger className="text-center mb-16" variant="fadeUp" staggerDelay={0.08}>
          <h2 className="section-title gradient-text">Skills & Tech Stack</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </Stagger>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {skillGroups.map((group) => {
            const Icon = iconMap[group.icon] || Code2;
            return (
              <div
                key={group.group}
                style={cardStyle(group.color)}
                className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-8px_var(--card-glow)]"
              >
                <div className={`h-1 bg-gradient-to-r ${group.color}`} />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${group.color}`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-white">{group.group}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/10 hover:scale-105 cursor-default transition-all duration-200 font-mono inline-block"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
