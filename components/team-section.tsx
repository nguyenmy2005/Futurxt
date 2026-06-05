"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "next-themes";
import { Globe, Brain, Server, Pen, MoveUpRight } from "lucide-react";

const capabilities = [
  {
    icon: Globe,
    title: "Website Design & Development",
    description: "Designing and developing premium websites that elevate brands, engage audiences, and drive measurable business growth.",
    tech: ["Corporate Websites", "Landing Pages", "CMS Solutions", "E-Commerce Platforms"],
    index: "01",
    accent: "#2563EB",
    accentLight: "#3B82F6",
    darkAccent: "#A8D4FF",
  },
  {
    icon: Pen,
    title: "Digital Experience Design",
    description: "Creating modern digital experiences that enhance usability, strengthen brand presence, and accelerate business growth.",
    tech: ["UX Strategy", "Wireframing", "Prototyping", "Design Systems"],
    index: "02",
    accent: "#7C3AED",
    accentLight: "#8B5CF6",
    darkAccent: "#D4AAFF",
  },
  {
    icon: Server,
    title: "Custom Web Applications",
    description: "Creating scalable digital platforms that automate workflows, connect systems, and support evolving business needs.",
    tech: ["Client Portals", "Business Systems", "Workflow Automation", "API Integrations"],
    index: "03",
    accent: "#0F766E",
    accentLight: "#14B8A6",
    darkAccent: "#7DD3C8",
  },
  {
    icon: Brain,
    title: "AI Integration & Automation",
    description: "Building intelligent systems that automate repetitive tasks, improve decision-making, and deliver better customer experiences at scale.",
    tech: ["AI Chatbots", "Intelligent Automation", "Workflow Automation", "Custom AI Tools"],
    index: "04",
    accent: "#B45309",
    accentLight: "#F59E0B",
    darkAccent: "#FFD580",
  },
];

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // ── Theme tokens ──
  const bg              = isDark ? "#000000" : "#ffffff";
  const borderTop       = isDark
    ? "linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)"
    : "linear-gradient(90deg,transparent,rgba(0,0,0,0.10),transparent)";
  const labelColor      = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
  const labelDivider    = isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.30)";
  const headingColor    = isDark ? "#ffffff" : "#0a0a0a";
  const headingShadow   = isDark
    ? "0 0 40px rgba(255,255,255,0.25)"
    : "0 2px 8px rgba(0,0,0,0.06)";
  const subColor        = isDark ? "rgba(255,255,255,0.72)" : "rgba(10,10,10,0.62)";
  const dividerBg       = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  // Card tokens
  const cardBg          = isDark ? "rgba(22,22,28,0.65)" : "rgba(248,249,252,0.90)";
  const cardBorder      = isDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.10)";
  const cardInsetTop    = isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.85)";
  const cardInsetSide   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)";
  const cardTitleColor  = isDark ? "#ffffff" : "#0a0a0a";
  const cardDescColor   = isDark ? "rgba(255,255,255,0.62)" : "rgba(10,10,10,0.58)";
  const cardBoxShadow   = isDark
    ? [
        "0 10px 40px rgba(0,0,0,0.50)",
        `inset 0 1.5px 0 ${cardInsetTop}`,
        "inset 0 -1px 0 rgba(255,255,255,0.05)",
        `inset 1px 0 0 ${cardInsetSide}`,
        `inset -1px 0 0 ${cardInsetSide}`,
      ].join(",")
    : [
        "0 4px 24px rgba(0,0,0,0.07)",
        "0 1px 4px rgba(0,0,0,0.04)",
        `inset 0 1.5px 0 ${cardInsetTop}`,
        "inset 0 -1px 0 rgba(0,0,0,0.04)",
        `inset 1px 0 0 ${cardInsetSide}`,
        `inset -1px 0 0 ${cardInsetSide}`,
      ].join(",");

  // CTA bar tokens
  const ctaBg           = isDark ? "rgba(24,24,30,0.80)" : "rgba(248,249,252,0.95)";
  const ctaBorder       = isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.12)";
  const ctaTopLine      = isDark ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.90)";
  const ctaBoxShadow    = isDark
    ? [
        "0 40px 100px rgba(0,0,0,0.65)",
        "0 8px 32px rgba(0,0,0,0.45)",
        "inset 0 2px 0 rgba(255,255,255,0.24)",
        "inset 0 -1px 0 rgba(255,255,255,0.07)",
        "inset 1px 0 0 rgba(255,255,255,0.09)",
        "inset -1px 0 0 rgba(255,255,255,0.09)",
      ].join(",")
    : [
        "0 8px 40px rgba(0,0,0,0.08)",
        "0 2px 12px rgba(0,0,0,0.05)",
        "inset 0 2px 0 rgba(255,255,255,0.90)",
        "inset 0 -1px 0 rgba(0,0,0,0.05)",
        "inset 1px 0 0 rgba(255,255,255,0.60)",
        "inset -1px 0 0 rgba(255,255,255,0.60)",
      ].join(",");
  const ctaLabelColor   = isDark ? "#7DD3C8" : "#0F766E";
  const ctaHeadingColor = isDark ? "#ffffff" : "#0a0a0a";
  const ctaHeadingShadow= isDark ? "0 2px 16px rgba(255,255,255,0.15)" : "0 1px 6px rgba(0,0,0,0.06)";
  const ctaGlow1        = isDark
    ? "radial-gradient(ellipse 65% 80% at 20% 50%, rgba(168,212,255,0.09) 0%, transparent 65%)"
    : "radial-gradient(ellipse 65% 80% at 20% 50%, rgba(37,99,235,0.05) 0%, transparent 65%)";
  const ctaGlow2        = isDark
    ? "radial-gradient(ellipse 55% 70% at 85% 50%, rgba(125,211,200,0.07) 0%, transparent 65%)"
    : "radial-gradient(ellipse 55% 70% at 85% 50%, rgba(15,118,110,0.04) 0%, transparent 65%)";

  // CTA button tokens
  const btnAccent       = isDark ? "rgba(168,212,255,0.16)" : "rgba(37,99,235,0.10)";
  const btnBorder       = isDark ? "rgba(168,212,255,0.45)" : "rgba(37,99,235,0.35)";
  const btnShadow       = isDark
    ? [
        "0 6px 24px rgba(168,212,255,0.20)",
        "inset 0 1.5px 0 rgba(255,255,255,0.30)",
        "inset 0 -1px 0 rgba(168,212,255,0.14)",
      ].join(",")
    : [
        "0 4px 16px rgba(37,99,235,0.14)",
        "inset 0 1.5px 0 rgba(255,255,255,0.80)",
        "inset 0 -1px 0 rgba(37,99,235,0.10)",
      ].join(",");
  const btnColor        = isDark ? "#A8D4FF" : "#1D4ED8";
  const btnHoverShadow  = isDark
    ? [
        "0 0 40px rgba(168,212,255,0.40)",
        "0 8px 24px rgba(168,212,255,0.25)",
        "inset 0 1.5px 0 rgba(255,255,255,0.36)",
        "inset 0 -1px 0 rgba(168,212,255,0.18)",
      ].join(",")
    : [
        "0 0 32px rgba(37,99,235,0.28)",
        "0 8px 24px rgba(37,99,235,0.18)",
        "inset 0 1.5px 0 rgba(255,255,255,0.85)",
        "inset 0 -1px 0 rgba(37,99,235,0.12)",
      ].join(",");

  const scrollColor     = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.40)";

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative w-full flex flex-col justify-center overflow-hidden min-h-screen"
      style={{ background: bg, transition: "background 0.4s ease" }}
    >
      {/* Top rule */}
      <div
        className="absolute top-0 left-[8%] right-[8%] h-px"
        style={{ background: borderTop }}
      />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-8 py-16 sm:py-20 lg:py-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-px" style={{ background: labelDivider }} />
            <span
              className="text-[11px] font-mono tracking-[0.25em] uppercase"
              style={{ color: labelColor }}
            >
              Services
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 lg:gap-8">
            <h2
              className="font-black leading-[1.08] tracking-[-0.03em] m-0"
              style={{
                fontFamily: "'Georgia','Times New Roman',serif",
                fontSize: "clamp(1.7rem,3.2vw,2.8rem)",
                color: headingColor,
                textShadow: headingShadow,
                transition: "color 0.4s ease, text-shadow 0.4s ease",
              }}
            >
              Building digital products
              <br />
              that move businesses forward
            </h2>
            <p
              className="text-sm lg:text-right lg:max-w-[340px] leading-[1.7] m-0 font-medium tracking-[-0.005em] lg:flex-shrink-0"
              style={{ color: subColor, transition: "color 0.4s ease" }}
            >
              From strategy and design to development and AI integration, we
              help businesses build modern digital experiences.
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-px mb-6"
          style={{ background: dividerBg, transformOrigin: "left" }}
        />

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              const accent = isDark ? cap.darkAccent : cap.accentLight;
              const accentSolid = isDark ? cap.darkAccent : cap.accent;

              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  whileHover={{
                    y: -4,
                    borderColor: `${accent}55`,
                    background: isDark ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.98)",
                    boxShadow: isDark
                      ? `0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px ${accent}30, inset 0 1px 0 rgba(255,255,255,0.18)`
                      : `0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.95)`,
                  }}
                  style={{
                    position: "relative",
                    padding: "1.4rem 1.5rem 1.3rem",
                    borderRadius: 20,
                    border: `1px solid ${cardBorder}`,
                    background: cardBg,
                    backdropFilter: "blur(48px) saturate(200%) brightness(1.10)",
                    WebkitBackdropFilter: "blur(48px) saturate(200%) brightness(1.10)",
                    cursor: "default",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    overflow: "hidden",
                    boxShadow: cardBoxShadow,
                  }}
                >
                  {/* Top accent line */}
                  <div style={{
                    position: "absolute", top: 0, left: "1.2rem", right: "1.2rem", height: 1,
                    background: `linear-gradient(90deg,transparent,${accent}60,transparent)`,
                  }} />
                  {/* Glow */}
                  <div style={{
                    position: "absolute", top: "-30%", right: "-20%",
                    width: "70%", height: "70%", borderRadius: "50%",
                    background: `radial-gradient(circle, ${accent}${isDark ? "12" : "18"} 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                  {/* Index */}
                  <span style={{
                    position: "absolute", top: 14, right: 16,
                    fontSize: 10, fontFamily: "monospace",
                    color: `${accentSolid}${isDark ? "70" : "90"}`,
                    letterSpacing: "0.15em",
                  }}>
                    {cap.index}
                  </span>
                  {/* Icon */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${accent}${isDark ? "35" : "45"}`,
                    background: `${accent}${isDark ? "14" : "18"}`,
                    marginBottom: 14,
                    boxShadow: `0 0 20px ${accent}${isDark ? "22" : "30"}, inset 0 1px 0 rgba(255,255,255,${isDark ? "0.15" : "0.80"})`,
                  }}>
                    <Icon size={18} color={accentSolid} />
                  </div>
                  <div style={{
                    fontSize: 13.5, fontWeight: 700,
                    color: cardTitleColor,
                    marginBottom: 7, letterSpacing: "-0.015em", lineHeight: 1.3,
                    transition: "color 0.4s ease",
                  }}>
                    {cap.title}
                  </div>
                  <p style={{
                    fontSize: 12,
                    color: cardDescColor,
                    lineHeight: 1.65, margin: "0 0 14px",
                    transition: "color 0.4s ease",
                  }}>
                    {cap.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {cap.tech.map((t) => (
                      <span key={t} style={{
                        fontSize: 10, fontFamily: "monospace",
                        padding: "3px 9px", borderRadius: 999,
                        border: `1px solid ${accent}${isDark ? "28" : "38"}`,
                        color: `${accentSolid}${isDark ? "CC" : ""}`,
                        background: `${accent}${isDark ? "0F" : "14"}`,
                        letterSpacing: "0.02em",
                        fontWeight: isDark ? 400 : 600,
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background: dividerBg }} />

        {/* CTA */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full lg:w-auto"
            style={{
              padding: "1.6rem 1.6rem",
              borderRadius: 28,
              background: ctaBg,
              backdropFilter: "blur(72px) saturate(220%) brightness(1.12)",
              WebkitBackdropFilter: "blur(72px) saturate(220%) brightness(1.12)",
              border: `1px solid ${ctaBorder}`,
              boxShadow: ctaBoxShadow,
              overflow: "hidden",
              transition: "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            {/* Glow overlays */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: [ctaGlow1, ctaGlow2].join(","),
            }} />
            <div style={{
              position: "absolute", top: 0, left: "2rem", right: "2rem", height: 1,
              background: `linear-gradient(90deg,transparent,${ctaTopLine},transparent)`,
            }} />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-14 gap-5">
              <div>
                <div style={{
                  fontSize: 10, fontFamily: "monospace",
                  color: ctaLabelColor,
                  letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 10,
                  transition: "color 0.4s ease",
                }}>
                  Ready to Shape the Future?
                </div>
                <div
                  className="font-extrabold leading-[1.12] tracking-[-0.03em]"
                  style={{
                    fontSize: "clamp(1.1rem,2vw,1.45rem)",
                    color: ctaHeadingColor,
                    textShadow: ctaHeadingShadow,
                    transition: "color 0.4s ease",
                  }}
                >
                  Whether it's a website, web application, or AI solution
                  <br className="hidden sm:block" />
                  {" "}we're here to bring your vision to life.
                </div>
              </div>

              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{
                  scale: 1.06,
                  boxShadow: btnHoverShadow,
                }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full lg:w-auto lg:flex-shrink-0"
                style={{
                  padding: "15px 28px", borderRadius: 16,
                  background: btnAccent,
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  border: `1px solid ${btnBorder}`,
                  boxShadow: btnShadow,
                  color: btnColor,
                  fontSize: 14, fontWeight: 700,
                  textDecoration: "none", cursor: "pointer",
                  whiteSpace: "nowrap", letterSpacing: "-0.005em",
                  transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                Get in Touch <MoveUpRight size={14} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Keep Scrolling */}
        <div className="flex justify-center mt-4">
          <motion.button
            onClick={() => document.getElementById("service-0")?.scrollIntoView({ behavior: "smooth" })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 0, background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            <motion.span
              animate={{ opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontSize: 11, fontWeight: 500, letterSpacing: "0.38em",
                color: scrollColor,
                textTransform: "uppercase",
                fontFamily: "'Georgia', serif", whiteSpace: "nowrap",
                transition: "color 0.4s ease",
              }}
            >
              Keep Scrolling
            </motion.span>
          </motion.button>
        </div>

      </div>
    </section>
  );
}