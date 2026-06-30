// Framer Motion variants (used by /workflow/[id] page only)

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const stagger = (delay = 0.08) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: delay,
      delayChildren: 0.05,
    },
  },
});
