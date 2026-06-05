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
  const color = isDark ? "rgba(255,255,255,0.95)" : "#0a0a0a";
  return text.replace(
    /\*\*(.*?)\*\*/g,
    `<strong style="color: ${color}; font-weight: 650;">$1</strong>`
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

  // ── Token helpers ──
  const sectionBg       = isDark ? "#000000" : "#ffffff";
  const labelColor      = isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.40)";
  const dividerColor    = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const headingColor    = isDark ? "#ffffff" : "#0a0a0a";
  const subColor        = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.48)";
  const panelBg         = isDark ? "rgba(8,8,18,0.75)" : "#ffffff";
  const panelBorder     = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)";
  const panelShadow     = isDark
    ? "0 40px 100px rgba(0,0,0,0.60), 0 0 0 0.5px rgba(255,255,255,0.06) inset"
    : "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)";
  const titleBarBg      = isDark ? "rgba(4,4,12,0.60)" : "#f5f5f7";
  const titleBarBorder  = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const titleBarText    = isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.28)";
  const sidebarBg       = isDark ? "rgba(4,4,12,0.40)" : "#fafafa";
  const sidebarBorder   = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const sidebarLabel    = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.28)";
  const sidebarFooter   = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.18)";
  const breadcrumbBg    = isDark ? "rgba(6,6,16,0.25)" : "#f9f9fb";
  const breadcrumbBorder= isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const breadcrumbMuted = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.30)";
  const breadcrumbSlash = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.18)";
  const contentBg       = isDark ? "transparent" : "#ffffff";
  const idColor         = isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.28)";
  const inlineDivider   = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)";
  const bodyColor       = isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.55)";
  const bottomNavBg     = isDark ? "rgba(4,4,12,0.35)" : "#f5f5f7";
  const bottomNavBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const navBtnColor     = isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)";
  const navBtnHover     = isDark ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.75)";
  const dotInactive     = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)";
  const activeCardBg    = isDark ? "rgba(255,255,255,0.055)" : "#ffffff";
  const activeCardBorder= isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)";
  const activeCardShadow= isDark ? "none" : "0 2px 8px rgba(0,0,0,0.06)";
  const inactiveTabText = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)";
  const inactiveDot     = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)";
  const tabsBg          = isDark ? "rgba(4,4,12,0.40)" : "#fafafa";
  const mobileBtnBg     = isDark ? "rgba(255,255,255,0.05)" : "#ffffff";
  const mobileBtnBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)";
  const mobileBtnColor  = isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)";

  return (
    <section
      id="vision"
      className="relative overflow-hidden flex flex-col items-center justify-center py-10"
      style={{
        background: sectionBg,
        transition: "background 0.4s ease",
        position: "relative",
        zIndex: 10,
        isolation: "isolate",
        minHeight: "100vh",
        paddingBottom: "5rem",
      }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full"
          style={{
            background: isDark ? "rgba(139,92,246,0.07)" : "rgba(139,92,246,0.04)",
            filter: "blur(180px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full"
          style={{
            background: isDark ? "rgba(34,211,238,0.05)" : "rgba(14,165,233,0.04)",
            filter: "blur(120px)",
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center w-full"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[1px]" style={{ background: dividerColor }} />
            <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: labelColor }}>
              Our Vision
            </span>
            <div className="w-8 h-[1px]" style={{ background: dividerColor }} />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-2"
            style={{
              color: headingColor,
              textShadow: isDark
                ? "0 0 40px rgba(255,255,255,0.35), 0 0 80px rgba(255,255,255,0.15)"
                : "none",
              transition: "color 0.4s ease",
            }}
          >
            We are building the next generation.
          </h2>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: subColor }}>
            Four principles. One system. A way of thinking about modern software.
          </p>
        </motion.div>

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl overflow-hidden w-full"
          style={{
            background: panelBg,
            border: `1px solid ${panelBorder}`,
            boxShadow: panelShadow,
            backdropFilter: isDark ? "blur(48px) saturate(180%)" : "none",
            WebkitBackdropFilter: isDark ? "blur(48px) saturate(180%)" : "none",
            transition: "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-3 px-5 py-3"
            style={{
              background: titleBarBg,
              borderBottom: `1px solid ${titleBarBorder}`,
              transition: "background 0.4s ease",
            }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,95,86,0.80)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,189,46,0.80)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(39,201,63,0.80)" }} />
            </div>
            <div className="flex-1 flex justify-center">
              <span className="text-xs font-mono tracking-wider" style={{ color: titleBarText }}>
                xinchao@futurxt / vision
              </span>
            </div>
            <div className="w-16" />
          </div>

          {/* ── MOBILE ── */}
          {isMobile ? (
            <div className="flex flex-col">
              <div
                className="flex border-b overflow-x-auto"
                style={{
                  background: tabsBg,
                  borderColor: sidebarBorder,
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                } as React.CSSProperties}
              >
                {chapters.map((ch, i) => {
                  const isActive = i === active;
                  const s = tagStyles[ch.tagColor];
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActive(i)}
                      className="relative flex flex-col items-center gap-1 px-4 py-3 shrink-0 transition-all duration-200"
                      style={{
                        background: isActive ? (isDark ? "rgba(255,255,255,0.055)" : "#ffffff") : "transparent",
                        borderBottom: `2px solid ${isActive ? s.accent : "transparent"}`,
                        minWidth: 80,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{ background: isActive ? s.accent : inactiveDot }}
                      />
                      <p className="text-[9px] font-mono" style={{ color: isActive ? (isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.50)") : (isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.28)") }}>
                        {ch.id}
                      </p>
                      <p className="text-[10px] font-semibold whitespace-nowrap" style={{ color: isActive ? headingColor : inactiveTabText }}>
                        {ch.tag}
                      </p>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  className="px-5 py-5"
                  style={{ background: contentBg }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono" style={{ color: idColor }}>{current.id}</span>
                    <div className="h-[1px] w-5" style={{ background: inlineDivider }} />
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${ts.text} ${ts.bg} ${ts.border}`}>
                      {current.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug tracking-tight mb-3" style={{ color: headingColor }}>
                    {current.title}
                  </h3>
                  <div className="h-[1px] mb-4" style={{ background: inlineDivider }} />
                  <div className="space-y-3">
                    {current.content.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        className="text-sm leading-[1.85]"
                        style={{ color: bodyColor }}
                        dangerouslySetInnerHTML={{ __html: parseContent(para, isDark) }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ background: bottomNavBg, borderTop: `1px solid ${bottomNavBorder}` }}
              >
                <button
                  onClick={() => setActive((active - 1 + chapters.length) % chapters.length)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{ color: mobileBtnColor, background: mobileBtnBg, border: `1px solid ${mobileBtnBorder}` }}
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-2">
                  {chapters.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === active ? 20 : 6,
                        height: 6,
                        background: i === active ? tagStyles[chapters[i].tagColor].accent : dotInactive,
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActive((active + 1) % chapters.length)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{ color: mobileBtnColor, background: mobileBtnBg, border: `1px solid ${mobileBtnBorder}` }}
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            /* ── DESKTOP ── */
            <div className="flex" style={{ minHeight: 380 }}>
              {/* Sidebar */}
              <div
                className="w-52 shrink-0 flex flex-col py-4"
                style={{
                  background: sidebarBg,
                  borderRight: `1px solid ${sidebarBorder}`,
                  transition: "background 0.4s ease",
                }}
              >
                <div className="px-4 mb-4">
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: sidebarLabel }}>
                    FOS · Principles
                  </p>
                </div>
                <nav className="flex-1 space-y-0.5 px-2">
                  {chapters.map((ch, i) => {
                    const isActive = i === active;
                    const s = tagStyles[ch.tagColor];
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setActive(i)}
                        className="w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 relative flex items-center gap-3"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeChapterVision"
                            className="absolute inset-0 rounded-xl"
                            style={{
                              background: activeCardBg,
                              border: `1px solid ${activeCardBorder}`,
                              boxShadow: activeCardShadow,
                            }}
                            transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
                          />
                        )}
                        <div
                          className="relative w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300"
                          style={{ background: isActive ? s.accent : inactiveDot }}
                        />
                        <div className="relative flex-1 min-w-0">
                          <p className="text-[10px] font-mono mb-0.5" style={{ color: isActive ? s.accent : sidebarLabel }}>
                            {ch.id}
                          </p>
                          <p className="text-xs font-semibold truncate" style={{ color: isActive ? headingColor : inactiveTabText }}>
                            {ch.tag}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </nav>
                <div className="px-4 pt-4 mt-4" style={{ borderTop: `1px solid ${sidebarBorder}` }}>
                  <p className="text-[10px] font-mono tracking-wide leading-relaxed" style={{ color: sidebarFooter }}>
                    FUTURXT OPERATING SYSTEM<br />v2026 ·
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col min-w-0">
                <div
                  className="flex items-center gap-2 px-7 py-3"
                  style={{
                    background: breadcrumbBg,
                    borderBottom: `1px solid ${breadcrumbBorder}`,
                    transition: "background 0.4s ease",
                  }}
                >
                  <span className="text-xs font-mono" style={{ color: breadcrumbMuted }}>Vision</span>
                  <span className="text-xs" style={{ color: breadcrumbSlash }}>/</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.tag}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className={`text-xs font-mono font-semibold ${ts.text}`}
                    >
                      {current.tag}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className="flex-1 overflow-y-auto px-7 py-6"
                    style={{ background: contentBg, transition: "background 0.4s ease" }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono" style={{ color: idColor }}>{current.id}</span>
                      <div className="h-[1px] w-5" style={{ background: inlineDivider }} />
                      <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${ts.text} ${ts.bg} ${ts.border}`}>
                        {current.tag}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold leading-snug tracking-tight mb-4" style={{ color: headingColor }}>
                      {current.title}
                    </h3>
                    <div className="h-[1px] mb-5" style={{ background: inlineDivider }} />
                    <div className="space-y-3 max-w-xl">
                      {current.content.split("\n\n").map((para, i) => (
                        <p
                          key={i}
                          className="text-sm leading-[1.85]"
                          style={{ color: bodyColor }}
                          dangerouslySetInnerHTML={{ __html: parseContent(para, isDark) }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div
                  className="px-7 py-3 flex items-center justify-between"
                  style={{ background: bottomNavBg, borderTop: `1px solid ${bottomNavBorder}`, transition: "background 0.4s ease" }}
                >
                  <button
                    onClick={() => setActive((active - 1 + chapters.length) % chapters.length)}
                    className="text-xs font-mono transition-all duration-200"
                    style={{ color: navBtnColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = navBtnHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = navBtnColor)}
                  >
                    ← Prev
                  </button>
                  <div className="flex items-center gap-2">
                    {chapters.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === active ? 20 : 6,
                          height: 6,
                          background: i === active ? tagStyles[chapters[i].tagColor].accent : dotInactive,
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setActive((active + 1) % chapters.length)}
                    className="text-xs font-mono transition-all duration-200"
                    style={{ color: navBtnColor }}
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