import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Target, User } from 'lucide-react';
import { personalInfo } from '../data/profile';
import { fadeUp, slideIn, stagger, viewportConfig } from '../utils/animations';
import { useCountUp } from '../hooks';

const STATS = [
  { label: 'Projects Shipped', value: 15, suffix: '+' },
  { label: 'Happy Clients', value: 12, suffix: '+' },
  { label: 'Countries Served', value: 8, suffix: '' },
  { label: 'Hours Saved / Month', value: 500, suffix: '+' },
];

function StatCard({ stat, started }) {
  const count = useCountUp(stat.value, started, 1400);
  return (
    <motion.div
      variants={fadeUp}
      className="glass rounded-xl p-5 text-center glass-hover"
    >
      <div className="text-3xl font-black gradient-text mb-1">{count}{stat.suffix}</div>
      <div className="text-xs text-white/40">{stat.label}</div>
    </motion.div>
  );
}

export default function About() {
  const [statsStarted, setStatsStarted] = useState(false);

  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-sm font-mono text-blue-400 mb-3">
            // who I am
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title gradient-text">
            About Me
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — story */}
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="space-y-6"
          >
            <motion.div variants={slideIn} className="flex items-center gap-2 text-white/40 text-sm">
              <User size={14} />
              <span className="font-mono">My Story</span>
            </motion.div>

            {personalInfo.about.split('\n\n').map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-white/60 leading-relaxed text-base"
              >
                {para}
              </motion.p>
            ))}

            <motion.div variants={fadeUp} className="flex items-center gap-2 text-white/40 text-sm pt-2">
              <MapPin size={14} />
              <span>{personalInfo.location}</span>
            </motion.div>
          </motion.div>

          {/* Right — goals + stats */}
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="space-y-6"
          >
            {/* Goals */}
            <motion.div variants={fadeUp} className="glass rounded-2xl p-6 space-y-4">
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
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={stagger(0.08)}
              onViewportEnter={() => setStatsStarted(true)}
              viewport={viewportConfig}
              className="grid grid-cols-2 gap-4"
            >
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} started={statsStarted} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
