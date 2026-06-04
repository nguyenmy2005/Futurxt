"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const CODE_SNIPPETS: Record<string, string[]> = {
  TypeScript: [
    'import { FuturxtEngine } from "@futurxt/core";',
    "",
    "const engine = new FuturxtEngine({",
    '  name: "ScaleUp Platform",',
    '  capabilities: ["Web", "AI", "Cloud"],',
    "  uptime: 99.9,",
    "});",
    "",
    "await engine.launch({",
    '  env: "production",',
    "  zeroTrust: true,",
    "});",
  ],
  Python: [
    "from futurxt import Platform",
    "",
    "platform = Platform(",
    '    focus=["Web Engineering", "AI Workflows"],',
    "    stack={",
    '        "frontend": ["Next.js", "TypeScript"],',
    '        "backend":  ["FastAPI", "Go"],',
    '        "ai":       ["LangChain", "OpenAI"],',
    "    }",
    ")",
    "",
    'platform.deploy(env="production")',
  ],
  Go: [
    "package main",
    "",
    "import (",
    '    "context"',
    '    "github.com/futurxt/engine"',
    ")",
    "",
    "func main() {",
    "    ctx := context.Background()",
    "    eng := engine.New(engine.Config{",
    "        Scalability: engine.Extreme,",
    "        Latency:     14,",
    "    })",
    "    eng.Deploy(ctx)",
    "}",
  ],
  Rust: [
    "use futurxt::prelude::*;",
    "",
    "#[tokio::main]",
    "async fn main() -> Result<()> {",
    "    let app = App::builder()",
    "        .with_performance(Performance::Extreme)",
    "        .with_ai_node(AiConfig::rag())",
    "        .build()?;",
    "    app.run().await;",
    "    Ok(())",
    "}",
  ],
  Kotlin: [
    "import dev.futurxt.Platform",
    "",
    "fun main() {",
    "    val platform = Platform.builder()",
    '        .name("ScaleUp")',
    "        .enableAI(true)",
    "        .cloudProvider(Cloud.GCP)",
    "        .build()",
    "",
    "    platform.launch()",
    "}",
  ],
  Swift: [
    "import Futurxt",
    "",
    "let engine = FuturxtEngine(",
    '    name: "ScaleUp",',
    "    capabilities: [.web, .ai, .cloud]",
    ")",
    "",
    "Task {",
    "    try await engine.launch(",
    "        env: .production,",
    "        zeroTrust: true",
    "    )",
    "}",
  ],
};

const KEYWORDS_MAP: Record<string, string[]> = {
  TypeScript: ["import","export","from","const","let","var","function","async","await","return","new","type","interface","if","else","for","of","in"],
  Python:     ["from","import","def","class","return","if","else","elif","for","in","while","with","as","not","and","or","True","False","None","await"],
  Go:         ["package","import","func","var","const","type","struct","interface","return","if","else","for","range","go","defer","chan","map","make","new"],
  Rust:       ["use","fn","pub","let","mut","const","struct","enum","impl","for","in","if","else","match","return","async","await","mod","trait","where","self","Self"],
  Kotlin:     ["import","fun","val","var","class","object","if","else","for","in","while","return","when","is","as","null","true","false","override","data","sealed"],
  Swift:      ["import","let","var","func","class","struct","enum","if","else","for","in","while","return","guard","try","catch","throw","async","await","Task","true","false","nil"],
};

const TYPES_MAP: Record<string, string[]> = {
  TypeScript: ["FuturxtEngine","string","number","boolean","Promise","Array","Record"],
  Python:     ["Platform","List","Dict","Optional","Union","Any","str","int","float","bool"],
  Go:         ["Config","Context","Engine","Error"],
  Rust:       ["App","Performance","AiConfig","Result","Option","String","Vec"],
  Kotlin:     ["Platform","Cloud","String","Int","Boolean","List","Map"],
  Swift:      ["FuturxtEngine","Task","String","Int","Bool","Array"],
};

