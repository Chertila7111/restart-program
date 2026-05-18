'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogoSvg } from '@/components/LogoSvg'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-soft)', padding: '5rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '26rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <LogoSvg size={100} />
          </Link>
        </div>

        <div className="card" style={{ padding: '2rem 2rem 2.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
            Сброс пароля
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Введите email — пришлём ссылку для создания нового пароля
          </p>

          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✓</div>
              <h2 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Письмо отправлено</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Проверьте почту {email} и перейдите по ссылке в письме. Ссылка действительна 1 час.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                  Email
                </label>
                <input
                  type="email" required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {status === 'error' && (
                <div style={{ color: '#B91C1C', fontSize: '0.825rem', background: '#FEF2F2', padding: '0.75rem 1rem', borderRadius: '0.625rem', border: '1px solid #FCA5A5' }}>
                  Произошла ошибка. Попробуйте позже.
                </div>
              )}

              <button
                type="submit" className="btn-primary"
                disabled={status === 'loading'}
                style={{ marginTop: '0.25rem', opacity: status === 'loading' ? 0.75 : 1 }}
              >
                {status === 'loading' ? 'Отправляем...' : 'Отправить ссылку →'}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/auth/login" style={{ color: 'var(--text-light)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Вернуться к входу
          </Link>
        </div>
      </div>
    </div>
  )
}
