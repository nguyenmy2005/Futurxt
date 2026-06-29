"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { X, Monitor, Sparkles, Layers, TrendingUp } from "lucide-react";

export function PromoPopup() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window !== "undefined" &&
      (window.location.pathname === "/contact" || window.location.pathname.startsWith("/demo"))) return;
    const t = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(t);
  }, [mounted]);

  const dismiss = () => setVisible(false);

  const handleCTA = () => {
    dismiss();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!mounted) return null;
  if (typeof window !== "undefined" &&
    (window.location.pathname === "/contact" || window.location.pathname.startsWith("/demo"))) return null;

  const isDark = resolvedTheme === "dark";

  const bg          = isDark ? "#141414" : "#ffffff";
  const bgService   = isDark ? "#1e1e1e" : "#f5f5f5";
  const border      = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const textPrimary = isDark ? "#ffffff" : "#0a0a0a";
  const textSub     = isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.45)";
  const iconColor   = isDark ? "#7c6ff7" : "#6366f1";
  const closeBg     = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const ctaBg       = isDark ? "#ffffff" : "#0a0a0a";
  const ctaColor    = isDark ? "#0a0a0a" : "#ffffff";
  const serif       = "'Georgia','Times New Roman',serif";
  const trustColor  = isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)";

  const services = [
    { icon: Monitor,    label: "Website Development" },
    { icon: Sparkles,   label: "AI Automation" },
    { icon: Layers,     label: "Custom SaaS" },
    { icon: TrendingUp, label: "Lead Generation" },
  ];

  const popupWidth = isMobile ? "100%" : 400;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismiss}
              style={{
                position: "fixed", inset: 0, zIndex: 9990,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(6px)",
              }}
            />
          )}

          <motion.div
            initial={isMobile
              ? { opacity: 0, y: "100%" }
              : { opacity: 0, scale: 0.93, y: 20 }}
            animate={isMobile
              ? { opacity: 1, y: 0 }
              : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile
              ? { opacity: 0, y: "100%" }
              : { opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            style={{
              position: "fixed",
              bottom: isMobile ? 0 : 28,
              right: isMobile ? 0 : 28,
              left: isMobile ? 0 : "auto",
              zIndex: 9999,
              width: popupWidth,
              background: bg,
              border: isMobile ? "none" : `1px solid ${border}`,
              borderTop: `1px solid ${border}`,
              borderRadius: isMobile ? "24px 24px 0 0" : 20,
              boxShadow: isDark
                ? "0 40px 100px rgba(0,0,0,0.8)"
                : "0 40px 100px rgba(0,0,0,0.20)",
              overflow: "hidden",
              transition: "background 0.3s",
            }}
          >
            <div style={{ padding: isMobile ? "28px 24px 36px" : "28px 24px 28px" }}>

              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <p style={{
                  margin: 0, fontSize: 13, fontWeight: 800,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: textPrimary,
                }}>
                  FUTURXT
                </p>
                <button
                  onClick={dismiss}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    border: "none", background: closeBg,
                    cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                >
                  <X style={{ width: 16, height: 16, color: textPrimary }} />
                </button>
              </div>

              {/* Headline */}
              <h2 style={{
                fontFamily: serif,
                fontSize: isMobile ? "clamp(1.85rem,8vw,2.3rem)" : "2rem",
                fontWeight: 900,
                color: textPrimary,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                margin: "0 0 14px",
              }}>
                Websites that<br />
                grow your business
                <span style={{ color: iconColor }}>.</span>
              </h2>

              {/* Sub */}
              <p style={{
                fontFamily: serif,
                fontSize: 15,
                color: textSub,
                lineHeight: 1.7,
                margin: "0 0 22px",
              }}>
                Modern websites, AI automation and custom software built to help you generate more leads and save time.
              </p>

              {/* Service grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 18,
              }}>
                {services.map(({ icon: Icon, label }) => (
                  <div key={label} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "13px 14px",
                    borderRadius: 14,
                    background: bgService,
                    border: `1px solid ${border}`,
                  }}>
                    <Icon style={{ width: 18, height: 18, color: iconColor, flexShrink: 0 }} />
                    <span style={{
                      fontSize: 13, fontWeight: 600,
                      color: textPrimary, letterSpacing: "-0.01em",
                    }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCTA}
                style={{
                  width: "100%",
                  padding: isMobile ? "17px 0" : "16px 0",
                  borderRadius: 14,
                  background: ctaBg,
                  border: "none",
                  cursor: "pointer",
                  color: ctaColor,
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: "-0.01em",
                  fontFamily: "inherit",
                  marginBottom: 14,
                  transition: "background 0.3s, color 0.3s",
                }}
              >
                Get a free website audit →
              </motion.button>

              {/* Trust */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 7,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={trustColor} strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <span style={{ fontSize: 12, color: trustColor, fontWeight: 500 }}>
                  Trusted by growing businesses
                </span>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}