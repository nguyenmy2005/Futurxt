"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "dark" | "light";

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

    const stars = Array.from({ length: 500 }, () => {
      const s = { x: (Math.random() - 0.5) * W * 2, y: (Math.random() - 0.5) * H * 2, z: Math.random() * W, pz: 0 };
      s.pz = s.z;
      return s;
    });

    let animId: number;
    let frame = 0;
    const TOTAL = 32;

    const draw = () => {
      frame++;
      const progress = frame / TOTAL;
      const speed = progress < 0.6 ? W * 0.09 * (1 - progress * 0.15) : W * 0.05 * (1 - progress);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, W, H);
      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 0) { s.x = (Math.random() - 0.5) * W * 2; s.y = (Math.random() - 0.5) * H * 2; s.z = W; s.pz = W; }
        const sx = (s.x / s.z) * W + cx;
        const sy = (s.y / s.z) * H + cy;
        const px = (s.x / s.pz) * W + cx;
        const py = (s.y / s.pz) * H + cy;
        const size = Math.max(0.1, (1 - s.z / W) * 3);
        const b = Math.floor((1 - s.z / W) * 255);
        const alpha = Math.min(1, (1 - s.z / W) * 1.8);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${b},${b},${b},${alpha.toFixed(2)})`; ctx.lineWidth = size; ctx.stroke();
      }
      if (frame < TOTAL) { animId = requestAnimationFrame(draw); }
      else {
        let a = 1;
        const fade = () => {
          a -= 0.2;
          ctx.fillStyle = "rgba(0,0,0,0.25)";
          ctx.fillRect(0, 0, W, H);
          if (a > 0) requestAnimationFrame(fade);
          else { ctx.clearRect(0, 0, W, H); onDone(); }
        };
        fade();
      }
    };

    const tid = setTimeout(() => draw(), 60);
    return () => { clearTimeout(tid); cancelAnimationFrame(animId); };
  }, [onDone]);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 50 }} />
  );
}

function StarField({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;

    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.022 + 0.005,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    }));

    let t = 0;
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t++;

      for (const s of stars) {
        const tw = s.alpha * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase)));

        if (theme === "dark") {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          g.addColorStop(0, `rgba(210,225,255,${(tw * 0.5).toFixed(3)})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(235,242,255,${tw.toFixed(3)})`; ctx.fill();
        } else {
          // light mode: ngôi sao màu trắng tinh, glow trắng nhẹ
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          g.addColorStop(0, `rgba(180,190,210,${(tw * 0.28).toFixed(3)})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160,170,195,${(tw * 0.7).toFixed(3)})`; ctx.fill();
        }

        s.x += s.vx; s.y += s.vy;
        if (s.x < -10) s.x = W + 10;
        if (s.x > W + 10) s.x = -10;
        if (s.y < -10) s.y = H + 10;
        if (s.y > H + 10) s.y = -10;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", setSize); };
  }, [theme]);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  );
}

function useTypewriter(text: string, started: boolean, speed = 13) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!started) return;
    setDisplayed(""); setDone(false);
    let i = 0;
    const tick = () => { i++; setDisplayed(text.slice(0, i)); if (i < text.length) setTimeout(tick, speed); else setDone(true); };
    const t = setTimeout(tick, speed);
    return () => clearTimeout(t);
  }, [started, text, speed]);
  return { displayed, done };
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      style={{
        position: "fixed", top: "1rem", left: "1rem", zIndex: 100,
        width: 44, height: 44, borderRadius: "50%",
        border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)",
        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        boxShadow: isDark ? "0 2px 20px rgba(0,0,0,0.5)" : "0 2px 16px rgba(0,0,0,0.1)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        padding: 0, outline: "none", transition: "all 0.4s ease",
      }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.svg key="moon" width="20" height="20" viewBox="0 0 24 24" fill="none"
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.7 }} transition={{ duration: 0.28 }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="rgba(215,228,255,0.95)" />
          </motion.svg>
        ) : (
          <motion.svg key="sun" width="22" height="22" viewBox="0 0 24 24" fill="none"
            initial={{ opacity: 0, rotate: 30, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -30, scale: 0.7 }} transition={{ duration: 0.28 }}>
            <circle cx="12" cy="12" r="5" fill="#f59e0b" />
            <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </g>
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface IdeaSectionProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function IdeaSection({ theme, onToggleTheme }: IdeaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hyperspaceOver, setHyperspaceOver] = useState(false);
  const [stage, setStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const subtitleText = "We help startups and businesses turn ambitious ideas into production-ready products.";
  const { displayed, done: typeDone } = useTypewriter(subtitleText, stage >= 2, 14);

  useEffect(() => {
    if (!hyperspaceOver) return;
    const t1 = setTimeout(() => setStage(1), 60);
    const t2 = setTimeout(() => setStage(2), 680);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [hyperspaceOver]);

  useEffect(() => {
    if (!typeDone) return;
    const t = setTimeout(() => setStage(3), 180);
    return () => clearTimeout(t);
  }, [typeDone]);

  useEffect(() => {
    if (stage !== 3) return;
    const t = setTimeout(() => setStage(4), 580);
    return () => clearTimeout(t);
  }, [stage]);

  const handleScrollDown = () => {
    const el = sectionRef.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + el.offsetHeight, behavior: "smooth" });
  };

  const handleStartProject = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const isDark = theme === "dark";
  const serif = "'Georgia','Times New Roman',serif";
  const bgColor = isDark ? "#000000" : "#ffffff";
  const textPrimary = isDark ? "#ffffff" : "#0a0a0a";
  const textSecondary = isDark ? "rgba(255,255,255,0.82)" : "rgba(10,10,10,0.72)";
  const textMuted = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  return (
    <>
      {/*
        ✅ FIX DẢI ĐEN: inject global style trực tiếp vào html/body
        - html, body background match với section để khi iOS overscroll
          không lộ màu nền khác phía sau
        - overscroll-behavior: none ngăn rubber-band scroll
      */}
      <style>{`
        html, body {
          background: ${bgColor} !important;
          overscroll-behavior: none;
          overscroll-behavior-y: none;
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100dvh",
          minHeight: "100dvh",
          background: bgColor,
          transition: "background 0.45s ease",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        {/* Hyperspace intro */}
        <AnimatePresence>
          {!hyperspaceOver && (
            <motion.div
              key="hs"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ position: "absolute", inset: 0, zIndex: 49, background: "#000" }}
            >
              <HyperspaceCanvas onDone={() => setHyperspaceOver(true)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ Background solid layer — luôn ở dưới cùng, không bao giờ transparent */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: bgColor, transition: "background 0.45s ease" }} />

        {/* StarField */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <StarField theme={theme} />
        </div>

        {/* Radial tint */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(90,110,220,0.06) 0%, transparent 70%)"
            : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100,120,200,0.03) 0%, transparent 70%)",
          transition: "background 0.45s ease",
        }} />

        {/* Main content */}
        <div style={{
          position: "relative", zIndex: 20,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", width: "100%", maxWidth: 960,
          paddingInline: isMobile ? "1.25rem" : "2rem",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          boxSizing: "border-box" as const,
        }}>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
            animate={stage >= 1 ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 32, filter: "blur(10px)" }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "opacity, transform, filter" }}
          >
            {(["FROM IDEA", "TO SCALE"] as const).map((line, i) => (
              <h2 key={line} style={{
                fontFamily: serif,
                fontSize: isMobile ? "clamp(3rem,17vw,5.2rem)" : "clamp(3.5rem,8.5vw,8rem)",
                fontWeight: 900, color: textPrimary,
                margin: i === 0 ? 0 : "0.02em 0 0",
                lineHeight: 1.0, letterSpacing: "-0.03em", textTransform: "uppercase",
                textShadow: isDark ? "0 0 60px rgba(255,255,255,0.35)" : "0 1px 4px rgba(0,0,0,0.06)",
                transition: "color 0.45s ease",
              }}>{line}</h2>
            ))}

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={stage >= 1 ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.65, ease: "easeOut" }}
              style={{
                width: 68, height: 1,
                background: isDark
                  ? "linear-gradient(to right, transparent, rgba(170,190,255,0.55), transparent)"
                  : "linear-gradient(to right, transparent, rgba(0,0,0,0.25), transparent)",
                margin: isMobile ? "1.3rem auto 1.1rem" : "1.9rem auto 1.5rem",
                transformOrigin: "center", transition: "background 0.45s ease",
              }}
            />
          </motion.div>

          {/* Subtitle */}
          <div style={{
            minHeight: isMobile ? "3.2rem" : "2.8rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            maxWidth: isMobile ? "340px" : "100%",
          }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: serif,
                fontSize: isMobile ? "clamp(0.9rem,3.8vw,1.05rem)" : "clamp(1rem,1.85vw,1.32rem)",
                fontWeight: 400, color: textSecondary, margin: 0,
                lineHeight: 1.75, letterSpacing: "0.015em",
                whiteSpace: isMobile ? "normal" : "nowrap",
                textAlign: "center", transition: "color 0.45s ease",
              }}
            >
              {displayed}
              {stage >= 2 && !typeDone && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.48, repeatType: "reverse" }}
                  style={{
                    display: "inline-block", width: "2px", height: "1em",
                    background: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                    marginLeft: "3px", verticalAlign: "middle", borderRadius: "1px",
                  }}
                />
              )}
            </motion.p>
          </div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={stage >= 3 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.93, y: 10 }}
            transition={{ type: "spring", stiffness: 115, damping: 18, mass: 0.75 } as any}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStartProject}
            style={{
              marginTop: isMobile ? "1.5rem" : "2rem",
              borderRadius: 9999,
              background: isDark ? "rgba(255,255,255,0.12)" : "rgba(8,8,8,0.88)",
              backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
              border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0,0,0,0.8)",
              boxShadow: isDark
                ? "0 1px 0 rgba(255,255,255,0.3) inset, 0 6px 28px rgba(0,0,0,0.5)"
                : "0 1px 0 rgba(255,255,255,0.12) inset, 0 6px 24px rgba(0,0,0,0.18)",
              padding: isMobile ? "13px 34px" : "15px 44px",
              cursor: "pointer", outline: "none", appearance: "none" as any,
              transition: "background 0.45s ease, border 0.45s ease",
            }}
          >
            <span style={{
              fontFamily: serif,
              fontSize: isMobile ? "clamp(0.92rem,3.8vw,1.1rem)" : "clamp(1rem,1.75vw,1.28rem)",
              fontWeight: 600, color: isDark ? "rgba(255,255,255,0.97)" : "#ffffff",
              letterSpacing: "0.045em", whiteSpace: "nowrap",
              textShadow: isDark ? "0 1px 10px rgba(255,255,255,0.25)" : "0 1px 3px rgba(0,0,0,0.35)",
              transition: "color 0.45s ease",
            }}>Start a Project</span>
          </motion.button>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={stage >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            onClick={handleScrollDown}
            style={{
              marginTop: isMobile ? "1.8rem" : "2.4rem",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "0.5rem", cursor: "pointer", userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span style={{
              fontFamily: serif, fontSize: "0.66rem", letterSpacing: "0.22em",
              textTransform: "uppercase", color: textMuted, fontWeight: 400,
              transition: "color 0.45s ease",
            }}>Scroll down to discover more</span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}
            >
              {[0.4, 0.18].map((opacity, i) => (
                <svg key={i} width="18" height="10" viewBox="0 0 18 10" fill="none">
                  <path d="M1 1L9 9L17 1"
                    stroke={isDark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </section>
    </>
  );
}