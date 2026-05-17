'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const res = await signIn('credentials', {
      email: form.email.toLowerCase().trim(),
      password: form.password,
      redirect: false,
    })

    if (res?.ok) {
      router.push(callbackUrl)
    } else {
      setError('Неверный email или пароль')
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
          <Link href="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Image src="/logo.png" alt="Снова с собой" width={64} height={64} style={{ objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>Снова с собой</span>
          </Link>
        </div>

        <div className="card" style={{ padding: '2rem 2rem 2.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
            Войти в кабинет
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Доступ открыт участникам программы по приглашению
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Email
              </label>
              <input
                type="email" required autoComplete="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Пароль
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                  placeholder="Ваш пароль"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex' }}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ color: '#B91C1C', fontSize: '0.825rem', background: '#FEF2F2', padding: '0.75rem 1rem', borderRadius: '0.625rem', border: '1px solid #FCA5A5' }}>
                {error}
              </div>
            )}

            <button
              type="submit" className="btn-primary"
              disabled={status === 'loading'}
              style={{ marginTop: '0.25rem', opacity: status === 'loading' ? 0.75 : 1 }}
            >
              {status === 'loading' ? 'Входим...' : 'Войти →'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', lineHeight: 1.7 }}>
            Нет аккаунта? Доступ открывается после оплаты.{' '}
            <Link href="/pricing" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Выбрать тариф →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
