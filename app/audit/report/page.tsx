'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ReportItem {
  title: string
  impact: string
  fix: string
}

interface Report {
  summary: string
  items: ReportItem[]
}

function useSystemTheme() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(mq.matches)
    const handler = (e: MediaQueryListEvent) => setDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return dark
}

async function generateReport(company: string, website: string, review: string, score: string): Promise<Report> {
  const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: `You are a web design consultant writing a website audit report for a business owner who is NOT technical. They don't understand developer terms.

Business: ${company}
Website: ${website}
Technical assessment: ${review}
Score: ${score}/10

Write a JSON report that translates technical problems into business impact language.

RULES:
- Never use technical terms like "title tag", "meta description", "PageSpeed", "SEO score", "CSS", "JavaScript", "HTTP"
- Always explain in terms of: lost customers, lost revenue, looking unprofessional, hard to find on Google
- Keep each sentence under 15 words
- Be specific to THIS business

Return ONLY valid JSON, no markdown, no backticks:
{
  "summary": "2 sentences max. What the biggest problem is costing them.",
  "items": [
    {
      "title": "Short problem name (5 words max)",
      "impact": "What this costs them in business terms (1 sentence)",
      "fix": "What we would do to fix it (1 sentence)"
    }
  ]
}

Generate 3-5 items based on the assessment.`
      }]
    })
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return {
      summary: `We found several issues on ${company}'s website that may be costing you customers.`,
      items: [
        { title: 'Hard to find on Google', impact: 'New customers searching for you cannot find your business.', fix: 'We\'ll optimize your site so Google can properly rank it.' },
        { title: 'Outdated design', impact: 'Visitors leave quickly because the site looks untrustworthy.', fix: 'We\'ll redesign with a modern look that builds confidence.' },
        { title: 'No clear contact path', impact: 'Interested customers don\'t know how to reach you.', fix: 'We\'ll add clear buttons and contact info throughout.' }
      ]
    }
  }
}

