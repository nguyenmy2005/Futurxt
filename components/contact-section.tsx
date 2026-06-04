"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2, ArrowUpRight, MessageCircle, Linkedin } from "lucide-react";

const contactInfo = [
  { icon: Mail,          label: "Email",            value: "hellofuturxt@gmail.com",                    href: "mailto:hellofuturxt@gmail.com",                color: "#A8D4FF" },
  { icon: Phone,         label: "Phone / WhatsApp", value: "+84 0977 535 103",                          href: "tel:+840977535103",                            color: "#D4AAFF" },
  { icon: Linkedin,      label: "LinkedIn",         value: "linkedin.com/in/futurxt",                   href: "https://www.linkedin.com/in/futurxt/",         color: "#7DD3C8" },
  { icon: MapPin,        label: "Location",         value: "Remote / Worldwide",                        href: "#",                                            color: "#FFD580" },
  { icon: Clock,         label: "Response Time",    value: "Typically within 12–24 hours",              href: "#",                                            color: "#B8F5A0" },
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

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  color: "rgba(255,255,255,0.92)",
  fontSize: 14,
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
  color: "rgba(255,255,255,0.45)",
  display: "block",
  marginBottom: 8,
  fontWeight: 700,
};

export function ContactSection() {
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
  const [referral, setReferral] = useState("");
  const [projectType, setProjectType] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
      body: JSON.stringify({
        name, email, phone: fullPhone,
        company,
        service: finalService,
        projectType,
        budget,
        timeline,
        referral,
        message,
      }),
    });
    if (res.ok) { setSent(true); }
    else { const data = await res.json(); setError(data.error || "Something went wrong. Please try again."); }
    setSending(false);
  };

  return (
    <section
      id="contact"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "#000000",
        overflow: "hidden",
        padding: isMobile ? "60px 0 80px" : "80px 0",
      }}
    >
      {/* Top border rule */}
      <div style={{
        position: "absolute", top: 0, left: "6%", right: "6%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
      }} />

      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", top: "10%", left: "5%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,212,255,0.07) 0%, transparent 65%)",
        pointerEvents: "none", filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", right: "5%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,170,255,0.07) 0%, transparent 65%)",
        pointerEvents: "none", filter: "blur(40px)",
      }} />

      <div
        ref={ref}
        style={{
          position: "relative", zIndex: 10,
          maxWidth: 1300, margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 2rem",
          width: "100%",
          boxSizing: "border-box",
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
            <div style={{ width: 36, height: 1, background: "rgba(255,255,255,0.60)" }} />
            <span style={{
              fontSize: 11, fontFamily: "monospace",
              letterSpacing: "0.32em", color: "rgba(255,255,255,0.55)",
              textTransform: "uppercase", fontWeight: 700,
            }}>
              Contact Us
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Georgia','Times New Roman',serif",
            fontSize: isMobile ? "clamp(2rem,8vw,2.8rem)" : "clamp(2.8rem,4vw,4.2rem)",
            fontWeight: 900, lineHeight: 1.04,
            letterSpacing: "-0.035em", color: "#ffffff",
            margin: "0 0 18px",
            textShadow: "0 0 60px rgba(255,255,255,0.20), 0 0 120px rgba(168,212,255,0.12)",
          }}>
            Start Your Project
          </h2>
          <p style={{
            fontSize: isMobile ? 14 : 16,
            color: "rgba(255,255,255,0.80)",
            maxWidth: 560,
            lineHeight: 1.8,
            fontWeight: 400,
            letterSpacing: "0.005em",
            textShadow: "0 1px 20px rgba(255,255,255,0.08)",
          }}>
            Tell us about your project. We'll recommend the right approach, provide expert guidance, and respond within{" "}
            <span style={{
              color: "#ffffff",
              fontWeight: 700,
              textShadow: "0 0 24px rgba(168,212,255,0.55), 0 0 48px rgba(168,212,255,0.25)",
            }}>
              24 hours
            </span>.
          </p>
        </motion.div>

        {/* ── Two-col grid (desktop) / single col (mobile) ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr",
          gap: isMobile ? "1.25rem" : "3rem",
          alignItems: "start",
          width: "100%",
          boxSizing: "border-box",
        }}>

          {/* ── LEFT: contact cards ── */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -28, y: isMobile ? 20 : 0 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", boxSizing: "border-box" }}
          >
            {/* Mobile: show cards in 2-col grid */}
            {isMobile ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                width: "100%",
                boxSizing: "border-box",
              }}>
                {contactInfo.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      initial={{ opacity: 0, y: 12 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.45, delay: 0.2 + i * 0.06 }}
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "14px 14px",
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        backdropFilter: "blur(60px) saturate(200%)",
                        WebkitBackdropFilter: "blur(60px) saturate(200%)",
                        textDecoration: "none",
                        transition: "border-color 0.25s, background 0.25s",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                        overflow: "hidden",
                        cursor: "pointer",
                        boxSizing: "border-box",
                        minWidth: 0,
                      }}
                    >
                      <div style={{
                        position: "absolute", top: 0, left: "1rem", right: "1rem", height: 1,
                        background: `linear-gradient(90deg, transparent, ${item.color}35, transparent)`,
                      }} />
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: `${item.color}12`, border: `1px solid ${item.color}28`,
                        boxShadow: `0 0 16px ${item.color}18, inset 0 1px 0 ${item.color}20`,
                      }}>
                        <Icon size={16} color={item.color} strokeWidth={1.8} />
                      </div>
                      <div style={{ minWidth: 0, width: "100%" }}>
                        <p style={{
                          fontSize: 9, fontFamily: "monospace", letterSpacing: "0.18em",
                          textTransform: "uppercase", color: "rgba(255,255,255,0.32)",
                          marginBottom: 3, fontWeight: 700, margin: "0 0 3px",
                        }}>{item.label}</p>
                        <p style={{
                          fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.88)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          letterSpacing: "-0.01em", margin: 0,
                        }}>{item.value}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            ) : (
              /* Desktop: original single-col cards */
              contactInfo.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                    style={{
                      position: "relative", display: "flex", alignItems: "center",
                      gap: 16, padding: "18px 20px", borderRadius: 18,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      backdropFilter: "blur(60px) saturate(200%)",
                      WebkitBackdropFilter: "blur(60px) saturate(200%)",
                      textDecoration: "none",
                      transition: "border-color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      overflow: "hidden", cursor: "pointer",
                      marginBottom: 10,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = `${item.color}50`;
                      el.style.background = "rgba(255,255,255,0.07)";
                      el.style.transform = "translateY(-2px) translateX(4px)";
                      el.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${item.color}20`;
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(255,255,255,0.10)";
                      el.style.background = "rgba(255,255,255,0.04)";
                      el.style.transform = "translateY(0) translateX(0)";
                      el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08)";
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 0, left: "1.2rem", right: "1.2rem", height: 1,
                      background: `linear-gradient(90deg, transparent, ${item.color}35, transparent)`,
                    }} />
                    <div style={{
                      position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2,
                      borderRadius: "0 2px 2px 0",
                      background: `linear-gradient(180deg, transparent, ${item.color}60, transparent)`,
                    }} />
                    <div style={{
                      width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${item.color}12`, border: `1px solid ${item.color}28`,
                      boxShadow: `0 0 20px ${item.color}18, inset 0 1px 0 ${item.color}20`,
                    }}>
                      <Icon size={19} color={item.color} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 10, fontFamily: "monospace", letterSpacing: "0.20em",
                        textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: 3, fontWeight: 700,
                      }}>{item.label}</p>
                      <p style={{
                        fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.92)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.01em",
                      }}>{item.value}</p>
                    </div>
                    <ArrowUpRight size={14} color="rgba(255,255,255,0.22)" style={{ flexShrink: 0 }} />
                  </motion.a>
                );
              })
            )}

            {/* Tagline box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.65, duration: 0.6 }}
              style={{
                marginTop: 6, padding: isMobile ? "16px 18px" : "22px 24px", borderRadius: 18,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                position: "relative", overflow: "hidden",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09)",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: "1.5rem", right: "1.5rem", height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              }} />
              <p style={{
                fontSize: isMobile ? 13 : 14,
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.82)",
                margin: 0,
                fontWeight: 400,
                letterSpacing: "0.005em",
                textShadow: "0 1px 12px rgba(255,255,255,0.06)",
              }}>
                We partner with ambitious startups and businesses to{" "}
                <span style={{
                  color: "#ffffff",
                  fontWeight: 700,
                  textShadow: "0 0 20px rgba(255,255,255,0.30)",
                }}>
                  design, build, and launch
                </span>{" "}
                exceptional digital experiences — powered by modern web technologies and AI.
              </p>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: form ── */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 28, y: isMobile ? 20 : 0 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%", boxSizing: "border-box" }}
          >
            <div style={{
              borderRadius: isMobile ? 20 : 28,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(80px) saturate(200%) brightness(1.06)",
              WebkitBackdropFilter: "blur(80px) saturate(200%) brightness(1.06)",
              padding: isMobile ? "20px 16px" : "40px 40px",
              boxShadow: [
                "0 48px 120px rgba(0,0,0,0.60)",
                "inset 0 1.5px 0 rgba(255,255,255,0.20)",
                "inset 0 -1px 0 rgba(255,255,255,0.05)",
                "inset 1px 0 0 rgba(255,255,255,0.06)",
                "inset -1px 0 0 rgba(255,255,255,0.06)",
              ].join(","),
              overflow: "hidden", position: "relative",
              boxSizing: "border-box",
              width: "100%",
            }}>
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(168,212,255,0.07) 0%, transparent 70%)",
              }} />
              <div style={{
                position: "absolute", bottom: 0, right: 0, width: 300, height: 300,
                borderRadius: "50%", pointerEvents: "none",
                background: "radial-gradient(circle, rgba(212,170,255,0.05) 0%, transparent 70%)",
              }} />
              <div style={{
                position: "absolute", top: 0, left: "2rem", right: "2rem", height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
              }} />

              {sent ? (
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: "72px 0", textAlign: "center", position: "relative", zIndex: 1,
                }}>
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    style={{
                      width: 80, height: 80, borderRadius: "50%",
                      background: "rgba(125,211,200,0.12)",
                      border: "1px solid rgba(125,211,200,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 28,
                      boxShadow: "0 0 60px rgba(125,211,200,0.25), inset 0 1px 0 rgba(125,211,200,0.25)",
                    }}
                  >
                    <CheckCircle2 size={38} color="#7DD3C8" strokeWidth={1.8} />
                  </motion.div>
                  <h3 style={{
                    fontFamily: "'Georgia',serif", fontSize: 24, fontWeight: 800,
                    color: "#ffffff", marginBottom: 12, textShadow: "0 0 30px rgba(255,255,255,0.20)",
                  }}>
                    Message Sent!
                  </h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 320, lineHeight: 1.8 }}>
                    Thank you for reaching out. We'll respond{" "}
                    <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>typically within 12–24 hours</span>.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: isMobile ? 16 : 20, position: "relative", zIndex: 1 }}
                >
                  {/* Row 1: Name + Email */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Name *</label>
                      <input
                        type="text" required placeholder="Your name"
                        value={name} onChange={e => setName(e.target.value)}
                        style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.55)", background: "rgba(255,255,255,0.09)", boxShadow: "0 0 0 3px rgba(168,212,255,0.12)" })}
                        onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)", boxShadow: "none" })}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input
                        type="email" required placeholder="your@email.com"
                        value={email} onChange={e => setEmail(e.target.value)}
                        style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.55)", background: "rgba(255,255,255,0.09)", boxShadow: "0 0 0 3px rgba(168,212,255,0.12)" })}
                        onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)", boxShadow: "none" })}
                      />
                    </div>
                  </div>

                  {/* Row 2: Company */}
                  <div>
                    <label style={labelStyle}>Company / Organization</label>
                    <input
                      type="text" placeholder="Your company name (optional)"
                      value={company} onChange={e => setCompany(e.target.value)}
                      style={inputBase}
                      onFocus={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.55)", background: "rgba(255,255,255,0.09)", boxShadow: "0 0 0 3px rgba(168,212,255,0.12)" })}
                      onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)", boxShadow: "none" })}
                    />
                  </div>

                  {/* Row 3: Phone */}
                  <div>
                    <label style={labelStyle}>Phone / WhatsApp</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <select
                        value={countryCode} onChange={e => setCountryCode(e.target.value)}
                        style={{ ...inputBase, width: isMobile ? 120 : 158, flexShrink: 0 }}
                        onFocus={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.55)", boxShadow: "0 0 0 3px rgba(168,212,255,0.12)" })}
                        onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", boxShadow: "none" })}
                      >
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code} style={{ background: "#0e0e18", color: "#fff" }}>
                            {c.code}  {c.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        placeholder="Phone or WhatsApp number"
                        value={phone} onChange={e => setPhone(e.target.value)}
                        style={{ ...inputBase, flex: 1 }}
                        onFocus={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.55)", background: "rgba(255,255,255,0.09)", boxShadow: "0 0 0 3px rgba(168,212,255,0.12)" })}
                        onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)", boxShadow: "none" })}
                      />
                    </div>
                  </div>

                  {/* Row 4: Service + Project Type */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Service Needed</label>
                      <select
                        value={serviceNeeded} onChange={e => setServiceNeeded(e.target.value)}
                        style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.55)", boxShadow: "0 0 0 3px rgba(168,212,255,0.12)" })}
                        onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", boxShadow: "none" })}
                      >
                        <option value="" style={{ background: "#0e0e18" }}>Choose a service...</option>
                        <option value="business-website" style={{ background: "#0e0e18" }}>Business Website</option>
                        <option value="landing-page" style={{ background: "#0e0e18" }}>Landing Page</option>
                        <option value="ai-website" style={{ background: "#0e0e18" }}>AI-Powered Website</option>
                        <option value="web-app" style={{ background: "#0e0e18" }}>Custom Web Application</option>
                        <option value="saas" style={{ background: "#0e0e18" }}>SaaS Platform</option>
                        <option value="content-manager-website" style={{ background: "#0e0e18" }}>Content-Manager Website</option>
                        <option value="ai-automation" style={{ background: "#0e0e18" }}>AI Automation</option>
                        <option value="other" style={{ background: "#0e0e18" }}>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Project Type</label>
                      <select
                        value={projectType} onChange={e => setProjectType(e.target.value)}
                        style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.55)", boxShadow: "0 0 0 3px rgba(168,212,255,0.12)" })}
                        onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", boxShadow: "none" })}
                      >
                        <option value="" style={{ background: "#0e0e18" }}>Select type...</option>
                        <option value="startup" style={{ background: "#0e0e18" }}>Startup</option>
                        <option value="small-business" style={{ background: "#0e0e18" }}>Small Business</option>
                        <option value="enterprise" style={{ background: "#0e0e18" }}>Enterprise</option>
                        <option value="agency" style={{ background: "#0e0e18" }}>Agency</option>
                        <option value="personal" style={{ background: "#0e0e18" }}>Personal Project</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom request */}
                  {serviceNeeded === "other" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label style={labelStyle}>Describe Your Request *</label>
                      <input
                        type="text" required
                        value={customRequest} onChange={e => setCustomRequest(e.target.value)}
                        placeholder="e.g. E-commerce platform with custom checkout..."
                        style={{ ...inputBase, borderColor: "rgba(168,212,255,0.25)" }}
                        onFocus={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.55)", background: "rgba(255,255,255,0.09)", boxShadow: "0 0 0 3px rgba(168,212,255,0.12)" })}
                        onBlur={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.25)", background: "rgba(255,255,255,0.06)", boxShadow: "none" })}
                      />
                    </motion.div>
                  )}

                  {/* Row 5: Budget + Timeline */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Project Budget</label>
                      <select
                        value={budget} onChange={e => setBudget(e.target.value)}
                        style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: "rgba(212,170,255,0.55)", boxShadow: "0 0 0 3px rgba(212,170,255,0.12)" })}
                        onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", boxShadow: "none" })}
                      >
                        <option value="" style={{ background: "#0e0e18" }}>Select budget...</option>
                        <option value="under-1k" style={{ background: "#0e0e18" }}>Under $1,000</option>
                        <option value="1k-5k" style={{ background: "#0e0e18" }}>$1,000 – $5,000</option>
                        <option value="5k-10k" style={{ background: "#0e0e18" }}>$5,000 – $10,000</option>
                        <option value="10k-25k" style={{ background: "#0e0e18" }}>$10,000 – $25,000</option>
                        <option value="25k-50k" style={{ background: "#0e0e18" }}>$25,000 – $50,000</option>
                        <option value="50k+" style={{ background: "#0e0e18" }}>$50,000+</option>
                        <option value="not-sure" style={{ background: "#0e0e18" }}>Not sure yet</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Project Timeline</label>
                      <select
                        value={timeline} onChange={e => setTimeline(e.target.value)}
                        style={inputBase}
                        onFocus={e => applyStyle(e, { borderColor: "rgba(212,170,255,0.55)", boxShadow: "0 0 0 3px rgba(212,170,255,0.12)" })}
                        onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", boxShadow: "none" })}
                      >
                        <option value="" style={{ background: "#0e0e18" }}>Project Timeline</option>
                        <option value="asap" style={{ background: "#0e0e18" }}>ASAP</option>
                        <option value="2weeks" style={{ background: "#0e0e18" }}>Within 2 weeks</option>
                        <option value="1month" style={{ background: "#0e0e18" }}>Within 1 month</option>
                        <option value="1-3months" style={{ background: "#0e0e18" }}>1–3 months</option>
                        <option value="3months+" style={{ background: "#0e0e18" }}>3+ months</option>
                        <option value="exploring" style={{ background: "#0e0e18" }}>Just exploring ideas</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 6: Referral */}
                  <div>
                    <label style={labelStyle}>How Did You Find Us?</label>
                    <select
                      value={referral} onChange={e => setReferral(e.target.value)}
                      style={inputBase}
                      onFocus={e => applyStyle(e, { borderColor: "rgba(125,211,200,0.55)", boxShadow: "0 0 0 3px rgba(125,211,200,0.12)" })}
                      onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", boxShadow: "none" })}
                    >
                      <option value="" style={{ background: "#0e0e18" }}>Select a source...</option>
                      <option value="google" style={{ background: "#0e0e18" }}>Google Search</option>
                      <option value="facebook" style={{ background: "#0e0e18" }}>Facebook</option>
                      <option value="instagram" style={{ background: "#0e0e18" }}>Instagram</option>
                      <option value="linkedin" style={{ background: "#0e0e18" }}>LinkedIn</option>
                      <option value="twitter" style={{ background: "#0e0e18" }}>Twitter / X</option>
                      <option value="referral" style={{ background: "#0e0e18" }}>Friend / Referral</option>
                      <option value="other" style={{ background: "#0e0e18" }}>Other</option>
                    </select>
                  </div>

                  {/* Row 7: Message */}
                  <div>
                    <label style={labelStyle}>Message *</label>
                    <textarea
                      required rows={4}
                      placeholder="Describe your project goals, target audience, key features, and any AI functionality you'd like to include."
                      value={message} onChange={e => setMessage(e.target.value)}
                      style={{ ...inputBase, resize: "none", lineHeight: 1.80 }}
                      onFocus={e => applyStyle(e, { borderColor: "rgba(168,212,255,0.55)", background: "rgba(255,255,255,0.09)", boxShadow: "0 0 0 3px rgba(168,212,255,0.12)" })}
                      onBlur={e => applyStyle(e, { borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)", boxShadow: "none" })}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: 13, color: "#f87171", textAlign: "center", margin: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={!sending ? { scale: 1.015 } : {}}
                    whileTap={!sending ? { scale: 0.985 } : {}}
                    style={{
                      width: "100%", padding: "16px", borderRadius: 16,
                      background: sending
                        ? "rgba(255,255,255,0.06)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,240,245,0.95) 100%)",
                      border: sending ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.90)",
                      color: sending ? "rgba(255,255,255,0.35)" : "#000000",
                      fontSize: 14, fontWeight: 800,
                      cursor: sending ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                      transition: "all 0.25s", letterSpacing: "0.04em",
                      boxShadow: sending
                        ? "none"
                        : "0 0 40px rgba(255,255,255,0.22), 0 4px 20px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,1)",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {sending ? "Sending..." : <><Send size={15} strokeWidth={2.8} /> Send Message</>}
                  </motion.button>

                  <p style={{
                    fontSize: 11, color: "rgba(255,255,255,0.30)",
                    textAlign: "center", margin: 0, letterSpacing: "0.03em",
                  }}>
                    🔒 Your info is safe. We respond{" "}
                    <span style={{ color: "rgba(255,255,255,0.58)", fontWeight: 600 }}>typically within 12–24 hours</span>.
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