"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);
  const glowX = useSpring(rawX, { stiffness: 80, damping: 22, mass: 0.5 });
  const glowY = useSpring(rawY, { stiffness: 80, damping: 22, mass: 0.5 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rawX, rawY]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: glowX,
        top: glowY,
        x: "-50%",
        y: "-50%",
        width: 700,
        height: 700,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)",
        filter: "blur(8px)",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}