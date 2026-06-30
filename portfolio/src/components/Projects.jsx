import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { projects, categories } from '../data/projects';
import { demoConfigs, workflowConfigs } from '../data/demoConfigs';
import { ProjectCard, ProjectModal } from './ProjectCard';
import AIChatModal from './AIChatModal';
import WorkflowViewerModal from './WorkflowViewerModal';
import { fadeUp, stagger, viewportConfig } from '../utils/animations';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);     // detail modal
  const [activeDemo, setActiveDemo] = useState(null); // chat modal key
  const [activeWF, setActiveWF] = useState(null);     // workflow key

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
        {/* Heading */}
        <motion.div variants={stagger()} initial="hidden" whileInView="visible" viewport={viewportConfig}
          className="text-center mb-12">
          <motion.p variants={fadeUp} className="text-sm font-mono text-blue-400 mb-3">// what I've built</motion.p>
          <motion.h2 variants={fadeUp} className="section-title gradient-text">Projects</motion.h2>
          <motion.p variants={fadeUp} className="text-white/40 mt-4 max-w-xl mx-auto text-sm">
            AI automation systems, intelligent agents, and web products — with interactive demos.
          </motion.p>
          <motion.div variants={fadeUp}
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </motion.div>

        {/* Search + Filter */}
        <motion.div variants={stagger(0.05)} initial="hidden" whileInView="visible" viewport={viewportConfig}
          className="flex flex-col md:flex-row gap-4 mb-10">
          <motion.div variants={fadeUp} className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" placeholder="Search projects, technologies..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors" />
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
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
          </motion.div>
        </motion.div>

        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-white/30 text-xs font-mono mb-6">
          {filtered.length} project{filtered.length!==1?'s':''}{query && ` matching "${query}"`}
        </motion.p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div key={project.id} layout
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, scale:0.95 }} transition={{ delay: i*0.06 }}>
                <ProjectCard
                  project={project}
                  onClick={setSelected}
                  onLiveDemo={() => openDemo(project)}
                  onViewWorkflow={() => openWorkflow(project)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-white/30">
            <p className="text-4xl mb-3">🔍</p>
            <p>No projects found. Try a different search or filter.</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)}
          onLiveDemo={() => { setSelected(null); openDemo(selected); }}
          onViewWorkflow={() => { setSelected(null); openWorkflow(selected); }} />
      )}

      {/* AI Chat Demo modal */}
      <AnimatePresence>
        {activeDemoCfg && (
          <AIChatModal key={activeDemo} {...activeDemoCfg} onClose={() => setActiveDemo(null)} />
        )}
      </AnimatePresence>

      {/* Workflow viewer modal — quick look only; full page lives at /workflow/:id */}
      <AnimatePresence>
        {activeWFCfg && (
          <WorkflowViewerModal key={activeWF} {...activeWFCfg}
            workflowId={activeWF}
            onClose={() => setActiveWF(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
