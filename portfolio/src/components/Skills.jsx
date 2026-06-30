import { motion } from 'framer-motion';
import { Zap, Bot, Globe, Code2, Database, Wrench } from 'lucide-react';
import { skillGroups } from '../data/profile';
import { fadeUp, stagger, scaleIn, viewportConfig } from '../utils/animations';

const iconMap = { Zap, Bot, Globe, Code2, Database, Wrench };

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-sm font-mono text-blue-400 mb-3">
            // what I work with
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title gradient-text">
            Skills & Tech Stack
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </motion.div>

        {/* Skill groups */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillGroups.map((group) => {
            const Icon = iconMap[group.icon] || Code2;
            return (
              <motion.div
                key={group.group}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="glass glass-hover rounded-2xl p-6 space-y-4 transition-shadow duration-300 hover:shadow-[0_0_30px_-8px_rgba(139,92,246,0.35)]"
              >
                {/* Group header */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${group.color} bg-opacity-10`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{group.group}</h3>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/8 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/10 cursor-default transition-all duration-200 font-mono"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
