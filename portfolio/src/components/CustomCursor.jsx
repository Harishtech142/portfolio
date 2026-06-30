import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';

/**
 * Premium custom cursor — a small dot plus a trailing ring that expands
 * over interactive elements. Only mounts on devices with a real mouse
 * (skips touch/coarse pointers) and respects prefers-reduced-motion.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const ringX = useSpring(mx, { stiffness: 300, damping: 30, mass: 0.4 });
  const ringY = useSpring(my, { stiffness: 300, damping: 30, mass: 0.4 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || reducedMotion) return; // leave disabled — native cursor stays

    setEnabled(true);
    document.documentElement.classList.add('custom-cursor-active');

    const handleMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const handleOver = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) setHovering(true);
    };
    const handleOut = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) setHovering(false);
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseleave', handleLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Small solid dot — tracks instantly */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{
          x: mx, y: my,
          translateX: '-50%', translateY: '-50%',
          width: 6, height: 6,
          background: '#fff',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />
      {/* Trailing ring — springs behind, expands on hover */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full border"
        style={{
          x: ringX, y: ringY,
          translateX: '-50%', translateY: '-50%',
          width: hovering ? 48 : 28,
          height: hovering ? 48 : 28,
          borderColor: hovering ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.3)',
          background: hovering ? 'rgba(139,92,246,0.08)' : 'transparent',
          opacity: visible ? 1 : 0,
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease, opacity 0.2s ease',
        }}
      />
    </>
  );
}