const C = {
  keyword:     "rgba(255,255,255,0.98)",
  string:      "#7DD3C8",
  number:      "#FFD580",
  comment:     "rgba(255,255,255,0.35)",
  function:    "#A8D4FF",
  type:        "#D4AAFF",
  variable:    "rgba(255,255,255,0.88)",
  punctuation: "rgba(255,255,255,0.50)",
  operator:    "rgba(255,255,255,0.60)",
  plain:       "rgba(255,255,255,0.82)",
};

function syntaxColor(line: string, lang: string): React.ReactNode {
  if (!line.trim()) return <span>&nbsp;</span>;
  const keywords = KEYWORDS_MAP[lang] ?? [];
  const types    = TYPES_MAP[lang]    ?? [];
  const parts: React.ReactNode[] = [];
  let rest = line;
  let key = 0;

  const push = (text: string, color: string, italic?: boolean) =>
    parts.push(<span key={key++} style={{ color, fontStyle: italic ? "italic" : undefined }}>{text}</span>);

  const indentMatch = rest.match(/^(\s+)/);
  if (indentMatch) { push(indentMatch[1], "transparent"); rest = rest.slice(indentMatch[1].length); }

  if (rest.startsWith("//") || rest.startsWith("#") || rest.startsWith("/*")) {
    push(rest, C.comment, true); return <>{parts}</>;
  }
  if (rest.startsWith("#[") || rest.startsWith("@")) {
    push(rest, C.type); return <>{parts}</>;
  }

  const tokenRe = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\d+(?:\.\d+)?)|([A-Za-z_$][A-Za-z0-9_$]*)|([{}()[\]])|([,:.<>?!*=+\-/|&^%]+)|(\s+)/g;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(rest)) !== null) {
    const [full, strTok, numTok, wordTok, punctBrace, operTok, spaceTok] = m;
    if (spaceTok)   { push(spaceTok, "transparent"); continue; }
    if (strTok)     { push(strTok,   C.string);      continue; }
    if (numTok)     { push(numTok,   C.number);      continue; }
    if (punctBrace) { push(punctBrace, C.punctuation); continue; }
    if (operTok)    { push(operTok,  C.operator);    continue; }
    if (wordTok) {
      if (keywords.includes(wordTok))             { push(wordTok, C.keyword);   continue; }
      if (types.includes(wordTok))                { push(wordTok, C.type);      continue; }
      if (/^[A-Z]/.test(wordTok))                 { push(wordTok, C.type);      continue; }
      const nextChar = rest[m.index + full.length];
      if (nextChar === "(")                        { push(wordTok, C.function);  continue; }
      push(wordTok, C.variable); continue;
    }
    push(full, C.plain);
  }
  return <>{parts}</>;
}

const EXTS: Record<string, string> = {
  TypeScript: ".ts", Python: ".py", Go: ".go",
  Rust: ".rs", Kotlin: ".kt", Swift: ".swift",
};

