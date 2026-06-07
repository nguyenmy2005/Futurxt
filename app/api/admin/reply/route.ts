import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { to, name, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "FuturXT <onboarding@resend.dev>",
      to,
      subject,
      html: `
        <div style="font-family:'DM Sans',sans-serif;max-width:580px;margin:0 auto;background:#080808;color:#e5e5e5;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
          <div style="padding:32px 32px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
              <div style="width:32px;height:32px;border-radius:9px;background:#111;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:15px;">⚡</div>
              <div>
                <p style="margin:0;font-size:14px;font-weight:800;color:#fff;">FuturXT</p>
                <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.3);font-family:monospace;letter-spacing:0.1em;">OFFICIAL REPLY</p>
              </div>
            </div>
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.35);">Hi <strong style="color:#fff;">${name}</strong>,</p>
          </div>
          <div style="padding:28px 32px;">
            <div style="white-space:pre-wrap;font-size:14px;line-height:1.75;color:rgba(255,255,255,0.8);">${body.replace(/\n/g, "<br/>")}</div>
          </div>
          <div style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">
              FuturXT · Remote / Worldwide ·
              <a href="https://futurxt.dev" style="color:rgba(255,255,255,0.35);text-decoration:none;">futurxt.dev</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reply API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}