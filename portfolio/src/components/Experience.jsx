import { motion } from 'framer-motion';
import { experiences } from '../data/profile';
import { fadeUp, slideIn, stagger, viewportConfig } from '../utils/animations';

const typeConfig = {
  'Full-time': { color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  Contract: { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  Learning: { color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
};

export default function Experience() {
  return (
    <section id="experience" className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-sm font-mono text-blue-400 mb-3">
            // my journey
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title gradient-text">
            Experience
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px timeline-line md:-translate-x-px" />

          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              const config = typeConfig[exp.type] || typeConfig['Full-time'];

              return (
                <motion.div
                  key={exp.id}
                  variants={stagger(0.08)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div
                    className={`absolute left-5 md:left-1/2 w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-500/30 -translate-x-1 md:-translate-x-1.5 mt-5 z-10`}
                  />

                  {/* Spacer for desktop */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card */}
                  <motion.div
                    variants={slideIn}
                    whileHover={{ scale: 1.01 }}
                    className={`ml-12 md:ml-0 glass glass-hover rounded-2xl p-6 space-y-3 ${
                      isLeft ? 'md:mr-10 md:text-right' : 'md:ml-10'
                    } md:w-1/2`}
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
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
