"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About", href: "#about" },
    { name: "Team", href: "#team" },
    { name: "Services", href: "#services" },
    { name: "Vision", href: "#vision" },
  ],
  services: [
    { name: "Web Development", href: "#services" },
    { name: "UI/UX Design", href: "#services" },
    { name: "AI Integration", href: "#services" },
    { name: "SaaS Solutions", href: "#services" },
  ],
};

const socialLinks = [
  { icon: Github,   href: "#",                             label: "GitHub"   },
  { icon: Twitter,  href: "#",                             label: "Twitter"  },
  { icon: Linkedin, href: "#",                             label: "LinkedIn" },
  { icon: Mail,     href: "mailto:hellofuturxt@gmail.com", label: "Email"    },
];

const contactInfo = [
  { icon: Mail,   value: "hellofuturxt@gmail.com", href: "mailto:hellofuturxt@gmail.com" },
  { icon: Phone,  value: "+84 0977 535 103",        href: "tel:+840977535103"             },
  { icon: MapPin, value: "Remote / Worldwide",      href: "#"                             },
];

const MOBILE_CSS = `
  @media (max-width: 767px) {
    .footer-grid { display: flex !important; flex-direction: column !important; gap: 40px !important; }
    .footer-brand { grid-column: unset !important; }
    .footer-logo { height: 90px !important; }
    .footer-desc { font-size: 13px !important; max-width: 100% !important; }
    .footer-contact-value { font-size: 13px !important; word-break: break-all; }
    .footer-section-title { font-size: 10px !important; }
    .footer-link { font-size: 13px !important; }
    .footer-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
    .footer-bottom p, .footer-bottom a { font-size: 12px !important; }
    .footer-bottom-links { gap: 16px !important; }
  }
`;

export function Footer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const styleId = "footer-mobile-css";
    if (!document.getElementById(styleId)) {
      const tag = document.createElement("style");
      tag.id = styleId;
      tag.textContent = MOBILE_CSS;
      document.head.appendChild(tag);
    }
    return () => { document.getElementById(styleId)?.remove(); };
  }, []);

  // ── Tokens ──
  const bg            = isDark ? "#000000" : "#ffffff";
  const topRule       = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const glowColor1    = isDark ? "rgba(34,211,238,0.04)"  : "rgba(14,165,233,0.04)";
  const glowColor2    = isDark ? "rgba(139,92,246,0.04)"  : "rgba(139,92,246,0.03)";
  const iconAccent    = isDark ? "#67e8f9" : "#0E7490";
  const iconBg        = isDark ? "rgba(34,211,238,0.07)"  : "rgba(14,165,233,0.07)";
  const iconBorder    = isDark ? "rgba(34,211,238,0.15)"  : "rgba(14,165,233,0.18)";
  const descColor     = isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.45)";
  const contactColor  = isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.42)";
  const contactHover  = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const socialBg      = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const socialBorder  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const socialColor   = isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.40)";
  const socialBgHover = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const socialBdHover = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.16)";
  const socialClHover = isDark ? "rgba(255,255,255,0.90)" : "rgba(0,0,0,0.85)";
  const sectionTitle  = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
  const linkColor     = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.40)";
  const linkHover     = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const dividerColor  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const copyrightColor= isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.30)";

  return (
    <footer style={{
      position: "relative",
      paddingTop: 96,
      paddingBottom: 48,
      overflow: "hidden",
      background: bg,
      zIndex: 10,
      isolation: "isolate",
      transition: "background 0.4s ease",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${topRule}, transparent)`,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 300, borderRadius: "50%", filter: "blur(120px)",
          background: glowColor1,
        }} />
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 400, height: 300, borderRadius: "50%", filter: "blur(120px)",
          background: glowColor2,
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48, marginBottom: 64 }}>

          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ gridColumn: "span 2" }}
          >
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <img
                className="footer-logo"
                src={isDark ? "/Futurax.X.png" : "/Futurax.XX.png"}
                alt="Futurxt Logo"
                style={{ height: 150, width: "auto" }}
              />
            </Link>
            <p className="footer-desc" style={{
              color: descColor, fontSize: 14, lineHeight: 1.7,
              maxWidth: 400, marginBottom: 24,
              transition: "color 0.4s ease",
            }}>
              A future-focused technology company building next-generation digital experiences through Web, AI, and cutting-edge technology.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.value} href={item.href}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, fontSize: 14,
                      color: contactColor, textDecoration: "none", transition: "color 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = contactHover; }}
                    onMouseLeave={e => { e.currentTarget.style.color = contactColor; }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: iconBg, border: `1px solid ${iconBorder}`,
                    }}>
                      <Icon style={{ width: 14, height: 14, color: iconAccent }} />
                    </div>
                    <span className="footer-contact-value">{item.value}</span>
                  </a>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link key={social.label} href={social.href} aria-label={social.label}
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: socialBg, border: `1px solid ${socialBorder}`,
                      color: socialColor, transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = socialBgHover;
                      el.style.borderColor = socialBdHover;
                      el.style.color = socialClHover;
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = socialBg;
                      el.style.borderColor = socialBorder;
                      el.style.color = socialColor;
                    }}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="footer-section-title" style={{
              color: sectionTitle, fontSize: 11, fontWeight: 600,
              letterSpacing: "0.20em", textTransform: "uppercase", marginBottom: 20,
              transition: "color 0.4s ease",
            }}>Company</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link"
                    style={{ color: linkColor, fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = linkHover; }}
                    onMouseLeave={e => { e.currentTarget.style.color = linkColor; }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="footer-section-title" style={{
              color: sectionTitle, fontSize: 11, fontWeight: 600,
              letterSpacing: "0.20em", textTransform: "uppercase", marginBottom: 20,
              transition: "color 0.4s ease",
            }}>Services</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link"
                    style={{ color: linkColor, fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = linkHover; }}
                    onMouseLeave={e => { e.currentTarget.style.color = linkColor; }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${dividerColor}, transparent)`,
          marginBottom: 32,
        }} />

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}
        >
          <p style={{ color: copyrightColor, fontSize: 14, margin: 0, transition: "color 0.4s ease" }}>
            © {new Date().getFullYear()} Futurxt. All rights reserved.
          </p>
          <div className="footer-bottom-links" style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service"].map(label => (
              <Link key={label} href="#"
                style={{ color: copyrightColor, fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = linkHover; }}
                onMouseLeave={e => { e.currentTarget.style.color = copyrightColor; }}
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}