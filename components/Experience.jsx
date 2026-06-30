'use client'

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences } from '../data/profile';
import Reveal, { Stagger } from './ScrollReveal';

const typeConfig = {
  'Full-time': { color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  Contract: { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  Learning: { color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
};

export default function Experience() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    if (!section || !timeline) return;
    const cards = section.querySelectorAll('.exp-card');
    if (!cards.length) return;
    gsap.set(cards, { y: 40, opacity: 0 });
    gsap.set(timeline, { scaleY: 0 });
    const ctx = gsap.context(() => {
      gsap.to(timeline, {
        scaleY: 1,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });
      gsap.to(cards, {
        y: 0, opacity: 1,
        duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <Reveal variant="zoomIn" className="text-center mb-6">
          <p className="text-sm font-mono text-blue-400">// my journey</p>
        </Reveal>
        <Stagger className="text-center mb-16" variant="fadeUp" staggerDelay={0.08}>
          <h2 className="section-title gradient-text">Experience</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </Stagger>

        <div className="relative">
          <div ref={timelineRef} className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px timeline-line md:-translate-x-px" />

          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              const config = typeConfig[exp.type] || typeConfig['Full-time'];

              return (
                <div
                  key={exp.id}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`absolute left-5 md:left-1/2 w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-500/30 -translate-x-1 md:-translate-x-1.5 mt-5 z-10`}
                  />

                  <div className="hidden md:block md:w-1/2" />

                  <div
                    className={`exp-card ml-12 md:ml-0 glass glass-hover rounded-2xl p-6 space-y-3 hover:scale-[1.01] ${
                      isLeft ? 'md:mr-10 md:text-right' : 'md:ml-10'
                    } flex-1 md:flex-none md:w-1/2`}
                  >
                    <div className={`flex items-start gap-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                      <div>
                        <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                        <p className="text-blue-400 text-sm font-medium">{exp.company}</p>
                        <div className={`flex items-center gap-2 mt-1 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                          <span className="text-white/30 text-xs font-mono">{exp.period}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${config.bg} ${config.color}`}>
                            {exp.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed">{exp.description}</p>

                    <ul className={`space-y-1.5 ${isLeft ? 'md:items-end' : ''} flex flex-col`}>
                      {exp.highlights.map((h, j) => (
                        <li key={j} className={`flex items-start gap-2 text-xs text-white/40 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
