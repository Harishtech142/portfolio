import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

/* ─── Render a single node ─────────────────────────────────────────────────── */
function WFNode({ node }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity:0, scale:0.8 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ delay: node.animDelay ?? 0, type:'spring', damping:16 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position:'absolute', left: node.x, top: node.y, width: 140 }}
    >
      <motion.div
        animate={hovered ? { scale:1.06, y:-3 } : { scale:1, y:0 }}
        transition={{ duration:0.2 }}
        className="rounded-xl border cursor-default select-none overflow-hidden"
        style={{
          background: hovered ? `${node.color}18` : `${node.color}0e`,
          borderColor: hovered ? `${node.color}80` : `${node.color}40`,
          boxShadow: hovered ? `0 0 20px ${node.color}44` : `0 0 8px ${node.color}22`,
        }}>
        {/* Top color bar */}
        <div className="h-1" style={{ background: `linear-gradient(90deg,${node.color},${node.color}88)` }} />
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ background:`${node.color}22`, border:`1px solid ${node.color}44` }}>
              {node.icon}
            </div>
            <span className="text-[11px] font-semibold text-white leading-tight">{node.label}</span>
          </div>
          <p className="text-[9px] leading-snug" style={{ color:`${node.color}cc` }}>{node.desc}</p>
        </div>
        {/* Status dot */}
        <div className="px-3 pb-2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:node.color }} />
          <span className="text-[8px] text-white/30">Active</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Animated SVG connection with data dot ────────────────────────────────── */
function Connection({ from, to, color, delay = 0 }) {
  const x1 = from.x + 70; const y1 = from.y + 60;
  const x2 = to.x + 70;   const y2 = to.y;
  const midY = (y1 + y2) / 2;
  const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

  return (
    <g>
      {/* Base path */}
      <path d={path} fill="none" stroke={`${color}30`} strokeWidth="1.5" />
      {/* Animated glow path */}
      <motion.path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.6"
        strokeDasharray="6 8"
        animate={{ strokeDashoffset: [24, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'linear' }} />
      {/* Moving dot */}
      <motion.circle r="3.5" fill={color}
        style={{ filter:`drop-shadow(0 0 4px ${color})`, offsetPath: `path("${path}")` }}
        animate={{
          offsetDistance: ['0%','100%'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 1.6, repeat: Infinity, delay: delay + 0.2, ease:'easeInOut' }}
      />
    </g>
  );
}

/* ─── Workflow canvas — zoomable, pannable live diagram ────────────────────── */
export default function WorkflowCanvas({ nodes, connections, hint = 'Drag to pan · Use the zoom controls' }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const lastPos = useRef(null);
  const canvasRef = useRef(null);

  // Calculate canvas bounding box
  const maxX = Math.max(...nodes.map(n => n.x)) + 160;
  const maxY = Math.max(...nodes.map(n => n.y)) + 90;

  const onMouseDown = (e) => {
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e) => {
    if (!dragging || !lastPos.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan(p => ({ x: p.x+dx, y: p.y+dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => { setDragging(false); lastPos.current = null; };

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.min(2.5, Math.max(0.3, z + delta)));
  };

  return (
    <div className="relative flex-1 overflow-hidden rounded-xl border border-white/8 h-full"
      style={{ background:'#0d0d1a', cursor: dragging ? 'grabbing' : 'grab',
        backgroundImage:'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize:'24px 24px' }}
      ref={canvasRef}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      onWheel={onWheel}>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        {[
          { icon: ZoomIn, fn: () => setZoom(z => Math.min(z+0.2, 2.5)), label: 'Zoom in' },
          { icon: ZoomOut, fn: () => setZoom(z => Math.max(z-0.2, 0.3)), label: 'Zoom out' },
          { icon: Maximize2, fn: () => { setZoom(1); setPan({x:0,y:0}); }, label: 'Reset view' },
        ].map(({ icon:Ic, fn, label }, i) => (
          <button key={i} onClick={fn} aria-label={label}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/8">
            <Ic size={12} />
          </button>
        ))}
      </div>

      {/* Scrollable inner canvas */}
      <div style={{
        transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`,
        transformOrigin: '20px 20px',
        width: maxX, height: maxY,
        position: 'absolute',
        transition: dragging ? 'none' : 'transform 0.1s ease',
      }}>
        {/* SVG connections */}
        <svg style={{ position:'absolute', width: maxX, height: maxY, pointerEvents:'none', overflow:'visible' }}>
          {connections.map((c,i) => {
            const from = nodes.find(n => n.id === c.from);
            const to = nodes.find(n => n.id === c.to);
            if (!from || !to) return null;
            return <Connection key={i} from={from} to={to} color={c.color || to.color} delay={i*0.3} />;
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(n => <WFNode key={n.id} node={n} />)}
      </div>

      {/* Hint */}
      <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-white/20 text-[9px]">
        <Move size={9} /> {hint}
      </div>
    </div>
  );
}
