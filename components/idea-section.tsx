"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    const STAR_COUNT = 600;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * W * 2,
      y: (Math.random() - 0.5) * H * 2,
      z: Math.random() * W,
      pz: 0,
    }));
    stars.forEach((s) => { s.pz = s.z; });

    let animId: number;
    let frame = 0;
    const TOTAL_FRAMES = 55;

    const draw = () => {
      frame++;
      const progress = frame / TOTAL_FRAMES;
      const speed = progress < 0.6
        ? W * 0.07 * (1 - progress * 0.2)
        : W * 0.04 * (1 - progress);

      ctx.fillStyle = "rgba(0,0,0,0.25)";
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
        const size = Math.max(0.1, (1 - s.z / W) * 2.5);
        const brightness = Math.floor((1 - s.z / W) * 255);
        const alpha = Math.min(1, (1 - s.z / W) * 1.5);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${brightness},${Math.floor(brightness * 0.92)},255,${alpha.toFixed(2)})`;
        ctx.lineWidth = size;
        ctx.stroke();
      });

      if (frame < TOTAL_FRAMES) {
        animId = requestAnimationFrame(draw);
      } else {
        let fadeAlpha = 1;
        const fadeOut = () => {
          fadeAlpha -= 0.12;
          ctx.fillStyle = `rgba(0,0,0,0.18)`;
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

    setTimeout(() => { draw(); }, 80);
    return () => cancelAnimationFrame(animId);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.18 + 0.06,
      twinkleSpeed: Math.random() * 0.03 + 0.008,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;
      stars.forEach((s) => {
        const twinkle = s.alpha * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase)));
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        grd.addColorStop(0, `rgba(210,225,255,${(twinkle * 0.5).toFixed(3)})`);
        grd.addColorStop(1, `rgba(180,210,255,0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,240,255,${twinkle.toFixed(3)})`;
        ctx.fill();
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
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

export function IdeaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hyperspaceOver, setHyperspaceOver] = useState(false);
  const [stage, setStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile để wrap subtitle
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
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
    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    } else {
      const el = sectionRef.current;
      if (!el) return;
      window.scrollTo({ top: el.offsetTop + el.offsetHeight, behavior: "smooth" });
    }
  };

  const handleStartProject = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const serifFont = "'Georgia','Times New Roman',serif";
  const smoothSpring = { type: "spring", stiffness: 120, damping: 20, mass: 0.8 };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#000000",
        // Mobile: min-h thay vì h cứng
        minHeight: "100svh",
        height: "100svh",
      }}
    >
      <AnimatePresence>
        {!hyperspaceOver && (
          <motion.div
            key="hyperspace"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ position: "fixed", inset: 0, zIndex: 49, background: "#000" }}
          >
            <HyperspaceCanvas onDone={() => setHyperspaceOver(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        position: "sticky",
        top: 0,
        height: "100svh",   // ← svh thay vì vh, tránh bị thanh URL mobile che
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
      }}>
        <StarField />

        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(80,100,200,0.07) 0%, transparent 70%)",
        }} />

        <div style={{
          position: "relative", zIndex: 20,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          // Mobile: padding trái phải nhiều hơn
          paddingInline: isMobile ? "1.25rem" : "1.5rem",
          paddingBlock: isMobile ? "2rem" : "0",
          maxWidth: 960, width: "100%",
        }}>

          {/* FROM IDEA TO SCALE */}
          <motion.div
            initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
            animate={stage >= 1
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 36, filter: "blur(8px)" }
            }
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "opacity, transform, filter" }}
          >
            <h2 style={{
              fontFamily: serifFont,
              // Mobile: nhỏ hơn để vừa màn
              fontSize: isMobile ? "clamp(2.8rem,16vw,5rem)" : "clamp(3.2rem,8vw,7.5rem)",
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              textShadow: "0 0 80px rgba(255,255,255,0.5), 0 0 160px rgba(180,200,255,0.18)",
            }}>
              FROM IDEA
            </h2>
            <h2 style={{
              fontFamily: serifFont,
              fontSize: isMobile ? "clamp(2.8rem,16vw,5rem)" : "clamp(3.2rem,8vw,7.5rem)",
              fontWeight: 900,
              color: "#ffffff",
              margin: "0.04em 0 0",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              textShadow: "0 0 80px rgba(255,255,255,0.5), 0 0 160px rgba(180,200,255,0.18)",
            }}>
              TO SCALE
            </h2>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={stage >= 1 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
              style={{
                width: 72, height: 1,
                background: "linear-gradient(to right, transparent, rgba(160,185,255,0.5), transparent)",
                margin: isMobile ? "1.4rem auto 1.2rem" : "2rem auto 1.6rem",
                transformOrigin: "center",
              }}
            />
          </motion.div>

          {/* Subtitle — wrap trên mobile, nowrap trên desktop */}
          <div style={{
            // Mobile: height auto để text wrap xuống dòng
            height: isMobile ? "auto" : "2.8rem",
            minHeight: isMobile ? "2.8rem" : undefined,
            marginBottom: isMobile ? "0.5rem" : 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            // Giới hạn width trên mobile
            maxWidth: isMobile ? "320px" : "100%",
          }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                fontFamily: serifFont,
                fontSize: isMobile ? "clamp(0.85rem,3.5vw,1rem)" : "clamp(1rem,1.9vw,1.35rem)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.85)",
                margin: 0,
                lineHeight: 1.8,
                letterSpacing: "0.02em",
                textShadow: "0 0 24px rgba(255,255,255,0.2)",
                // Mobile: wrap, Desktop: nowrap
                whiteSpace: isMobile ? "normal" : "nowrap",
                textAlign: "center",
              }}
            >
              {displayed}
              {stage >= 2 && !typeDone && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5, ease: "linear", repeatType: "reverse" }}
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "1em",
                    background: "rgba(255,255,255,0.65)",
                    marginLeft: "3px",
                    verticalAlign: "middle",
                    borderRadius: "1px",
                  }}
                />
              )}
            </motion.p>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={stage >= 3 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            transition={smoothSpring}
            onClick={handleStartProject}
            style={{
              marginTop: isMobile ? "1.4rem" : "1.8rem",
              willChange: "opacity, transform",
              borderRadius: 9999,
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.13) 100%)",
              backdropFilter: "blur(40px) saturate(200%) brightness(1.15)",
              WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.15)",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow: [
                "0 2px 0 0 rgba(255,255,255,0.35) inset",
                "0 -1px 0 0 rgba(255,255,255,0.08) inset",
                "0 8px 32px rgba(0,0,0,0.45)",
                "0 1px 0 rgba(255,255,255,0.12)",
                "0 0 0 0.5px rgba(255,255,255,0.10)",
              ].join(", "),
              // Mobile: padding nhỏ hơn
              padding: isMobile ? "12px 32px" : "14px 40px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <p style={{
              fontFamily: serifFont,
              fontSize: isMobile ? "clamp(0.9rem,3.5vw,1.1rem)" : "clamp(0.95rem,1.8vw,1.3rem)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.96)",
              margin: 0,
              letterSpacing: "0.04em",
              textShadow: "0 1px 12px rgba(255,255,255,0.3), 0 0 1px rgba(255,255,255,0.5)",
              whiteSpace: "nowrap",
            }}>
              Start a Project
            </p>
          </motion.div>

          {/* Scroll down */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={stage >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onClick={handleScrollDown}
            style={{
              marginTop: isMobile ? "1.6rem" : "2.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.55rem",
              cursor: "pointer",
              willChange: "opacity, transform",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span style={{
              fontFamily: serifFont,
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)",
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}>
              Scroll down to discover more
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}
            >
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M1 1L9 9L17 1" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M1 1L9 9L17 1" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}