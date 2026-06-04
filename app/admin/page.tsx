"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Briefcase, MessageSquare, Calendar, Lock, LogOut, Inbox, Building2, DollarSign, Clock, Share2 } from "lucide-react";

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

const serviceLabel: Record<string, string> = {
  web: "Web Development",
  uiux: "UI/UX Design",
  ai: "AI Integration",
  saas: "SaaS Solutions",
  custom: "Custom Request",
};

const statusColors = {
  new:         { bg: "bg-cyan/10",   border: "border-cyan/20",   text: "text-cyan",   label: "🔵 New" },
  in_progress: { bg: "bg-yellow-400/10", border: "border-yellow-400/20", text: "text-yellow-400", label: "🟡 In Progress" },
  done:        { bg: "bg-emerald-400/10", border: "border-emerald-400/20", text: "text-emerald-400", label: "✅ Done" },
};

function formatService(s: string) {
  if (!s) return "—";
  if (s.startsWith("Custom:")) return s;
  return serviceLabel[s] ?? s;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "new" | "in_progress" | "done">("all");
  const supabase = createSupabaseBrowserClient();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "futurxt2026") {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setContacts(data ?? []);
        setLoading(false);
      });
  }, [authed]);

  const updateStatus = async (id: string, status: Contact["status"]) => {
    await supabase.from("contacts").update({ status }).eq("id", id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  const filtered = filter === "all" ? contacts : contacts.filter(c => c.status === filter);
  const counts = {
    all: contacts.length,
    new: contacts.filter(c => c.status === "new").length,
    in_progress: contacts.filter(c => c.status === "in_progress").length,
    done: contacts.filter(c => c.status === "done").length,
  };

  // ── Login Screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, oklch(0.65 0.2 300 / 0.12) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, oklch(0.75 0.18 200 / 0.1) 0%, transparent 70%)" }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-sm">
          <div className="glass-strong rounded-2xl p-8 border border-border/50">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan/20 to-purple/20 border border-cyan/20 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-cyan" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Admin Access</h1>
              <p className="text-xs text-muted-foreground mt-1">FuturXT Dashboard</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wider block mb-1.5 uppercase">Password</label>
                <input
                  type="password" value={pw}
                  onChange={(e) => { setPw(e.target.value); setPwError(false); }}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 rounded-xl bg-secondary/40 border text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors ${
                    pwError ? "border-red-500/50 focus:border-red-500/70" : "border-border/50 focus:border-cyan/40"
                  }`}
                />
                {pwError && <p className="text-xs text-red-400 mt-1.5">Incorrect password</p>}
              </div>
              <button type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan to-purple text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
                Enter Dashboard
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.2 300 / 0.08) 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan/20 to-purple/20 border border-cyan/20 flex items-center justify-center">
            <Inbox className="w-4 h-4 text-cyan" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">FuturXT Admin</h1>
            <p className="text-[10px] text-muted-foreground font-mono">Contact Leads</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-secondary/40 rounded-xl p-1 border border-border/30">
            {(["all", "new", "in_progress", "done"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                {f.replace("_", " ").toUpperCase()} {counts[f] > 0 && `(${counts[f]})`}
              </button>
            ))}
          </div>
          <button onClick={() => { setAuthed(false); setPw(""); setSelected(null); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex gap-6 h-[calc(100vh-65px)]">

        {/* List */}
        <div className="w-80 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Inbox className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No contacts yet</p>
            </div>
          ) : (
            filtered.map((c, i) => {
              const sc = statusColors[c.status];
              return (
                <motion.button key={c.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(c)}
                  className={`w-full text-left glass-strong rounded-xl p-4 border transition-all ${
                    selected?.id === c.id
                      ? "border-cyan/30 bg-cyan/5"
                      : "border-border/40 hover:border-border/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                    <span className="text-[10px] text-muted-foreground/50 font-mono shrink-0">{timeAgo(c.created_at)}</span>
                  </div>
                  {c.company && <p className="text-xs text-muted-foreground/50 truncate mb-1">{c.company}</p>}
                  <p className="text-xs text-muted-foreground/70 truncate mb-2">{c.email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {c.service && (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan/70 font-mono border border-cyan/10">
                        {formatService(c.service)}
                      </span>
                    )}
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-mono border ${sc.bg} ${sc.border} ${sc.text}`}>
                      {sc.label}
                    </span>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>

        {/* Detail */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                className="glass-strong rounded-2xl p-8 border border-border/50 h-fit">

                {/* Name + status */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">{selected.name}</h2>
                    {selected.company && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" /> {selected.company}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {new Date(selected.created_at).toLocaleString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {selected.service && (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan/10 to-purple/10 border border-cyan/20 text-cyan font-mono">
                      {formatService(selected.service)}
                    </span>
                  )}
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: Mail,       label: "Email",    value: selected.email,            href: `mailto:${selected.email}` },
                    { icon: Phone,      label: "Phone",    value: selected.phone || "—",     href: selected.phone ? `tel:${selected.phone}` : undefined },
                    { icon: DollarSign, label: "Budget",   value: selected.budget || "—" },
                    { icon: Clock,      label: "Timeline", value: selected.timeline || "—" },
                    { icon: Briefcase,  label: "Service",  value: formatService(selected.service ?? "") },
                    { icon: Share2,     label: "Referral", value: selected.referral || "—" },
                    { icon: Calendar,   label: "Submitted",value: timeAgo(selected.created_at) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-secondary/30 border border-border/30 p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <item.icon className="w-3.5 h-3.5 text-cyan/60" />
                        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">{item.label}</span>
                      </div>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-foreground font-medium hover:text-cyan transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-sm text-foreground font-medium">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message */}
                <div className="rounded-xl bg-secondary/30 border border-border/30 p-5 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-3.5 h-3.5 text-purple/60" />
                    <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">Message</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Status update */}
                <div className="mb-4">
                  <p className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mb-2">Update Status</p>
                  <div className="flex gap-2">
                    {(["new", "in_progress", "done"] as const).map(s => {
                      const sc = statusColors[s];
                      return (
                        <button key={s} onClick={() => updateStatus(selected.id, s)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            selected.status === s
                              ? `${sc.bg} ${sc.border} ${sc.text}`
                              : "bg-secondary/30 border-border/30 text-muted-foreground hover:text-foreground"
                          }`}>
                          {sc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a href={`mailto:${selected.email}?subject=Re: Your project inquiry`}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan to-purple text-primary-foreground text-sm font-semibold text-center hover:opacity-90 transition-all">
                    Reply via Email
                  </a>
                  {selected.phone && (
                    <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl border border-border/50 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all">
                      WhatsApp
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/40 border border-border/30 flex items-center justify-center mb-4">
                  <MessageSquare className="w-7 h-7 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground">Select a contact to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}