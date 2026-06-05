"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2, ArrowUpRight, Linkedin } from "lucide-react";

const contactInfo = [
  { icon: Mail,     label: "Email",            value: "hellofuturxt@gmail.com",   href: "mailto:hellofuturxt@gmail.com",       color: { dark: "#A8D4FF", light: "#1D4ED8" } },
  { icon: Phone,    label: "Phone / WhatsApp", value: "+84 0977 535 103",         href: "tel:+840977535103",                   color: { dark: "#D4AAFF", light: "#6D28D9" } },
  { icon: Linkedin, label: "LinkedIn",         value: "linkedin.com/in/futurxt",   href: "https://www.linkedin.com/in/futurxt/",color: { dark: "#7DD3C8", light: "#0F766E" } },
  { icon: MapPin,   label: "Location",         value: "Remote / Worldwide",        href: "#",                                   color: { dark: "#FFD580", light: "#B45309" } },
  { icon: Clock,    label: "Response Time",    value: "Within 24 Business Hours", href: "#",                                   color: { dark: "#B8F5A0", light: "#15803D" } },
];

const countryCodes = [
  { code: "+1",  name: "US/Canada" },{ code: "+7",  name: "Russia" },{ code: "+20", name: "Egypt" },
  { code: "+27", name: "South Africa" },{ code: "+30", name: "Greece" },{ code: "+31", name: "Netherlands" },
  { code: "+32", name: "Belgium" },{ code: "+33", name: "France" },{ code: "+34", name: "Spain" },
  { code: "+36", name: "Hungary" },{ code: "+39", name: "Italy" },{ code: "+40", name: "Romania" },
  { code: "+41", name: "Switzerland" },{ code: "+44", name: "UK" },{ code: "+45", name: "Denmark" },
  { code: "+46", name: "Sweden" },{ code: "+47", name: "Norway" },{ code: "+48", name: "Poland" },
  { code: "+49", name: "Germany" },{ code: "+51", name: "Peru" },{ code: "+52", name: "Mexico" },
  { code: "+54", name: "Argentina" },{ code: "+55", name: "Brazil" },{ code: "+56", name: "Chile" },
  { code: "+57", name: "Colombia" },{ code: "+60", name: "Malaysia" },{ code: "+61", name: "Australia" },
  { code: "+62", name: "Indonesia" },{ code: "+63", name: "Philippines" },{ code: "+64", name: "New Zealand" },
  { code: "+65", name: "Singapore" },{ code: "+66", name: "Thailand" },{ code: "+81", name: "Japan" },
  { code: "+82", name: "South Korea" },{ code: "+84", name: "Vietnam" },{ code: "+86", name: "China" },
  { code: "+90", name: "Turkey" },{ code: "+91", name: "India" },{ code: "+92", name: "Pakistan" },
  { code: "+94", name: "Sri Lanka" },{ code: "+95", name: "Myanmar" },{ code: "+98", name: "Iran" },
  { code: "+212", name: "Morocco" },{ code: "+213", name: "Algeria" },{ code: "+216", name: "Tunisia" },
  { code: "+234", name: "Nigeria" },{ code: "+254", name: "Kenya" },{ code: "+351", name: "Portugal" },
  { code: "+353", name: "Ireland" },{ code: "+358", name: "Finland" },{ code: "+380", name: "Ukraine" },
  { code: "+420", name: "Czech Republic" },{ code: "+421", name: "Slovakia" },{ code: "+852", name: "Hong Kong" },
  { code: "+855", name: "Cambodia" },{ code: "+856", name: "Laos" },{ code: "+880", name: "Bangladesh" },
  { code: "+886", name: "Taiwan" },{ code: "+966", name: "Saudi Arabia" },{ code: "+971", name: "UAE" },
  { code: "+974", name: "Qatar" },{ code: "+977", name: "Nepal" },{ code: "+998", name: "Uzbekistan" },
];

