'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Tier } from './DashboardShell'

const STORAGE_KEY = 'onboarding_v1_done'
const PAD = 10

type Step = {
  icon: string
  title: string
  body: string
  target?: string                          // data-onboarding value
  link?: { label: string; href: string }   // optional "stay on page" link shown inside card
}

function getSteps(tier: Tier): Step[] {
  const base: Step[] = [
    {
      icon: '👋',
      title: 'Добро пожаловать!',
      body: 'Это ваш личный кабинет. Сейчас быстро покажем, что здесь есть и как этим пользоваться.',
    },
    {
      icon: '📅',
      title: 'Ваша встреча',
      body: 'Здесь вы видите ближайшую групповую встречу — ссылку для входа, дату, время и ведущего психолога.',
      target: 'nav-main',
    },
    {
      icon: '💬',
      title: 'Чат с куратором',
      body: 'Есть вопрос? Пишите куратору прямо здесь — отвечаем в рабочее время, обычно в течение дня.',
      target: 'nav-chats',
    },
    {
      icon: '🧠',
      title: 'Мой психолог',
      body: 'Здесь информация о специалисте, который ведёт вашу программу: опыт, специализация, контакт.',
      target: 'nav-psychologist',
    },
  ]

  if (tier === 'intro') {
    return [
      ...base,
      {
        icon: '🚀',
        title: 'Хотите большего?',
        body: 'Вводная встреча — это первый шаг. Полная программа открывает дневник, задания и групповые сессии каждую неделю.',
        target: 'sidebar-upsell',
        link: { label: 'Посмотреть программы', href: '/pricing' },
      },
    ]
  }

  return [
    ...base,
    {
      icon: '📖',
      title: 'Программа',
      body: 'Еженедельные модули: статьи, упражнения и практики — открываются постепенно, один в неделю.',
      target: 'nav-program',
    },
    {
      icon: '✍️',
      title: 'Дневник и задания',
      body: 'Записывайте мысли в дневнике и выполняйте задания. Психолог видит ваш прогресс и может оставить комментарий.',
      target: 'nav-journal',
    },
    {
      icon: '✅',
      title: 'Всё готово!',
      body: 'Вы разобрались с кабинетом. Если появятся вопросы — куратор в чате или раздел «Помощь». Повторить обучение можно через кнопку «Обучение» в меню.',
    },
  ]
}

type HighlightRect = { left: number; top: number; width: number; height: number }

