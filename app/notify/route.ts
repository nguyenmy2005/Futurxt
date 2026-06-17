import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { company, email, website, score, review } = body

    console.log('Calling Resend with key:', process.env.RESEND_API_KEY ? 'EXISTS' : 'MISSING')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Futurxt <hello@futurxt.com>',
        to: ['hello@futurxt.com'],
        subject: `New Lead: ${company}`,
        html: `
          <h2>New lead just came in</h2>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Email:</strong> ${email || 'Not provided'}</p>
          <p><strong>Website:</strong> ${website}</p>
          <p><strong>Score:</strong> ${score}/10</p>
          <p><strong>Issues:</strong> ${review}</p>
        `
      })
    })

    const data = await res.json()
    console.log('Resend response:', JSON.stringify(data))
    return NextResponse.json(data)
  } catch (err) {
    console.error('Notify error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}