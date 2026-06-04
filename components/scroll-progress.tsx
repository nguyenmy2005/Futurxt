"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll({ layoutEffect: false });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left",
        background: "linear-gradient(to right, #22d3ee, #7dd3fc, #a855f7)",
      }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[100]"
    />
  );
}