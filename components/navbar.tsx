"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const NAV_ITEMS = [
  { name: "About",       href: "#about"        },
  { name: "Team",        href: "#team"          },
  { name: "Services",    href: "#services"      },
  { name: "Vision",      href: "#vision"        },
  { name: "How We Work", href: "#how-we-work"   },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const container = document.querySelector(".snap-container") as HTMLElement;
    if (!container) return;
    const onScroll = () => setScrolled(container.scrollTop > 40);
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".snap-container") as HTMLElement;
    if (!container) return;
    const ids = ["about", "team", "services", "vision", "how-we-work", "contact"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        { root: container, threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.replace("#", ""));
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Tokens ──
  const bgScrolled    = isDark ? "rgba(4,4,10,0.85)"        : "rgba(255,255,255,0.85)";
  const borderScrolled= isDark ? "rgba(255,255,255,0.06)"   : "rgba(0,0,0,0.08)";
  const navActive     = isDark ? "rgba(255,255,255,0.95)"   : "rgba(0,0,0,0.90)";
  const navInactive   = isDark ? "rgba(255,255,255,0.45)"   : "rgba(0,0,0,0.40)";
  const navActiveBg   = isDark ? "rgba(255,255,255,0.06)"   : "rgba(0,0,0,0.06)";
  const ctaBg         = isDark ? "rgba(255,255,255,0.92)"   : "rgba(0,0,0,0.90)";
  const ctaColor      = isDark ? "#000"                     : "#fff";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? bgScrolled : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? `1px solid ${borderScrolled}`
          : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => {
            const container = document.querySelector(".snap-container") as HTMLElement;
            container?.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 group"
        >
          <img
            src={isDark ? "/Futurax.X.png" : "/Futurax.XX.png"}
            alt="Futurax"
            className="h-8 w-auto"
          />
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <button
                key={item.name}
                onClick={() => scrollTo(item.href)}
                className="relative px-4 py-2 text-[13px] font-medium transition-colors duration-200"
                style={{
                  color: isActive ? navActive : navInactive,
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="navActive"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: navActiveBg }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <motion.button
          onClick={() => scrollTo("#contact")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold"
          style={{
            background: ctaBg,
            color: ctaColor,
          }}
        >
          Start a Project
        </motion.button>
      </div>
    </motion.header>
  );
}