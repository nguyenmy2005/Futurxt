"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

type Theme = "dark" | "light";

function MorphOrb({ theme, isMobile }: { theme: Theme; isMobile: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // Cleanup canvas cũ trước khi tạo mới
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const isTablet = window.innerWidth < 1024;
    const orbSize = isMobile ? 300 : isTablet ? 420 : 620;
    const W = orbSize, H = orbSize;

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      const THREE = (window as any).THREE;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
      camera.position.set(0, 0, 32);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      renderer.domElement.style.display = "block";
      renderer.domElement.style.margin = "0 auto";

      const group = new THREE.Group();
      scene.add(group);

      const COUNT = isMobile ? 600 : 1200;
      const SPHERE_R = 6.5;
      const CUBE_HALF = 5.2;
      const TRI_SCALE = 1.45;

      const spherePos: any[] = [];
      for (let i = 0; i < COUNT; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        spherePos.push(new THREE.Vector3(
          SPHERE_R * Math.sin(phi) * Math.cos(theta),
          SPHERE_R * Math.sin(phi) * Math.sin(theta),
          SPHERE_R * Math.cos(phi)
        ));
      }

      const cubePos: any[] = [];
      const cubeFaceFns = [
        (u: number, v: number) => new THREE.Vector3(CUBE_HALF, u, v),
        (u: number, v: number) => new THREE.Vector3(-CUBE_HALF, u, v),
        (u: number, v: number) => new THREE.Vector3(u, CUBE_HALF, v),
        (u: number, v: number) => new THREE.Vector3(u, -CUBE_HALF, v),
        (u: number, v: number) => new THREE.Vector3(u, v, CUBE_HALF),
        (u: number, v: number) => new THREE.Vector3(u, v, -CUBE_HALF),
      ];
      const sqrtPerFace = Math.ceil(Math.sqrt(COUNT / 6)) + 2;
      for (const fn of cubeFaceFns)
        for (let xi = 0; xi < sqrtPerFace; xi++)
          for (let yi = 0; yi < sqrtPerFace; yi++)
            cubePos.push(fn(
              ((xi + 0.5) / sqrtPerFace * 2 - 1) * CUBE_HALF,
              ((yi + 0.5) / sqrtPerFace * 2 - 1) * CUBE_HALF
            ));
      for (let i = cubePos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cubePos[i], cubePos[j]] = [cubePos[j], cubePos[i]];
      }
      while (cubePos.length < COUNT) cubePos.push(cubePos[cubePos.length - 1].clone());
      cubePos.length = COUNT;

      const triPos: any[] = [];
      const ts2 = SPHERE_R * TRI_SCALE;
      const TVERTS = [
        new THREE.Vector3(0, ts2 * 0.94, 0),
        new THREE.Vector3(-ts2 * 0.816, -ts2 * 0.333, ts2 * 0.471),
        new THREE.Vector3(ts2 * 0.816, -ts2 * 0.333, ts2 * 0.471),
        new THREE.Vector3(0, -ts2 * 0.333, -ts2 * 0.943),
      ];
      const TFACES: [number, number, number][] = [[0,1,2],[0,1,3],[0,2,3],[1,2,3]];
      const triPool: any[] = [];
      const N_TRI = 30;
      for (const [ai, bi, ci] of TFACES) {
        const VA = TVERTS[ai], VB = TVERTS[bi], VC = TVERTS[ci];
        for (let si = 0; si <= N_TRI; si++) {
          for (let ti2 = 0; ti2 <= N_TRI - si; ti2++) {
            const u = si / N_TRI, v = ti2 / N_TRI, w = 1 - u - v;
            if (w < -0.001) continue;
            triPool.push(new THREE.Vector3(
              VA.x * u + VB.x * v + VC.x * Math.max(0, w),
              VA.y * u + VB.y * v + VC.y * Math.max(0, w),
              VA.z * u + VB.z * v + VC.z * Math.max(0, w),
            ));
          }
        }
      }
      for (let i = triPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [triPool[i], triPool[j]] = [triPool[j], triPool[i]];
      }
      const step = triPool.length / COUNT;
      for (let i = 0; i < COUNT; i++) triPos.push(triPool[Math.floor(i * step)].clone());

      const isDarkTheme = theme === "dark";
      const sharedGeo = new THREE.SphereGeometry(0.10, 7, 7);
      const meshData: any[] = [];
      for (let i = 0; i < COUNT; i++) {
        const sp = spherePos[i];
        let color: any;
        if (isDarkTheme) {
          color = new THREE.Color(1, 1, 1); // dark → trắng
        } else {
          color = new THREE.Color(0, 0, 0); // light → đen
        }
        const mat = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(sharedGeo, mat);
        mesh.position.copy(sp);
        group.add(mesh);
        meshData.push({ mesh, sPos: sp, cPos: cubePos[i], tPos: triPos[i] });
      }

      group.rotation.x = 0.2;
      group.rotation.y = 0.3;

      let isDragging = false;
      let prevMouse = { x: 0, y: 0 };
      let rotV = { x: 0, y: 0 };

      const onMouseDown = (e: MouseEvent) => {
        if (isMobile) return;
        const r = renderer.domElement.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; rotV = { x: 0, y: 0 };
        }
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || isMobile) return;
        rotV.x = (e.clientY - prevMouse.y) * 0.011;
        rotV.y = (e.clientX - prevMouse.x) * 0.011;
        group.rotation.x += rotV.x; group.rotation.y += rotV.y;
        prevMouse = { x: e.clientX, y: e.clientY };
      };
      const onMouseUp = () => { isDragging = false; };

      if (!isMobile) {
        renderer.domElement.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        renderer.domElement.style.cursor = "grab";
      }

      const HOLD = 5000, TRANS = 2200, CYCLE = HOLD * 3 + TRANS * 3;
      const ease = (t: number) => {
        t = Math.max(0, Math.min(1, t));
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      const tmp = new THREE.Vector3();
      const lv = (a: any, b: any, t: number) => {
        tmp.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
        return tmp;
      };

      let animId: number;
      const startTime = performance.now();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const el = (performance.now() - startTime) % CYCLE;
        const p1 = HOLD, p2 = HOLD + TRANS, p3 = 2 * HOLD + TRANS;
        const p4 = 2 * HOLD + 2 * TRANS, p5 = 3 * HOLD + 2 * TRANS;
        for (const d of meshData) {
          if      (el < p1) d.mesh.position.copy(d.sPos);
          else if (el < p2) d.mesh.position.copy(lv(d.sPos, d.cPos, ease((el - p1) / TRANS)));
          else if (el < p3) d.mesh.position.copy(d.cPos);
          else if (el < p4) d.mesh.position.copy(lv(d.cPos, d.tPos, ease((el - p3) / TRANS)));
          else if (el < p5) d.mesh.position.copy(d.tPos);
          else              d.mesh.position.copy(lv(d.tPos, d.sPos, ease((el - p5) / TRANS)));
        }
        if (!isDragging) {
          rotV.x *= 0.93; rotV.y *= 0.93;
          group.rotation.x += rotV.x + 0.0004;
          group.rotation.y += rotV.y + 0.0018;
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        if (!isMobile) {
          renderer.domElement.removeEventListener("mousedown", onMouseDown);
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        }
        sharedGeo.dispose(); renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [theme, isMobile]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.6 }}
      className="
        w-[300px] h-[300px]
        md:w-[420px] md:h-[420px]
        lg:w-[560px] lg:h-[560px]
        xl:w-[620px] xl:h-[620px]
        flex-shrink-0 mx-auto lg:mx-0
      "
    >
      <div ref={mountRef} className="w-full h-full" />
    </motion.div>
  );
}

