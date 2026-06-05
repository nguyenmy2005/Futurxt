"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";

const chapters = [
  {
    id: "01",
    tag: "The Problem",
    tagColor: "red",
    title: "The world moved on. Most businesses didn't.",
    content: `Every day, thousands of businesses lose customers they never knew they had. Not because their product is bad — but because their **digital presence** is invisible, outdated, or simply broken.

Old websites that take 8 seconds to load. Contact forms nobody checks. Support queues that stretch for days. **Workflows built in 2010** trying to survive in 2025.

The gap between where businesses are and where customers expect them to be has never been wider. And it's growing — fast.

The companies that close this gap will win everything. The ones that don't will slowly become **invisible**.`,
  },
  {
    id: "02",
    tag: "The Shift",
    tagColor: "cyan",
    title: "AI doesn't replace your team. It makes them superhuman.",
    content: `Imagine your customer support answering **10,000 questions simultaneously** — instantly, accurately, 24/7. No burnout. No queue. No missed messages.

That's not science fiction. That's what we build.

We design **AI-native systems** that learn your business, speak your language, and handle the repetitive so your team can focus on what only humans can do — **relationships, strategy, creativity**.

The businesses winning today aren't the ones working harder. They're the ones who built **smarter systems** underneath everything they do.`,
  },
  {
    id: "03",
    tag: "The Design",
    tagColor: "purple",
    title: "Beautiful software changes how people feel about your brand.",
    content: `There's a moment when a user lands on a website and instantly feels — *this company gets it.*

That feeling isn't accidental. It's designed. Every pixel, every transition, every micro-interaction is a signal: **we care about your experience**.

We've seen companies triple their conversion rate not by changing their product — but by **redesigning how it's presented**. The same offer, delivered beautifully, hits differently.

In a world of noise, **design is trust**. And trust is revenue.`,
  },
  {
    id: "04",
    tag: "The Vision",
    tagColor: "blue",
    title: "The future belongs to companies that build it.",
    content: `We are not here to maintain the status quo. We are here to **dismantle it**, rebuild it better, and hand it back to you — faster, smarter, more beautiful than before.

SaaS platforms that scale. AI agents that work while you sleep. Interfaces that make your customers feel understood. **Automation that removes friction** from every corner of your business.

This is what Futurxt builds. Not just software — **systems that evolve with you**.

The companies that will define the next decade aren't waiting for the future. They're **building it, right now**.`,
  },
];

interface TagStyle {
  dot: string;
  text: string;
  bg: string;
  border: string;
  accent: string;
}

