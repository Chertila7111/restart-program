'use client'

import { useState } from 'react'
import { ShieldOff, ShieldCheck } from 'lucide-react'

export function RevokeAccessButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function revoke() {
    if (status === 'loading' || status === 'done') return
    setStatus('loading')
    try {
      const r = await fetch('/api/journal/revoke-access', { method: 'POST' })
      setStatus(r.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
        marginTop: '0.625rem',
        padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
        background: '#DCFCE7', border: '1px solid #86EFAC',
      }}>
        <ShieldCheck size={13} style={{ color: '#16A34A', marginTop: '0.1rem', flexShrink: 0 }} />
        <div style={{ fontSize: '0.775rem', color: '#166534', lineHeight: 1.55 }}>
          <strong>Доступ закрыт.</strong> Психолог больше не видит ваш дневник.
          Чтобы снова открыть доступ — отметьте нужные записи при просмотре.
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <button
        onClick={revoke}
        disabled={status === 'loading'}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          padding: '0.35rem 0.75rem', borderRadius: '0.5rem',
          border: '1px solid #86EFAC', background: 'transparent',
          color: '#166534', fontSize: '0.775rem', fontWeight: 600,
          cursor: status === 'loading' ? 'wait' : 'pointer',
        }}
      >
        <ShieldOff size={12} />
        {status === 'loading' ? 'Закрываем доступ...' : 'Закрыть доступ для психолога'}
      </button>
      {status === 'error' && (
        <span style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: '#B91C1C' }}>
          Не удалось. Попробуйте ещё раз.
        </span>
      )}
    </div>
  )
}
