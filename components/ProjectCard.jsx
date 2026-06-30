'use client'

import { Play, Network, X, Star } from 'lucide-react';

const CAT_GRAD = {
  'AI Agent':     'from-blue-900/50 to-purple-900/50',
  'AI Automation':'from-yellow-900/40 to-orange-900/40',
  'Web Development':'from-green-900/40 to-teal-900/40',
};
const CAT_EMOJI = { 'AI Agent':'🤖', 'AI Automation':'⚡', 'Web Development':'🌐' };

export function ProjectCard({ project, onClick, onLiveDemo, onViewWorkflow }) {
  return (
    <div className="relative rounded-2xl group hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-200 h-full">
      <div className="relative glass glass-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full"
        style={{ border:'1px solid rgba(255,255,255,0.08)' }}>

      {project.featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
          <Star size={9} fill="currentColor" /> Featured
        </div>
      )}

      <div className={`relative h-44 bg-gradient-to-br ${CAT_GRAD[project.category] || 'from-blue-900/40 to-purple-900/40'} overflow-hidden`}
        onClick={() => onClick(project)}>
        {project.image ? (
          <img src={project.image} alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-500"
            onError={e => { e.target.style.display='none'; }} />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-15 select-none">{CAT_EMOJI[project.category] || '🔧'}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-3" onClick={() => onClick(project)}>
        <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit">
          {project.category}
        </span>
        <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors duration-300 leading-snug">
          {project.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed line-clamp-2 flex-1">{project.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0,4).map(t => <span key={t} className="tech-tag">{t}</span>)}
          {project.tech.length > 4 && <span className="tech-tag text-white/30">+{project.tech.length-4}</span>}
        </div>
      </div>

      <div className="px-5 pb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onLiveDemo?.(); }}
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95"
          style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
          <Play size={11} fill="white" /> Live Demo
        </button>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onViewWorkflow?.(); }}
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white/70 border border-white/15 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all hover:scale-105 active:scale-95">
          <Network size={11} /> View Workflow
        </button>
      </div>
      </div>
    </div>
  );
}

export function ProjectModal({ project, onClose, onLiveDemo, onViewWorkflow }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-backdrop"
      onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl border border-white/10 modal-content"
        onClick={e => e.stopPropagation()}>

        <div className={`relative h-52 bg-gradient-to-br ${CAT_GRAD[project.category] || 'from-blue-900/40 to-purple-900/40'}`}>
          {project.image && (
            <img src={project.image} alt={project.title}
              className="w-full h-full object-cover opacity-60"
              onError={e => { e.target.style.display='none'; }} />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-10 select-none">{CAT_EMOJI[project.category] || '🔧'}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <button onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all">
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block px-2 py-0.5 text-[10px] font-mono rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 mb-2">
              {project.category}
            </span>
            <h2 className="text-2xl font-bold text-white">{project.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-white/70 leading-relaxed">{project.longDesc || project.description}</p>

          <div>
            <h4 className="text-xs font-mono text-white/30 mb-2 uppercase tracking-widest">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
            </div>
          </div>

          {project.features?.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-white/30 mb-2 uppercase tracking-widest">Key Features</h4>
              <ul className="space-y-2">
                {project.features.map((f,i) => (
                  <li key={i} className="flex items-start gap-2.5 text-white/60 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={() => { onClose(); onLiveDemo?.(); }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
              <Play size={14} fill="white" /> Live Demo
            </button>
            <button type="button" onClick={() => { onClose(); onViewWorkflow?.(); }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white/70 border border-white/15 hover:text-white hover:border-white/30 transition-all hover:scale-105">
              <Network size={14} /> View Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
