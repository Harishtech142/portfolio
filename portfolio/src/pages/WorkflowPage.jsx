import { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Maximize2, Minimize2, ListTree } from 'lucide-react';
import { workflowConfigs } from '../data/demoConfigs';
import WorkflowCanvas from '../components/WorkflowCanvas';
import { fadeUp, stagger } from '../utils/animations';

export default function WorkflowPage() {
  const { id } = useParams();
  const config = workflowConfigs[id];
  const [fullscreen, setFullscreen] = useState(false);
  const pageRef = useRef(null);

  // Esc exits fullscreen — standard expected behavior for any fullscreen UI.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e) => { if (e.key === 'Escape') setFullscreen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  if (!config) {
    // Unknown workflow id — send back home rather than showing a broken page.
    return <Navigate to="/" replace />;
  }

  const { title, subtitle, nodes, connections, steps, downloadImage } = config;

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-white/8 backdrop-blur-xl bg-black/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/#projects"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Projects</span>
          </Link>
          <div className="min-w-0 text-center flex-1">
            <h1 className="text-sm md:text-base font-bold text-white truncate">{title}</h1>
            <p className="text-[10px] text-white/40 truncate">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href={downloadImage} download
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
              style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button onClick={() => setFullscreen(f => !f)}
              aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10">
              {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {fullscreen ? (
          /* ── Fullscreen mode: canvas only, maximum space ─────────────────── */
          <motion.div key="fullscreen"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 pt-[60px] p-4 bg-[#0a0a0a]">
            <WorkflowCanvas nodes={nodes} connections={connections}
              hint="Drag to pan · Scroll or use the controls to zoom · Esc to exit fullscreen" />
          </motion.div>
        ) : (
          /* ── Normal mode: canvas + step-by-step panel, glassmorphism layout ── */
          <motion.div key="normal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <div className="grid lg:grid-cols-[1fr_360px] gap-6">
              {/* Canvas */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible"
                className="glass rounded-2xl border border-white/10 overflow-hidden h-[360px] sm:h-[420px] lg:h-[min(640px,70vh)]">
                <WorkflowCanvas nodes={nodes} connections={connections} />
              </motion.div>

              {/* Step-by-step explanation panel */}
              <motion.div variants={stagger(0.06)} initial="hidden" animate="visible"
                className="glass rounded-2xl border border-white/10 p-5 flex flex-col max-h-[70vh] lg:max-h-[min(640px,70vh)]">
                <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-4 shrink-0">
                  <ListTree size={14} />
                  HOW IT WORKS
                </div>
                <div className="space-y-3 overflow-y-auto pr-1">
                  {steps.map((step) => (
                    <motion.div key={step.n} variants={fadeUp}
                      className="flex gap-3 p-3 rounded-xl border border-white/8 bg-white/[0.02]">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                        style={{ background: `${step.color}22`, color: step.color, border: `1px solid ${step.color}55` }}>
                        {step.n}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white leading-tight">{step.label}</div>
                        <div className="text-xs text-white/45 mt-0.5 leading-snug">{step.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
