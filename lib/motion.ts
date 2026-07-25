import type { Transition, Variants } from "framer-motion";

/** Shared easing — keep motion consistent across the product. */
export const motionEasing = [0.22, 1, 0.36, 1] as const;

export const motionDuration = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.45,
  float: 4.5,
} as const;

export const defaultTransition: Transition = {
  duration: motionDuration.normal,
  ease: motionEasing,
};

/** Hero entrance — slightly longer, calmer than section reveals. */
export const heroFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.slow, ease: motionEasing },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/** In-viewport section band reveal. */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: motionEasing },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

/** Denser stagger for feature / logo grids. */
export const staggerGrid: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const hoverLift = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.98 },
  transition: { duration: motionDuration.fast, ease: motionEasing },
} as const;

export const cardHover = {
  whileHover: { y: -4, transition: { duration: motionDuration.fast, ease: motionEasing } },
  whileTap: { scale: 0.985 },
} as const;

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: motionDuration.fast, ease: motionEasing },
} as const;

export const buttonHover = {
  whileHover: { scale: 1.015, y: -1 },
  whileTap: { scale: 0.98 },
  transition: { duration: motionDuration.fast, ease: motionEasing },
} as const;

export const buttonInteraction = buttonHover;

/** Subtle continuous float for decorative visuals. */
export const imageFloat = {
  animate: { y: [0, -8, 0] },
  transition: {
    duration: motionDuration.float,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

/** Soft glow pulse for status indicators / accents. */
export const glowPulse = {
  animate: { opacity: [0.55, 1, 0.55], scale: [1, 1.08, 1] },
  transition: {
    duration: 2.6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

/**
 * Consultation illustration — viewport entrance.
 * Opacity + transform only (GPU-friendly). Once via whileInView.
 */
/**
 * Illustration fades in first, then the card stack enters.
 * `delayChildren` holds the cards back so the artwork reads on its own.
 */
export const consultationVisualFrame: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: motionEasing,
      when: "beforeChildren",
      delayChildren: 1.4,
      staggerChildren: 0.36,
    },
  },
};

export const consultationVisualCard: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: motionEasing,
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

export const consultationVisualIcon: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.32, ease: motionEasing },
  },
};

export const consultationVisualTitle: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: motionEasing },
  },
};

export const consultationVisualBody: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: motionEasing },
  },
};
