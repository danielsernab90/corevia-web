"use client";

import {
  CalendarClock,
  Map,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { coreviaIconProps } from "@/lib/icons";
import {
  consultationVisualBody,
  consultationVisualCard,
  consultationVisualFrame,
  consultationVisualIcon,
  consultationVisualTitle,
  motionEasing,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type ConsultationVisualProps = {
  className?: string;
};

type VisualCardConfig = {
  key: "card1" | "card2" | "card3";
  Icon: LucideIcon;
  iconTone: string;
  kind: "session" | "detail";
};

const cards: VisualCardConfig[] = [
  {
    key: "card1",
    Icon: CalendarClock,
    iconTone: "bg-primary/10 text-primary",
    kind: "session",
  },
  {
    key: "card2",
    Icon: Sparkles,
    iconTone: "bg-secondary/10 text-secondary",
    kind: "detail",
  },
  {
    key: "card3",
    Icon: Map,
    iconTone: "bg-primary/10 text-primary",
    kind: "detail",
  },
];

export function ConsultationVisual({ className }: ConsultationVisualProps) {
  const t = useTranslations("BookConsultation.hero");
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={
        reduceMotion
          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
          : consultationVisualFrame
      }
    >
      <div
        role="img"
        aria-label={t("visualLabel")}
        className="relative min-h-[24rem] w-full overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-surface via-background to-muted elevation-md sm:aspect-[4/3] sm:min-h-0"
      >
        {/* Living background — glow + drifting grid + faint particles */}
        <LivingBackground reduceMotion={Boolean(reduceMotion)} />

        <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-7">
          <div className="relative w-full max-w-sm space-y-2.5 sm:space-y-3">
            {cards.map((card) => {
              const Icon = card.Icon;
              return (
                <motion.div
                  key={card.key}
                  variants={
                    reduceMotion
                      ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
                      : consultationVisualCard
                  }
                  className="rounded-xl border border-border/80 bg-background/80 p-3.5 shadow-md backdrop-blur-md sm:rounded-2xl sm:p-4"
                >
                  <div className="flex items-start gap-3">
                    <motion.span
                      variants={
                        reduceMotion
                          ? undefined
                          : consultationVisualIcon
                      }
                      className={cn(
                        "inline-flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10",
                        card.iconTone
                      )}
                    >
                      <Icon className="size-4 sm:size-5" {...coreviaIconProps} />
                    </motion.span>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <motion.p
                        variants={
                          reduceMotion ? undefined : consultationVisualTitle
                        }
                        className="text-sm font-semibold text-foreground"
                      >
                        {t(`visual.${card.key}.title`)}
                      </motion.p>

                      {card.kind === "session" ? (
                        <motion.div
                          variants={
                            reduceMotion ? undefined : consultationVisualBody
                          }
                          className="mt-0.5 flex flex-wrap items-center gap-2"
                        >
                          <p className="text-caption text-muted-foreground">
                            {t("visual.card1.subtitle")}
                          </p>
                          <span className="rounded-md bg-success/10 px-2 py-0.5 text-caption font-medium text-success">
                            {t("visual.badge")}
                          </span>
                        </motion.div>
                      ) : (
                        <motion.p
                          variants={
                            reduceMotion ? undefined : consultationVisualBody
                          }
                          className="mt-1 text-caption leading-relaxed text-muted-foreground"
                        >
                          {card.key === "card2"
                            ? t("visual.card2.description")
                            : t("visual.card3.description")}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LivingBackground({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) {
    return (
      <>
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_55%),radial-gradient(ellipse_at_80%_70%,color-mix(in_oklab,var(--secondary)_14%,transparent),transparent_50%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--border)_80%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_80%,transparent)_1px,transparent_1px)] [background-size:28px_28px]"
        />
      </>
    );
  }

  return (
    <>
      {/* Soft drifting primary glow */}
      <motion.div
        aria-hidden
        className="absolute -top-[20%] -left-[10%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_68%)] blur-2xl will-change-transform"
        animate={{
          x: [0, 18, -8, 0],
          y: [0, 12, -10, 0],
          opacity: [0.55, 0.75, 0.6, 0.55],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Soft drifting secondary glow */}
      <motion.div
        aria-hidden
        className="absolute -right-[15%] -bottom-[25%] h-[65%] w-[65%] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--secondary)_16%,transparent),transparent_68%)] blur-2xl will-change-transform"
        animate={{
          x: [0, -14, 10, 0],
          y: [0, -12, 8, 0],
          opacity: [0.45, 0.65, 0.5, 0.45],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Gentle grid drift */}
      <motion.div
        aria-hidden
        className="absolute inset-[-28px] opacity-[0.32] will-change-transform [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--border)_80%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_80%,transparent)_1px,transparent_1px)] [background-size:28px_28px]"
        animate={{ x: [0, 14, 0], y: [0, 14, 0] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Faint floating particles */}
      {[
        { top: "18%", left: "72%", size: 3, duration: 9, delay: 0 },
        { top: "62%", left: "14%", size: 2, duration: 11, delay: 1.2 },
        { top: "38%", left: "88%", size: 2.5, duration: 10, delay: 0.6 },
        { top: "78%", left: "58%", size: 2, duration: 13, delay: 2 },
      ].map((particle) => (
        <motion.span
          key={`${particle.top}-${particle.left}`}
          aria-hidden
          className="absolute rounded-full bg-primary/25"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: motionEasing,
          }}
        />
      ))}
    </>
  );
}