function queryOnboarding(target: string): HighlightRect | null {
  const el = document.querySelector(`[data-onboarding="${target}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (r.width === 0 && r.height === 0) return null   // hidden on mobile
  return { left: r.left, top: r.top, width: r.width, height: r.height }
}

type Props = { tier: Tier; role: string }

export default function OnboardingTour({ tier, role }: Props) {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [hl, setHl] = useState<HighlightRect | null>(null)   // highlighted element rect

  const steps = (role === 'admin' || role === 'psychologist') ? [] : getSteps(tier)

  // Recompute highlight whenever step or visibility changes
  useEffect(() => {
    if (!visible || steps.length === 0) return
    const target = steps[step]?.target
    if (!target) { setHl(null); return }
    const t = setTimeout(() => setHl(queryOnboarding(target)), 80)
    return () => clearTimeout(t)
  }, [visible, step, steps])

  // Recompute on resize (sidebar items move)
  useEffect(() => {
    if (!visible) return
    const target = steps[step]?.target
    if (!target) return
    const handler = () => setHl(queryOnboarding(target))
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [visible, step, steps])

  // First-time auto-show
  useEffect(() => {
    if (steps.length === 0) return
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setVisible(true), 700)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [steps.length])

  // External trigger (sidebar "Обучение" button)
  useEffect(() => {
    if (steps.length === 0) return
    const handler = () => { setStep(0); setVisible(true) }
    window.addEventListener('startOnboarding', handler)
    return () => window.removeEventListener('startOnboarding', handler)
  }, [steps.length])

  const finish = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
    setVisible(false)
    setHl(null)
  }, [])

  const next = () => step < steps.length - 1 ? setStep(s => s + 1) : finish()
  const prev = () => setStep(s => Math.max(0, s - 1))

  if (!visible || steps.length === 0) return null

  const current = steps[step]
  const isLast = step === steps.length - 1

  // Viewport dimensions (safe — we only render client-side)
  const vw = window.innerWidth
  const vh = window.innerHeight

  // Tooltip placement
  let cardLeft: number | string
  let cardTop: number | string
  let cardTransform: string
  const cardMaxW = 360

  if (hl && hl.left + hl.width + cardMaxW + 48 < vw) {
    // Element is in left half and there's room → show card to the right
    cardLeft = hl.left + hl.width + PAD + 16
    cardTop = Math.max(80, Math.min(hl.top + hl.height / 2, vh - 300))
    cardTransform = 'translateY(-50%)'
  } else if (hl && hl.top > vh * 0.55) {
    // Element is in lower part → show card above
    cardLeft = '50%'
    cardTop = hl.top - PAD - 16
    cardTransform = 'translate(-50%, -100%)'
  } else {
    // Default: centered
    cardLeft = '50%'
    cardTop = '50%'
    cardTransform = 'translate(-50%, -50%)'
  }

  return (
    <>
      {/* Dark overlay with spotlight hole */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 9998, pointerEvents: 'none' }}
        aria-hidden
      >
        <defs>
          <mask id="ob-spotlight">
            <rect width="100%" height="100%" fill="white" />
            {hl && (
              <rect
                x={hl.left - PAD}
                y={hl.top - PAD}
                width={hl.width + PAD * 2}
                height={hl.height + PAD * 2}
                rx={12}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(20,36,28,0.72)" mask="url(#ob-spotlight)" />
      </svg>

      {/* Glowing ring around highlighted element */}
      {hl && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            left: hl.left - PAD,
            top: hl.top - PAD,
            width: hl.width + PAD * 2,
            height: hl.height + PAD * 2,
            borderRadius: 12,
            border: '2px solid var(--primary)',
            boxShadow: '0 0 0 3px rgba(78,123,94,0.25), 0 0 16px rgba(78,123,94,0.35)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        role="dialog"
        aria-modal
        style={{
          position: 'fixed',
          left: cardLeft,
          top: cardTop,
          transform: cardTransform,
          zIndex: 10000,
          maxWidth: cardMaxW,
          width: 'calc(100vw - 2rem)',
          background: 'var(--card)',
          borderRadius: '1.375rem',
          padding: '1.625rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        }}
      >
        {/* Step dots */}
        <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.125rem' }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              height: '0.35rem',
              width: i === step ? '1.5rem' : '0.35rem',
              borderRadius: 9999,
              background: i === step ? 'var(--primary)' : i < step ? 'var(--primary-light)' : '#E5E7EB',
              transition: 'all 0.3s',
              flexShrink: 0,
            }} />
          ))}
        </div>

        <div style={{ fontSize: '2.25rem', lineHeight: 1, marginBottom: '0.625rem' }}>{current.icon}</div>
        <h2 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {current.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.855rem', lineHeight: 1.75, marginBottom: current.link ? '0.75rem' : '1.25rem' }}>
          {current.body}
        </p>

        {/* Optional link — doesn't close or redirect, opens in same tab */}
        {current.link && (
          <a
            href={current.link.href}
            target="_self"
            onClick={finish}
            style={{
              display: 'inline-block', marginBottom: '1rem',
              fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600,
              textDecoration: 'underline', textUnderlineOffset: '3px',
            }}
          >
            {current.link.label} →
          </a>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {step > 0 && (
            <button onClick={prev} style={{
              padding: '0.6rem 0.875rem', borderRadius: '0.75rem',
              border: '1.5px solid var(--border)', background: 'white',
              color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem',
              cursor: 'pointer', flexShrink: 0,
            }}>←</button>
          )}
          <button onClick={next} style={{
            flex: 1, padding: '0.65rem 1rem', borderRadius: '0.75rem',
            background: 'var(--primary)', color: 'white', border: 'none',
            fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
          }}>
            {isLast ? 'Готово ✓' : 'Далее →'}
          </button>
          {!isLast && (
            <button onClick={finish} style={{
              padding: '0.6rem 0.75rem', borderRadius: '0.75rem',
              border: '1.5px solid var(--border)', background: 'white',
              color: 'var(--text-light)', fontSize: '0.8rem',
              cursor: 'pointer', flexShrink: 0,
            }}>✕</button>
          )}
        </div>
      </div>
    </>
  )
}
