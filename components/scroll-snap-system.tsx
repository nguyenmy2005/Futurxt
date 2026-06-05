"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SnapCtx {
  activeIndex: number;
  totalSlides: number;
  goTo: (index: number) => void;
}
const SnapContext = createContext<SnapCtx>({ activeIndex: 0, totalSlides: 0, goTo: () => {} });
export const useSnapContext = () => useContext(SnapContext);

interface SnapSlideProps {
  id?: string;
  tall?: boolean;
  children: ReactNode;
  className?: string;
}

export function SnapSlide({ id, tall = false, children, className = "" }: SnapSlideProps) {
  return (
    <section
      id={id}
      data-snap-slide
      data-tall={tall ? "true" : undefined}
      className={[
        "relative w-full",
        tall
          ? "h-auto min-h-screen overflow-visible"
          : "min-h-svh lg:h-screen lg:overflow-hidden overflow-visible",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

interface SnapContainerProps {
  children: ReactNode;
  showDots?: boolean;
}

export function SnapContainer({ children, showDots = true }: SnapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const slides = el.querySelectorAll("[data-snap-slide]");
    setTotalSlides(slides.length);
  }, [children]);

  const goTo = useCallback((index: number) => {
    const el = containerRef.current;
    if (!el || isAnimating.current) return;
    const slides = Array.from(el.querySelectorAll("[data-snap-slide]"));
    const target = slides[index] as HTMLElement;
    if (!target) return;

    isAnimating.current = true;
    currentIndex.current = index;
    setActiveIndex(index);

    const startY = el.scrollTop;
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
      el.scrollTop = startY + distance * ease(progress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.scrollTop = endY;
        setTimeout(() => { isAnimating.current = false; }, 400);
      }
    };

    requestAnimationFrame(step);
  }, []);

  // IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll("[data-snap-slide]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = slides.indexOf(entry.target as HTMLElement);
            if (idx !== -1) {
              setActiveIndex(idx);
              currentIndex.current = idx;
            }
          }
        });
      },
      { root: isMobile ? null : el, threshold: 0.5 }
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [children, isMobile]);

  // Wheel — desktop only
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let accumulated = 0;
    const THRESHOLD = 50;
    let resetTimer: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return;

      const slides = Array.from(el.querySelectorAll("[data-snap-slide]"));
      const currentSlide = slides[currentIndex.current] as HTMLElement | undefined;
      const isTall = currentSlide?.dataset.tall === "true";

      if (isTall) {
        const slideTop = currentSlide!.offsetTop;
        const slideHeight = currentSlide!.offsetHeight;
        const scrollTop = el.scrollTop;
        const atBottom = scrollTop + el.clientHeight >= slideTop + slideHeight - 10;
        const atTop = scrollTop <= slideTop + 10;

        if (e.deltaY > 0 && !atBottom) return;
        if (e.deltaY < 0 && !atTop) return;
      }

      e.preventDefault();
      if (isAnimating.current) return;

      accumulated += e.deltaY;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { accumulated = 0; }, 200);

      if (Math.abs(accumulated) >= THRESHOLD) {
        const dir = accumulated > 0 ? 1 : -1;
        accumulated = 0;
        const next = Math.max(0, Math.min(currentIndex.current + dir, totalSlides - 1));
        if (next !== currentIndex.current) goTo(next);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo, totalSlides]);

  // Keyboard — desktop only
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (window.innerWidth < 1024) return;
      if (isAnimating.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(Math.min(currentIndex.current + 1, totalSlides - 1));
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(Math.max(currentIndex.current - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, totalSlides]);

  // Touch
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (window.innerWidth < 1024) return;
      if (isAnimating.current) return;

      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;

      const slides = Array.from(el.querySelectorAll("[data-snap-slide]"));
      const currentSlide = slides[currentIndex.current] as HTMLElement | undefined;
      const isTall = currentSlide?.dataset.tall === "true";

      if (isTall) {
        const slideTop = currentSlide!.offsetTop;
        const slideHeight = currentSlide!.offsetHeight;
        const scrollTop = el.scrollTop;
        const atBottom = scrollTop + el.clientHeight >= slideTop + slideHeight - 10;
        const atTop = scrollTop <= slideTop + 10;
        if (dy > 0 && !atBottom) return;
        if (dy < 0 && !atTop) return;
      }

      const dir = dy > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(currentIndex.current + dir, totalSlides - 1));
      if (next !== currentIndex.current) goTo(next);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo, totalSlides]);

  // Mobile
  if (isMobile) {
    return (
      <SnapContext.Provider value={{ activeIndex, totalSlides, goTo }}>
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "auto",
            // ← backgroundColor hardcode đã xóa, CSS tự xử lý
          }}
        >
          {children}
        </div>
      </SnapContext.Provider>
    );
  }

  // Desktop
  return (
    <SnapContext.Provider value={{ activeIndex, totalSlides, goTo }}>
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "scroll",
          scrollSnapType: "none",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {showDots && <DotNav />}
    </SnapContext.Provider>
  );
}

const SLIDE_LABELS = [
  "Intro", "Hero", "About", "Team", "Services",
  "Vision", "How We Work", "Idea", "Contact", "Footer",
];

function DotNav() {
  const { activeIndex, totalSlides, goTo } = useSnapContext();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="hidden lg:flex flex-col items-center"
      style={{
        position: "fixed",
        right: 28,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 200,
        gap: 10,
      }}
    >
      {Array.from({ length: totalSlides }).map((_, i) => {
        const isActive = i === activeIndex;
        const label = SLIDE_LABELS[i] ?? `${i + 1}`;
        return (
          <div
            key={i}
            style={{ position: "relative", display: "flex", alignItems: "center" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <AnimatePresence>
              {hovered === i && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: "absolute", right: 18, whiteSpace: "nowrap",
                    fontSize: 10, fontFamily: "monospace", letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.55)", textTransform: "uppercase",
                    pointerEvents: "none", userSelect: "none",
                  }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              onClick={() => goTo(i)}
              animate={{ width: isActive ? 20 : 5, height: 5, opacity: isActive ? 1 : 0.3 }}
              whileHover={{ opacity: 0.75, scale: 1.3 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: 99, border: "none", background: "#ffffff",
                cursor: "pointer", padding: 0, display: "block",
              }}
              aria-label={`Go to ${label}`}
            />
          </div>
        );
      })}
    </div>
  );
}

interface SlideTransitionProps {
  slideIndex: number;
  children: ReactNode;
  direction?: "up" | "fade";
}

export function SlideTransition({ slideIndex, children, direction = "up" }: SlideTransitionProps) {
  const { activeIndex } = useSnapContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
  }

  const isActive = activeIndex === slideIndex;

  const variants = {
    hidden: direction === "fade" ? { opacity: 0 } : { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
    exit: direction === "fade" ? { opacity: 0 } : { opacity: 0, y: -30 },
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={slideIndex}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", height: "100%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}