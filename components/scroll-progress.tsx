"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export function ScrollProgress() {
  const scrollXProgress = useMotionValue(0);
  const scaleX = useSpring(scrollXProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    const container = document.querySelector(".snap-container") as HTMLElement | null;
    if (!container) return;

    const update = () => {
      const max = container.scrollHeight - container.clientHeight;
      if (max <= 0) return;
      scrollXProgress.set(container.scrollTop / max);
    };

    container.addEventListener("scroll", update, { passive: true });
    return () => container.removeEventListener("scroll", update);
  }, [scrollXProgress]);

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