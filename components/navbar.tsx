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

// Helper: get the single page scroller (fixed container)
function getScroller(): HTMLElement | null {
  return document.querySelector(".snap-container") as HTMLElement | null;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // ── Scrolled state ──
  useEffect(() => {
    const container = getScroller();
    if (!container) return;
    const onScroll = () => setScrolled(container.scrollTop > 40);
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // ── Active section highlight ──
  useEffect(() => {
    const container = getScroller();
    const ids = ["about", "team", "services", "vision", "how-we-work", "contact"];

    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        // root: container for snap zone, null for normal zone — use null to cover both
        { root: null, threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // ── scrollTo: works for both snap zone and normal zone ──
  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const container = getScroller();
    if (container) {
      // Scroll the fixed container to the element's offsetTop
      const target = el as HTMLElement;
      const startY = container.scrollTop;
      const endY = target.offsetTop;
      const distance = endY - startY;
      const duration = 750;
      let startTime: number | null = null;

      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollTop = startY + distance * ease(progress);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ── Tokens ──
  const bgScrolled     = isDark ? "rgba(4,4,10,0.85)"      : "rgba(255,255,255,0.85)";
  const borderScrolled = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const navActive      = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.90)";
  const navInactive    = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.40)";
  const navActiveBg    = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const ctaBg          = isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.90)";
  const ctaColor       = isDark ? "#000"                   : "#fff";

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
        {/* Logo → scroll to top */}
        <button
          onClick={() => {
            const container = getScroller();
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

        {/* Nav items */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <button
                key={item.name}
                onClick={() => scrollTo(item.href)}
                className="relative px-4 py-2 text-[13px] font-medium transition-colors duration-200"
                style={{ color: isActive ? navActive : navInactive }}
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

        {/* CTA */}
        <motion.button
          onClick={() => scrollTo("#contact")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold"
          style={{ background: ctaBg, color: ctaColor }}
        >
          Start a Project
        </motion.button>
      </div>
    </motion.header>
  );
}