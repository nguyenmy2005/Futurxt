"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Contact = {
  id: string;
  created_at: string;
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
};

const statusColors = {
  new: { bg: "rgba(168,212,255,0.12)", border: "rgba(168,212,255,0.35)", text: "#A8D4FF" },
  in_progress: { bg: "rgba(255,213,128,0.12)", border: "rgba(255,213,128,0.35)", text: "#FFD580" },
  done: { bg: "rgba(125,211,200,0.12)", border: "rgba(125,211,200,0.35)", text: "#7DD3C8" },
};

const statusLabel = { new: "🔵 New", in_progress: "🟡 In Progress", done: "✅ Done" };

export default function AdminDashboard({ contacts: initial }: { contacts: Contact[] }) {
  const [contacts, setContacts] = useState(initial);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "in_progress" | "done">("all");
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const filtered = filter === "all" ? contacts : contacts.filter(c => c.status === filter);
  const counts = {
    all: contacts.length,
    new: contacts.filter(c => c.status === "new").length,
    in_progress: contacts.filter(c => c.status === "in_progress").length,
    done: contacts.filter(c => c.status === "done").length,
  };

  const updateStatus = async (id: string, status: Contact["status"]) => {
    await supabase.from("contacts").update({ status }).eq("id", id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const cell: React.CSSProperties = {
    padding: "14px 16px",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    verticalAlign: "middle",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#fff", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,rgba(168,212,255,0.2),rgba(212,170,255,0.2))",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>⚡</div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>FuturXT Admin</p>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>CONTACT LEADS</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 18px", borderRadius: 9,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.60)", fontSize: 12,
            cursor: "pointer", fontWeight: 600, letterSpacing: "0.04em",
          }}
        >
          LOGOUT
        </button>
      </div>

      <div style={{ padding: "32px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {(["all", "new", "in_progress", "done"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "18px 20px", borderRadius: 16, textAlign: "left", cursor: "pointer",
                background: filter === s ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${filter === s ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.08)"}`,
                transition: "all 0.2s",
              }}
            >
              <p style={{ margin: "0 0 6px", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", color: "rgba(255,255,255,0.40)", textTransform: "uppercase" }}>
                {s.replace("_", " ")}
              </p>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff" }}>{counts[s]}</p>
            </button>
          ))}
        </div>

        {/* Table + Detail panel */}
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
          {/* Table */}
          <div style={{
            borderRadius: 18, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  {["Name", "Email", "Service", "Budget", "Status", "Date"].map(h => (
                    <th key={h} style={{
                      ...cell, color: "rgba(255,255,255,0.35)", fontFamily: "monospace",
                      fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                      fontWeight: 700, textAlign: "left",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ ...cell, textAlign: "center", color: "rgba(255,255,255,0.25)", padding: "40px" }}>
                      No contacts yet.
                    </td>
                  </tr>
                ) : filtered.map(c => {
                  const sc = statusColors[c.status];
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(selected?.id === c.id ? null : c)}
                      style={{
                        cursor: "pointer",
                        background: selected?.id === c.id ? "rgba(168,212,255,0.05)" : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { if (selected?.id !== c.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                      onMouseLeave={e => { if (selected?.id !== c.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td style={cell}>
                        <p style={{ margin: 0, fontWeight: 700, color: "#fff", fontSize: 13 }}>{c.name}</p>
                        {c.company && <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{c.company}</p>}
                      </td>
                      <td style={cell}>{c.email}</td>
                      <td style={cell}>{c.service || "—"}</td>
                      <td style={cell}>{c.budget || "—"}</td>
                      <td style={cell}>
                        <span style={{
                          padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                          background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
                          whiteSpace: "nowrap",
                        }}>
                          {statusLabel[c.status]}
                        </span>
                      </td>
                      <td style={{ ...cell, color: "rgba(255,255,255,0.40)", fontSize: 12 }}>
                        {new Date(c.created_at).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{
              borderRadius: 18, padding: 24,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.10)",
              height: "fit-content", position: "sticky", top: 90,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{selected.name}</h3>
                  {selected.company && <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.40)" }}>{selected.company}</p>}
                </div>
                <button onClick={() => setSelected(null)} style={{
                  background: "none", border: "none", color: "rgba(255,255,255,0.40)",
                  cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4,
                }}>✕</button>
              </div>

              {[
                ["📧 Email", selected.email],
                ["📞 Phone", selected.phone || "—"],
                ["⚙️ Service", selected.service || "—"],
                ["💰 Budget", selected.budget || "—"],
                ["📅 Timeline", selected.timeline || "—"],
                ["📣 Referral", selected.referral || "—"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.35)", minWidth: 90, paddingTop: 1, letterSpacing: "0.05em" }}>{label}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{value}</span>
                </div>
              ))}

              <div style={{
                margin: "18px 0", padding: 16,
                background: "rgba(255,255,255,0.04)", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <p style={{ margin: "0 0 8px", fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Message</p>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>{selected.message}</p>
              </div>

              {/* Status changer */}
              <p style={{ margin: "0 0 10px", fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Update Status</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(["new", "in_progress", "done"] as const).map(s => {
                  const sc = statusColors[s];
                  const isActive = selected.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      style={{
                        padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        background: isActive ? sc.bg : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isActive ? sc.border : "rgba(255,255,255,0.10)"}`,
                        color: isActive ? sc.text : "rgba(255,255,255,0.45)",
                        transition: "all 0.2s",
                      }}
                    >
                      {statusLabel[s]}
                    </button>
                  );
                })}
              </div>

              <a href={`mailto:${selected.email}`} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, marginTop: 18, padding: "12px",
                borderRadius: 12, textDecoration: "none",
                background: "rgba(255,255,255,0.96)",
                color: "#000", fontWeight: 800, fontSize: 13,
                letterSpacing: "0.04em",
              }}>
                ✉️ Reply via Email
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}