interface HeroSectionProps {
  theme: Theme;
}

export function HeroSection({ theme }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  const orbY        = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbOpacity  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isDark = theme === "dark";

  const bg              = isDark ? "#000000" : "#ffffff";
  const headingColor    = isDark ? "#ffffff" : "#0a0a0a";
  const headingShadow   = isDark
    ? "0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.1)"
    : "0 2px 8px rgba(0,0,0,0.08)";
  const dividerBg       = isDark
    ? "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)"
    : "linear-gradient(90deg, rgba(0,0,0,0.3), transparent)";
  const bodyColor       = isDark ? "rgba(255,255,255,0.75)" : "rgba(10,10,10,0.65)";
  const radialGlow      = isDark
    ? "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)"
    : "radial-gradient(circle, rgba(100,120,200,0.05) 0%, transparent 70%)";
  const scrollColor     = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
  const primaryBg       = isDark ? "#ffffff" : "#0a0a0a";
  const primaryColor    = isDark ? "#000000" : "#ffffff";
  const primaryHover    = isDark
    ? { scale: 1.04, boxShadow: "0 0 28px rgba(255,255,255,0.25)" }
    : { scale: 1.04, boxShadow: "0 0 28px rgba(0,0,0,0.18)" };
  const secondaryBg     = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const secondaryBorder = isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(0,0,0,0.16)";
  const secondaryColor  = isDark ? "rgba(255,255,255,0.9)" : "rgba(10,10,10,0.82)";
  const secondaryHover  = isDark
    ? { scale: 1.04, backgroundColor: "rgba(255,255,255,0.14)" }
    : { scale: 1.04, backgroundColor: "rgba(0,0,0,0.10)" };

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative w-full flex items-center overflow-hidden min-h-svh lg:h-screen"
      style={{ background: bg, transition: "background 0.4s ease" }}
    >
      <div
        className="
          pointer-events-none absolute rounded-full
          w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]
          top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
          lg:top-1/2 lg:left-auto lg:right-[8%] lg:translate-x-0 lg:-translate-y-1/2
        "
        style={{ background: radialGlow }}
      />

      <div
        className="
          relative z-10 w-full
          max-w-[1280px] mx-auto
          px-5 sm:px-8 lg:px-12
          pt-20 pb-16 sm:pt-24 sm:pb-20 lg:py-0
          flex flex-col lg:flex-row
          items-center
          justify-center lg:justify-between
          gap-6 lg:gap-12
        "
      >
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <h1
            className="font-black leading-[1.05] tracking-[-0.035em] mb-6 sm:mb-7"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(2.4rem, 7vw, 5rem)",
              color: headingColor,
              textShadow: headingShadow,
              transition: "color 0.4s ease, text-shadow 0.4s ease",
            }}
          >
            We build<br />
            systems that<br />
            scale
          </h1>

          <div
            className="w-12 h-px mb-6 sm:mb-7 mx-auto lg:mx-0"
            style={{ background: dividerBg, transition: "background 0.4s ease" }}
          />

          <p
            className="leading-[1.85] mb-10 sm:mb-11 font-normal tracking-[0.015em] max-w-[430px] mx-auto lg:mx-0"
            style={{
              fontSize: "clamp(0.95rem, 1.35vw, 1.15rem)",
              color: bodyColor,
              transition: "color 0.4s ease",
            }}
          >
            AI-powered web applications, intelligent automations, and scalable SaaS platforms—
            designed to help businesses grow faster and operate smarter.
          </p>

          <div className="flex gap-3 flex-wrap items-center justify-center lg:justify-start">
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={primaryHover}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl font-bold text-sm no-underline cursor-pointer tracking-[0.025em]"
              style={{
                padding: "13px 26px",
                background: primaryBg,
                color: primaryColor,
                transition: "background 0.4s ease, color 0.4s ease",
              }}
            >
              Start a Project
              <ArrowRight size={15} strokeWidth={2.5} />
            </motion.a>

            <motion.a
              href="#how-we-work"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("how-we-work")?.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={secondaryHover}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl font-semibold text-sm no-underline cursor-pointer tracking-[0.025em]"
              style={{
                padding: "13px 26px",
                background: secondaryBg,
                backdropFilter: "blur(18px) saturate(160%)",
                WebkitBackdropFilter: "blur(18px) saturate(160%)",
                border: secondaryBorder,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 24px rgba(0,0,0,0.12)",
                color: secondaryColor,
                transition: "background 0.25s ease, border 0.4s ease, color 0.4s ease",
              }}
            >
              See how we work
              <ChevronRight size={15} strokeWidth={2} style={{ opacity: 0.7 }} />
            </motion.a>
          </div>
        </motion.div>

        {mounted && (
          <motion.div
            style={isMobile ? {} : { y: orbY, opacity: orbOpacity }}
            className="flex-shrink-0 flex justify-center w-full lg:w-auto"
          >
            <MorphOrb theme={theme} isMobile={isMobile} />
          </motion.div>
        )}
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        className="
          absolute bottom-8 sm:bottom-11
          left-0 right-0 mx-auto w-fit
          flex flex-col items-center
          bg-transparent border-none cursor-pointer p-0 z-20
        "
      >
        <motion.span
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-[10px] sm:text-[11px] font-medium tracking-[0.38em] uppercase whitespace-nowrap"
          style={{
            fontFamily: "'Georgia', serif",
            color: scrollColor,
            transition: "color 0.4s ease",
          }}
        >
          Keep Scrolling
        </motion.span>
      </motion.button>
    </section>
  );
}