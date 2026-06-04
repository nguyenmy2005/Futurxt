"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

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
    tagColor: "gradient",
    title: "The future belongs to companies that build it.",
    content: `We are not here to maintain the status quo. We are here to **dismantle it**, rebuild it better, and hand it back to you — faster, smarter, more beautiful than before.

SaaS platforms that scale. AI agents that work while you sleep. Interfaces that make your customers feel understood. **Automation that removes friction** from every corner of your business.

This is what Futurxt builds. Not just software — **systems that evolve with you**.

The companies that will define the next decade aren't waiting for the future. They're **building it, right now**.`,
  },
];

const tagStyles: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  red:      { dot: "bg-red-400",    text: "text-red-400",    bg: "bg-red-400/8",    border: "border-red-400/20"    },
  cyan:     { dot: "bg-cyan-400",   text: "text-cyan-400",   bg: "bg-cyan-400/8",   border: "border-cyan-400/20"   },
  purple:   { dot: "bg-purple-400", text: "text-purple-400", bg: "bg-purple-400/8", border: "border-purple-400/20" },
  gradient: { dot: "bg-white/60",   text: "text-white/60",   bg: "bg-white/5",      border: "border-white/10"      },
};

function parseContent(text: string) {
  return text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong style="color: rgba(255,255,255,0.95); font-weight: 600;">$1</strong>'
  );
}

