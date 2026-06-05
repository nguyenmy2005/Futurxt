"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

function HyperspaceCanvas({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const cx = W / 2;
    const cy = H / 2;

    const isMobileDevice = W < 768;
    const STAR_COUNT = isMobileDevice ? 250 : 500;

    const stars = Array.from({ length: STAR_COUNT }, () => {
      const s = { x: (Math.random() - 0.5) * W * 2, y: (Math.random() - 0.5) * H * 2, z: Math.random() * W, pz: 0 };
      s.pz = s.z;
      return s;
    });

    let animId: number;
    let frame = 0;
    const TOTAL = isMobileDevice ? 28 : 32;

    const draw = () => {
      frame++;
      const progress = frame / TOTAL;
      const speed = progress < 0.6
        ? W * 0.09 * (1 - progress * 0.15)
        : W * 0.05 * (1 - progress);

      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 0) {
          s.x = (Math.random() - 0.5) * W * 2;
          s.y = (Math.random() - 0.5) * H * 2;
          s.z = W;
          s.pz = W;
        }
        const sx = (s.x / s.z) * W + cx;
        const sy = (s.y / s.z) * H + cy;
        const px = (s.x / s.pz) * W + cx;
        const py = (s.y / s.pz) * H + cy;
        const size = Math.max(0.1, (1 - s.z / W) * 3);
        const b = Math.floor((1 - s.z / W) * 255);
        const alpha = Math.min(1, (1 - s.z / W) * 1.8);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${b},${b},${b},${alpha.toFixed(2)})`;
        ctx.lineWidth = size;
        ctx.stroke();
      }

      if (frame < TOTAL) {
        animId = requestAnimationFrame(draw);
      } else {
        let a = 1;
        const fade = () => {
          a -= 0.25;
          ctx.fillStyle = "rgba(0,0,0,0.32)";
          ctx.fillRect(0, 0, W, H);
          if (a > 0) requestAnimationFrame(fade);
          else { ctx.clearRect(0, 0, W, H); onDone(); }
        };
        fade();
      }
    };

    const tid = setTimeout(draw, 60);
    return () => { clearTimeout(tid); cancelAnimationFrame(animId); };
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 50 }}
    />
  );
}

function useTypewriter(text: string, started: boolean, speed = 14) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const tick = () => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) setTimeout(tick, speed);
      else setDone(true);
    };
    const t = setTimeout(tick, speed);
    return () => clearTimeout(t);
  }, [started, text, speed]);

  return { displayed, done };
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div style={{
        position: "fixed", top: "1rem", left: "1rem", zIndex: 200,
        width: 44, height: 44, borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.18)",
      }} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        top: "1rem",
        left: "1rem",
        zIndex: 200,
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(0,0,0,0.12)",
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        outline: "none",
        transition: "all 0.4s ease",
      }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.svg key="moon" width="20" height="20" viewBox="0 0 24 24" fill="none"
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
            transition={{ duration: 0.28 }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="rgba(215,228,255,0.95)" />
          </motion.svg>
        ) : (
          <motion.svg key="sun" width="22" height="22" viewBox="0 0 24 24" fill="none"
            initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
            transition={{ duration: 0.28 }}>
            <circle cx="12" cy="12" r="5" fill="#f59e0b" />
            <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </g>
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function IdeaSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const sectionRef = useRef<HTMLElement>(null);
  const [hyperspaceOver, setHyperspaceOver] = useState(false);
  const [stage, setStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const bgColor = isDark ? "#000000" : "#ffffff";
  const serif = "'Georgia','Times New Roman',serif";
  const textPrimary = isDark ? "#ffffff" : "#000000";
  const textSecondary = isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.62)";

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const color = isDark ? "#000000" : "#ffffff";
    html.style.backgroundColor = color;
    body.style.backgroundColor = color;
    return () => {
      html.style.backgroundColor = "";
      body.style.backgroundColor = "";
    };
  }, [isDark]);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const subtitleText = "We help startups and businesses turn ambitious ideas into production-ready products.";
  const { displayed, done: typeDone } = useTypewriter(subtitleText, stage >= 2, 14);

  const onHyperspaceDone = useCallback(() => setHyperspaceOver(true), []);

  useEffect(() => {
    if (!hyperspaceOver) return;
    const t1 = setTimeout(() => setStage(1), 60);
    const t2 = setTimeout(() => setStage(2), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [hyperspaceOver]);

  useEffect(() => {
    if (!typeDone) return;
    const t = setTimeout(() => setStage(3), 180);
    return () => clearTimeout(t);
  }, [typeDone]);

  useEffect(() => {
    if (stage !== 3) return;
    const t = setTimeout(() => setStage(4), 600);
    return () => clearTimeout(t);
  }, [stage]);

  const handleIntroduce = () => {
    document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        minHeight: "100dvh",
        background: bgColor,
        transition: mounted ? "background 0.45s ease" : "none",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemeToggle />

      <AnimatePresence>
        {!hyperspaceOver && (
          <motion.div
            key="hs"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 49, background: "#000" }}
          >
            <HyperspaceCanvas onDone={onHyperspaceDone} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          maxWidth: isMobile ? "100%" : 960,
          paddingInline: isMobile ? "1.25rem" : "2rem",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          boxSizing: "border-box" as const,
        }}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 36, filter: "blur(12px)" }}
          animate={stage >= 1 ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "opacity, transform, filter", width: "100%" }}
        >
          {(["FROM IDEA", "TO SCALE"] as const).map((line, i) => (
            <h1
              key={line}
              style={{
                fontFamily: serif,
                fontSize: isMobile ? "clamp(2.8rem,16vw,4.8rem)" : "clamp(4rem,9vw,8.5rem)",
                fontWeight: 900,
                color: textPrimary,
                margin: i === 0 ? 0 : "0.04em 0 0",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                transition: "color 0.45s ease",
                textAlign: "center",
              }}
            >
              {line}
            </h1>
          ))}

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={stage >= 1 ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
            style={{
              width: 56,
              height: 1,
              background: isDark
                ? "linear-gradient(to right, transparent, rgba(255,255,255,0.38), transparent)"
                : "linear-gradient(to right, transparent, rgba(0,0,0,0.22), transparent)",
              margin: isMobile ? "1.2rem auto 1.1rem" : "2rem auto 1.7rem",
              transformOrigin: "center",
              transition: "background 0.45s ease",
            }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            width: "100%",
            maxWidth: isMobile ? "300px" : "620px",
            margin: "0 auto",
            marginBottom: isMobile ? "2rem" : "2.8rem",
            minHeight: isMobile ? "auto" : "2.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: serif,
              fontSize: isMobile ? "clamp(0.82rem,3.4vw,0.95rem)" : "clamp(1rem,1.8vw,1.28rem)",
              fontWeight: 400,
              color: textSecondary,
              margin: 0,
              lineHeight: 1.8,
              letterSpacing: "0.012em",
              textAlign: "center",
              transition: "color 0.45s ease",
              whiteSpace: "normal",
            }}
          >
            {displayed}
            {stage >= 2 && !typeDone && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse" }}
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "1em",
                  background: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)",
                  marginLeft: "3px",
                  verticalAlign: "middle",
                  borderRadius: "1px",
                }}
              />
            )}
          </p>
        </motion.div>

        {/* Introduce button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 } as any}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: isMobile ? "0.5rem" : "0.75rem",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleIntroduce}
            style={{
              borderRadius: 9999,
              background: isDark ? "transparent" : "#000000",
              border: isDark ? "1px solid rgba(255,255,255,0.32)" : "1px solid #000000",
              padding: isMobile ? "13px 44px" : "15px 60px",
              cursor: "pointer",
              outline: "none",
              appearance: "none" as any,
              transition: "background 0.45s ease, border 0.45s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: serif,
                fontSize: isMobile ? "clamp(0.88rem,3.6vw,1.05rem)" : "clamp(0.95rem,1.7vw,1.22rem)",
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}
            >
              Introduce
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}