"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MessageSquare, Pencil, Code2, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Initial Consultation",
    description: "We start with a real conversation about your product, goals, and timeline — then build a solution that fits exactly what you need.",
    icon: MessageSquare,
    color: "cyan",
    tag: "INPUT",
  },
  {
    step: "02",
    title: "Design & Planning",
    description: "We map out the architecture, user flows, and UI before writing a single line of code. You approve before we build.",
    icon: Pencil,
    color: "purple",
    tag: "PROCESS",
  },
  {
    step: "03",
    title: "Development",
    description: "Iterative builds with regular check-ins. You see progress weekly — no black box, no surprises at the end.",
    icon: Code2,
    color: "cyan",
    tag: "BUILD",
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "We handle deployment, testing, and commissioning. Post-launch support included so you never fend for yourself.",
    icon: Rocket,
    color: "purple",
    tag: "OUTPUT",
  },
];

export function HowWeWorkSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Tokens ──
  const sectionBg     = isDark ? "#000000" : "#ffffff";
  const topRule       = isDark
    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)"
    : "linear-gradient(90deg, transparent, rgba(0,0,0,0.10), transparent)";
  const glow1         = isDark ? "rgba(139,92,246,0.05)" : "rgba(139,92,246,0.04)";
  const glow2         = isDark ? "rgba(34,211,238,0.04)"  : "rgba(14,165,233,0.03)";
  const labelColor    = isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.42)";
  const dividerColor  = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.20)";
  const headingColor  = isDark ? "#ffffff" : "#0a0a0a";
  const headingShadow = isDark ? "0 0 40px rgba(255,255,255,0.35), 0 0 80px rgba(255,255,255,0.15)" : "none";
  const subColor      = isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.60)";
  const subShadow     = isDark ? "0 0 20px rgba(255,255,255,0.20)" : "none";
  const cardBg        = isDark ? "rgba(8,8,18,0.65)"      : "rgba(248,249,252,0.90)";
  const cardBorder    = isDark ? "rgba(255,255,255,0.07)"  : "rgba(0,0,0,0.09)";
  const cardShadow    = isDark ? "0 8px 32px rgba(0,0,0,0.30)" : "0 4px 20px rgba(0,0,0,0.06)";
  const titleColor    = isDark ? "rgba(255,255,255,0.95)"  : "#0a0a0a";
  const bodyColor     = isDark ? "rgba(255,255,255,0.48)"  : "rgba(0,0,0,0.52)";
  const stepNumColor  = isDark ? "rgba(255,255,255,0.15)"  : "rgba(0,0,0,0.20)";

  const getAccents = (color: string) => {
    if (color === "cyan") {
      return {
        accentColor:  isDark ? "#67e8f9" : "#0E7490",
        accentBg:     isDark ? "rgba(103,232,249,0.07)" : "rgba(14,116,144,0.08)",
        accentBorder: isDark ? "rgba(103,232,249,0.20)" : "rgba(14,116,144,0.22)",
      };
    }
    return {
      accentColor:  isDark ? "#c4b5fd" : "#6D28D9",
      accentBg:     isDark ? "rgba(196,181,253,0.07)" : "rgba(109,40,217,0.07)",
      accentBorder: isDark ? "rgba(196,181,253,0.20)" : "rgba(109,40,217,0.20)",
    };
  };

  return (
    <section
      id="how-we-work"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: sectionBg,
        padding: isMobile ? "60px 0 80px" : "1.5rem 0",
        transition: "background 0.4s ease",
      }}
    >
      {/* Background glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "50%", left: 0,
          width: 700, height: 700, borderRadius: "50%",
          filter: "blur(180px)", transform: "translateY(-50%)",
          background: glow1,
        }} />
        <div style={{
          position: "absolute", top: "50%", right: 0,
          width: 600, height: 600, borderRadius: "50%",
          filter: "blur(160px)", transform: "translateY(-50%)",
          background: glow2,
        }} />
      </div>

      {/* Top rule */}
      <div style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
        background: topRule,
      }} />

      <div
        ref={ref}
        style={{
          position: "relative", zIndex: 10,
          maxWidth: 900, margin: "0 auto",
          padding: isMobile ? "0 20px" : "0 2rem",
          width: "100%",
          boxSizing: "border-box",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: isMobile ? "2rem" : "1.2rem", width: "100%" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: dividerColor }} />
            <span style={{
              fontSize: 10, fontFamily: "monospace",
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: labelColor,
            }}>
              Our Process
            </span>
            <div style={{ width: 32, height: 1, background: dividerColor }} />
          </div>

          <h2 style={{
            fontFamily: "'Georgia','Times New Roman',serif",
            fontSize: isMobile ? "clamp(2rem,8vw,2.8rem)" : "clamp(2.8rem,5vw,4.2rem)",
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: "-0.035em",
            color: headingColor,
            margin: "0 0 16px",
            textShadow: headingShadow,
            transition: "color 0.4s ease",
          }}>
            How we work
          </h2>

          <p style={{
            fontSize: isMobile ? 14 : 15,
            maxWidth: 400, margin: "0 auto",
            lineHeight: 1.75,
            color: subColor,
            textShadow: subShadow,
            transition: "color 0.4s ease",
          }}>
            A transparent, structured workflow — from first call to final deployment.
          </p>
        </motion.div>

        {/* Desktop: 2-col grid */}
        {!isMobile && (
          <div style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 14,
          }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const { accentColor, accentBg, accentBorder } = getAccents(step.color);
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.1 + index * 0.1 }}
                  style={{
                    borderRadius: 20,
                    background: cardBg,
                    backdropFilter: isDark ? "blur(30px) saturate(160%)" : "none",
                    WebkitBackdropFilter: isDark ? "blur(30px) saturate(160%)" : "none",
                    border: `1px solid ${cardBorder}`,
                    padding: "28px 28px",
                    boxShadow: cardShadow,
                    transition: "background 0.4s ease, border 0.4s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: accentBg, border: `1px solid ${accentBorder}`, flexShrink: 0,
                    }}>
                      <Icon style={{ width: 20, height: 20, color: accentColor }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 10, fontFamily: "monospace", letterSpacing: "0.18em",
                        padding: "4px 10px", borderRadius: 999,
                        border: `1px solid ${accentBorder}`,
                        color: accentColor, background: accentBg,
                      }}>
                        {step.tag}
                      </span>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: stepNumColor }}>
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <h3 style={{
                    fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em",
                    color: titleColor, marginBottom: 12,
                    transition: "color 0.4s ease",
                  }}>
                    {step.title}
                  </h3>
                  <div style={{
                    height: 1, marginBottom: 14,
                    background: `linear-gradient(90deg, ${accentBorder}, transparent)`,
                  }} />
                  <p style={{
                    fontSize: 13.5, lineHeight: 1.80,
                    color: bodyColor, margin: 0,
                    transition: "color 0.4s ease",
                  }}>
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Mobile: timeline */}
        {isMobile && (
          <div style={{ width: "100%", position: "relative" }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const { accentColor, accentBg, accentBorder } = getAccents(step.color);
              const isLast = index === steps.length - 1;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.1 + index * 0.12 }}
                  style={{ display: "flex", gap: 16, position: "relative", paddingBottom: isLast ? 0 : 20 }}
                >
                  <div style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", flexShrink: 0, width: 44,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: accentBg,
                      border: `1.5px solid ${accentBorder}`,
                      boxShadow: `0 0 20px ${accentColor}22`,
                      flexShrink: 0, zIndex: 1,
                    }}>
                      <Icon style={{ width: 18, height: 18, color: accentColor }} />
                    </div>
                    {!isLast && (
                      <div style={{
                        width: 1.5, flex: 1, marginTop: 6,
                        background: `linear-gradient(180deg, ${accentColor}40, ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"})`,
                        minHeight: 40,
                      }} />
                    )}
                  </div>

                  <div style={{
                    flex: 1, borderRadius: 16,
                    background: cardBg,
                    backdropFilter: isDark ? "blur(30px) saturate(160%)" : "none",
                    WebkitBackdropFilter: isDark ? "blur(30px) saturate(160%)" : "none",
                    border: `1px solid ${cardBorder}`,
                    padding: "16px 18px",
                    boxShadow: cardShadow,
                    marginBottom: isLast ? 0 : 4,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: "1rem", right: "1rem", height: 1,
                      background: `linear-gradient(90deg, transparent, ${accentColor}35, transparent)`,
                    }} />
                    <div style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", marginBottom: 10,
                    }}>
                      <span style={{
                        fontSize: 9, fontFamily: "monospace", letterSpacing: "0.18em",
                        padding: "3px 9px", borderRadius: 999,
                        border: `1px solid ${accentBorder}`,
                        color: accentColor, background: accentBg,
                      }}>
                        {step.tag}
                      </span>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: stepNumColor }}>
                        {step.step}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em",
                      color: titleColor, marginBottom: 8, transition: "color 0.4s ease",
                    }}>
                      {step.title}
                    </h3>
                    <div style={{
                      height: 1, marginBottom: 10,
                      background: `linear-gradient(90deg, ${accentBorder}, transparent)`,
                    }} />
                    <p style={{
                      fontSize: 13, lineHeight: 1.78,
                      color: bodyColor, margin: 0, transition: "color 0.4s ease",
                    }}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}