export function VisionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const current = chapters[active];
  const ts = tagStyles[current.tagColor];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="vision"
      className="relative overflow-hidden flex flex-col items-center justify-center py-10"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full blur-[180px]"
          style={{ background: "rgba(139,92,246,0.07)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-[120px]"
          style={{ background: "rgba(34,211,238,0.05)" }}
        />
        <div
          className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px]"
          style={{ background: "rgba(239,68,68,0.03)" }}
        />
      </div>

      <div
        ref={ref}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center gap-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center w-full"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[1px] bg-white/25" />
            <span className="text-[10px] font-mono tracking-[0.28em] uppercase text-white/50">
              Our Vision
            </span>
            <div className="w-8 h-[1px] bg-white/25" />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-2"
            style={{
              color: "#ffffff",
              textShadow: "0 0 40px rgba(255,255,255,0.35), 0 0 80px rgba(255,255,255,0.15)",
            }}
          >
            We are building the next generation.
          </h2>
          <p
            className="text-sm max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Four principles. One system. A way of thinking about modern software.
          </p>
        </motion.div>

        {/* Main UI */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl border border-white/[0.08] overflow-hidden w-full"
          style={{
            background: "rgba(8,8,18,0.75)",
            backdropFilter: "blur(48px) saturate(180%)",
            WebkitBackdropFilter: "blur(48px) saturate(180%)",
            boxShadow:
              "0 0 0 0.5px rgba(255,255,255,0.06) inset, 0 40px 100px rgba(0,0,0,0.60), 0 0 60px rgba(139,92,246,0.06)",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06]"
            style={{
              background: "rgba(4,4,12,0.60)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,95,86,0.70)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,189,46,0.70)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(39,201,63,0.70)" }} />
            </div>
            <div className="flex-1 flex justify-center">
              <span
                className="text-xs font-mono tracking-wider"
                style={{ color: "rgba(255,255,255,0.16)" }}
              >
                xinchao@futurxt / vision
              </span>
            </div>
            <div className="w-16" />
          </div>

          {/* ── MOBILE LAYOUT ── */}
          {isMobile ? (
            <div className="flex flex-col">
              {/* Chapter tabs - horizontal scroll */}
              <div
                className="flex border-b border-white/[0.06] overflow-x-auto"
                style={{
                  background: "rgba(4,4,12,0.40)",
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                }}
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
                        background: isActive ? "rgba(255,255,255,0.055)" : "transparent",
                        borderBottom: isActive ? "2px solid rgba(255,255,255,0.5)" : "2px solid transparent",
                        minWidth: 80,
                      }}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          isActive ? s.dot : "bg-white/15"
                        }`}
                      />
                      <p
                        className="text-[9px] font-mono"
                        style={{ color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)" }}
                      >
                        {ch.id}
                      </p>
                      <p
                        className="text-[10px] font-medium whitespace-nowrap"
                        style={{ color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.30)" }}
                      >
                        {ch.tag}
                      </p>
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
                  className="px-5 py-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "rgba(255,255,255,0.20)" }}
                    >
                      {current.id}
                    </span>
                    <div className="h-[1px] w-5 bg-white/[0.10]" />
                    <span
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${ts.text} ${ts.bg} ${ts.border}`}
                    >
                      {current.tag}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-bold leading-snug tracking-tight mb-3"
                    style={{ color: "rgba(255,255,255,0.95)" }}
                  >
                    {current.title}
                  </h3>

                  <div className="h-[1px] mb-4" style={{ background: "rgba(255,255,255,0.05)" }} />

                  <div className="space-y-3">
                    {current.content.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        className="text-sm leading-[1.85]"
                        style={{ color: "rgba(255,255,255,0.42)" }}
                        dangerouslySetInnerHTML={{ __html: parseContent(para) }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom nav */}
              <div
                className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between"
                style={{
                  background: "rgba(4,4,12,0.35)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <button
                  onClick={() => setActive((active - 1 + chapters.length) % chapters.length)}
                  className="text-xs font-mono transition-all duration-200 px-3 py-1.5 rounded-lg"
                  style={{
                    color: "rgba(255,255,255,0.40)",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  ← Prev
                </button>

                <div className="flex items-center gap-2">
                  {chapters.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === active ? 20 : 6,
                        height: 6,
                        background:
                          i === active
                            ? "linear-gradient(90deg, rgba(139,92,246,0.9), rgba(34,211,238,0.9))"
                            : "rgba(255,255,255,0.12)",
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActive((active + 1) % chapters.length)}
                  className="text-xs font-mono transition-all duration-200 px-3 py-1.5 rounded-lg"
                  style={{
                    color: "rgba(255,255,255,0.40)",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            /* ── DESKTOP LAYOUT (giữ nguyên 100%) ── */
            <div className="flex" style={{ minHeight: 380 }}>
              {/* Left: Chapter list */}
              <div
                className="w-52 shrink-0 border-r border-white/[0.06] flex flex-col py-4"
                style={{
                  background: "rgba(4,4,12,0.40)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="px-4 mb-4">
                  <p
                    className="text-[10px] font-mono tracking-[0.2em] uppercase"
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  >
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
                        style={{ background: "transparent" }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeChapter"
                            className="absolute inset-0 rounded-xl"
                            style={{
                              background: "rgba(255,255,255,0.055)",
                              border: "0.5px solid rgba(255,255,255,0.10)",
                            }}
                            transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
                          />
                        )}
                        <div
                          className={`relative w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                            isActive ? s.dot : "bg-white/15"
                          }`}
                        />
                        <div className="relative flex-1 min-w-0">
                          <p
                            className={`text-[10px] font-mono mb-0.5 ${isActive ? s.text : ""}`}
                            style={!isActive ? { color: "rgba(255,255,255,0.18)" } : {}}
                          >
                            {ch.id}
                          </p>
                          <p
                            className={`text-xs font-medium truncate ${isActive ? "text-white" : ""}`}
                            style={!isActive ? { color: "rgba(255,255,255,0.28)" } : {}}
                          >
                            {ch.tag}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </nav>
                <div className="px-4 pt-4 border-t border-white/[0.06] mt-4">
                  <p
                    className="text-[10px] font-mono tracking-wide leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.10)" }}
                  >
                    FUTURXT OPERATING SYSTEM
                    <br />
                    v2026 ·
                  </p>
                </div>
              </div>

              {/* Right: Content panel */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Breadcrumb */}
                <div
                  className="flex items-center gap-2 px-7 py-3 border-b border-white/[0.06]"
                  style={{
                    background: "rgba(6,6,16,0.25)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.18)" }}>
                    Vision
                  </span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.10)" }}>
                    /
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.tag}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className={`text-xs font-mono ${ts.text}`}
                    >
                      {current.tag}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className="flex-1 overflow-y-auto px-7 py-5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-xs font-mono"
                        style={{ color: "rgba(255,255,255,0.20)" }}
                      >
                        {current.id}
                      </span>
                      <div className="h-[1px] w-5 bg-white/[0.10]" />
                      <span
                        className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${ts.text} ${ts.bg} ${ts.border}`}
                      >
                        {current.tag}
                      </span>
                    </div>
                    <h3
                      className="text-xl md:text-2xl font-bold leading-snug tracking-tight mb-4"
                      style={{ color: "rgba(255,255,255,0.95)" }}
                    >
                      {current.title}
                    </h3>
                    <div className="h-[1px] mb-4" style={{ background: "rgba(255,255,255,0.05)" }} />
                    <div className="space-y-3 max-w-xl">
                      {current.content.split("\n\n").map((para, i) => (
                        <p
                          key={i}
                          className="text-sm leading-[1.85]"
                          style={{ color: "rgba(255,255,255,0.42)" }}
                          dangerouslySetInnerHTML={{ __html: parseContent(para) }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Bottom nav */}
                <div
                  className="px-7 py-3 border-t border-white/[0.06] flex items-center justify-between"
                  style={{
                    background: "rgba(4,4,12,0.35)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  <button
                    onClick={() => setActive((active - 1 + chapters.length) % chapters.length)}
                    className="text-xs font-mono transition-all duration-200"
                    style={{ color: "rgba(255,255,255,0.22)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.70)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
                  >
                    ← Prev
                  </button>

                  <div className="flex items-center gap-2">
                    {chapters.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === active ? 20 : 6,
                          height: 6,
                          background:
                            i === active
                              ? "linear-gradient(90deg, rgba(139,92,246,0.9), rgba(34,211,238,0.9))"
                              : "rgba(255,255,255,0.12)",
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActive((active + 1) % chapters.length)}
                    className="text-xs font-mono transition-all duration-200"
                    style={{ color: "rgba(255,255,255,0.30)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.80)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.30)")}
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