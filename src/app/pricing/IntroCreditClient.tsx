'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

const INTRO_CREDIT = 1490
const FULL_PROGRAM_IDS = ['base', 'plus', 'plus-pro', 'personal', 'personal-start', 'personal-balance', 'personal-deep']

export default function IntroCreditClient() {
  const [hasIntro, setHasIntro] = useState(false)

  useEffect(() => {
    fetch('/api/user/intro-credit')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.hasIntro) setHasIntro(true) })
      .catch(() => {})
  }, [])

  if (!hasIntro) return null

  return (
    <>
      {/* Banner injected above group plans via CSS data attribute targeting */}
      <div
        id="intro-credit-banner"
        style={{ background: 'var(--bg-sage)', border: '1.5px solid var(--primary)', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
      >
        <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
            Вводная встреча оплачена — вычитаем {INTRO_CREDIT.toLocaleString('ru-RU')} ₽
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
            Скидка применится автоматически при оформлении.
          </span>
        </div>
      </div>
    </>
  )
}
