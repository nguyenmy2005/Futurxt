// app/api/notify-demo-view/route.ts
import { NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY  = process.env.RESEND_API_KEY!
const NOTIFY_EMAIL    = process.env.NOTIFY_EMAIL || 'your@email.com'
const FROM_EMAIL      = 'alerts@futurxt.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, eventType, company, email, phone, address } = body

    const actionLabel =
      eventType === 'view_demo'
        ? '👀 ĐÃ XEM DEMO WEBSITE'
        : '🔥 ĐÃ BẤM LIÊN HỆ — NÓNG!'

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,Arial,sans-serif;background:#f5f5f0;padding:32px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center">
<table width="520" style="background:#fff;border-radius:14px;overflow:hidden;">
  <tr><td style="background:#111;padding:18px 28px;">
    <span style="color:#fff;font-weight:900;font-size:15px;letter-spacing:0.1em;">FUTURXT LEAD ALERT</span>
  </td></tr>
  <tr><td style="padding:28px;">
    <p style="margin:0 0 14px;font-size:14px;color:#e8531a;font-weight:800;">${actionLabel}</p>
    <p style="margin:0 0 6px;font-size:15px;color:#111;font-weight:700;">${company || '—'}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#555;">📧 ${email || '—'}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#555;">📞 ${phone || '—'}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#555;">📍 ${address || '—'}</p>
    <p style="margin:14px 0 0;font-size:12px;color:#999;">Demo slug: ${slug}</p>
    <p style="margin:4px 0 0;font-size:12px;color:#999;">
      Xem demo: <a href="https://futurxt.com/demo/${slug}">futurxt.com/demo/${slug}</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    `Futurxt Alerts <${FROM_EMAIL}>`,
        to:      [NOTIFY_EMAIL],
        subject: `${actionLabel} — ${company}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ ok: false, error: err }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}