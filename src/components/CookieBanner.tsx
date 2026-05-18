'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const KEY = 'cookie_consent_v1'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [])

  const accept = (all: boolean) => {
    try { localStorage.setItem(KEY, all ? 'all' : 'necessary') } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Использование файлов cookie"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 8000,
        background: '#1C2B23',
        color: '#D6E9DC',
        padding: '1.125rem 1.5rem',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.18)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <p style={{ flex: 1, minWidth: '200px', fontSize: '0.825rem', lineHeight: 1.6, margin: 0, color: '#A8B8A0' }}>
        Мы используем файлы cookie для работы сайта и улучшения вашего опыта.
        Нажимая «Принять все», вы соглашаетесь с&nbsp;
        <Link href="/legal/privacy" style={{ color: '#7DB88A', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          политикой конфиденциальности
        </Link>
        &nbsp;и обработкой персональных данных согласно ФЗ-152.
      </p>

      <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0, flexWrap: 'wrap' }}>
        <button
          onClick={() => accept(false)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.625rem',
            border: '1px solid rgba(168,184,160,0.4)',
            background: 'transparent',
            color: '#A8B8A0',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Только необходимые
        </button>
        <button
          onClick={() => accept(true)}
          style={{
            padding: '0.5rem 1.125rem',
            borderRadius: '0.625rem',
            border: 'none',
            background: 'var(--primary)',
            color: 'white',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          Принять все
        </button>
      </div>
    </div>
  )
}