function CodeEditor() {
  const languages = Object.keys(CODE_SNIPPETS);
  const [langIdx, setLangIdx] = useState(0);
  const [visibleLines, setVisible] = useState(0);
  const [charIdx, setChar] = useState(0);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lang  = languages[langIdx];
  const lines = CODE_SNIPPETS[lang];

  useEffect(() => { setVisible(0); setChar(0); setDone(false); }, [langIdx]);

  useEffect(() => {
    if (done) return;
    if (visibleLines >= lines.length) {
      setDone(true);
      setTimeout(() => setLangIdx(p => (p + 1) % languages.length), 3200);
      return;
    }
    const currentLine = lines[visibleLines];
    if (charIdx < currentLine.length) {
      const t = setTimeout(() => setChar(c => c + 1), 18);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setVisible(v => v + 1); setChar(0); }, 25);
    return () => clearTimeout(t);
  }, [visibleLines, charIdx, done, lines, languages.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visibleLines, charIdx]);

  return (
    <div style={{
      width: "100%",
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(22,22,28,0.75)",
      backdropFilter: "blur(60px) saturate(200%) brightness(1.1)",
      WebkitBackdropFilter: "blur(60px) saturate(200%) brightness(1.1)",
      overflow: "hidden",
      boxShadow: [
        "0 40px 100px rgba(0,0,0,0.65)",
        "inset 0 1.5px 0 rgba(255,255,255,0.22)",
        "inset 0 -1px 0 rgba(255,255,255,0.06)",
        "inset 1px 0 0 rgba(255,255,255,0.08)",
        "inset -1px 0 0 rgba(255,255,255,0.08)",
      ].join(","),
    }}>

      {/* Title bar */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "12px 16px",
        background: "rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        gap: 10,
      }}>
        <div style={{ display: "flex", gap: 7 }}>
          {["rgba(255,95,86,0.9)","rgba(255,189,46,0.9)","rgba(40,200,64,0.9)"].map((bg, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: bg, boxShadow: `0 0 6px ${bg}` }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <span style={{
            fontSize: 12, fontFamily: "monospace",
            color: "rgba(255,255,255,0.80)",
            background: "rgba(255,255,255,0.10)",
            padding: "3px 14px", borderRadius: 99,
            border: "1px solid rgba(255,255,255,0.16)",
            letterSpacing: "0.02em",
          }}>
            futurxt{EXTS[lang]}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <motion.div
            animate={{ opacity: done ? 1 : 0.7, backgroundColor: done ? "rgba(40,200,64,1)" : "rgba(255,189,46,1)" }}
            style={{ width: 7, height: 7, borderRadius: "50%" }}
          />
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.60)" }}>
            {done ? "compiled" : "typing..."}
          </span>
        </div>
      </div>

      {/* Language tabs */}
      <div style={{
        display: "flex",
        background: "rgba(0,0,0,0.25)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
        overflowX: "auto",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}>
        {languages.map((l, i) => (
          <button
            key={l}
            onClick={() => setLangIdx(i)}
            style={{
              position: "relative",
              padding: "8px 14px",
              fontSize: 11,
              fontFamily: "monospace",
              color: i === langIdx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
              background: i === langIdx ? "rgba(255,255,255,0.10)" : "transparent",
              border: "none",
              borderRight: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              fontWeight: i === langIdx ? 600 : 400,
              flexShrink: 0,
            }}
          >
            {l}
            {i === langIdx && (
              <motion.div
                layoutId="tab-line"
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 2,
                  background: "rgba(255,255,255,0.80)",
                  borderRadius: 2,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Code area */}
      <div
        ref={scrollRef}
        style={{
          padding: "16px 0",
          minHeight: 280,
          maxHeight: 320,
          overflowY: "auto",
          overflowX: "auto",
          background: "transparent",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.14) transparent",
        }}
      >
        {lines.map((line, li) => {
          if (li > visibleLines) return null;
          const isCurrent   = li === visibleLines && !done;
          const displayLine = isCurrent ? line.slice(0, charIdx) : line;

          return (
            <div
              key={li}
              style={{
                display: "flex",
                lineHeight: "24px",
                minHeight: 24,
                background: isCurrent ? "rgba(255,255,255,0.05)" : "transparent",
              }}
            >
              <span style={{
                width: 40, paddingRight: 12,
                fontSize: 11,
                fontFamily: "monospace",
                color: isCurrent ? "rgba(255,255,255,0.50)" : "rgba(255,255,255,0.25)",
                userSelect: "none", flexShrink: 0, textAlign: "right",
              }}>
                {li + 1}
              </span>
              <span style={{
                fontSize: 12.5,
                fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
                paddingRight: 16,
                whiteSpace: "pre",
                letterSpacing: "0.01em",
              }}>
                {syntaxColor(displayLine, lang)}
                {isCurrent && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                      display: "inline-block", width: 2, height: 14,
                      background: "rgba(255,255,255,0.90)",
                      marginLeft: 1, verticalAlign: "middle", borderRadius: 1,
                    }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "6px 16px",
        background: "rgba(255,255,255,0.06)",
        borderTop: "1px solid rgba(255,255,255,0.10)",
      }}>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.50)" }}>
          ⎇ main
        </span>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.50)", letterSpacing: "0.18em" }}>
          {lang.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex flex-col items-center bg-black overflow-hidden"
    >
      {/* Top rule */}
      <div style={{
        position: "absolute", top: 0, left: "8%", right: "8%",
        height: 1,
        background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)",
      }} />

      {/* Subtle center glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 900, height: 500, borderRadius: "50%",
        background: "radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="
        relative z-10 w-full
        max-w-[1280px] mx-auto
        px-5 sm:px-8 lg:px-12
        pt-20 sm:pt-24 pb-2
      ">

        {/* ── Top: About text + Code editor ── */}
        <div className="
          grid grid-cols-1 lg:grid-cols-2
          gap-10 lg:gap-16
          items-start
          mb-8 sm:mb-10
        ">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-6 sm:mb-7">
              <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.50)" }} />
              <span style={{
                fontSize: 11, fontFamily: "monospace",
                letterSpacing: "0.28em",
                color: "rgba(255,255,255,0.60)",
                textTransform: "uppercase",
              }}>
                About Futurxt
              </span>
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: "'Georgia','Times New Roman',serif",
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              margin: "0 0 28px",
              textShadow: "0 0 40px rgba(255,255,255,0.25)",
            }}>
              Built by engineers<br />
              <span style={{ color: "#ffffff" }}>Designed for growth</span>
            </h2>

            {/* Text card */}
            <div style={{
              display: "flex", flexDirection: "column", gap: 0,
              background: "rgba(28,28,34,0.80)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 20,
              backdropFilter: "blur(60px) saturate(200%) brightness(1.1)",
              WebkitBackdropFilter: "blur(60px) saturate(200%) brightness(1.1)",
              overflow: "hidden",
              boxShadow: [
                "0 40px 100px rgba(0,0,0,0.65)",
                "inset 0 1.5px 0 rgba(255,255,255,0.22)",
                "inset 0 -1px 0 rgba(255,255,255,0.06)",
                "inset 1px 0 0 rgba(255,255,255,0.08)",
                "inset -1px 0 0 rgba(255,255,255,0.08)",
              ].join(","),
            }}>
              {[
                {
                  text: "Futurxt is a product engineering studio helping startups and businesses build modern web applications, AI systems, and automation platforms.",
                  opacity: 1.0, weight: 500,
                },
                {
                  text: "We combine design, engineering, and AI to create products that scale from idea to production.",
                  opacity: 0.95, weight: 400,
                },
                {
                  text: "We believe technology should do more than solve problems today — it should create opportunities for tomorrow.",
                  opacity: 0.88, weight: 400,
                },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "20px 24px",
                    borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.10)" : "none",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <div style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%",
                    width: 2, borderRadius: 2,
                    background: i === 0
                      ? "rgba(255,255,255,0.35)"
                      : i === 1
                      ? "rgba(255,255,255,0.18)"
                      : "rgba(255,255,255,0.10)",
                  }} />
                  <p style={{
                    fontSize: "clamp(13px, 1.4vw, 15.5px)",
                    lineHeight: 1.80,
                    color: `rgba(255,255,255,${p.opacity})`,
                    margin: 0,
                    fontWeight: p.weight,
                    letterSpacing: "0.01em",
                  }}>
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Code editor */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <CodeEditor />
          </motion.div>
        </div>

      </div>

      {/* Keep scrolling */}
      <motion.button
        onClick={() => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.0 }}
        className="
          relative mb-4
          flex flex-col items-center gap-3
          bg-transparent border-none cursor-pointer p-0 z-20
        "
      >
        <motion.span
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-[11px] font-medium tracking-[0.38em] text-white/55 uppercase whitespace-nowrap"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Keep Scrolling
        </motion.span>

        <div className="flex flex-col items-center">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, 6, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
            >
              <ChevronDown
                size={20}
                strokeWidth={1.2}
                color="rgba(255,255,255,0.60)"
                style={{ display: "block", marginTop: i === 0 ? 0 : -10 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.button>
    </section>
  );
}