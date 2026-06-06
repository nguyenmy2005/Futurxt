"use client";

export const dynamic = 'force-dynamic'
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Invalid email or password."); setLoading(false); return; }
    router.push("/admin");
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 12,
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
    color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 380, padding: 40, borderRadius: 24,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.10)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 900 }}>FuturXT Admin</h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Sign in to continue</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="email" required placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} style={inp} />
          <input type="password" required placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} style={inp} />
          {error && <p style={{ margin: 0, fontSize: 13, color: "#f87171", textAlign: "center" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            padding: "14px", borderRadius: 12, fontWeight: 800, fontSize: 13,
            background: loading ? "rgba(255,255,255,0.06)" : "#fff",
            color: loading ? "rgba(255,255,255,0.30)" : "#000",
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.05em", textTransform: "uppercase",
          }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}