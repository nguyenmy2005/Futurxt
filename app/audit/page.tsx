'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function parseIssues(review: string): string[] {
  if (!review) return []
  const delimiters = ['. ', ', ', '; ', ' — ', ' - ']
  let issues: string[] = [review]
  for (const d of delimiters) {
    if (review.includes(d)) {
      issues = review.split(d).filter(s => s.trim().length > 10)
      break
    }
  }
  return issues.slice(0, 7).map(s => s.trim().replace(/[.,;!]+$/, '')).filter(Boolean)
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

function AuditContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const isDark = useSystemTheme()

  const company = params.get('company') || 'Your Business'
  const email   = params.get('email') || ''
  const website = params.get('website') || ''
  const review  = params.get('review') || ''
  const score   = params.get('score') || ''

  const issues = parseIssues(review)
  const issueCount = issues.length || 3

  // ── Theme tokens ──
  const t = {
    bg:            isDark ? '#000000'                    : '#f5f5f7',
    surface:       isDark ? 'rgba(255,255,255,0.03)'     : 'rgba(0,0,0,0.03)',
    border:        isDark ? 'rgba(255,255,255,0.10)'     : 'rgba(0,0,0,0.10)',
    borderSub:     isDark ? 'rgba(255,255,255,0.07)'     : 'rgba(0,0,0,0.07)',
    borderFaint:   isDark ? 'rgba(255,255,255,0.05)'     : 'rgba(0,0,0,0.05)',
    surfaceFaint:  isDark ? 'rgba(255,255,255,0.02)'     : 'rgba(0,0,0,0.02)',
    text:          isDark ? '#ffffff'                    : '#0a0a0a',
    textMuted:     isDark ? 'rgba(255,255,255,0.45)'     : 'rgba(0,0,0,0.45)',
    textSub:       isDark ? 'rgba(255,255,255,0.85)'     : 'rgba(0,0,0,0.75)',
    textFooter:    isDark ? 'rgba(255,255,255,0.55)'     : 'rgba(0,0,0,0.45)',
    dividerColor:  isDark ? 'rgba(255,255,255,0.20)'     : 'rgba(0,0,0,0.15)',
    numBg:         isDark ? 'rgba(255,255,255,0.06)'     : 'rgba(0,0,0,0.06)',
    numBorder:     isDark ? 'rgba(255,255,255,0.12)'     : 'rgba(0,0,0,0.12)',
    ctaBg:         isDark ? '#ffffff'                    : '#0a0a0a',
    ctaColor:      isDark ? '#000000'                    : '#ffffff',
    ctaBorder:     isDark ? 'rgba(255,255,255,0.85)'     : 'rgba(0,0,0,0.85)',
    ctaHoverBg:    isDark ? 'rgba(255,255,255,0.92)'     : 'rgba(0,0,0,0.85)',
    ctaDisabledBg: isDark ? 'rgba(255,255,255,0.08)'     : 'rgba(0,0,0,0.06)',
    ctaDisabledColor: isDark ? 'rgba(255,255,255,0.3)'  : 'rgba(0,0,0,0.25)',
    iconColor:     isDark ? 'rgba(255,255,255,0.7)'      : 'rgba(0,0,0,0.5)',
    accentRed:     '#ff3b3b',
    accentBlue:    isDark ? '#3b9eff'                    : '#0071e3',
  }

  const handleClick = async () => {
    setLoading(true)
    await supabase.from('leads').insert({ company_name: company, email, website, review, score, status: 'new' })
    setLoading(false)
    setDone(true)
    setTimeout(() => router.push('/'), 2200)
  }

  if (done) {
    return (
      <main style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', transition: 'background 0.3s' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', background: t.numBg }}>
            <CheckCircle2 size={32} color={t.text} strokeWidth={1.5} />
          </div>
          <p style={{ color: t.text, fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>We'll be in touch shortly.</p>
          <p style={{ color: t.textMuted, fontSize: 14 }}>Redirecting you to Futurxt...</p>
        </div>
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
      justifyContent: 'center',
      padding: 'clamp(24px, 5vw, 40px) clamp(16px, 5vw, 20px)',
      fontFamily: 'inherit',
      transition: 'background 0.3s',
    }}>

      {/* Logo + tagline */}
      <div style={{ maxWidth: 560, width: '100%', margin: '0 auto 32px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ color: t.text, fontWeight: 900, fontSize: 'clamp(22px, 5vw, 28px)', letterSpacing: '-0.04em' }}>Futurxt</span>
        <div style={{ width: 1, height: 20, background: t.dividerColor, flexShrink: 0 }} />
        <span style={{ color: t.textMuted, fontSize: 12, fontWeight: 500, letterSpacing: '0.02em' }}>
          Website Design & Development Agency
        </span>
      </div>

      <div style={{ maxWidth: 560, width: '100%', margin: '0 auto' }}>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(1.7rem, 6vw, 3rem)',
          fontWeight: 900,
          color: t.text,
          lineHeight: 1.08,
          letterSpacing: '-0.038em',
          margin: '0 0 clamp(24px, 5vw, 36px)',
        }}>
          Your Website May Be Losing Potential Customers
        </h1>

        {/* Issues card */}
        <div style={{
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          background: t.surface,
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          marginBottom: 16,
        }}>

          {/* Card header */}
          <div style={{ padding: 'clamp(16px, 4vw, 22px) clamp(16px, 4vw, 24px) clamp(14px, 3vw, 18px)', borderBottom: `1px solid ${t.borderSub}`, textAlign: 'center' }}>
            <span style={{ color: t.text, fontWeight: 700, fontSize: 'clamp(14px, 3.5vw, 16px)', lineHeight: 1.6 }}>
              We found{' '}
              <span style={{ color: t.accentRed, fontWeight: 900 }}>{issueCount} issues</span>
              {' '}that may be costing{' '}
              <span style={{ color: t.accentBlue, fontWeight: 800 }}>{company}</span>
              {' '}potential customers
            </span>
          </div>

          {/* Issues list */}
          <div style={{ padding: '8px 0' }}>
            {issues.length > 0 ? issues.map((issue, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(12px, 3vw, 16px)',
                padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
                borderBottom: i < issues.length - 1 ? `1px solid ${t.borderFaint}` : 'none',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1,
                  background: t.numBg, border: `1px solid ${t.numBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 12, color: t.text, fontFamily: 'monospace', fontWeight: 800 }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: t.text, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{issue}</p>
              </div>
            )) : (
              <div style={{ padding: 'clamp(16px, 4vw, 22px) clamp(16px, 4vw, 24px)' }}>
                <p style={{ color: t.text, fontSize: 'clamp(14px, 3.5vw, 16px)', margin: 0, lineHeight: 1.65 }}>
                  Our team has identified several areas for improvement on your website.
                </p>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div style={{
            padding: 'clamp(14px, 3vw, 18px) clamp(16px, 4vw, 24px)',
            borderTop: `1px solid ${t.borderSub}`,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: t.surfaceFaint,
          }}>
            <TrendingUp size={16} color={t.iconColor} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: t.textSub, margin: 0, lineHeight: 1.65, fontWeight: 400 }}>
              Small improvements to your website can lead to better user engagement and more qualified leads.
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleClick}
          disabled={loading}
          style={{
            width: '100%',
            padding: 'clamp(15px, 4vw, 18px) 24px',
            borderRadius: 14,
            background: loading ? t.ctaDisabledBg : t.ctaBg,
            border: `1px solid ${t.ctaBorder}`,
            color: loading ? t.ctaDisabledColor : t.ctaColor,
            fontSize: 'clamp(14px, 3.5vw, 15px)',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            letterSpacing: '0.02em',
            transition: 'all 0.2s',
            marginBottom: 14,
          }}
          onMouseEnter={e => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.background = t.ctaHoverBg
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.background = t.ctaBg
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }
          }}
        >
          {loading ? 'Submitting...' : <>Show Me The Website Review <ArrowRight size={16} strokeWidth={2.5} /></>}
        </button>

        <p style={{ fontSize: 'clamp(11px, 3vw, 13px)', color: t.textFooter, textAlign: 'center', margin: 0, lineHeight: 1.7 }}>
          Includes a redesign concept and actionable recommendations.
        </p>

      </div>
    </main>
  )
}

export default function AuditPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%' }} />
      </main>
    }>
      <AuditContent />
    </Suspense>
  )
}