export function ContactSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+84");
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [customRequest, setCustomRequest] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [projectType, setProjectType] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sectionBg       = isDark ? "#000000" : "#f9f9fb";
  const topRuleBg       = isDark
    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)"
    : "linear-gradient(90deg, transparent, rgba(0,0,0,0.10), transparent)";
  const labelColor      = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.50)";
  const dividerColor    = isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.30)";
  const headingColor    = isDark ? "#ffffff" : "#0a0a0a";
  const headingShadow   = isDark ? "0 0 60px rgba(255,255,255,0.20), 0 0 120px rgba(168,212,255,0.12)" : "none";
  const subColor        = isDark ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.65)";
  const subHighlight    = isDark ? "#ffffff" : "#0a0a0a";
  const subHlShadow     = isDark ? "0 0 24px rgba(168,212,255,0.55)" : "none";

  const cardBg          = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder      = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)";
  const cardShadow      = isDark ? "0 2px 16px rgba(0,0,0,0.25)" : "0 2px 12px rgba(0,0,0,0.05)";

  const taglineText     = isDark ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.62)";
  const taglineBold     = isDark ? "#ffffff" : "#0a0a0a";
  const taglineShadow   = isDark ? "0 0 20px rgba(255,255,255,0.25)" : "none";

  const formPanelBg     = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const formPanelBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";
  const formPanelShadow = isDark
    ? "0 48px 120px rgba(0,0,0,0.60), inset 0 1.5px 0 rgba(255,255,255,0.18)"
    : "0 8px 40px rgba(0,0,0,0.08), inset 0 1.5px 0 rgba(255,255,255,0.90)";

  const inputBg          = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)";
  const inputBorder      = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)";
  const inputColor       = isDark ? "rgba(255,255,255,0.95)" : "#0a0a0a";
  const inputPlaceholder = isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.32)";
  const inputFocusBorder = isDark ? "rgba(168,212,255,0.60)" : "rgba(37,99,235,0.60)";
  const inputFocusBg     = isDark ? "rgba(255,255,255,0.09)" : "rgba(37,99,235,0.03)";
  const inputFocusShadow = isDark ? "0 0 0 3px rgba(168,212,255,0.12)" : "0 0 0 3px rgba(37,99,235,0.10)";
  const optionBg         = isDark ? "#0e0e18" : "#ffffff";
  const labelStyleColor  = isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.48)";

  const submitBg     = isDark
    ? "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,240,245,0.95) 100%)"
    : "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)";
  const submitColor  = isDark ? "#000000" : "#ffffff";
  const submitShadow = isDark
    ? "0 0 40px rgba(255,255,255,0.20), 0 4px 20px rgba(255,255,255,0.10)"
    : "0 4px 20px rgba(0,0,0,0.25)";
  const submitBorder    = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)";
  const footerNoteColor = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.40)";
  const footerNoteBold  = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.68)";

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 14,
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputColor,
    fontSize: 14,
    fontWeight: 450,
    outline: "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: "0.20em",
    textTransform: "uppercase" as const,
    color: labelStyleColor,
    display: "block",
    marginBottom: 8,
    fontWeight: 700,
  };

  const applyStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    styles: Record<string, string>
  ) => { Object.assign(e.target.style, styles); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true); setError("");
    const finalService = serviceNeeded === "other" ? `Other: ${customRequest}` : serviceNeeded;
    const fullPhone = phone ? `${countryCode} ${phone}` : "";
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone: fullPhone, company, service: finalService, projectType, budget, timeline, message }),
    });
    if (res.ok) { setSent(true); }
    else { const data = await res.json(); setError(data.error || "Something went wrong. Please try again."); }
    setSending(false);
  };

  // Shared card style — clean, no accent bar
  const contactCardStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    borderRadius: 18,
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    boxShadow: cardShadow,
    textDecoration: "none",
    transition: "border-color 0.22s, background 0.22s, transform 0.22s, box-shadow 0.22s",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",
  };

  return (
    <section
      id="contact"
      style={{
        position: "relative", width: "100%", minHeight: "100vh",
        display: "flex", alignItems: "center",
        background: sectionBg, overflow: "hidden",
        padding: isMobile ? "60px 0 80px" : "80px 0",
        transition: "background 0.4s ease",
      }}
    >
      <style>{`
        #contact input::placeholder,
        #contact textarea::placeholder { color: ${inputPlaceholder}; opacity: 1; }
        #contact select option { background: ${optionBg}; color: ${isDark ? "#fff" : "#0a0a0a"}; }
      `}</style>

      <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: 1, background: topRuleBg }} />

      {/* Ambient glows */}
      <div style={{
        position: "absolute", top: "10%", left: "5%", width: 600, height: 600, borderRadius: "50%",
        background: isDark ? "radial-gradient(circle, rgba(168,212,255,0.06) 0%, transparent 65%)" : "radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 65%)",
        pointerEvents: "none", filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", right: "5%", width: 500, height: 500, borderRadius: "50%",
        background: isDark ? "radial-gradient(circle, rgba(212,170,255,0.06) 0%, transparent 65%)" : "radial-gradient(circle, rgba(109,40,217,0.04) 0%, transparent 65%)",
        pointerEvents: "none", filter: "blur(40px)",
      }} />

      <div
        ref={ref}
        style={{
          position: "relative", zIndex: 10,
          maxWidth: 1300, margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 2rem",
          width: "100%", boxSizing: "border-box",
        }}
      >
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: isMobile ? "1.75rem" : "2.5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <div style={{ width: 36, height: 1, background: dividerColor }} />
            <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.32em", color: labelColor, textTransform: "uppercase", fontWeight: 700 }}>
              Contact Us
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Georgia','Times New Roman',serif",
            fontSize: isMobile ? "clamp(2rem,8vw,2.8rem)" : "clamp(2.8rem,4vw,4.2rem)",
            fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.035em",
            color: headingColor, margin: "0 0 18px", textShadow: headingShadow,
            transition: "color 0.4s ease",
          }}>
            Tell Us About Your Project
          </h2>
          <p style={{
            fontSize: isMobile ? 14 : 16, color: subColor,
            maxWidth: 600, lineHeight: 1.8, fontWeight: 400, letterSpacing: "0.005em",
            transition: "color 0.4s ease",
          }}>
            Tell us about your project, goals, and requirements. We'll review everything carefully and get back to you with recommendations, estimated timelines, and next steps within{" "}
            <span style={{ color: subHighlight, fontWeight: 700, textShadow: subHlShadow }}>24 business hours</span>.
          </p>
        </motion.div>

        {/* ── Two-col grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr",
          gap: isMobile ? "1.25rem" : "3rem",
          alignItems: "start", width: "100%", boxSizing: "border-box",
        }}>

          {/* ── Left column ── */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -28, y: isMobile ? 20 : 0 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", boxSizing: "border-box" }}
          >
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              const c = isDark ? item.color.dark : item.color.light;
              const isLink = item.href !== "#";
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.07 }}
                  style={contactCardStyle}
                  onMouseEnter={e => {
                    if (!isLink) return;
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${c}45`;
                    el.style.background = isDark ? "rgba(255,255,255,0.07)" : "rgba(248,249,252,0.95)";
                    el.style.transform = "translateY(-2px)";
                    el.style.boxShadow = `0 8px 32px rgba(0,0,0,${isDark ? "0.35" : "0.08"})`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = cardBorder;
                    el.style.background = cardBg;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = cardShadow;
                  }}
                >
                  {/* Top shimmer line */}
                  <div style={{
                    position: "absolute", top: 0, left: "1.5rem", right: "1.5rem", height: 1,
                    background: `linear-gradient(90deg, transparent, ${c}28, transparent)`,
                  }} />

                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${c}12`, border: `1px solid ${c}28`,
                  }}>
                    <Icon size={18} color={c} strokeWidth={1.8} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 10, fontFamily: "monospace", letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color: isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.45)",
                      margin: "0 0 3px", fontWeight: 700,
                    }}>{item.label}</p>
                    <p style={{
                      fontSize: 14, fontWeight: 700,
                      color: isDark ? "rgba(255,255,255,0.95)" : "#0a0a0a",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      letterSpacing: "-0.01em", margin: 0,
                    }}>{item.value}</p>
                  </div>

                  {/* Arrow — only for links */}
                  {isLink && (
                    <ArrowUpRight
                      size={14}
                      color={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.28)"}
                      style={{ flexShrink: 0 }}
                    />
                  )}
                </motion.a>
              );
            })}

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.65, duration: 0.6 }}
              style={{
                marginTop: 4,
                padding: isMobile ? "16px 18px" : "20px 22px",
                borderRadius: 18,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                boxShadow: cardShadow,
                transition: "background 0.4s ease, border 0.4s ease",
              }}
            >
              <p style={{
                fontSize: isMobile ? 13 : 14, lineHeight: 1.85, color: taglineText,
                margin: 0, fontWeight: 400, letterSpacing: "0.005em",
                transition: "color 0.4s ease",
              }}>
                We help startups and businesses transform ideas into scalable digital products —{" "}
                <span style={{ color: taglineBold, fontWeight: 700, textShadow: taglineShadow }}>
                  from high-converting websites and SaaS platforms
                </span>{" "}
                to AI-powered systems and automation solutions.
              </p>
            </motion.div>
          </motion.div>

          {/* ── Right column: form ── */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 28, y: isMobile ? 20 : 0 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%", boxSizing: "border-box" }}
          >
            <div style={{
              borderRadius: isMobile ? 20 : 28,
              background: formPanelBg,
              border: `1px solid ${formPanelBorder}`,
              backdropFilter: isDark ? "blur(80px) saturate(200%)" : "none",
              WebkitBackdropFilter: isDark ? "blur(80px) saturate(200%)" : "none",
              padding: isMobile ? "20px 16px" : "40px 40px",
              boxShadow: formPanelShadow,
              position: "relative", boxSizing: "border-box", width: "100%",
              transition: "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
            }}>
              <div style={{
                position: "absolute", top: 0, left: "2rem", right: "2rem", height: 1,
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent)",
              }} />

              {sent ? (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", padding: "72px 0",
                  textAlign: "center", position: "relative", zIndex: 1,
                }}>
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    style={{
                      width: 80, height: 80, borderRadius: "50%",
                      background: isDark ? "rgba(125,211,200,0.12)" : "rgba(15,118,110,0.08)",
                      border: `1px solid ${isDark ? "rgba(125,211,200,0.35)" : "rgba(15,118,110,0.30)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28,
                    }}
                  >
                    <CheckCircle2 size={38} color={isDark ? "#7DD3C8" : "#0F766E"} strokeWidth={1.8} />
                  </motion.div>
                  <h3 style={{ fontFamily: "'Georgia',serif", fontSize: 24, fontWeight: 800, color: headingColor, marginBottom: 12 }}>
                    Message Sent!
                  </h3>
                  <p style={{ fontSize: 15, color: isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.55)", maxWidth: 320, lineHeight: 1.8 }}>
                    Thank you for reaching out. We'll respond{" "}
                    <span style={{ color: headingColor, fontWeight: 700 }}>within 24 business hours</span>.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: isMobile ? 16 : 20, position: "relative", zIndex: 1 }}
                >
                  {/* Name + Email */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Name *</label>
                      <input type="text" required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, background: inputFocusBg, boxShadow: inputFocusShadow })}
                        onBlur={e => applyStyle(e, { borderColor: inputBorder, background: inputBg, boxShadow: "none" })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, background: inputFocusBg, boxShadow: inputFocusShadow })}
                        onBlur={e => applyStyle(e, { borderColor: inputBorder, background: inputBg, boxShadow: "none" })} />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label style={labelStyle}>Company / Organization</label>
                    <input type="text" placeholder="Your company name (optional)" value={company} onChange={e => setCompany(e.target.value)} style={inputBase}
                      onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, background: inputFocusBg, boxShadow: inputFocusShadow })}
                      onBlur={e => applyStyle(e, { borderColor: inputBorder, background: inputBg, boxShadow: "none" })} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>Phone / WhatsApp</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                        style={{ ...inputBase, width: isMobile ? 120 : 158, flexShrink: 0 }}
                        onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, boxShadow: inputFocusShadow })}
                        onBlur={e => applyStyle(e, { borderColor: inputBorder, boxShadow: "none" })}>
                        {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}  {c.name}</option>)}
                      </select>
                      <input type="tel" placeholder="Phone or WhatsApp number" value={phone} onChange={e => setPhone(e.target.value)}
                        style={{ ...inputBase, flex: 1 }}
                        onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, background: inputFocusBg, boxShadow: inputFocusShadow })}
                        onBlur={e => applyStyle(e, { borderColor: inputBorder, background: inputBg, boxShadow: "none" })} />
                    </div>
                  </div>

                  {/* Service + Project Type */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Service Needed</label>
                      <select value={serviceNeeded} onChange={e => setServiceNeeded(e.target.value)} style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, boxShadow: inputFocusShadow })}
                        onBlur={e => applyStyle(e, { borderColor: inputBorder, boxShadow: "none" })}>
                        <option value="">Choose a service...</option>
                        <option value="landing-page">Landing Page</option>
                        <option value="business-website">Business Website</option>
                        <option value="corporate-website">Corporate Website</option>
                        <option value="ecommerce-website">E-Commerce Website</option>
                        <option value="ux-ui-design">UX/UI Design</option>
                        <option value="mvp-development">MVP Development</option>
                        <option value="custom-software">Custom Software Development</option>
                        <option value="saas">SaaS Platform</option>
                        <option value="ai-integration">AI Integration</option>
                        <option value="ai-automation">AI Automation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Project Type</label>
                      <select value={projectType} onChange={e => setProjectType(e.target.value)} style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, boxShadow: inputFocusShadow })}
                        onBlur={e => applyStyle(e, { borderColor: inputBorder, boxShadow: "none" })}>
                        <option value="">Select type...</option>
                        <option value="startup">Startup</option>
                        <option value="small-business">Small Business</option>
                        <option value="growing-company">Growing Company</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="agency">Agency</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {serviceNeeded === "other" && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <label style={labelStyle}>Describe Your Request *</label>
                      <input type="text" required value={customRequest} onChange={e => setCustomRequest(e.target.value)}
                        placeholder="e.g. E-commerce platform with custom checkout..."
                        style={{ ...inputBase, borderColor: inputFocusBorder }}
                        onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, background: inputFocusBg, boxShadow: inputFocusShadow })}
                        onBlur={e => applyStyle(e, { borderColor: inputFocusBorder, background: inputBg, boxShadow: "none" })} />
                    </motion.div>
                  )}

                  {/* Budget + Timeline */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Project Budget</label>
                      <select value={budget} onChange={e => setBudget(e.target.value)} style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, boxShadow: inputFocusShadow })}
                        onBlur={e => applyStyle(e, { borderColor: inputBorder, boxShadow: "none" })}>
                        <option value="">Select budget...</option>
                        <option value="under-2500">Under $2,500</option>
                        <option value="2500-5000">$2,500 – $5,000</option>
                        <option value="5000-10000">$5,000 – $10,000</option>
                        <option value="10000-20000">$10,000 – $20,000</option>
                        <option value="20000-50000">$20,000 – $50,000</option>
                        <option value="50000+">$50,000+</option>
                        <option value="not-sure">Not Sure Yet</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Project Timeline</label>
                      <select value={timeline} onChange={e => setTimeline(e.target.value)} style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, boxShadow: inputFocusShadow })}
                        onBlur={e => applyStyle(e, { borderColor: inputBorder, boxShadow: "none" })}>
                        <option value="">Select timeline...</option>
                        <option value="asap">As Soon As Possible</option>
                        <option value="1month">Within 1 Month</option>
                        <option value="1-3months">1–3 Months</option>
                        <option value="3-6months">3–6 Months</option>
                        <option value="6months+">6+ Months</option>
                        <option value="exploring">Just Exploring</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={labelStyle}>Message *</label>
                    <textarea required rows={4}
                      placeholder="Describe your project goals, target audience, key features, and any AI functionality you'd like to include."
                      value={message} onChange={e => setMessage(e.target.value)}
                      style={{ ...inputBase, resize: "none", lineHeight: 1.80 }}
                      onFocus={e => applyStyle(e, { borderColor: inputFocusBorder, background: inputFocusBg, boxShadow: inputFocusShadow })}
                      onBlur={e => applyStyle(e, { borderColor: inputBorder, background: inputBg, boxShadow: "none" })} />
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: 13, color: isDark ? "#f87171" : "#DC2626", textAlign: "center", margin: 0 }}>
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit" disabled={sending}
                    whileHover={!sending ? { scale: 1.015 } : {}}
                    whileTap={!sending ? { scale: 0.985 } : {}}
                    style={{
                      width: "100%", padding: "16px", borderRadius: 16,
                      background: sending ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)") : submitBg,
                      border: `1px solid ${sending ? inputBorder : submitBorder}`,
                      color: sending ? (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.30)") : submitColor,
                      fontSize: 14, fontWeight: 800,
                      cursor: sending ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                      transition: "all 0.25s", letterSpacing: "0.04em",
                      boxShadow: sending ? "none" : submitShadow,
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {sending ? "Sending..." : <><Send size={15} strokeWidth={2.8} /> Send Message</>}
                  </motion.button>

                  <p style={{ fontSize: 11, color: footerNoteColor, textAlign: "center", margin: 0, letterSpacing: "0.03em" }}>
                    🔒 Your information is secure and confidential.{" "}
                    <span style={{ color: footerNoteBold, fontWeight: 600 }}>Our team responds within 24 business hours.</span>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}