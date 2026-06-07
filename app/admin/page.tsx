"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Mail, Phone, Building2, Briefcase, DollarSign, Clock,
  Share2, MessageSquare, Calendar, LogOut, Inbox,
  ChevronRight, X, Send, RefreshCw, Search
} from "lucide-react";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  referral?: string;
  message: string;
  status: "new" | "in_progress" | "done";
  created_at: string;
};

type ReplyModal = {
  open: boolean;
  contact: Contact | null;
  subject: string;
  body: string;
  sending: boolean;
  sent: boolean;
  error: string;
};

const SERVICE_LABEL: Record<string, string> = {
  web: "Web Development",
  uiux: "UI/UX Design",
  ai: "AI Integration",
  saas: "SaaS Solutions",
  custom: "Custom Request",
};

const STATUS_CONFIG = {
  new:         { label: "New",         dot: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.25)",  text: "#60a5fa" },
  in_progress: { label: "In Progress", dot: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  text: "#fbbf24" },
  done:        { label: "Done",        dot: "#34d399", bg: "rgba(52,211,153,0.08)",   border: "rgba(52,211,153,0.25)",  text: "#34d399" },
};

function fmt(s?: string) {
  if (!s) return "—";
  if (s.startsWith("Custom:")) return s;
  return SERVICE_LABEL[s] ?? s;
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
      background: "hsl(" + hue + ",40%,18%)",
      border: "1px solid hsl(" + hue + ",40%,28%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 800, color: "hsl(" + hue + ",70%,72%)",
      letterSpacing: "-0.02em", fontFamily: "'DM Mono', monospace",
    }}>{initials}</div>
  );
}

