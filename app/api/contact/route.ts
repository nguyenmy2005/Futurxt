import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, service, budget, timeline, referral, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // ── 1. Lưu vào Supabase ──
    const supabase = createSupabaseAdminClient();
    const { error: dbError } = await supabase.from("contacts").insert([
      { name, email, phone, company, service, budget, timeline, referral, message },
    ]);

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json({ error: "Database error." }, { status: 500 });
    }

    // ── 2. Gửi email notification cho admin ──
    await resend.emails.send({
      from: "FuturXT Contact <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `🔔 New Lead: ${name} ${company ? `(${company})` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#e5e5e5;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:32px;border-bottom:1px solid rgba(255,255,255,0.08);">
            <h1 style="margin:0;font-size:22px;color:#fff;">🚀 New Contact from FuturXT</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.45);font-size:13px;">${new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })} (ICT)</p>
          </div>
          <div style="padding:32px;">
            <table style="width:100%;border-collapse:collapse;">
              ${[
                ["👤 Name", name],
                ["📧 Email", email],
                ["📞 Phone", phone || "—"],
                ["🏢 Company", company || "—"],
                ["⚙️ Service", service || "—"],
                ["💰 Budget", budget || "—"],
                ["📅 Timeline", timeline || "—"],
                ["📣 Referral", referral || "—"],
              ]
                .map(
                  ([label, value]) => `
                <tr>
                  <td style="padding:10px 0;color:rgba(255,255,255,0.45);font-size:12px;font-family:monospace;letter-spacing:0.05em;width:130px;vertical-align:top;">${label}</td>
                  <td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600;">${value}</td>
                </tr>`
                )
                .join("")}
            </table>
            <div style="margin-top:24px;padding:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.10);border-radius:12px;">
              <p style="margin:0 0 8px;color:rgba(255,255,255,0.40);font-size:11px;font-family:monospace;letter-spacing:0.15em;text-transform:uppercase;">💬 Message</p>
              <p style="margin:0;color:rgba(255,255,255,0.85);font-size:14px;line-height:1.7;">${message}</p>
            </div>
            <div style="margin-top:24px;text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin" 
                 style="display:inline-block;padding:14px 32px;background:#fff;color:#000;font-weight:800;border-radius:10px;text-decoration:none;font-size:13px;letter-spacing:0.05em;">
                VIEW IN ADMIN →
              </a>
            </div>
          </div>
        </div>
      `,
    });

    // ── 3. Gửi email xác nhận cho khách ──
    await resend.emails.send({
      from: "FuturXT <onboarding@resend.dev>",
      to: email,
      subject: "We received your message — FuturXT",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0f;color:#e5e5e5;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);">
            <h1 style="margin:0;font-size:26px;color:#fff;letter-spacing:-0.03em;">Thank you, ${name}!</h1>
            <p style="margin:12px 0 0;color:rgba(255,255,255,0.50);font-size:14px;line-height:1.7;">
              We've received your message and will get back to you within <strong style="color:#A8D4FF;">24 hours</strong>.
            </p>
          </div>
          <div style="padding:32px;text-align:center;">
            <p style="color:rgba(255,255,255,0.45);font-size:13px;line-height:1.8;margin:0 0 24px;">
              In the meantime, feel free to reach us directly via WhatsApp or Telegram.
            </p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
              <a href="https://t.me/0977535103" style="display:inline-block;padding:12px 24px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;">Telegram</a>
              <a href="https://wa.me/840977535103" style="display:inline-block;padding:12px 24px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;">WhatsApp</a>
            </div>
            <p style="margin:32px 0 0;color:rgba(255,255,255,0.25);font-size:11px;">
              © FuturXT · Remote / Worldwide
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}