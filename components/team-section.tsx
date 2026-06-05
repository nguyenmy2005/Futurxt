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

  const bg           = isDark ? "#000000" : "#ffffff";
  const borderTop    = isDark
    ? "linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)"
    : "linear-gradient(90deg,transparent,rgba(0,0,0,0.10),transparent)";
  const labelColor   = isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.50)";
  const labelDivider = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)";
  const headingColor = isDark ? "#ffffff" : "#0a0a0a";
  const subColor     = isDark ? "rgba(255,255,255,0.78)" : "rgba(10,10,10,0.68)";
  const dividerBg    = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";

  // Card
  const cardBg       = isDark ? "rgba(20,20,26,0.80)" : "#f9fafb";
  const cardBorder   = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";
  const cardBoxShadow = isDark
    ? "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)"
    : "0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.90)";
  const cardTitleColor = isDark ? "#ffffff" : "#0a0a0a";
  const cardDescColor  = isDark ? "rgba(255,255,255,0.70)" : "rgba(10,10,10,0.64)";

  // CTA
  const ctaBg        = isDark ? "rgba(18,18,24,0.90)" : "#f8f9fc";
  const ctaBorder    = isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.11)";
  const ctaBoxShadow = isDark
    ? "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14)"
    : "0 4px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)";
  const ctaLabelColor   = isDark ? "#7DD3C8" : "#0F766E";
  const ctaHeadingColor = isDark ? "#ffffff" : "#0a0a0a";

  const btnAccent      = isDark ? "rgba(168,212,255,0.14)" : "rgba(37,99,235,0.09)";
  const btnBorder      = isDark ? "rgba(168,212,255,0.42)" : "rgba(37,99,235,0.32)";
  const btnColor       = isDark ? "#A8D4FF" : "#1D4ED8";
  const btnShadow      = isDark
    ? "0 4px 20px rgba(168,212,255,0.18), inset 0 1px 0 rgba(255,255,255,0.24)"
    : "0 4px 14px rgba(37,99,235,0.12), inset 0 1px 0 rgba(255,255,255,0.80)";
  const btnHoverShadow = isDark
    ? "0 0 36px rgba(168,212,255,0.36), 0 8px 24px rgba(168,212,255,0.22), inset 0 1px 0 rgba(255,255,255,0.30)"
    : "0 0 28px rgba(37,99,235,0.24), 0 8px 20px rgba(37,99,235,0.16), inset 0 1px 0 rgba(255,255,255,0.90)";

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

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-px" style={{ background: labelDivider }} />
            <span
              className="text-[12px] font-mono tracking-[0.25em] uppercase font-semibold"
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
                fontSize: "clamp(1.9rem,3.4vw,3.0rem)",
                color: headingColor,
                transition: "color 0.4s ease",
              }}
            >
              Building digital products
              <br />
              that move businesses forward
            </h2>
            <p
              className="lg:text-right lg:max-w-[360px] leading-[1.75] m-0 tracking-[-0.005em] lg:flex-shrink-0"
              style={{
                color: subColor,
                fontSize: "clamp(14px,1.2vw,16px)",
                fontWeight: 450,
                transition: "color 0.4s ease",
              }}
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
          className="h-px mb-7"
          style={{ background: dividerBg, transformOrigin: "left" }}
        />

        {/* ── Cards grid ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-7"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              const accent      = isDark ? cap.darkAccent : cap.accentLight;
              const accentSolid = isDark ? cap.darkAccent : cap.accent;

              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  whileHover={{
                    y: -4,
                    boxShadow: isDark
                      ? `0 20px 52px rgba(0,0,0,0.55), 0 0 0 1px ${accent}35, inset 0 1px 0 rgba(255,255,255,0.14)`
                      : `0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.98)`,
                  }}
                  style={{
                    position: "relative",
                    padding: "1.5rem 1.6rem 1.4rem",
                    borderRadius: 20,
                    border: `1px solid ${cardBorder}`,
                    background: cardBg,
                    backdropFilter: "blur(40px) saturate(180%)",
                    WebkitBackdropFilter: "blur(40px) saturate(180%)",
                    cursor: "default",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    overflow: "hidden",
                    boxShadow: cardBoxShadow,
                  }}
                >
                  {/* Top accent line */}
                  <div style={{
                    position: "absolute", top: 0, left: "1.2rem", right: "1.2rem", height: 1,
                    background: `linear-gradient(90deg,transparent,${accent}55,transparent)`,
                  }} />

                  {/* Index */}
                  <span style={{
                    position: "absolute", top: 15, right: 17,
                    fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                    color: `${accentSolid}${isDark ? "80" : "99"}`,
                    letterSpacing: "0.15em",
                  }}>
                    {cap.index}
                  </span>

                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${accent}${isDark ? "38" : "48"}`,
                    background: `${accent}${isDark ? "16" : "1A"}`,
                    marginBottom: 15,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,${isDark ? "0.14" : "0.85"})`,
                  }}>
                    <Icon size={19} color={accentSolid} strokeWidth={1.8} />
                  </div>

                  {/* Title */}
                  <div style={{
                    fontSize: 14.5, fontWeight: 750,
                    color: cardTitleColor,
                    marginBottom: 8,
                    letterSpacing: "-0.02em", lineHeight: 1.28,
                    transition: "color 0.4s ease",
                  }}>
                    {cap.title}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: 13,
                    color: cardDescColor,
                    lineHeight: 1.70,
                    margin: "0 0 15px",
                    fontWeight: 400,
                    transition: "color 0.4s ease",
                  }}>
                    {cap.description}
                  </p>

                  {/* Tech tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {cap.tech.map((t) => (
                      <span key={t} style={{
                        fontSize: 11, fontFamily: "monospace",
                        padding: "4px 10px", borderRadius: 999,
                        border: `1px solid ${accent}${isDark ? "30" : "40"}`,
                        color: `${accentSolid}${isDark ? "DD" : ""}`,
                        background: `${accent}${isDark ? "10" : "15"}`,
                        letterSpacing: "0.02em",
                        fontWeight: isDark ? 500 : 650,
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
        <div className="h-px mb-7" style={{ background: dividerBg }} />

        {/* ── CTA ── */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full lg:w-auto"
            style={{
              padding: "1.7rem 1.8rem",
              borderRadius: 28,
              background: ctaBg,
              backdropFilter: "blur(60px) saturate(200%)",
              WebkitBackdropFilter: "blur(60px) saturate(200%)",
              border: `1px solid ${ctaBorder}`,
              boxShadow: ctaBoxShadow,
              overflow: "hidden",
              transition: "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            {/* Top shimmer line */}
            <div style={{
              position: "absolute", top: 0, left: "2rem", right: "2rem", height: 1,
              background: isDark
                ? "linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)"
                : "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)",
            }} />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-14 gap-5">
              <div>
                <div style={{
                  fontSize: 11, fontFamily: "monospace",
                  color: ctaLabelColor, fontWeight: 600,
                  letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 11,
                  transition: "color 0.4s ease",
                }}>
                  Ready to Shape the Future?
                </div>
                <div
                  className="font-extrabold leading-[1.16] tracking-[-0.03em]"
                  style={{
                    fontSize: "clamp(1.15rem,2.1vw,1.55rem)",
                    color: ctaHeadingColor,
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
                whileHover={{ scale: 1.05, boxShadow: btnHoverShadow }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full lg:w-auto lg:flex-shrink-0"
                style={{
                  padding: "15px 30px", borderRadius: 16,
                  background: btnAccent,
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  border: `1px solid ${btnBorder}`,
                  boxShadow: btnShadow,
                  color: btnColor,
                  fontSize: 15, fontWeight: 700,
                  textDecoration: "none", cursor: "pointer",
                  whiteSpace: "nowrap", letterSpacing: "-0.005em",
                  transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                Get in Touch <MoveUpRight size={15} />
              </motion.a>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}