const darkTagStyles: Record<string, TagStyle> = {
  red:    { dot: "bg-red-400",    text: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/25",    accent: "#F87171" },
  cyan:   { dot: "bg-teal-400",   text: "text-teal-400",   bg: "bg-teal-400/10",   border: "border-teal-400/25",   accent: "#2DD4BF" },
  purple: { dot: "bg-violet-400", text: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/25", accent: "#A78BFA" },
  blue:   { dot: "bg-blue-400",   text: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/25",   accent: "#60A5FA" },
};

const lightTagStyles: Record<string, TagStyle> = {
  red:    { dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",    accent: "#DC2626" },
  cyan:   { dot: "bg-teal-500",   text: "text-teal-700",   bg: "bg-teal-50",   border: "border-teal-200",   accent: "#0F766E" },
  purple: { dot: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200", accent: "#6D28D9" },
  blue:   { dot: "bg-blue-500",   text: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   accent: "#1D4ED8" },
};

function parseContent(text: string, isDark: boolean) {
  const strongColor = isDark ? "#ffffff" : "#0a0a0a";
  return text.replace(
    /\*\*(.*?)\*\*/g,
    `<strong style="color: ${strongColor}; font-weight: 700;">\$1</strong>`
  );
}

export function VisionSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const tagStyles = isDark ? darkTagStyles : lightTagStyles;
  const current = chapters[active];
  const ts = tagStyles[current.tagColor];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Tokens ──
  const sectionBg        = isDark ? "#000000" : "#ffffff";
  const labelColor       = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.48)";
  const dividerColor     = isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.18)";
  const headingColor     = isDark ? "#ffffff" : "#0a0a0a";
  const subColor         = isDark ? "rgba(255,255,255,0.68)" : "rgba(0,0,0,0.58)";

  const panelBg          = isDark ? "rgba(10,10,18,0.90)" : "#ffffff";
  const panelBorder      = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const panelShadow      = isDark
    ? "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)"
    : "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)";

  const titleBarBg       = isDark ? "rgba(6,6,14,0.70)" : "#f4f4f6";
  const titleBarBorder   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const titleBarText     = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.32)";

  const sidebarBg        = isDark ? "rgba(6,6,14,0.50)" : "#fafafa";
  const sidebarBorder    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const sidebarLabel     = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.32)";
  const sidebarFooter    = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.28)";

  const breadcrumbBg     = isDark ? "rgba(6,6,14,0.35)" : "#f9f9fb";
  const breadcrumbBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const breadcrumbMuted  = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.38)";
  const breadcrumbSlash  = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.20)";

  const contentBg        = isDark ? "transparent" : "#ffffff";
  const idColor          = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)";
  const inlineDivider    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const bodyColor        = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.60)";

  const bottomNavBg      = isDark ? "rgba(6,6,14,0.45)" : "#f4f4f6";
  const bottomNavBorder  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const navBtnColor      = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.40)";
  const navBtnHover      = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)";
  const dotInactive      = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.16)";

  const activeCardBg     = isDark ? "rgba(255,255,255,0.06)" : "#ffffff";
  const activeCardBorder = isDark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.09)";
  const activeCardShadow = isDark ? "none" : "0 2px 8px rgba(0,0,0,0.06)";
  const inactiveTabText  = isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.38)";
  const inactiveDot      = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.20)";
  const tabsBg           = isDark ? "rgba(6,6,14,0.50)" : "#fafafa";
  const mobileBtnBg      = isDark ? "rgba(255,255,255,0.06)" : "#ffffff";
  const mobileBtnBorder  = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const mobileBtnColor   = isDark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.50)";

  return (
    <section
      id="vision"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: sectionBg,
        padding: "2.5rem 0 5rem",
        transition: "background 0.4s ease",
        zIndex: 10,
        isolation: "isolate",
      }}
    >
      <div ref={ref} className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 flex flex-col items-center gap-7">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: "center", width: "100%" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 32, height: 1, background: dividerColor }} />
            <span style={{
              fontSize: 11, fontFamily: "monospace",
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: labelColor, fontWeight: 600,
            }}>
              Our Vision
            </span>
            <div style={{ width: 32, height: 1, background: dividerColor }} />
          </div>

          <h2 style={{
            fontFamily: "'Georgia','Times New Roman',serif",
            fontSize: isMobile ? "clamp(2.0rem,7vw,2.8rem)" : "clamp(2.6rem,4.5vw,3.8rem)",
            fontWeight: 900, lineHeight: 1.06,
            letterSpacing: "-0.035em",
            color: headingColor,
            margin: "0 0 14px",
            transition: "color 0.4s ease",
          }}>
            We are building the next generation.
          </h2>

          <p style={{
            fontSize: isMobile ? 15 : 16,
            maxWidth: 420, margin: "0 auto",
            lineHeight: 1.78, color: subColor,
            fontWeight: 400,
            transition: "color 0.4s ease",
          }}>
            Four principles. One system. A way of thinking about modern software.
          </p>
        </motion.div>

        {/* ── Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            borderRadius: 20, overflow: "hidden", width: "100%",
            background: panelBg,
            border: `1px solid ${panelBorder}`,
            boxShadow: panelShadow,
            backdropFilter: isDark ? "blur(48px) saturate(180%)" : "none",
            WebkitBackdropFilter: isDark ? "blur(48px) saturate(180%)" : "none",
            transition: "background 0.4s ease, border 0.4s ease",
          }}
        >
          {/* Title bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 18px",
            background: titleBarBg,
            borderBottom: `1px solid ${titleBarBorder}`,
            transition: "background 0.4s ease",
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["rgba(255,95,86,0.80)", "rgba(255,189,46,0.80)", "rgba(39,201,63,0.80)"].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <span style={{ fontSize: 12, fontFamily: "monospace", color: titleBarText, letterSpacing: "0.06em" }}>
                xinchao@futurxt / vision
              </span>
            </div>
            <div style={{ width: 60 }} />
          </div>

          {/* ── MOBILE ── */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Tabs */}
              <div style={{
                display: "flex",
                background: tabsBg,
                borderBottom: `1px solid ${sidebarBorder}`,
                overflowX: "auto",
                scrollbarWidth: "none",
              }}>
                {chapters.map((ch, i) => {
                  const isActive = i === active;
                  const s = tagStyles[ch.tagColor];
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActive(i)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                        padding: "12px 16px", flexShrink: 0, minWidth: 80,
                        background: isActive ? (isDark ? "rgba(255,255,255,0.06)" : "#ffffff") : "transparent",
                        borderBottom: `2px solid ${isActive ? s.accent : "transparent"}`,
                        border: "none", cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: isActive ? s.accent : inactiveDot,
                        transition: "all 0.3s",
                      }} />
                      <span style={{ fontSize: 9, fontFamily: "monospace", color: isActive ? (isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.50)") : (isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.30)") }}>
                        {ch.id}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 650, color: isActive ? headingColor : inactiveTabText, whiteSpace: "nowrap" }}>
                        {ch.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  style={{ padding: "20px 20px 16px", background: contentBg, transition: "background 0.4s ease" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: idColor, fontWeight: 600 }}>{current.id}</span>
                    <div style={{ height: 1, width: 20, background: inlineDivider }} />
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${ts.text} ${ts.bg} ${ts.border}`}>
                      {current.tag}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: 19, fontWeight: 750, letterSpacing: "-0.02em",
                    lineHeight: 1.28, color: headingColor, marginBottom: 13,
                    transition: "color 0.4s ease",
                  }}>
                    {current.title}
                  </h3>

                  <div style={{ height: 1, marginBottom: 16, background: inlineDivider }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {current.content.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        style={{ fontSize: 14, lineHeight: 1.85, color: bodyColor, margin: 0, fontWeight: 400 }}
                        dangerouslySetInnerHTML={{ __html: parseContent(para, isDark) }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom nav */}
              <div style={{
                padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: bottomNavBg, borderTop: `1px solid ${bottomNavBorder}`,
              }}>
                <button
                  onClick={() => setActive((active - 1 + chapters.length) % chapters.length)}
                  style={{
                    fontSize: 12, fontFamily: "monospace", fontWeight: 600,
                    padding: "7px 14px", borderRadius: 10,
                    color: mobileBtnColor, background: mobileBtnBg, border: `1px solid ${mobileBtnBorder}`,
                    cursor: "pointer",
                  }}
                >
                  ← Prev
                </button>
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  {chapters.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      style={{
                        width: i === active ? 22 : 7, height: 7, borderRadius: 99,
                        background: i === active ? tagStyles[chapters[i].tagColor].accent : dotInactive,
                        border: "none", cursor: "pointer", padding: 0,
                        transition: "all 0.3s",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActive((active + 1) % chapters.length)}
                  style={{
                    fontSize: 12, fontFamily: "monospace", fontWeight: 600,
                    padding: "7px 14px", borderRadius: 10,
                    color: mobileBtnColor, background: mobileBtnBg, border: `1px solid ${mobileBtnBorder}`,
                    cursor: "pointer",
                  }}
                >
                  Next →
                </button>
              </div>
            </div>

          ) : (
            /* ── DESKTOP ── */
            <div style={{ display: "flex", minHeight: 400 }}>
              {/* Sidebar */}
              <div style={{
                width: 210, flexShrink: 0, display: "flex", flexDirection: "column",
                padding: "16px 0",
                background: sidebarBg,
                borderRight: `1px solid ${sidebarBorder}`,
                transition: "background 0.4s ease",
              }}>
                <div style={{ padding: "0 16px", marginBottom: 14 }}>
                  <p style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.20em", textTransform: "uppercase", color: sidebarLabel, fontWeight: 600, margin: 0 }}>
                    FOS · Principles
                  </p>
                </div>

                <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 8px" }}>
                  {chapters.map((ch, i) => {
                    const isActive = i === active;
                    const s = tagStyles[ch.tagColor];
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setActive(i)}
                        style={{
                          width: "100%", textAlign: "left",
                          padding: "10px 12px", borderRadius: 12,
                          background: "none", border: "none", cursor: "pointer",
                          position: "relative", display: "flex", alignItems: "center", gap: 10,
                          transition: "all 0.2s",
                        }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeChapterVision"
                            style={{
                              position: "absolute", inset: 0, borderRadius: 12,
                              background: activeCardBg,
                              border: `1px solid ${activeCardBorder}`,
                              boxShadow: activeCardShadow,
                            }}
                            transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
                          />
                        )}
                        <div style={{
                          position: "relative", width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                          background: isActive ? s.accent : inactiveDot,
                          transition: "all 0.3s",
                        }} />
                        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 10, fontFamily: "monospace", marginBottom: 2, color: isActive ? s.accent : sidebarLabel, fontWeight: 600 }}>
                            {ch.id}
                          </p>
                          <p style={{ fontSize: 13, fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: isActive ? headingColor : inactiveTabText, margin: 0 }}>
                            {ch.tag}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <div style={{ padding: "14px 16px 0", borderTop: `1px solid ${sidebarBorder}`, marginTop: 8 }}>
                  <p style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.05em", lineHeight: 1.7, color: sidebarFooter, margin: 0 }}>
                    FUTURXT OPERATING SYSTEM<br />v2026 ·
                  </p>
                </div>
              </div>

              {/* Content area */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* Breadcrumb */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "11px 28px",
                  background: breadcrumbBg,
                  borderBottom: `1px solid ${breadcrumbBorder}`,
                  transition: "background 0.4s ease",
                }}>
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: breadcrumbMuted, fontWeight: 500 }}>Vision</span>
                  <span style={{ fontSize: 12, color: breadcrumbSlash }}>/</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.tag}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className={`text-[12px] font-mono font-semibold ${ts.text}`}
                    >
                      {current.tag}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Body */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      flex: 1, overflowY: "auto",
                      padding: "26px 30px",
                      background: contentBg,
                      transition: "background 0.4s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: idColor, fontWeight: 600 }}>{current.id}</span>
                      <div style={{ height: 1, width: 20, background: inlineDivider }} />
                      <span className={`text-[12px] font-mono px-3 py-1 rounded-full border font-semibold ${ts.text} ${ts.bg} ${ts.border}`}>
                        {current.tag}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: 22, fontWeight: 750, letterSpacing: "-0.025em",
                      lineHeight: 1.26, color: headingColor,
                      marginBottom: 16,
                      transition: "color 0.4s ease",
                    }}>
                      {current.title}
                    </h3>

                    <div style={{ height: 1, marginBottom: 20, background: inlineDivider }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 560 }}>
                      {current.content.split("\n\n").map((para, i) => (
                        <p
                          key={i}
                          style={{ fontSize: 14.5, lineHeight: 1.88, color: bodyColor, margin: 0, fontWeight: 400 }}
                          dangerouslySetInnerHTML={{ __html: parseContent(para, isDark) }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Bottom nav */}
                <div style={{
                  padding: "11px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: bottomNavBg, borderTop: `1px solid ${bottomNavBorder}`,
                  transition: "background 0.4s ease",
                }}>
                  <button
                    onClick={() => setActive((active - 1 + chapters.length) % chapters.length)}
                    style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: navBtnColor, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = navBtnHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = navBtnColor)}
                  >
                    ← Prev
                  </button>
                  <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                    {chapters.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        style={{
                          width: i === active ? 22 : 7, height: 7, borderRadius: 99,
                          background: i === active ? tagStyles[chapters[i].tagColor].accent : dotInactive,
                          border: "none", cursor: "pointer", padding: 0,
                          transition: "all 0.3s",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setActive((active + 1) % chapters.length)}
                    style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: navBtnColor, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = navBtnHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = navBtnColor)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}