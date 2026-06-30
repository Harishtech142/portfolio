import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOAD_DURATION_MS = 1200; // mirrors the loading-bar animation duration below

export default function LoadingScreen({ isLoading }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const progress = Math.min((now - start) / LOAD_DURATION_MS, 1);
      setPercent(Math.round(progress * 100));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          {/* Ambient glow pulse behind the logo */}
          <motion.div
            aria-hidden="true"
            className="absolute w-72 h-72 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', damping: 15 }}
            className="relative font-mono text-3xl font-bold gradient-text mb-8"
          >
            &lt;SmartFlow /&gt;
          </motion.div>

          {/* Loading bar */}
          <motion.div className="relative w-48 h-px bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: LOAD_DURATION_MS / 1000, ease: 'easeInOut' }}
              className="h-full origin-left"
              style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)' }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 0.5 }}
            className="relative text-white/30 text-xs font-mono mt-4 tabular-nums"
          >
            initializing... {percent}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
