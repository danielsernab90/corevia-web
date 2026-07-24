"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import {
  buttonHover,
  cardHover,
  fadeIn,
  fadeUp,
  glowPulse,
  heroFade,
  hoverLift,
  hoverScale,
  imageFloat,
  scaleIn,
  sectionReveal,
  staggerContainer,
  staggerGrid,
  staggerItem,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type MotionBaseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children" | "variants">;

function withViewport(delay = 0, once = true) {
  return {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once, amount: 0.2 },
    transition: delay ? { delay } : undefined,
  };
}

export function FadeIn({
  children,
  className,
  delay = 0,
  once = true,
  ...props
}: MotionBaseProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeIn}
      {...withViewport(delay, once)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeUp({
  children,
  className,
  delay = 0,
  once = true,
  ...props
}: MotionBaseProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeUp}
      {...withViewport(delay, once)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HeroFade({
  children,
  className,
  ...props
}: Omit<MotionBaseProps, "delay" | "once">) {
  return (
    <motion.div
      className={cn(className)}
      variants={heroFade}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SectionReveal({
  children,
  className,
  once = true,
  ...props
}: MotionBaseProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={sectionReveal}
      {...withViewport(0, once)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  className,
  delay = 0,
  once = true,
  ...props
}: MotionBaseProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={scaleIn}
      {...withViewport(delay, once)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  once = true,
  ...props
}: MotionBaseProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainer}
      {...withViewport(0, once)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGrid({
  children,
  className,
  once = true,
  ...props
}: MotionBaseProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerGrid}
      {...withViewport(0, once)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...props
}: Omit<MotionBaseProps, "delay" | "once">) {
  return (
    <motion.div className={cn(className)} variants={staggerItem} {...props}>
      {children}
    </motion.div>
  );
}

export function HoverLift({
  children,
  className,
  ...props
}: Omit<MotionBaseProps, "delay" | "once">) {
  return (
    <motion.div className={cn(className)} {...hoverLift} {...props}>
      {children}
    </motion.div>
  );
}

export function CardHover({
  children,
  className,
  ...props
}: Omit<MotionBaseProps, "delay" | "once">) {
  return (
    <motion.div className={cn(className)} {...cardHover} {...props}>
      {children}
    </motion.div>
  );
}

export function HoverScale({
  children,
  className,
  ...props
}: Omit<MotionBaseProps, "delay" | "once">) {
  return (
    <motion.div className={cn(className)} {...hoverScale} {...props}>
      {children}
    </motion.div>
  );
}

export function ImageFloat({
  children,
  className,
  ...props
}: Omit<MotionBaseProps, "delay" | "once">) {
  return (
    <motion.div className={cn(className)} {...imageFloat} {...props}>
      {children}
    </motion.div>
  );
}

export function GlowPulse({
  children,
  className,
  ...props
}: Omit<MotionBaseProps, "delay" | "once">) {
  return (
    <motion.div className={cn(className)} {...glowPulse} {...props}>
      {children}
    </motion.div>
  );
}

type MotionButtonProps = HTMLMotionProps<"button">;

export function MotionButton({ className, ...props }: MotionButtonProps) {
  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className
      )}
      {...buttonHover}
      {...props}
    />
  );
}
