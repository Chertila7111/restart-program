'use client'

import { useEffect, useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function InviteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [state, setState] = useState<'loading' | 'ready' | 'signing' | 'error'>('loading')
  const [creds, setCreds] = useState<{ email: string; password: string; name?: string } | null>(null)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { setState('error'); setError('Ссылка недействительна — токен не найден'); return }
    try {
      const decoded = JSON.parse(atob(token))
      if (!decoded.email || !decoded.password) throw new Error()
      setCreds(decoded)
      setState('ready')
    } catch {
      setState('error')
      setError('Ссылка недействительна или повреждена')
    }
  }, [token])

  async function activate() {
    if (!creds) return
    setState('signing')

    // Try to register first (in case account doesn't exist yet)
    await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: creds.email, password: creds.password, name: creds.name || 'Участник' }),
    })

    // Sign in (works whether account was just created or already exists)
    const res = await signIn('credentials', {
      email: creds.email,
      password: creds.password,
      redirect: false,
    })

    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('Не удалось войти. Попробуйте войти вручную.')
      setState('error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-soft)', padding: '5rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <Image src="/logo-icon.png" alt="Снова с собой" width={100} height={100} style={{ objectFit: 'contain', display: 'block', height: '80px', width: 'auto', margin: '0 auto' }} />
          </Link>
        </div>

        <div className="card" style={{ padding: '2rem 2rem 2.5rem' }}>
          {state === 'loading' && (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              Проверяем приглашение...
            </div>
          )}

          {state === 'error' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                Ссылка не работает
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {error}
              </p>
              <Link href="/auth/login" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                Войти вручную
              </Link>
            </div>
          )}

          {(state === 'ready' || state === 'signing') && creds && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  🎉
                </div>
                <div>
                  <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.3 }}>
                    Добро пожаловать{creds.name ? `, ${creds.name.split(' ')[0]}` : ''}!
                  </h1>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Ваш доступ к программе готов</p>
                </div>
              </div>

              {/* Credentials card */}
              <div style={{
                background: 'var(--bg-sage)', borderRadius: '0.875rem', padding: '1.25rem',
                border: '1px solid var(--primary-light)', marginBottom: '1.5rem',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
                  Ваши данные для входа
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Email</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', wordBreak: 'break-all' }}>{creds.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Пароль</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', letterSpacing: showPass ? '0' : '0.15em' }}>
                        {showPass ? creds.password : '•'.repeat(Math.min(creds.password.length, 12))}
                      </div>
                      <button
                        onClick={() => setShowPass(!showPass)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}
                      >
                        {showPass ? 'Скрыть' : 'Показать'}
                      </button>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.875rem 0 0', lineHeight: 1.5 }}>
                  Сохраните эти данные — они нужны для входа в кабинет
                </p>
              </div>

              <button
                onClick={activate}
                disabled={state === 'signing'}
                className="btn-primary"
                style={{ width: '100%', opacity: state === 'signing' ? 0.75 : 1 }}
              >
                {state === 'signing' ? 'Открываем кабинет...' : 'Войти в личный кабинет →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InvitePage() {
  return (
    <Suspense>
      <InviteContent />
    </Suspense>
  )
}
