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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const STAR_COUNT = 500;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * W * 2,
      y: (Math.random() - 0.5) * H * 2,
      z: Math.random() * W,
      pz: 0,
    }));
    stars.forEach((s) => { s.pz = s.z; });

    let animId: number;
    let frame = 0;
    const TOTAL_FRAMES = 30;

    const draw = () => {
      frame++;
      const progress = frame / TOTAL_FRAMES;
      const speed = progress < 0.6
        ? W * 0.09 * (1 - progress * 0.15)
        : W * 0.05 * (1 - progress);

      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, W, H);

      stars.forEach((s) => {
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
        const size = Math.max(0.1, (1 - s.z / W) * 2.8);
        const b = Math.floor((1 - s.z / W) * 255);
        const alpha = Math.min(1, (1 - s.z / W) * 1.6);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${b},${b},${b},${alpha.toFixed(2)})`;
        ctx.lineWidth = size;
        ctx.stroke();
      });

      if (frame < TOTAL_FRAMES) {
        animId = requestAnimationFrame(draw);
      } else {
        let fadeAlpha = 1;
        const fadeOut = () => {
          fadeAlpha -= 0.18;
          ctx.fillStyle = `rgba(0,0,0,0.22)`;
          ctx.fillRect(0, 0, W, H);
          if (fadeAlpha > 0) {
            requestAnimationFrame(fadeOut);
          } else {
            ctx.clearRect(0, 0, W, H);
            onDone();
          }
        };
        fadeOut();
      }
    };

    setTimeout(() => { draw(); }, 60);
    return () => cancelAnimationFrame(animId);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
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

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.35 + 0.18,
      twinkleSpeed: Math.random() * 0.025 + 0.006,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      stars.forEach((s) => {
        const twinkle = s.alpha * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase)));

        if (theme === "dark") {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          grd.addColorStop(0, `rgba(200,220,255,${(twinkle * 0.55).toFixed(3)})`);
          grd.addColorStop(1, `rgba(0,0,0,0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230,240,255,${twinkle.toFixed(3)})`;
          ctx.fill();
        } else {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          grd.addColorStop(0, `rgba(80,90,120,${(twinkle * 0.4).toFixed(3)})`);
          grd.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(60,70,100,${twinkle.toFixed(3)})`;
          ctx.fill();
        }

        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -10) s.x = canvas.width + 10;
        if (s.x > canvas.width + 10) s.x = -10;
        if (s.y < -10) s.y = canvas.height + 10;
        if (s.y > canvas.height + 10) s.y = -10;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
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
      if (i < text.length) {
        setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };
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
      whileTap={{ scale: 0.92 }}
      style={{
        position: "fixed",
        top: "1.1rem", left: "1.1rem",
        zIndex: 100,
        width: 44, height: 44,
        borderRadius: "50%",
        border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(0,0,0,0.14)",
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: isDark
          ? "0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)"
          : "0 2px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 0,
        transition: "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
      }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.svg key="moon" width="20" height="20" viewBox="0 0 24 24" fill="none"
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="rgba(210,225,255,0.9)" stroke="rgba(210,225,255,0.5)" strokeWidth="0.5" />
          </motion.svg>
        ) : (
          <motion.svg key="sun" width="22" height="22" viewBox="0 0 24 24" fill="none"
            initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
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

interface IdeaSectionProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function IdeaSection({ theme, onToggleTheme }: IdeaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hyperspaceOver, setHyperspaceOver] = useState(false);
  const [stage, setStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setVh(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    // ✅ cũng update khi bàn phím ảo đóng/mở trên mobile
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const subtitleText = "We help startups and businesses turn ambitious ideas into production-ready products.";
  const { displayed, done: typeDone } = useTypewriter(subtitleText, stage >= 2, 14);

  useEffect(() => {
    if (!hyperspaceOver) return;
    const t1 = setTimeout(() => setStage(1), 60);
    const t2 = setTimeout(() => setStage(2), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [hyperspaceOver]);

  useEffect(() => {
    if (!typeDone) return;
    const t3 = setTimeout(() => setStage(3), 180);
    return () => clearTimeout(t3);
  }, [typeDone]);

  useEffect(() => {
    if (stage !== 3) return;
    const t4 = setTimeout(() => setStage(4), 600);
    return () => clearTimeout(t4);
  }, [stage]);

  const handleScrollDown = () => {
    const el = sectionRef.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + el.offsetHeight, behavior: "smooth" });
  };

  const handleStartProject = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const serifFont = "'Georgia','Times New Roman',serif";
  const isDark = theme === "dark";
  const bgColor = isDark ? "#000000" : "#ffffff";

  // ✅ height thực tế của viewport, không bị browser bar làm lệch
  const sectionHeight = vh > 0 ? `${vh}px` : "100dvh";

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: bgColor,
        // ✅ dùng cả width lẫn height cố định theo vh thực
        width: "100%",
        minHeight: sectionHeight,
        height: sectionHeight,
        transition: "background 0.5s ease",
        overflow: "hidden",
        // ✅ đảm bảo không có gap nào lọt qua
        marginBottom: 0,
        paddingBottom: 0,
      }}
    >
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />

      <AnimatePresence>
        {!hyperspaceOver && (
          <motion.div
            key="hyperspace"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0,
              zIndex: 49, background: "#000",
              // ✅ cover full section
              width: "100%", height: "100%",
            }}
          >
            <HyperspaceCanvas onDone={() => setHyperspaceOver(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ background layer phủ toàn bộ, không để lộ khoảng trống */}
      <div style={{
        position: "absolute", inset: 0,
        background: bgColor,
        transition: "background 0.5s ease",
        zIndex: 0,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        zIndex: 1,
      }}>
        <StarField theme={theme} />

        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: isDark
            ? "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(80,100,200,0.07) 0%, transparent 70%)"
            : "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(100,120,200,0.05) 0%, transparent 70%)",
          transition: "background 0.5s ease",
        }} />

        <div style={{
          position: "relative", zIndex: 20,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          paddingInline: isMobile ? "1.25rem" : "1.5rem",
          paddingBlock: isMobile ? "2rem" : "0",
          maxWidth: 960, width: "100%",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
            animate={stage >= 1
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 36, filter: "blur(8px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "opacity, transform, filter" }}
          >
            <h2 style={{
              fontFamily: serifFont,
              fontSize: isMobile ? "clamp(2.8rem,16vw,5rem)" : "clamp(3.2rem,8vw,7.5rem)",
              fontWeight: 900,
              color: isDark ? "#ffffff" : "#0a0a0a",
              margin: 0, lineHeight: 1.0,
              letterSpacing: "-0.03em", textTransform: "uppercase",
              textShadow: isDark
                ? "0 0 80px rgba(255,255,255,0.5), 0 0 160px rgba(180,200,255,0.18)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "color 0.5s ease, text-shadow 0.5s ease",
            }}>FROM IDEA</h2>
            <h2 style={{
              fontFamily: serifFont,
              fontSize: isMobile ? "clamp(2.8rem,16vw,5rem)" : "clamp(3.2rem,8vw,7.5rem)",
              fontWeight: 900,
              color: isDark ? "#ffffff" : "#0a0a0a",
              margin: "0.04em 0 0", lineHeight: 1.0,
              letterSpacing: "-0.03em", textTransform: "uppercase",
              textShadow: isDark
                ? "0 0 80px rgba(255,255,255,0.5), 0 0 160px rgba(180,200,255,0.18)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "color 0.5s ease, text-shadow 0.5s ease",
            }}>TO SCALE</h2>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={stage >= 1 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
              style={{
                width: 72, height: 1,
                background: isDark
                  ? "linear-gradient(to right, transparent, rgba(160,185,255,0.5), transparent)"
                  : "linear-gradient(to right, transparent, rgba(0,0,0,0.25), transparent)",
                margin: isMobile ? "1.4rem auto 1.2rem" : "2rem auto 1.6rem",
                transformOrigin: "center",
                transition: "background 0.5s ease",
              }}
            />
          </motion.div>

          <div style={{
            height: isMobile ? "auto" : "2.8rem",
            minHeight: isMobile ? "2.8rem" : undefined,
            marginBottom: isMobile ? "0.5rem" : 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", maxWidth: isMobile ? "320px" : "100%",
          }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                fontFamily: serifFont,
                fontSize: isMobile ? "clamp(0.85rem,3.5vw,1rem)" : "clamp(1rem,1.9vw,1.35rem)",
                fontWeight: 400,
                color: isDark ? "rgba(255,255,255,0.85)" : "rgba(10,10,10,0.72)",
                margin: 0, lineHeight: 1.8, letterSpacing: "0.02em",
                textShadow: isDark ? "0 0 24px rgba(255,255,255,0.2)" : "none",
                whiteSpace: isMobile ? "normal" : "nowrap",
                textAlign: "center", transition: "color 0.5s ease",
              }}
            >
              {displayed}
              {stage >= 2 && !typeDone && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5, ease: "linear", repeatType: "reverse" }}
                  style={{
                    display: "inline-block", width: "2px", height: "1em",
                    background: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)",
                    marginLeft: "3px", verticalAlign: "middle",
                    borderRadius: "1px", transition: "background 0.5s ease",
                  }}
                />
              )}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={stage >= 3 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            // ✅ fix TypeScript error: cast as any
            transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 } as any}
            onClick={handleStartProject}
            style={{
              marginTop: isMobile ? "1.4rem" : "1.8rem",
              willChange: "opacity, transform",
              borderRadius: 9999,
              background: isDark
                ? "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.13) 100%)"
                : "linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.78) 100%)",
              backdropFilter: "blur(40px) saturate(200%) brightness(1.15)",
              WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.15)",
              border: isDark ? "1px solid rgba(255,255,255,0.28)" : "1px solid rgba(0,0,0,0.75)",
              boxShadow: isDark
                ? "0 2px 0 0 rgba(255,255,255,0.35) inset, 0 -1px 0 0 rgba(255,255,255,0.08) inset, 0 8px 32px rgba(0,0,0,0.45)"
                : "0 2px 0 0 rgba(255,255,255,0.1) inset, 0 8px 24px rgba(0,0,0,0.25)",
              padding: isMobile ? "12px 32px" : "14px 40px",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.5s ease, border 0.5s ease, box-shadow 0.5s ease",
            }}
          >
            <p style={{
              fontFamily: serifFont,
              fontSize: isMobile ? "clamp(0.9rem,3.5vw,1.1rem)" : "clamp(0.95rem,1.8vw,1.3rem)",
              fontWeight: 600,
              color: isDark ? "rgba(255,255,255,0.96)" : "#ffffff",
              margin: 0, letterSpacing: "0.04em",
              textShadow: isDark
                ? "0 1px 12px rgba(255,255,255,0.3), 0 0 1px rgba(255,255,255,0.5)"
                : "0 1px 3px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap", transition: "color 0.5s ease",
            }}>Start a Project</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={stage >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onClick={handleScrollDown}
            style={{
              marginTop: isMobile ? "1.6rem" : "2.2rem",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "0.55rem", cursor: "pointer", willChange: "opacity, transform",
              userSelect: "none", WebkitTapHighlightColor: "transparent",
            }}
          >
            <span style={{
              fontFamily: serifFont, fontSize: "0.68rem", letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.35)",
              fontWeight: 400, whiteSpace: "nowrap", transition: "color 0.5s ease",
            }}>Scroll down to discover more</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}
            >
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M1 1L9 9L17 1"
                  stroke={isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)"}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M1 1L9 9L17 1"
                  stroke={isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.16)"}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}