function LoginScreen({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "xinchaofuturxt2026") {
      onAuth();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080808",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
      `}</style>

      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 360, padding: "0 24px" }}>
        <div style={{ animation: shake ? "shake 0.4s ease" : undefined }}>

          <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeUp 0.5s ease" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: "#111",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: 22,
            }}>⚡</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>FuturXT</h1>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em" }}>
              ADMIN DASHBOARD
            </p>
          </div>

          <div style={{
            background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "32px 28px", boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            animation: "fadeUp 0.5s ease 0.1s both",
          }}>
            <form onSubmit={handleSubmit}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8,
                fontFamily: "'DM Mono', monospace",
              }}>Password</label>
              <input
                type="password" value={pw} autoFocus
                onChange={e => { setPw(e.target.value); setErr(false); }}
                placeholder="••••••••••••"
                style={{
                  width: "100%", padding: "13px 16px", background: "#161616",
                  border: "1px solid " + (err ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"),
                  borderRadius: 12, color: "#fff", fontSize: 15, outline: "none",
                  fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em",
                }}
              />
              {err && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#ef4444", fontFamily: "'DM Mono', monospace" }}>Incorrect password</p>}
              <button type="submit" style={{
                width: "100%", marginTop: 16, padding: "13px", background: "#fff", color: "#000",
                border: "none", borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: "pointer",
                letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
              }}>
                Enter Dashboard
              </button>
            </form>
          </div>

          <p style={{
            textAlign: "center", marginTop: 20, fontSize: 11,
            color: "rgba(255,255,255,0.15)", fontFamily: "'DM Mono', monospace",
            animation: "fadeUp 0.5s ease 0.2s both",
          }}>futurxt.dev · secure access</p>
        </div>
      </div>
    </div>
  );
}

function ReplyModal({ state, setState }: {
  state: ReplyModal;
  setState: React.Dispatch<React.SetStateAction<ReplyModal>>;
}) {
  if (!state.open || !state.contact) return null;

  const send = async () => {
    setState(s => ({ ...s, sending: true, error: "" }));
    try {
      const res = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: state.contact!.email,
          name: state.contact!.name,
          subject: state.subject,
          body: state.body,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setState(s => ({ ...s, sending: false, sent: true }));
      setTimeout(() => setState(s => ({ ...s, open: false, sent: false })), 2000);
    } catch {
      setState(s => ({ ...s, sending: false, error: "Failed to send. Try again." }));
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) setState(s => ({ ...s, open: false })); }}
    >
      <div style={{
        width: "100%", maxWidth: 560, background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.8)", animation: "fadeUp 0.2s ease",
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#fff" }}>Reply to {state.contact.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace" }}>
              {state.contact.email}
            </p>
          </div>
          <button onClick={() => setState(s => ({ ...s, open: false }))}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <label style={{
            display: "block", fontSize: 11, fontFamily: "'DM Mono', monospace",
            color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6,
          }}>Subject</label>
          <input
            value={state.subject}
            onChange={e => setState(s => ({ ...s, subject: e.target.value }))}
            style={{
              width: "100%", padding: "11px 14px", background: "#161616",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
              color: "#fff", fontSize: 13, outline: "none", marginBottom: 16,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />

          <label style={{
            display: "block", fontSize: 11, fontFamily: "'DM Mono', monospace",
            color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6,
          }}>Message</label>
          <textarea
            value={state.body}
            onChange={e => setState(s => ({ ...s, body: e.target.value }))}
            rows={8}
            style={{
              width: "100%", padding: "11px 14px", background: "#161616",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
              color: "#fff", fontSize: 13, outline: "none", resize: "vertical",
              lineHeight: 1.7, marginBottom: 16, fontFamily: "'DM Sans', sans-serif",
            }}
          />

          {state.error && <p style={{ margin: "0 0 12px", fontSize: 12, color: "#ef4444" }}>{state.error}</p>}

          <button
            onClick={send}
            disabled={state.sending || state.sent}
            style={{
              width: "100%", padding: "13px",
              background: state.sent ? "rgba(52,211,153,0.15)" : "#fff",
              border: state.sent ? "1px solid rgba(52,211,153,0.4)" : "none",
              borderRadius: 12, cursor: state.sending ? "wait" : "pointer",
              fontSize: 13, fontWeight: 800,
              color: state.sent ? "#34d399" : "#000",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {state.sending ? "Sending…" : state.sent ? "✓ Sent!" : <><Send size={14} /> Send Reply</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "in_progress" | "done">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reply, setReply] = useState<ReplyModal>({
    open: false, contact: null, subject: "", body: "", sending: false, sent: false, error: ""
  });
  const supabase = createSupabaseBrowserClient();

  const fetchContacts = async (quiet = false) => {
    if (!quiet) setLoading(true); else setRefreshing(true);
    const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    setContacts(data ?? []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const updateStatus = async (id: string, status: Contact["status"]) => {
    await supabase.from("contacts").update({ status }).eq("id", id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setSelected(prev => prev && prev.id === id ? { ...prev, status } : prev);
  };

  const openReply = (contact: Contact) => {
    setReply({
      open: true, contact, sending: false, sent: false, error: "",
      subject: "Re: Your project inquiry — FuturXT",
      body: "Hi " + contact.name + ",\n\nThank you for reaching out to FuturXT! We've reviewed your inquiry and would love to discuss your project further.\n\n",
    });
  };

  const counts = {
    all: contacts.length,
    new: contacts.filter(c => c.status === "new").length,
    in_progress: contacts.filter(c => c.status === "in_progress").length,
    done: contacts.filter(c => c.status === "done").length,
  };

  const filtered = contacts
    .filter(c => filter === "all" || c.status === filter)
    .filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company ?? "").toLowerCase().includes(q);
    });

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
      `}</style>

      {/* Header */}
      <div style={{
        height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,8,8,0.95)", backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: "#111",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>⚡</div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, letterSpacing: "-0.03em" }}>FuturXT Admin</p>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em" }}>
              {counts.all} LEADS TOTAL
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => fetchContacts(true)} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            padding: "6px 10px", cursor: "pointer", color: "rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", gap: 5, fontSize: 12,
          }}>
            <RefreshCw size={12} style={{ animation: refreshing ? "spin 0.8s linear infinite" : undefined }} />
            Refresh
          </button>
          <button onClick={onLogout} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            padding: "6px 14px", cursor: "pointer", color: "rgba(255,255,255,0.35)",
            fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
          }}>
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>

        {/* Sidebar */}
        <div style={{
          width: 300, borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {(["all", "new", "in_progress", "done"] as const).map(s => {
              const isActive = filter === s;
              const cfg = s === "all" ? null : STATUS_CONFIG[s];
              return (
                <button key={s} onClick={() => setFilter(s)} style={{
                  padding: "14px 16px", textAlign: "left", cursor: "pointer",
                  background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                  border: "none",
                  borderBottom: "2px solid " + (isActive ? (cfg ? cfg.dot : "#fff") : "transparent"),
                  transition: "all 0.15s",
                }}>
                  <p style={{
                    margin: "0 0 3px", fontSize: 10, fontFamily: "'DM Mono', monospace",
                    color: isActive ? (cfg ? cfg.text : "#fff") : "rgba(255,255,255,0.3)",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>{s.replace("_", " ")}</p>
                  <p style={{
                    margin: 0, fontSize: 22, fontWeight: 900,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.4)", letterSpacing: "-0.04em",
                  }}>{counts[s]}</p>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)" }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, company…"
                style={{
                  width: "100%", padding: "8px 10px 8px 30px", background: "#111",
                  border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9,
                  color: "#fff", fontSize: 12, outline: "none", fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "rgba(255,255,255,0.6)",
                  animation: "spin 0.7s linear infinite",
                }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Inbox size={28} style={{ color: "rgba(255,255,255,0.1)", marginBottom: 10 }} />
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.2)" }}>No contacts found</p>
              </div>
            ) : filtered.map((c, i) => {
              const sc = STATUS_CONFIG[c.status];
              const isActive = selected?.id === c.id;
              return (
                <button key={c.id} onClick={() => setSelected(isActive ? null : c)} style={{
                  width: "100%", textAlign: "left", padding: "14px 16px",
                  background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                  border: "none", borderBottom: "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start",
                  borderLeft: "3px solid " + (isActive ? "#fff" : "transparent"),
                  transition: "all 0.15s",
                  animation: "fadeUp 0.3s ease " + (i * 0.03) + "s both",
                }}>
                  <Avatar name={c.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <p style={{
                        margin: 0, fontSize: 13, fontWeight: 700, color: "#fff",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150,
                      }}>{c.name}</p>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>
                        {timeAgo(c.created_at)}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 6px", fontSize: 11, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.email}
                    </p>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 10, padding: "2px 8px", borderRadius: 5, fontFamily: "'DM Mono', monospace",
                        background: sc.bg, border: "1px solid " + sc.border, color: sc.text,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                        {sc.label}
                      </span>
                      {c.service && (
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {fmt(c.service)}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={13} style={{ color: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)", flexShrink: 0, marginTop: 2 }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflowY: "auto", background: "#0a0a0a" }}>
          {!selected ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18, background: "#111",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MessageSquare size={24} style={{ color: "rgba(255,255,255,0.15)" }} />
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.2)" }}>Select a contact to view details</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.1)", fontFamily: "'DM Mono', monospace" }}>
                {counts.all} total · {counts.new} new
              </p>
            </div>
          ) : (
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 28px", animation: "fadeUp 0.25s ease" }}>

              {/* Top */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <Avatar name={selected.name} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", color: "#fff" }}>
                      {selected.name}
                    </h2>
                    {selected.company && (
                      <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 5 }}>
                        <Building2 size={12} /> {selected.company}
                      </p>
                    )}
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
                      {new Date(selected.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {selected.service && (
                    <span style={{
                      fontSize: 11, padding: "5px 12px", borderRadius: 7,
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)", fontFamily: "'DM Mono', monospace",
                    }}>{fmt(selected.service)}</span>
                  )}
                  <button onClick={() => setSelected(null)} style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex",
                  }}>
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Info grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { icon: Mail,          label: "Email",     value: selected.email },
                  { icon: Phone,         label: "Phone",     value: selected.phone || "—" },
                  { icon: DollarSign,    label: "Budget",    value: selected.budget || "—" },
                  { icon: Clock,         label: "Timeline",  value: selected.timeline || "—" },
                  { icon: Briefcase,     label: "Service",   value: fmt(selected.service ?? "") },
                  { icon: Share2,        label: "Referral",  value: selected.referral || "—" },
                  { icon: Calendar,      label: "Submitted", value: timeAgo(selected.created_at) },
                  { icon: MessageSquare, label: "Status",    value: STATUS_CONFIG[selected.status].label },
                ].map(item => (
                  <div key={item.label} style={{
                    background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <item.icon size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {item.label}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Message */}
              <div style={{
                background: "#111", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "20px", marginBottom: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <MessageSquare size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Message
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                  {selected.message}
                </p>
              </div>

              {/* Status */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: "0 0 10px", fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Update Status
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["new", "in_progress", "done"] as const).map(s => {
                    const sc = STATUS_CONFIG[s];
                    const isActive = selected.status === s;
                    return (
                      <button key={s} onClick={() => updateStatus(selected.id, s)} style={{
                        padding: "8px 16px", borderRadius: 9, fontSize: 12, fontWeight: 700,
                        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        background: isActive ? sc.bg : "transparent",
                        border: "1px solid " + (isActive ? sc.border : "rgba(255,255,255,0.08)"),
                        color: isActive ? sc.text : "rgba(255,255,255,0.35)",
                        transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? sc.dot : "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions - dùng button hết, không dùng thẻ a */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => openReply(selected)} style={{
                  flex: 1, padding: "12px", background: "#fff", color: "#000",
                  border: "none", borderRadius: 12, cursor: "pointer",
                  fontSize: 13, fontWeight: 800, letterSpacing: "0.04em",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <Send size={14} /> Reply via Email
                </button>

                {selected.phone && (
                  <button onClick={() => window.open("https://wa.me/" + selected.phone!.replace(/[^0-9]/g, ""), "_blank")} style={{
                    padding: "12px 20px", borderRadius: 12, background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    <Phone size={13} /> WhatsApp
                  </button>
                )}

                <button onClick={() => window.open("mailto:" + selected.email, "_self")} style={{
                  padding: "12px 20px", borderRadius: 12, background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <Mail size={13} /> Mail Client
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      <ReplyModal state={reply} setState={setReply} />
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}