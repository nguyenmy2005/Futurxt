"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Globe, Brain, Server, Pen, MoveUpRight } from "lucide-react";

const capabilities = [
  {
    icon: Globe,
    title: "Website Design & Development",
    description: "Designing and developing premium websites that elevate brands, engage audiences, and drive measurable business growth.",
    tech: ["Corporate Websites", "Landing Pages", "CMS Solutions", "E-Commerce Platforms"],
    index: "01",
    accent: "#A8D4FF",
  },
  {
    icon: Pen,
    title: "Digital Experience Design",
    description: "Creating modern digital experiences that enhance usability, strengthen brand presence, and accelerate business growth.",
    tech: ["UX Strategy", "Wireframing", "Prototyping", "Design Systems"],
    index: "02",
    accent: "#D4AAFF",
  },
  {
    icon: Server,
    title: "Custom Web Applications",
    description: "Creating scalable digital platforms that automate workflows, connect systems, and support evolving business needs.",
    tech: ["Client Portals", "Business Systems", "Workflow Automation", "API Integrations"],
    index: "03",
    accent: "#7DD3C8",
  },
  {
    icon: Brain,
    title: "AI Integration & Automation",
    description: "Building intelligent systems that automate repetitive tasks, improve decision-making, and deliver better customer experiences at scale.",
    tech: ["AI Chatbots", "Intelligent Automation", "Workflow Automation", "Custom AI Tools"],
    index: "04",
    accent: "#FFD580",
  },
];

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative w-full flex flex-col justify-center bg-black overflow-hidden min-h-screen"
    >
      {/* Top rule */}
      <div className="absolute top-0 left-[8%] right-[8%] h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)" }}
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
            <div className="w-9 h-px bg-white/50" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-white/60 uppercase">
              Services
            </span>
          </div>

          {/* Desktop: side by side / Mobile: stacked */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 lg:gap-8">
            <h2
              className="font-black leading-[1.08] tracking-[-0.03em] text-white m-0"
              style={{
                fontFamily: "'Georgia','Times New Roman',serif",
                fontSize: "clamp(1.7rem,3.2vw,2.8rem)",
                textShadow: "0 0 40px rgba(255,255,255,0.25)",
              }}
            >
              Building digital products
              <br />
              that move businesses forward
            </h2>
            <p className="text-sm text-white lg:text-right lg:max-w-[340px] leading-[1.7] m-0 font-medium tracking-[-0.005em] text-white/80 lg:flex-shrink-0"
              style={{ textShadow: "0 1px 12px rgba(255,255,255,0.18)" }}
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
          style={{ background: "rgba(255,255,255,0.08)", transformOrigin: "left" }}
        />

        {/* Grid — desktop 4 cols / mobile 1 col / sm 2 cols */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  whileHover={{
                    y: -4,
                    borderColor: `${cap.accent}45`,
                    background: "rgba(255,255,255,0.055)",
                    boxShadow: `0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px ${cap.accent}30, inset 0 1px 0 rgba(255,255,255,0.18)`,
                  }}
                  style={{
                    position: "relative",
                    padding: "1.4rem 1.5rem 1.3rem",
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.13)",
                    background: "rgba(22,22,28,0.65)",
                    backdropFilter: "blur(48px) saturate(200%) brightness(1.10)",
                    WebkitBackdropFilter: "blur(48px) saturate(200%) brightness(1.10)",
                    cursor: "default",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    overflow: "hidden",
                    boxShadow: [
                      "0 10px 40px rgba(0,0,0,0.50)",
                      "inset 0 1.5px 0 rgba(255,255,255,0.16)",
                      "inset 0 -1px 0 rgba(255,255,255,0.05)",
                      "inset 1px 0 0 rgba(255,255,255,0.07)",
                      "inset -1px 0 0 rgba(255,255,255,0.07)",
                    ].join(","),
                  }}
                >
                  {/* Top accent line */}
                  <div style={{
                    position: "absolute", top: 0, left: "1.2rem", right: "1.2rem", height: 1,
                    background: `linear-gradient(90deg,transparent,${cap.accent}55,transparent)`,
                  }} />
                  {/* Glow */}
                  <div style={{
                    position: "absolute", top: "-30%", right: "-20%",
                    width: "70%", height: "70%", borderRadius: "50%",
                    background: `radial-gradient(circle, ${cap.accent}12 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                  {/* Index */}
                  <span style={{
                    position: "absolute", top: 14, right: 16,
                    fontSize: 10, fontFamily: "monospace",
                    color: `${cap.accent}70`, letterSpacing: "0.15em",
                  }}>
                    {cap.index}
                  </span>
                  {/* Icon */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${cap.accent}35`,
                    background: `${cap.accent}14`,
                    marginBottom: 14,
                    boxShadow: `0 0 20px ${cap.accent}22, inset 0 1px 0 rgba(255,255,255,0.15)`,
                  }}>
                    <Icon size={18} color={cap.accent} />
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#ffffff", marginBottom: 7, letterSpacing: "-0.015em", lineHeight: 1.3 }}>
                    {cap.title}
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.65, margin: "0 0 14px" }}>
                    {cap.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {cap.tech.map((t) => (
                      <span key={t} style={{
                        fontSize: 10, fontFamily: "monospace",
                        padding: "3px 9px", borderRadius: 999,
                        border: `1px solid ${cap.accent}28`,
                        color: `${cap.accent}CC`,
                        background: `${cap.accent}0F`,
                        letterSpacing: "0.02em",
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
        <div className="h-px mb-6" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* CTA — desktop row / mobile column */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full lg:w-auto"
            style={{
              padding: "1.6rem 1.6rem",
              borderRadius: 28,
              background: "rgba(24,24,30,0.80)",
              backdropFilter: "blur(72px) saturate(220%) brightness(1.12)",
              WebkitBackdropFilter: "blur(72px) saturate(220%) brightness(1.12)",
              border: "1px solid rgba(255,255,255,0.20)",
              boxShadow: [
                "0 40px 100px rgba(0,0,0,0.65)",
                "0 8px 32px rgba(0,0,0,0.45)",
                "inset 0 2px 0 rgba(255,255,255,0.24)",
                "inset 0 -1px 0 rgba(255,255,255,0.07)",
                "inset 1px 0 0 rgba(255,255,255,0.09)",
                "inset -1px 0 0 rgba(255,255,255,0.09)",
              ].join(","),
              overflow: "hidden",
            }}
          >
            {/* Glow overlays */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: [
                "radial-gradient(ellipse 65% 80% at 20% 50%, rgba(168,212,255,0.09) 0%, transparent 65%)",
                "radial-gradient(ellipse 55% 70% at 85% 50%, rgba(125,211,200,0.07) 0%, transparent 65%)",
              ].join(","),
            }} />
            <div style={{
              position: "absolute", top: 0, left: "2rem", right: "2rem", height: 1,
              background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.32),transparent)",
            }} />

            {/* Inner: mobile stacked, desktop row */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-14 gap-5">
              <div>
                <div style={{
                  fontSize: 10, fontFamily: "monospace", color: "#7DD3C8",
                  letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 10,
                }}>
                  Ready to Shape the Future?
                </div>
                <div
                  className="font-extrabold text-white leading-[1.12] tracking-[-0.03em]"
                  style={{
                    fontSize: "clamp(1.1rem,2vw,1.45rem)",
                    textShadow: "0 2px 16px rgba(255,255,255,0.15)",
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
                  boxShadow: [
                    "0 0 40px rgba(168,212,255,0.40)",
                    "0 8px 24px rgba(168,212,255,0.25)",
                    "inset 0 1.5px 0 rgba(255,255,255,0.36)",
                    "inset 0 -1px 0 rgba(168,212,255,0.18)",
                  ].join(","),
                }}
                whileTap={{ scale: 0.97 }}
                // mobile: full width / desktop: fit
                className="flex items-center justify-center gap-2 w-full lg:w-auto lg:flex-shrink-0"
                style={{
                  padding: "15px 28px", borderRadius: 16,
                  background: "rgba(168,212,255,0.16)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  border: "1px solid rgba(168,212,255,0.45)",
                  boxShadow: [
                    "0 6px 24px rgba(168,212,255,0.20)",
                    "inset 0 1.5px 0 rgba(255,255,255,0.30)",
                    "inset 0 -1px 0 rgba(168,212,255,0.14)",
                  ].join(","),
                  color: "#A8D4FF", fontSize: 14, fontWeight: 700,
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
              gap: 12, background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            <motion.span
              animate={{ opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontSize: 11, fontWeight: 500, letterSpacing: "0.38em",
                color: "rgba(255,255,255,0.55)", textTransform: "uppercase",
                fontFamily: "'Georgia', serif", whiteSpace: "nowrap",
              }}
            >
              Keep Scrolling
            </motion.span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, 6, 0], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
                >
                  <svg width="18" height="10" viewBox="0 0 18 10" fill="none" style={{ display: "block", marginTop: i === 0 ? 0 : -4 }}>
                    <path d="M1 1L9 9L17 1" stroke="rgba(255,255,255,0.60)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              ))}
            </div>
          </motion.button>
        </div>

      </div>
    </section>
  );
}