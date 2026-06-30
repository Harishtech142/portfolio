import { useState, useEffect } from 'react';

// ─── Scroll Progress ──────────────────────────────────────────────────────────
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return progress;
}

// ─── Active Section (for nav highlighting) ───────────────────────────────────
export function useActiveSection(sections) {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return active;
}

// ─── Scroll Direction (for hide-on-scroll-down navbars) ──────────────────────
export function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState('up'); // 'up' | 'down'

  useEffect(() => {
    let lastY = window.scrollY;

    const handle = () => {
      const y = window.scrollY;
      const diff = y - lastY;
      if (Math.abs(diff) < threshold) return;
      setDirection(diff > 0 ? 'down' : 'up');
      lastY = y;
    };

    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [threshold]);

  return direction;
}

// ─── Show after scroll ────────────────────────────────────────────────────────
export function useShowOnScroll(threshold = 300) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handle = () => setShow(window.scrollY > threshold);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [threshold]);

  return show;
}

// ─── Count-up animation (for statistics) ──────────────────────────────────────
// Animates a numeric value from 0 to `end` once `start` becomes true (e.g. on
// viewport entry). Pair with a numeric `end` and append any "+" suffix in the
// component itself (keeps this hook reusable for plain numbers too).
export function useCountUp(end, start, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutExpo — fast start, gentle settle, reads as "counting up" rather than linear ticking.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, start, duration]);

  return value;
}

