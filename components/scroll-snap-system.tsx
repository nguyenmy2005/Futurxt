"use client";

import {
  useRef, useEffect, useState, useCallback,
  createContext, useContext, ReactNode, Children, isValidElement, cloneElement,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Context ──────────────────────────────────────────────────────────────────
interface SnapCtx {
  activeIndex: number;
  totalSlides: number;
  goTo: (index: number) => void;
}
const SnapContext = createContext<SnapCtx>({ activeIndex: 0, totalSlides: 0, goTo: () => {} });
export const useSnapContext = () => useContext(SnapContext);

// ─── SnapSlide ────────────────────────────────────────────────────────────────
interface SnapSlideProps {
  id?: string;
  tall?: boolean;
  children: ReactNode;
  className?: string;
  _snap?: boolean;
}

export function SnapSlide({ id, tall = false, children, className = "", _snap = true }: SnapSlideProps) {
  if (!_snap) {
    return (
      <section id={id} className={["relative w-full", className].join(" ")}>
        {children}
      </section>
    );
  }

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

// ─── SnapContainer ────────────────────────────────────────────────────────────
interface SnapContainerProps {
  children: ReactNode;
  snapCount?: number;
}

export function SnapContainer({ children, snapCount }: SnapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const inNormalZone = useRef(false); // ← track xem đang ở normal zone không
  const [isMobile, setIsMobile] = useState(false);

  const allChildren = Children.toArray(children);
  const snapEnd = snapCount ?? allChildren.length;
  const snapKids = allChildren.slice(0, snapEnd);
  const normalKids = allChildren.slice(snapEnd);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── goTo ──
  const goTo = useCallback((index: number) => {
    const el = containerRef.current;
    if (!el || isAnimating.current) return;
    const slides = Array.from(el.querySelectorAll("[data-snap-slide]"));
    const target = slides[index] as HTMLElement;
    if (!target) return;

    isAnimating.current = true;
    inNormalZone.current = false;
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

  // ── IntersectionObserver: CHỈ observe snap slides ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Chỉ lấy đúng snapEnd slides đầu tiên
    const allSlides = Array.from(el.querySelectorAll("[data-snap-slide]"));
    const snapSlides = allSlides.slice(0, snapEnd);

    const observer = new IntersectionObserver(
      (entries) => {
        // Không update nếu đang ở normal zone
        if (inNormalZone.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = snapSlides.indexOf(entry.target as HTMLElement);
            if (idx !== -1) {
              setActiveIndex(idx);
              currentIndex.current = idx;
            }
          }
        });
      },
      { root: isMobile ? null : el, threshold: 0.5 }
    );
    snapSlides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isMobile, snapEnd]);

  // ── Scroll listener: track normal zone bằng scroll position thực tế ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (isAnimating.current) return;
      const snapSlides = Array.from(el.querySelectorAll("[data-snap-slide]"));
      if (snapSlides.length === 0) return;

      // Tính boundary: bottom của snap slide cuối cùng
      const lastSnapSlide = snapSlides[snapSlides.length - 1] as HTMLElement;
      const snapZoneBottom = lastSnapSlide.offsetTop + lastSnapSlide.offsetHeight;
      const scrollBottom = el.scrollTop + el.clientHeight;

      if (scrollBottom > snapZoneBottom + 50) {
        // Đã scroll vào normal zone
        inNormalZone.current = true;
      } else if (el.scrollTop < lastSnapSlide.offsetTop - 50) {
        // Scroll ngược lên về snap zone
        inNormalZone.current = false;
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [snapEnd]);

  // ── Wheel handler ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let accumulated = 0;
    const THRESHOLD = 50;
    let resetTimer: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return;

      // Nếu đang ở normal zone → không intercept gì cả
      if (inNormalZone.current) return;

      const snapSlides = Array.from(el.querySelectorAll("[data-snap-slide]"));
      const snapSlideCount = snapSlides.length;
      const isLastSnap = currentIndex.current === snapSlideCount - 1;
      const currentSlide = snapSlides[currentIndex.current] as HTMLElement | undefined;
      const isTall = currentSlide?.dataset.tall === "true";

      if (isTall) {
        const slideTop = currentSlide!.offsetTop;
        const slideHeight = currentSlide!.offsetHeight;
        const scrollTop = el.scrollTop;
        const atBottom = scrollTop + el.clientHeight >= slideTop + slideHeight - 10;
        const atTop = scrollTop <= slideTop + 10;
        if (e.deltaY > 0 && !atBottom) { e.preventDefault(); return; }
        if (e.deltaY > 0 && atBottom && isLastSnap) {
          // Vào normal zone
          inNormalZone.current = true;
          return;
        }
        if (e.deltaY < 0 && !atTop) return;
      } else {
        if (isLastSnap && e.deltaY > 0) {
          // Vào normal zone
          inNormalZone.current = true;
          return;
        }
      }

      e.preventDefault();
      if (isAnimating.current) return;

      accumulated += e.deltaY;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { accumulated = 0; }, 200);

      if (Math.abs(accumulated) >= THRESHOLD) {
        const dir = accumulated > 0 ? 1 : -1;
        accumulated = 0;

        // Scroll ngược lên từ snap slide đầu tiên → không làm gì
        if (dir === -1 && currentIndex.current === 0) return;

        const next = Math.max(0, Math.min(currentIndex.current + dir, snapSlideCount - 1));
        if (next !== currentIndex.current) goTo(next);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // ── Keyboard ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (window.innerWidth < 1024) return;
      if (isAnimating.current) return;
      if (inNormalZone.current) return; // không intercept khi ở normal zone

      const snapSlides = Array.from(el.querySelectorAll("[data-snap-slide]"));
      const snapSlideCount = snapSlides.length;
      const isLastSnap = currentIndex.current === snapSlideCount - 1;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (isLastSnap) {
          inNormalZone.current = true;
          return;
        }
        e.preventDefault();
        goTo(Math.min(currentIndex.current + 1, snapSlideCount - 1));
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(Math.max(currentIndex.current - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  // ── Touch ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };

    const onTouchEnd = (e: TouchEvent) => {
      if (window.innerWidth < 1024) return;
      if (isAnimating.current) return;
      if (inNormalZone.current) return; // không intercept khi ở normal zone

      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;

      const snapSlides = Array.from(el.querySelectorAll("[data-snap-slide]"));
      const snapSlideCount = snapSlides.length;
      const isLastSnap = currentIndex.current === snapSlideCount - 1;

      if (isLastSnap && dy > 0) {
        inNormalZone.current = true;
        return;
      }

      const currentSlide = snapSlides[currentIndex.current] as HTMLElement | undefined;
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
      const next = Math.max(0, Math.min(currentIndex.current + dir, snapSlideCount - 1));
      if (next !== currentIndex.current) goTo(next);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo]);

  // ─── Mobile render ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <SnapContext.Provider value={{ activeIndex, totalSlides: snapEnd, goTo }}>
        <div ref={containerRef} style={{ width: "100%", height: "auto" }}>
          {allChildren}
        </div>
      </SnapContext.Provider>
    );
  }

  // ─── Desktop render ────────────────────────────────────────────────────────
  return (
    <SnapContext.Provider value={{ activeIndex, totalSlides: snapEnd, goTo }}>
      <div
        ref={containerRef}
        className="snap-container [&::-webkit-scrollbar]:hidden"
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {snapKids.map((child, i) =>
          isValidElement(child)
            ? cloneElement(child as React.ReactElement<SnapSlideProps>, { _snap: true, key: i })
            : child
        )}
        {normalKids.map((child, i) =>
          isValidElement(child)
            ? cloneElement(child as React.ReactElement<SnapSlideProps>, { _snap: false, key: `n-${i}` })
            : child
        )}
      </div>
    </SnapContext.Provider>
  );
}

// ─── SlideTransition ─────────────────────────────────────────────────────────
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

  if (isMobile) return <div style={{ width: "100%", height: "100%" }}>{children}</div>;

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