function ReportContent() {
  const params = useSearchParams()
  const router = useRouter()
  const isDark = useSystemTheme()

  const company = params?.get('company') ?? 'Your Business'
  const email   = params?.get('email') ?? ''
  const website = params?.get('website') ?? ''
  const review  = params?.get('review') ?? ''
  const score   = params?.get('score') ?? ''

  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    generateReport(company, website, review, score).then(r => {
      setReport(r)
      setLoading(false)
    })
  }, [])

  const t = {
    bg:          isDark ? '#000000' : '#f5f5f7',
    surface:     isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
    border:      isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)',
    borderSub:   isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    text:        isDark ? '#ffffff' : '#0a0a0a',
    textMuted:   isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    textSub:     isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.60)',
    textFooter:  isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    divider:     isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.15)',
    numBg:       isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    numBorder:   isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    tagBg:       isDark ? 'rgba(255,59,59,0.12)' : 'rgba(255,59,59,0.08)',
    tagText:     '#ff3b3b',
    fixBg:       isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    ctaBg:       isDark ? '#ffffff' : '#0a0a0a',
    ctaColor:    isDark ? '#000000' : '#ffffff',
    ctaBorder:   isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)',
    ctaHoverBg:  isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.85)',
    ctaDisBg:    isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    ctaDisColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
    accentBlue:  isDark ? '#3b9eff' : '#0071e3',
  }

  const handleContact = async () => {
    setSubmitting(true)
    await supabase.from('leads').insert({
      company_name: company,
      email,
      website,
      review,
      score,
      status: 'contacted'
    })
    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <main style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            border: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px', background: t.numBg
          }}>
            <CheckCircle2 size={32} color={t.text} strokeWidth={1.5} />
          </div>
          <p style={{ color: t.text, fontSize: 22, fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.03em' }}>
            Message received.
          </p>
          <p style={{ color: t.textMuted, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            We'll reach out to you as soon as possible — via email, Instagram, or another channel that works best for you.
          </p>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ width: 28, height: 28, border: `2px solid ${t.numBorder}`, borderTopColor: t.text, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: t.textMuted, fontSize: 13 }}>Preparing your report...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: t.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'clamp(24px, 5vw, 48px) clamp(16px, 5vw, 20px)',
    }}>
      <div style={{ maxWidth: 600, width: '100%', margin: '0 auto 40px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: t.text, fontWeight: 900, fontSize: 'clamp(20px, 4vw, 26px)', letterSpacing: '-0.04em' }}>Futurxt</span>
        <div style={{ width: 1, height: 18, background: t.divider }} />
        <span style={{ color: t.textMuted, fontSize: 11, fontWeight: 500, letterSpacing: '0.02em' }}>Website Design & Development</span>
      </div>

      <div style={{ maxWidth: 600, width: '100%', margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: t.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>
            Website Audit Report
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 5.5vw, 2.6rem)',
            fontWeight: 900, color: t.text,
            lineHeight: 1.08, letterSpacing: '-0.038em',
            margin: '0 0 16px'
          }}>
            Here's what we found on{' '}
            <span style={{ color: t.accentBlue }}>{company}</span>'s site
          </h1>
          {report?.summary && (
            <p style={{ color: t.textSub, fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              {report.summary}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {report?.items.map((item, i) => (
            <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 16, background: t.surface, overflow: 'hidden' }}>
              <div style={{
                padding: 'clamp(14px, 3vw, 18px) clamp(16px, 4vw, 22px)',
                borderBottom: `1px solid ${t.borderSub}`,
                display: 'flex', alignItems: 'flex-start', gap: 14
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: t.numBg, border: `1px solid ${t.numBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1
                }}>
                  <span style={{ fontSize: 12, color: t.text, fontFamily: 'monospace', fontWeight: 800 }}>{i + 1}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: t.text }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: 13, color: t.textSub, lineHeight: 1.65 }}>{item.impact}</p>
                </div>
                <span style={{
                  flexShrink: 0, padding: '3px 10px', borderRadius: 6,
                  background: t.tagBg, color: t.tagText,
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase'
                }}>Issue</span>
              </div>
              <div style={{
                padding: 'clamp(12px, 3vw, 14px) clamp(16px, 4vw, 22px)',
                background: t.fixBg, display: 'flex', alignItems: 'flex-start', gap: 10
              }}>
                <span style={{ fontSize: 13, color: '#22c55e', flexShrink: 0, marginTop: 1 }}>✓</span>
                <p style={{ margin: 0, fontSize: 13, color: t.textMuted, lineHeight: 1.65 }}>{item.fix}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleContact}
          disabled={submitting}
          style={{
            width: '100%',
            padding: 'clamp(15px, 4vw, 18px) 24px',
            borderRadius: 14,
            background: submitting ? t.ctaDisBg : t.ctaBg,
            border: `1px solid ${t.ctaBorder}`,
            color: submitting ? t.ctaDisColor : t.ctaColor,
            fontSize: 'clamp(14px, 3.5vw, 15px)',
            fontWeight: 800,
            cursor: submitting ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            letterSpacing: '0.02em', transition: 'all 0.2s', marginBottom: 12,
          }}
          onMouseEnter={e => {
            if (!submitting) {
              (e.currentTarget as HTMLButtonElement).style.background = t.ctaHoverBg
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={e => {
            if (!submitting) {
              (e.currentTarget as HTMLButtonElement).style.background = t.ctaBg
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }
          }}
        >
          {submitting ? 'Sending...' : <>Get In Touch <ArrowRight size={16} strokeWidth={2.5} /></>}
        </button>

        <p style={{ fontSize: 12, color: t.textFooter, textAlign: 'center', margin: 0, lineHeight: 1.7 }}>
          Free, no commitment. We'll reach out via email or social media.
        </p>
      </div>
    </main>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%' }} />
      </main>
    }>
      <ReportContent />
    </Suspense>
  )
}