"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Globe, Pen, Server, Brain, Send } from "lucide-react";

function hexRgb(h: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : "168,212,255";
}

function GlassCTA({ accent, label = "Start a project" }: { accent: string; label?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === "dark" : true;
  const rgb = hexRgb(accent);
  const bg = isDark
    ? `linear-gradient(145deg, rgba(${rgb},0.22) 0%, rgba(${rgb},0.10) 40%, rgba(255,255,255,0.05) 100%)`
    : `linear-gradient(145deg, rgba(${rgb},0.18) 0%, rgba(${rgb},0.08) 40%, rgba(255,255,255,0.60) 100%)`;
  const border = isDark ? `rgba(${rgb},0.50)` : `rgba(${rgb},0.55)`;
  const shadow = isDark
    ? [`0 4px 32px rgba(${rgb},0.26)`, `0 1px 8px rgba(0,0,0,0.4)`, `inset 0 1.5px 0 rgba(255,255,255,0.32)`, `inset 0 -1px 0 rgba(${rgb},0.14)`].join(",")
    : [`0 4px 24px rgba(${rgb},0.22)`, `0 1px 6px rgba(0,0,0,0.08)`, `inset 0 1.5px 0 rgba(255,255,255,0.90)`, `inset 0 -1px 0 rgba(${rgb},0.12)`].join(",");
  const color = isDark ? "#ffffff" : `rgb(${rgb})`;
  const textShadow = isDark ? `0 0 24px rgba(${rgb},0.9)` : `0 0 16px rgba(${rgb},0.5)`;
  return (
    <motion.a
      href="#contact"
      onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      style={{ display: "inline-flex", alignItems: "center", gap: 0, padding: "14px 28px", borderRadius: 16, background: bg, backdropFilter: "blur(80px) saturate(240%) brightness(1.2)", WebkitBackdropFilter: "blur(80px) saturate(240%) brightness(1.2)", border: `1px solid ${border}`, boxShadow: shadow, color, fontSize: 14, fontWeight: 700, textDecoration: "none", cursor: "pointer", letterSpacing: "0.01em", position: "relative", overflow: "hidden", transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: isDark ? "linear-gradient(90deg,transparent,rgba(255,255,255,0.60),transparent)" : "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, rgba(${rgb},0.18) 0%, transparent 65%)`, pointerEvents: "none" }} />
      <span style={{ position: "relative", zIndex: 1, textShadow }}>{label}</span>
    </motion.a>
  );
}

function SmartImage({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "transparent" }}>
      <img
        src={src}
        alt={alt}
        style={{
          position: "absolute", width: "100%", height: "100%",
          objectFit: "contain", objectPosition: "center center",
          display: "block",
        }}
      />
    </div>
  );
}

function PhotoGallery({ accent, photos, isMobile }: { accent: string; photos: { url: string }[]; isMobile: boolean }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === "dark" : true;
  const [current, setCurrent] = useState(0);
  const rgb = hexRgb(accent);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setCurrent(0); }, [photos]);

  useEffect(() => {
    if (isMobile || photos.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % photos.length);
    }, 7000);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [isMobile, photos.length]);

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent((c) => (c + 1) % photos.length);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => { mouseStartX.current = e.clientX; };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    mouseStartX.current = null;
  };

  const frameBorder = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)";
  const frameInset  = isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.95)";
  const headerBg    = isDark
    ? "linear-gradient(180deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)"
    : "linear-gradient(180deg,rgba(0,0,0,0.04) 0%,rgba(0,0,0,0.01) 100%)";
  const headerBorder= isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)";
  const frameBg     = isDark ? "#0d0d18" : "#ffffff";
  const dotInactive = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)";
  const counterColor= `rgba(${rgb},0.75)`;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div style={{
        position: "absolute", inset: -1.5, borderRadius: 24,
        border: `1.5px solid rgba(${rgb},0.32)`, pointerEvents: "none", zIndex: 0,
        boxShadow: `0 0 30px rgba(${rgb},0.10), inset 0 0 30px rgba(${rgb},0.03)`,
      }} />
      <div
        style={{
          position: "relative", width: "100%", height: "100%", borderRadius: 22,
          overflow: "hidden",
          border: `1px solid ${frameBorder}`,
          boxShadow: isDark
            ? `0 24px 60px rgba(0,0,0,0.70), 0 4px 16px rgba(0,0,0,0.40), inset 0 1px 0 ${frameInset}`
            : `0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 ${frameInset}`,
          background: frameBg,
          zIndex: 1, display: "flex", flexDirection: "column",
          cursor: "grab",
          userSelect: "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "11px 16px", flexShrink: 0,
          background: headerBg, borderBottom: `1px solid ${headerBorder}`, zIndex: 2,
        }}>
          <div style={{ display: "flex", gap: 7 }}>
            {[["#ff5f56","#ff3b30"],["#ffbd2e","#ff9500"],["#28c840","#34c759"]].map(([bg2, glow], i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: bg2, boxShadow: `0 0 6px ${glow}66` }} />
            ))}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: counterColor, letterSpacing: "0.14em", fontWeight: 600 }}>
              {String(current + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>
          {photos.map((photo, i) => (
            <div
              key={i}
              style={{
                position: "absolute", inset: 0,
                opacity: i === current ? 1 : 0,
                transition: "opacity 0.70s cubic-bezier(0.16,1,0.3,1)",
                zIndex: i === current ? 1 : 0,
              }}
            >
              <SmartImage src={photo.url} />
            </div>
          ))}

          {photos.length > 1 && (
            <div style={{
              position: "absolute", bottom: 12, left: "50%",
              transform: "translateX(-50%)",
              display: "flex", gap: 6, zIndex: 10,
            }}>
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 22 : 6, height: 6, borderRadius: 99,
                    background: i === current ? accent : dotInactive,
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    boxShadow: i === current ? `0 0 10px ${accent}` : "none",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FinanceAppDemo({ accent }: { accent: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const rgb = hexRgb(accent);
  const [activeTab, setActiveTab] = useState<"overview" | "budget" | "savings">("overview");
  const [salary, setSalary] = useState(5200);
  const [editingSalary, setEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState("5200");
  const [savingsGoal] = useState(10000);
  const [currentSavings, setCurrentSavings] = useState(6340);
  const [notification, setNotification] = useState<string | null>(null);

  const expenses = [
    { label: "Housing", amount: 1400, color: "#7DD3C8" },
    { label: "Food", amount: 620, color: "#A8D4FF" },
    { label: "Transport", amount: 280, color: "#D4AAFF" },
    { label: "Entertainment", amount: 190, color: "#FFD580" },
    { label: "Utilities", amount: 210, color: "#B8F5A0" },
  ];
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netSavings = salary - totalExpenses;
  const monthlyData = [
    { month: "Jan", revenue: 4800, savings: 900 }, { month: "Feb", revenue: 5100, savings: 1200 },
    { month: "Mar", revenue: 4950, savings: 1050 }, { month: "Apr", revenue: 5400, savings: 1500 },
    { month: "May", revenue: 5200, savings: 1300 }, { month: "Jun", revenue: salary, savings: netSavings > 0 ? netSavings : 0 },
  ];
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));
  const notify = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 2000); };
  const saveSalary = () => { const val = parseInt(salaryInput); if (!isNaN(val) && val > 0) { setSalary(val); notify("Salary updated"); } setEditingSalary(false); };
  const savingsPercent = Math.min((currentSavings / savingsGoal) * 100, 100);

  const phoneBg = "#ffffff";
  const phoneBodyBg = "#f5f7fa";
  const cardBg = "#fff";
  const cardBorder = "#f0f0f0";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ width: 260, height: 520, borderRadius: 44, background: phoneBg, boxShadow: isDark ? "0 0 0 10px #1a1a1a, 0 0 0 12px #2a2a2a, 0 40px 80px rgba(0,0,0,0.85), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)" : "0 0 0 10px #1a1a1a, 0 0 0 12px #2a2a2a, 0 30px 60px rgba(0,0,0,0.40), 0 8px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.15)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 90, height: 28, background: "#1a1a1a", borderRadius: "0 0 18px 18px", zIndex: 20 }} />
        <div style={{ position: "absolute", top: 8, left: 16, right: 16, display: "flex", justifyContent: "space-between", zIndex: 19, padding: "0 4px" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#111" }}>9:41</span>
          <span style={{ fontSize: 9, color: "#111" }}>●●●</span>
        </div>
        <div style={{ position: "absolute", inset: 0, top: 28, background: phoneBodyBg, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <AnimatePresence>
            {notification && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "#111", color: "#fff", fontSize: 10, fontWeight: 600, padding: "5px 14px", borderRadius: 99, whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>{notification}</motion.div>
            )}
          </AnimatePresence>
          <div style={{ padding: "14px 16px 10px", background: cardBg, borderBottom: `1px solid ${cardBorder}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>FinTrack</span>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 13 }}>$</span></div>
            </div>
            <p style={{ fontSize: 9, color: "#999", margin: 0, fontFamily: "monospace" }}>June 2025</p>
          </div>
          <div style={{ display: "flex", background: cardBg, padding: "6px 10px", gap: 4, borderBottom: `1px solid ${cardBorder}` }}>
            {(["overview", "budget", "savings"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: "5px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 9, fontWeight: 700, background: activeTab === tab ? "#111" : "transparent", color: activeTab === tab ? "#fff" : "#999", transition: "all 0.18s", fontFamily: "inherit", letterSpacing: "0.02em", textTransform: "capitalize" }}>{tab}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ background: "#111", borderRadius: 16, padding: "14px 14px 12px", position: "relative", overflow: "hidden" }}>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", margin: "0 0 4px", fontFamily: "monospace", letterSpacing: "0.08em" }}>MONTHLY SALARY</p>
                  {editingSalary ? (
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <span style={{ fontSize: 16, color: "#fff", fontWeight: 800 }}>$</span>
                      <input autoFocus value={salaryInput} onChange={(e) => setSalaryInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveSalary(); if (e.key === "Escape") setEditingSalary(false); }} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6, padding: "3px 7px", fontSize: 15, color: "#fff", fontWeight: 800, width: 90, outline: "none", fontFamily: "inherit" }} />
                      <button onClick={saveSalary} style={{ fontSize: 12, color: "#34c759", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>OK</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>${salary.toLocaleString()}</span>
                      <button onClick={() => { setEditingSalary(true); setSalaryInput(String(salary)); }} style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, padding: "1px 6px", cursor: "pointer", fontFamily: "inherit" }}>edit</button>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <div><p style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", margin: "0 0 2px", fontFamily: "monospace" }}>SPENT</p><p style={{ fontSize: 12, fontWeight: 800, color: "#ff5f56", margin: 0 }}>${totalExpenses.toLocaleString()}</p></div>
                    <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                    <div><p style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", margin: "0 0 2px", fontFamily: "monospace" }}>SAVED</p><p style={{ fontSize: 12, fontWeight: 800, color: netSavings > 0 ? "#34c759" : "#ff5f56", margin: 0 }}>${netSavings > 0 ? netSavings.toLocaleString() : 0}</p></div>
                    <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                    <div><p style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", margin: "0 0 2px", fontFamily: "monospace" }}>RATE</p><p style={{ fontSize: 12, fontWeight: 800, color: "#A8D4FF", margin: 0 }}>{salary > 0 ? Math.round((netSavings / salary) * 100) : 0}%</p></div>
                  </div>
                </div>
                <div style={{ background: cardBg, borderRadius: 14, padding: "10px 12px", border: `1px solid ${cardBorder}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#111", margin: "0 0 8px", letterSpacing: "0.04em" }}>INCOME VS SAVINGS</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 56 }}>
                    {monthlyData.map((d, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, height: "100%" }}>
                        <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 1 }}>
                          <motion.div initial={{ height: 0 }} animate={{ height: `${(d.savings / maxRevenue) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.07 }} style={{ background: "#34c759", borderRadius: "2px 2px 0 0", minHeight: 2 }} />
                          <motion.div initial={{ height: 0 }} animate={{ height: `${((d.revenue - d.savings) / maxRevenue) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.07 }} style={{ background: i === monthlyData.length - 1 ? "#111" : "#e5e7eb", borderRadius: "2px 2px 0 0" }} />
                        </div>
                        <span style={{ fontSize: 7.5, color: "#aaa", fontFamily: "monospace" }}>{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === "budget" && (
              <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ background: cardBg, borderRadius: 14, padding: "10px 12px", border: `1px solid ${cardBorder}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#111", margin: "0 0 8px", letterSpacing: "0.04em" }}>EXPENSE BREAKDOWN</p>
                  {expenses.map((exp, i) => (
                    <motion.div key={exp.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#111" }}>{exp.label}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#111" }}>${exp.amount}</span>
                        </div>
                        <div style={{ height: 5, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(exp.amount / salary) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.08 }} style={{ height: "100%", borderRadius: 99, background: exp.color }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div style={{ background: "#111", borderRadius: 14, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>TOTAL EXPENSES</span><span style={{ fontSize: 12, fontWeight: 800, color: "#ff5f56" }}>${totalExpenses.toLocaleString()}</span></div>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>REMAINING</span><span style={{ fontSize: 12, fontWeight: 800, color: netSavings > 0 ? "#34c759" : "#ff5f56" }}>${Math.max(netSavings, 0).toLocaleString()}</span></div>
                </div>
              </motion.div>
            )}
            {activeTab === "savings" && (
              <motion.div key="savings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ background: cardBg, borderRadius: 14, padding: "12px 14px", border: `1px solid ${cardBorder}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#111", margin: "0 0 8px", letterSpacing: "0.04em" }}>SAVINGS GOAL</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: "#111", letterSpacing: "-0.04em" }}>${currentSavings.toLocaleString()}</span>
                    <span style={{ fontSize: 10, color: "#aaa" }}>/ ${savingsGoal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                    <svg width="90" height="90" viewBox="0 0 90 90">
                      <circle cx="45" cy="45" r="36" fill="none" stroke="#f0f0f0" strokeWidth="7" />
                      <motion.circle cx="45" cy="45" r="36" fill="none" stroke="#7DD3C8" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 36}`} initial={{ strokeDashoffset: 2 * Math.PI * 36 }} animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - savingsPercent / 100) }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)" }} />
                      <text x="45" y="49" textAnchor="middle" fontSize="13" fontWeight="800" fill="#111" fontFamily="monospace">{Math.round(savingsPercent)}%</text>
                    </svg>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[100, 500, 1000].map((amt) => (
                      <button key={amt} onClick={() => { setCurrentSavings((s) => Math.min(s + amt, savingsGoal)); notify(`+$${amt} added`); }} style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9f9f9", fontSize: 9, fontWeight: 700, color: "#111", cursor: "pointer", fontFamily: "inherit" }}>+${amt}</button>
                    ))}
                  </div>
                </div>
                <div style={{ background: cardBg, borderRadius: 14, padding: "10px 12px", border: `1px solid ${cardBorder}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#111", margin: "0 0 8px", letterSpacing: "0.04em" }}>MILESTONES</p>
                  {[{ label: "Emergency Fund", target: 3000 }, { label: "Vacation Fund", target: 5000 }, { label: "Investment Fund", target: 10000 }].map((m, i) => {
                    const pct = Math.min((currentSavings / m.target) * 100, 100);
                    return (
                      <div key={m.label} style={{ marginBottom: i < 2 ? 8 : 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 9.5, color: "#555" }}>{m.label}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: pct >= 100 ? "#34c759" : "#111", fontFamily: "monospace" }}>{Math.round(pct)}%</span>
                        </div>
                        <div style={{ height: 5, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.1 }} style={{ height: "100%", borderRadius: 99, background: pct >= 100 ? "#34c759" : "#7DD3C8" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
          <div style={{ padding: "8px 16px 12px", background: cardBg, borderTop: `1px solid ${cardBorder}`, display: "flex", justifyContent: "space-around" }}>
            {["Home","Stats","Cards","Settings"].map((label, i) => (
              <button key={i} style={{ background: "none", border: "none", fontSize: 9, cursor: "pointer", opacity: i === 0 ? 1 : 0.35, padding: "4px 8px", color: "#111", fontWeight: i === 0 ? 700 : 400, fontFamily: "inherit" }}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const LOCAL_RESPONSES: Record<string, string> = {
  "what can you build": "We build high-performance websites, custom web apps, UX/UI systems, and AI-powered automation pipelines — all production-ready, shipped fast.",
  "how long": "Most projects ship in 2–6 weeks depending on scope. We move fast without cutting corners — clear milestones, daily updates.",
  "pricing": "Pricing is scoped per project. We offer fixed-price engagements so you always know what you're paying. Book a free call to get a quote.",
  "ai": "We integrate Claude, Gemini, and OpenAI into real workflows — chatbots with memory, RAG pipelines, n8n automations, and custom AI tools that actually deliver business value.",
  "tech stack": "Next.js, TypeScript, Tailwind, Framer Motion on the frontend. Node.js, PostgreSQL, Prisma, Redis on the backend. Deployed on Vercel or your own infra.",
  "contact": "Reach us via the contact form below, or book a free 30-min strategy call. We respond within 24 hours.",
  "ux": "We design in Figma — wireframes, interactive prototypes, full design systems with dark/light mode. Every pixel is intentional.",
};

function getLocalResponse(input: string): string {
  const q = input.toLowerCase();
  for (const [key, val] of Object.entries(LOCAL_RESPONSES)) {
    if (q.includes(key) || key.split(" ").some((w) => w.length > 3 && q.includes(w))) return val;
  }
  return "Great question! We'd love to give you a detailed answer. Drop us a message via the contact form below and we'll get back to you within 24 hours.";
}

function useTypewriter(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active || !text) return;
    setDisplayed("");
    let i = 0;
    const tick = () => { i++; setDisplayed(text.slice(0, i)); if (i < text.length) setTimeout(tick, 13); };
    setTimeout(tick, 13);
  }, [text, active]);
  return displayed;
}

type Message = { role: "user" | "assistant"; content: string; local?: boolean; typing?: boolean };

function AiLiveDemo({ accent, isDarkGlobal }: { accent: string; isDarkGlobal: boolean }) {
  const isDark = isDarkGlobal;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [typingMsgIdx, setTypingMsgIdx] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const bg = isDark ? "#0a0a10" : "#f8f9fb";
  const border = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const textPrimary = isDark ? "rgba(255,255,255,0.92)" : "#0a0a0a";
  const textMuted = isDark ? "rgba(255,255,255,0.38)" : "#888888";
  const headerBg = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const headerBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "#ffffff";
  const inputBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
  const userBubble = isDark ? "rgba(255,255,255,0.16)" : "#111111";
  const userBubbleText = isDark ? "rgba(255,255,255,0.95)" : "#ffffff";
  const aiBubble = isDark ? "rgba(255,255,255,0.07)" : "#ffffff";
  const aiBubbleBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const aiText = isDark ? "rgba(255,255,255,0.82)" : "#1a1a1a";

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, streamText]);

  const typingContent = typingMsgIdx !== null ? (messages[typingMsgIdx]?.content ?? "") : "";
  const typedText = useTypewriter(typingContent, typingMsgIdx !== null);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    setStreamText("");
    if (isOffline) { await handleLocalFallback(newMessages, userText); return; }
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "gemini-2.0-flash", stream: true, system: "You are Futurxt AI — a sharp, concise AI assistant for a product engineering studio. Keep answers helpful and brief (2-4 sentences max unless asked for more). Focus on web development, UI/UX, and AI automation topics.", messages: newMessages.map((m) => ({ role: m.role, content: m.content })) }) });
      if (!res.ok || !res.body) throw new Error("API error");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try { const parsed = JSON.parse(data); const t2 = parsed.choices?.[0]?.delta?.content; if (t2) { full += t2; setStreamText(full); } } catch {}
          }
        }
      }
      if (!full) throw new Error("Empty");
      setMessages((prev) => [...prev, { role: "assistant", content: full }]);
      setStreamText("");
    } catch {
      setIsOffline(true);
      setStreamText("");
      await handleLocalFallback(newMessages, userText);
    } finally { setLoading(false); }
  };

  const handleLocalFallback = async (msgs: Message[], userText: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const localReply = getLocalResponse(userText);
    const replyMsg: Message = { role: "assistant", content: localReply, local: true, typing: true };
    setMessages((prev) => { const next = [...prev, replyMsg]; setTypingMsgIdx(next.length - 1); return next; });
    setLoading(false);
    setTimeout(() => setTypingMsgIdx(null), localReply.length * 13 + 300);
  };

  const allMessages: Message[] = streamText ? [...messages, { role: "assistant", content: streamText }] : messages;
  const hasMessages = allMessages.length > 0;
  const suggestedQuestions = ["What can you build?", "What's your tech stack?", "How long does it take?"];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", borderRadius: 22, overflow: "hidden", background: bg, border: `1px solid ${border}`, boxShadow: isDark ? "0 40px 120px rgba(0,0,0,0.90), inset 0 1px 0 rgba(255,255,255,0.07)" : "0 8px 40px rgba(0,0,0,0.12), 0 1px 0 rgba(0,0,0,0.06)", transition: "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", flexShrink: 0, borderBottom: `1px solid ${headerBorder}`, background: headerBg, transition: "background 0.35s, border-color 0.35s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: isDark ? "rgba(255,255,255,0.10)" : "#111", border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.15)" : "0 2px 8px rgba(0,0,0,0.25)" }}>
            <span style={{ fontSize: 16, color: "#fff", fontWeight: 800 }}>AI</span>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: textPrimary, letterSpacing: "-0.02em", transition: "color 0.35s" }}>Futurxt AI</span>
              {isOffline && <span style={{ fontSize: 9, color: "#ff5f56", background: "rgba(255,95,86,0.10)", border: "1px solid rgba(255,95,86,0.20)", borderRadius: 4, padding: "1px 6px", fontFamily: "monospace", letterSpacing: "0.06em" }}>OFFLINE</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              {loading
                ? <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#34c759" }} />
                : <div style={{ width: 6, height: 6, borderRadius: "50%", background: isOffline ? "#ff5f56" : "#34c759", opacity: 0.8 }} />
              }
              <span style={{ fontSize: 11, color: textMuted, fontFamily: "monospace", transition: "color 0.35s" }}>{loading ? "typing…" : isOffline ? "offline mode" : "online · ready"}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14, minHeight: 0, scrollbarWidth: "thin", scrollbarColor: `${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"} transparent` }}>
        {!hasMessages && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, paddingTop: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: isDark ? "rgba(255,255,255,0.08)" : "#f0f0f0", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isDark ? "0 0 30px rgba(255,255,255,0.05)" : "0 4px 20px rgba(0,0,0,0.07)" }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>?</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: textPrimary, margin: "0 0 5px", letterSpacing: "-0.02em", transition: "color 0.35s" }}>How can I help you?</p>
              <p style={{ fontSize: 12, color: textMuted, margin: "0 0 16px", fontFamily: "monospace", transition: "color 0.35s" }}>Ask about services, pricing, or tech stack</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                {suggestedQuestions.map((q) => (
                  <button key={q} onClick={() => sendMessage(q)} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}`, background: isDark ? "rgba(255,255,255,0.05)" : "#ffffff", color: isDark ? "rgba(255,255,255,0.72)" : "#333", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s", whiteSpace: "nowrap" }}>{q}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {allMessages.map((msg, i) => {
          const isUser = msg.role === "user";
          const isStreamingThis = !isUser && i === allMessages.length - 1 && !!streamText && loading;
          const isTypingLocal = !isUser && i === typingMsgIdx;
          const displayContent = isTypingLocal ? typedText : msg.content;
          const stillTyping = isTypingLocal && typedText.length < msg.content.length;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 9, alignItems: "flex-end" }}>
              {!isUser ? (
                <div style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, background: isDark ? "rgba(255,255,255,0.08)" : "#111", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2, transition: "background 0.35s" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: isDark ? "rgba(255,255,255,0.80)" : "#fff" }}>AI</span>
                </div>
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, background: isDark ? "rgba(255,255,255,0.16)" : "#111", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2, fontSize: 11, fontWeight: 700, color: "#fff" }}>U</div>
              )}
              <div style={{ maxWidth: "74%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 3 }}>
                <div style={{ padding: "11px 15px", borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: isUser ? userBubble : aiBubble, border: `1px solid ${isUser ? "transparent" : aiBubbleBorder}`, transition: "background 0.35s, border-color 0.35s" }}>
                  <p style={{ fontSize: 13, lineHeight: 1.72, margin: 0, color: isUser ? userBubbleText : aiText, whiteSpace: "pre-wrap", fontWeight: isUser ? 500 : 400, transition: "color 0.35s" }}>
                    {displayContent}
                    {(isStreamingThis || stillTyping) && (
                      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }} style={{ display: "inline-block", width: 2, height: 13, background: isDark ? "rgba(255,255,255,0.6)" : "#555", marginLeft: 2, verticalAlign: "middle", borderRadius: 1 }} />
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
        {loading && !streamText && typingMsgIdx === null && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", gap: 9, alignItems: "flex-end" }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: isDark ? "rgba(255,255,255,0.08)" : "#f0f0f0", border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>AI</span>
            </div>
            <div style={{ padding: "13px 17px", borderRadius: "4px 16px 16px 16px", background: aiBubble, border: `1px solid ${aiBubbleBorder}`, display: "flex", alignItems: "center", gap: 5 }}>
              {[0,1,2].map((i) => (
                <motion.div key={i} animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -4, 0] }} transition={{ duration: 1.0, repeat: Infinity, delay: i * 0.18 }} style={{ width: 5, height: 5, borderRadius: "50%", background: isDark ? "rgba(255,255,255,0.5)" : "#aaa" }} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ padding: "12px 14px", flexShrink: 0, borderTop: `1px solid ${headerBorder}`, background: headerBg, transition: "background 0.35s, border-color 0.35s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: inputBg, border: `1px solid ${isFocused ? (isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)") : inputBorder}`, borderRadius: 14, padding: "10px 10px 10px 15px", transition: "border-color 0.2s, background 0.35s" }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="Ask me anything…" disabled={loading} style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: textPrimary, fontFamily: "inherit", caretColor: isDark ? "rgba(255,255,255,0.7)" : "#111", transition: "color 0.35s" }} />
          <motion.button onClick={() => sendMessage()} disabled={!input.trim() || loading} whileHover={input.trim() && !loading ? { scale: 1.08 } : {}} whileTap={input.trim() && !loading ? { scale: 0.92 } : {}} style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: input.trim() && !loading ? (isDark ? "rgba(255,255,255,0.18)" : "#111") : (isDark ? "rgba(255,255,255,0.05)" : "#e5e7eb"), border: `1px solid ${input.trim() && !loading ? (isDark ? "rgba(255,255,255,0.24)" : "transparent") : (isDark ? "rgba(255,255,255,0.06)" : "#d1d5db")}`, cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", color: input.trim() && !loading ? (isDark ? "rgba(255,255,255,0.90)" : "#fff") : textMuted, transition: "all 0.2s", padding: 0 }}>
            <Send size={13} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export const SERVICE_DATA = [
  {
    index: "01", icon: Globe,
    title: "Website Design\n& Development",
    desc: "We design and develop modern websites that combine exceptional user experience, strong brand presence, and measurable business results. Built for performance, scalability, and growth from day one.",
    features: [
      { label: "Corporate websites" }, { label: "Marketing websites" },
      { label: "E-commerce solutions" }, { label: "CMS implementation" },
      { label: "Landing pages" }, { label: "SEO optimization" },
    ],
    accent: "#A8D4FF", accentLight: "#2563EB",
    photos: [{ url: "/web1.png" }, { url: "/web2.png" }, { url: "/web3.png" }, { url: "/web4.png" }, { url: "/web5.png" }, { url: "/web6.png" }, { url: "/web7.png" }, { url: "/web8.png" }],
    aiDemo: false, webAppDemo: false,
  },
  {
    index: "02", icon: Pen,
    title: "UX/UI Design",
    desc: "Designing seamless digital experiences that balance user needs, business goals, and modern aesthetics. We transform ideas into intuitive interfaces that are ready for development and built to scale.",
    features: [
      { label: "User Experience Design" }, { label: "User Interface Design" },
      { label: "Wireframing" }, { label: "Interactive Prototyping" },
      { label: "Design Systems" }, { label: "Accessibility (WCAG)" },
    ],
    accent: "#D4AAFF", accentLight: "#7C3AED",
    photos: [{ url: "/UX1.png" }, { url: "/UX2.png" }, { url: "/UX3.png" }, { url: "/UX4.png" }, { url: "/UX5.png" }, { url: "/UX6.png" }],
    aiDemo: false, webAppDemo: false,
  },
  {
    index: "03", icon: Server,
    title: "Custom Software Development",
    desc: "We build scalable software solutions tailored to your operations, workflows, and customer needs. From SaaS platforms and client portals to internal business systems, every product is designed for reliability, performance, and long-term growth.",
    features: [
      { label: "SaaS Platforms" }, { label: "Client Portals" },
      { label: "Internal Tools" }, { label: "Business Systems" },
      { label: "Marketplace Platforms" }, { label: "API Integrations" },
    ],
    accent: "#7DD3C8", accentLight: "#0F766E",
    photos: [], aiDemo: false, webAppDemo: true,
  },
  {
    index: "04", icon: Brain,
    title: "AI Integration\n& Automation",
    desc: "Transform your business with AI-powered solutions that automate workflows, enhance customer experiences, and unlock new efficiencies. From intelligent assistants to end-to-end automation systems, we build practical AI that delivers measurable results.",
    features: [
      { label: "AI Chatbots" }, { label: "AI Agents" },
      { label: "Knowledge Base AI" }, { label: "Workflow Automation" },
      { label: "Custom AI Solutions" }, { label: "AI Integrations" },
    ],
    accent: "#FFFFFF", accentLight: "#111111",
    photos: [], aiDemo: true, webAppDemo: false,
  },
];

function AnimatedBackground({ accent, rgb, isMobile, isDark }: { accent: string; rgb: string; isMobile: boolean; isDark: boolean }) {
  if (isMobile) return null;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: isDark
          ? `radial-gradient(ellipse 60% 50% at 78% 38%, rgba(${rgb},0.08) 0%, transparent 60%), radial-gradient(ellipse 45% 40% at 15% 72%, rgba(${rgb},0.05) 0%, transparent 55%)`
          : `radial-gradient(ellipse 60% 50% at 78% 38%, rgba(${rgb},0.06) 0%, transparent 60%), radial-gradient(ellipse 45% 40% at 15% 72%, rgba(${rgb},0.04) 0%, transparent 55%)`,
        transition: "background 0.6s ease"
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(${rgb},${isDark ? "0.05" : "0.04"}) 1px, transparent 1px), linear-gradient(90deg, rgba(${rgb},${isDark ? "0.05" : "0.04"}) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)",
      }} />
      <div style={{
        position: "absolute", top: "-30%", right: "26%",
        width: 1.5, height: "160%",
        background: `linear-gradient(180deg, transparent, rgba(${rgb},${isDark ? "0.18" : "0.10"}) 35%, rgba(${rgb},${isDark ? "0.10" : "0.06"}) 65%, transparent)`,
        transform: "rotate(16deg)"
      }} />
      {isDark && (
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.007) 3px, rgba(255,255,255,0.007) 4px)" }} />
      )}
      <div style={{ position: "absolute", bottom: 0, left: "4%", right: "4%", height: 1, background: `linear-gradient(90deg,transparent,rgba(${rgb},0.28),transparent)`, boxShadow: `0 0 24px rgba(${rgb},0.16)` }} />
    </div>
  );
}

