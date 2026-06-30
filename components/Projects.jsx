'use client'

import { useState, useMemo, useRef, useEffect, lazy, Suspense } from 'react';
import { Search } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, categories } from '../data/projects';
import { demoConfigs, workflowConfigs } from '../data/demoConfigs';
import { ProjectCard, ProjectModal } from './ProjectCard';
import Reveal, { Stagger } from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const AIChatModal = lazy(() => import('./AIChatModal'));
const WorkflowViewerModal = lazy(() => import('./WorkflowViewerModal'));

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [activeDemo, setActiveDemo] = useState(null);
  const [activeWF, setActiveWF] = useState(null);
  const gridRef = useRef(null);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ = !q || p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some(t => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [activeCategory, query]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.children;
    if (!cards.length) return;
    gsap.set(cards, { y: 48, opacity: 0, scale: 0.95 });
    const ctx = gsap.context(() => {
      gsap.to(cards, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.6, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 88%' },
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [filtered.length]);

  const openDemo = (project) => {
    if (project.customLive && demoConfigs[project.customLive]) {
      setActiveDemo(project.customLive);
    }
  };

  const openWorkflow = (project) => {
    if (project.customCode && workflowConfigs[project.customCode]) {
      setActiveWF(project.customCode);
    }
  };

  const activeDemoCfg = activeDemo ? demoConfigs[activeDemo] : null;
  const activeWFCfg   = activeWF   ? workflowConfigs[activeWF]   : null;

  return (
    <section id="projects" className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <Reveal variant="zoomIn" className="text-center mb-6">
          <p className="text-sm font-mono text-blue-400">// what I've built</p>
        </Reveal>
        <Stagger className="text-center mb-12" variant="fadeUp" staggerDelay={0.08}>
          <h2 className="section-title gradient-text">Projects</h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm">
            AI automation systems, intelligent agents, and web products — with interactive demos.
          </p>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </Stagger>

        <Stagger staggerDelay={0.05} variant="fadeUp" className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" placeholder="Search projects, technologies..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'glass text-white/50 hover:text-white hover:bg-white/10'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </Stagger>

        <p className="text-white/30 text-xs font-mono mb-6 transition-opacity duration-300">
          {filtered.length} project{filtered.length!==1?'s':''}{query && ` matching "${query}"`}
        </p>

        {filtered.length > 0 ? (
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((project) => (
              <div key={project.id} className="h-full">
                <ProjectCard
                  project={project}
                  onClick={setSelected}
                  onLiveDemo={() => openDemo(project)}
                  onViewWorkflow={() => openWorkflow(project)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-white/30">
            <p className="text-4xl mb-3">🔍</p>
            <p>No projects found. Try a different search or filter.</p>
          </div>
        )}
      </div>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)}
          onLiveDemo={() => { setSelected(null); openDemo(selected); }}
          onViewWorkflow={() => { setSelected(null); openWorkflow(selected); }} />
      )}

      {activeDemoCfg && (
        <Suspense fallback={null}>
          <AIChatModal key={activeDemo} {...activeDemoCfg} onClose={() => setActiveDemo(null)} />
        </Suspense>
      )}

      {activeWFCfg && (
        <Suspense fallback={null}>
          <WorkflowViewerModal key={activeWF} {...activeWFCfg}
            workflowId={activeWF}
            onClose={() => setActiveWF(null)} />
        </Suspense>
      )}
    </section>
  );
}
