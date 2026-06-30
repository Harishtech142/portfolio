import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { certificates } from '../data/profile';
import { fadeUp, scaleIn, stagger, viewportConfig } from '../utils/animations';

export default function Certificates() {
  return (
    <section id="certificates" className="py-28 px-6">
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
            // credentials
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title gradient-text">
            Certificates
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          />
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {certificates.map((cert) => (
            <motion.a
              key={cert.id}
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={scaleIn}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="glass glass-hover rounded-2xl p-5 group cursor-pointer block"
            >
              {/* Top row */}
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

              {/* Title */}
              <h3 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:gradient-text transition-all">
                {cert.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-white/40 text-xs">{cert.issuer}</span>
                <span className="text-white/30 text-xs font-mono">{cert.date}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="text-center text-white/20 text-xs font-mono mt-10"
        >
          Click any certificate to verify credential
        </motion.p>
      </div>
    </section>
  );
}
