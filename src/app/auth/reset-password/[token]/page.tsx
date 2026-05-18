'use client'

import { useState } from 'react'
import Link from 'next/link'
import { use } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setErrorMsg('Пароли не совпадают'); return }
    if (password.length < 8) { setErrorMsg('Пароль должен быть не менее 8 символов'); return }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setStatus('done')
        setTimeout(() => router.push('/auth/login'), 3000)
      } else {
        setErrorMsg(data.error || 'Ошибка при сбросе пароля')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Ошибка соединения. Попробуйте позже.')
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
            Новый пароль
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Придумайте пароль не менее 8 символов
          </p>

          {status === 'done' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✓</div>
              <h2 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Пароль изменён</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Перенаправляем на страницу входа...
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                  Новый пароль
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} required
                    placeholder="Минимум 8 символов"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                  Повторите пароль
                </label>
                <input
                  type="password" required
                  placeholder="Повторите пароль"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                />
              </div>

              {errorMsg && (
                <div style={{ color: '#B91C1C', fontSize: '0.825rem', background: '#FEF2F2', padding: '0.75rem 1rem', borderRadius: '0.625rem', border: '1px solid #FCA5A5' }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit" className="btn-primary"
                disabled={status === 'loading'}
                style={{ marginTop: '0.25rem', opacity: status === 'loading' ? 0.75 : 1 }}
              >
                {status === 'loading' ? 'Сохраняем...' : 'Сохранить пароль →'}
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
