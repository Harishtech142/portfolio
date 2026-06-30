import { useState, useRef, useCallback } from 'react';

/**
 * Drop-in <button> replacement that adds a lightweight ripple-on-click effect.
 * Accepts the same props as a native button (onClick, className, style, children, disabled, type).
 * Used across CTA buttons, card action buttons, and form submit buttons for a consistent
 * "premium" tactile feel without duplicating ripple logic in every component.
 */
export default function RippleButton({ children, className = '', onClick, disabled, style, type = 'button', ...rest }) {
  const [ripples, setRipples] = useState([]);
  const idRef = useRef(0);

  const handleClick = useCallback((e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = idRef.current++;

    setRipples((r) => [...r, { id, x, y, size }]);
    // Clean up after the animation finishes — keeps the DOM from accumulating nodes.
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);

    onClick?.(e);
  }, [disabled, onClick]);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      style={style}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)',
            animation: 'ripple-expand 0.65s ease-out forwards',
          }}
        />
      ))}
    </button>
  );
}