export function ServiceSlide({ svcIndex }: { svcIndex: number }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === "dark" : true;

  const svc = SERVICE_DATA[svcIndex];
  const Icon = svc.icon;
  const accentColor = isDark ? svc.accent : svc.accentLight;
  const rgb = hexRgb(accentColor);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const mobileDemoHeight = svc.webAppDemo ? 580 : 520;
  const sectionBg = isDark ? "#000000" : "#ffffff";
  const headingColor = isDark ? "#ffffff" : "#0a0a0a";
  const headingShadow = isDark ? `0 2px 30px rgba(${rgb},0.15)` : "none";
  const labelColor = accentColor;
  const descColor = isDark ? "rgba(255,255,255,0.70)" : "rgba(10,10,10,0.65)";
  const featureBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const featureBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)";
  const featureText = isDark ? "rgba(255,255,255,0.82)" : "rgba(10,10,10,0.72)";
  const edgeLineTop = isDark ? `rgba(${rgb},0.20)` : `rgba(${rgb},0.15)`;
  const edgeLineBottom = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const iconBg = `rgba(${rgb},0.10)`;
  const iconBorder = isDark ? `rgba(${rgb},0.30)` : `rgba(${rgb},0.35)`;
  const ruleGradient = `linear-gradient(90deg,${accentColor},${accentColor}40)`;
  const ruleShadow = `0 0 10px ${accentColor}44`;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", alignItems: isMobile ? "flex-start" : "center", background: sectionBg, overflow: "hidden", transition: "background 0.4s ease" }}>
      
      <AnimatedBackground accent={accentColor} rgb={rgb} isMobile={isMobile} isDark={isDark} />

      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 1400, margin: "0 auto", width: "100%",
        padding: isMobile ? "5rem 1.25rem 4rem" : "0 3.5rem",
        display: isMobile ? "flex" : "grid",
        flexDirection: isMobile ? "column" : undefined,
        gridTemplateColumns: isMobile ? undefined : "0.85fr 1.15fr",
        gap: isMobile ? "2rem" : "5rem",
        alignItems: "center"
      }}>
        <motion.div
          key={`l-${svcIndex}`}
          initial={{ opacity: 0, x: isMobile ? 0 : -28, y: isMobile ? 20 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: iconBg, border: `1px solid ${iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={18} color={accentColor} strokeWidth={1.7} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 1, background: accentColor, opacity: 0.5 }} />
              <span style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.28em", color: labelColor, textTransform: "uppercase", fontWeight: 600, opacity: 0.80 }}>Our Services</span>
            </div>
          </div>

          <h2 style={{
            fontFamily: "'Georgia','Times New Roman',serif",
            fontSize: isMobile ? "clamp(2rem,8vw,2.8rem)" : "clamp(2.6rem,3.7vw,4.4rem)",
            fontWeight: 900, lineHeight: 0.96, letterSpacing: "-0.040em",
            color: headingColor, margin: "0 0 20px", whiteSpace: "pre-line",
            textShadow: headingShadow, transition: "color 0.4s ease"
          }}>
            {svc.title}
          </h2>

          <motion.div
            key={`rule-${svcIndex}`}
            initial={{ width: 0 }}
            animate={{ width: 52 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ height: 2.5, borderRadius: 99, background: ruleGradient, marginBottom: 22, boxShadow: ruleShadow }}
          />

          <p style={{
            fontSize: isMobile ? 15 : 16, lineHeight: 1.85, color: descColor,
            margin: "0 0 26px", maxWidth: isMobile ? "100%" : 420,
            fontWeight: 400, letterSpacing: "0.005em", transition: "color 0.4s ease"
          }}>
            {svc.desc}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 7 : 8, marginBottom: isMobile ? 26 : 38, maxWidth: isMobile ? "100%" : 420 }}>
            {svc.features.map((f, idx) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.055 }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: isMobile ? "9px 12px" : "10px 14px",
                  borderRadius: 10, border: `1px solid ${featureBorder}`,
                  background: featureBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)"
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, flexShrink: 0, opacity: 0.85 }} />
                <span style={{
                  fontSize: isMobile ? 12 : 13, fontWeight: 600, color: featureText,
                  letterSpacing: "-0.01em", lineHeight: 1.3, transition: "color 0.4s ease"
                }}>{f.label}</span>
              </motion.div>
            ))}
          </div>

          <GlassCTA accent={accentColor} label="Start a project" />
        </motion.div>

        <motion.div
          key={`r-${svcIndex}`}
          initial={{ opacity: 0, x: isMobile ? 0 : 32, y: isMobile ? 20 : 0, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: isMobile ? mobileDemoHeight : 520, width: "100%", position: "relative" }}
        >
          <div style={{ position: "relative", height: "100%", width: "100%" }}>
            {svc.aiDemo
              ? <AiLiveDemo accent={accentColor} isDarkGlobal={isDark} />
              : svc.webAppDemo
                ? <FinanceAppDemo accent={accentColor} />
                : <PhotoGallery accent={accentColor} photos={svc.photos} isMobile={isMobile} />
            }
          </div>
        </motion.div>
      </div>

      <div style={{ position: "absolute", top: 0, left: "4%", right: "4%", height: 1, background: `linear-gradient(90deg,transparent,${edgeLineTop},transparent)` }} />
      <div style={{ position: "absolute", bottom: 0, left: "4%", right: "4%", height: 1, background: `linear-gradient(90deg,transparent,${edgeLineBottom},transparent)` }} />

      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 6, zIndex: 20 }}>
        {SERVICE_DATA.map((s, i) => {
          const dotAccent = isDark ? s.accent : s.accentLight;
          const r2 = hexRgb(dotAccent);
          return (
            <div key={i} style={{ width: i === svcIndex ? 24 : 7, height: 7, borderRadius: 99, background: i === svcIndex ? dotAccent : (isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.14)"), transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", boxShadow: i === svcIndex ? `0 0 12px rgba(${r2},0.75)` : "none" }} />
          );
        })}
      </div>
    </div>
  );
}