'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { X, Maximize2 } from 'lucide-react';
import WorkflowCanvas from './WorkflowCanvas';

/* ─── Quick-look modal — opens from a project card, links to the full page ──── */
export default function WorkflowViewerModal({ onClose, workflowId, title, subtitle, nodes, connections }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.88)', backdropFilter:'blur(12px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ scale:0.9, opacity:0, y:24 }}
        animate={{ scale:1, opacity:1, y:0 }}
        exit={{ scale:0.9, opacity:0, y:24 }}
        transition={{ type:'spring', damping:20, stiffness:260 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/70 flex flex-col"
        style={{ background:'rgba(8,8,18,0.98)', height:'min(580px,88vh)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0"
          style={{ background:'rgba(255,255,255,0.025)' }}>
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-[10px] text-white/40 mt-0.5">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono border border-green-500/30 bg-green-500/8 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live Workflow
            </div>
            <button onClick={onClose}
              className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-3 min-h-0">
          <WorkflowCanvas nodes={nodes} connections={connections} />
        </div>

        {/* Footer — opens the dedicated full Workflow Viewer page (zoom, fullscreen,
            download, step-by-step explanation). Never links to GitHub, source code,
            or anything beyond the workflow diagram itself. */}
        <div className="px-5 py-4 border-t border-white/8 shrink-0"
          style={{ background:'rgba(255,255,255,0.02)' }}>
          <Link href={`/workflow/${workflowId}`} onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
            style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
            <Maximize2 size={14} />
            Open Full Workflow Viewer
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
