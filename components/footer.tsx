"use client";

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
  { icon: Github,   href: "#",                        label: "GitHub"   },
  { icon: Twitter,  href: "#",                        label: "Twitter"  },
  { icon: Linkedin, href: "#",                        label: "LinkedIn" },
  { icon: Mail,     href: "mailto:hellofuturxt@gmail.com", label: "Email"    },
];

const contactInfo = [
  { icon: Mail,   value: "hellofuturxt@gmail.com",  href: "mailto:hellofuturxt@gmail.com" },
  { icon: Phone,  value: "+84 0977 535 103",   href: "tel:+840977535103"        },
  { icon: MapPin, value: "Remote / Worldwide", href: "#"                        },
];

export function Footer() {
  return (
    <footer style={{ position: "relative", paddingTop: 96, paddingBottom: 48, overflow: "hidden" }}>

      {/* Background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 300, borderRadius: "50%", filter: "blur(120px)", background: "rgba(34,211,238,0.04)" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 300, borderRadius: "50%", filter: "blur(120px)", background: "rgba(139,92,246,0.04)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48, marginBottom: 64 }}>

          {/* Brand — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ gridColumn: "span 2" }}
          >
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <img src="/Futurax.X.png" alt="Futurxt Logo" style={{ height: 150, width: "auto" }} />
            </Link>

            <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 14, lineHeight: 1.7, maxWidth: 400, marginBottom: 24 }}>
              A future-focused technology company building next-generation
              digital experiences through Web, AI, and cutting-edge technology.
            </p>

            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.value}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.40)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.40)"; }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(34,211,238,0.07)",
                        border: "1px solid rgba(34,211,238,0.15)",
                      }}
                    >
                      <Icon style={{ width: 14, height: 14, color: "#67e8f9" }} />
                    </div>
                    {item.value}
                  </a>
                );
              })}
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: 8 }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.40)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.08)";
                      el.style.borderColor = "rgba(255,255,255,0.18)";
                      el.style.color = "rgba(255,255,255,0.90)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.04)";
                      el.style.borderColor = "rgba(255,255,255,0.08)";
                      el.style.color = "rgba(255,255,255,0.40)";
                    }}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Company links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Company
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Services
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", marginBottom: 32 }} />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}
        >
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, margin: 0 }}>
            © {new Date().getFullYear()} Futurxt. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            <Link
              href="#"
              style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.70)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.70)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}