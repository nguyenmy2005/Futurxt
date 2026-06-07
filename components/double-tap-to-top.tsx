"use client";
import { useEffect } from "react";

export function DoubleTapToTop() {
  useEffect(() => {
    let lastTap = 0;
    const handler = () => {
      const now = Date.now();
      if (now - lastTap < 300) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      lastTap = now;
    };
    document.addEventListener("touchend", handler);
    return () => document.removeEventListener("touchend", handler);
  }, []);
  return null;
}