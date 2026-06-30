'use client'

import { useEffect, useRef, useState, Children, cloneElement } from 'react';

export default function Reveal({ children, className = '', as: Tag = 'div', delay = 0, variant = 'fadeUp', onReveal, ...props }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          onReveal?.();
          obs.disconnect();
        }
      },
      { rootMargin: '-100px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [show, onReveal]);

  const animClass = show ? `reveal-${variant}` : 'reveal-hidden';

  return (
    <Tag
      ref={ref}
      className={`${className} ${animClass}`}
      style={{ animationDelay: delay ? `${delay}s` : undefined, ...props.style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Stagger({ children, className = '', as: Tag = 'div', staggerDelay = 0.08, variant = 'fadeUp', onReveal, ...props }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          onReveal?.();
          obs.disconnect();
        }
      },
      { rootMargin: '-100px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [show, onReveal]);

  return (
    <Tag ref={ref} className={className} {...props}>
      {Children.map(children, (child, i) =>
        child
          ? cloneElement(child, {
              className: `${child.props.className || ''} ${show ? `reveal-${variant}` : 'reveal-hidden'}`,
              style: {
                animationDelay: `${i * staggerDelay}s`,
                ...child.props.style,
              },
            })
          : child
      )}
    </Tag>
  );
}
