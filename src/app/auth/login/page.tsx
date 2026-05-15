'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/cabinet'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    if (res?.ok) {
      router.push(callbackUrl)
    } else {
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 100%)', padding: '5rem 1.5rem' }}>
      <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: '26rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.25rem', margin: '0 auto 1rem' }}>R</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F1535' }}>Вход в аккаунт</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Добро пожаловать в Restart</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Email</label>
            <input type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Пароль</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Ваш пароль"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: '2.5rem' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {status === 'error' && (
            <div style={{ color: '#EF4444', fontSize: '0.875rem', background: '#FEF2F2', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #FCA5A5' }}>
              Неверный email или пароль
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ marginTop: '0.5rem' }}>
            {status === 'loading' ? 'Входим...' : 'Войти →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
          <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>Нет аккаунта? </span>
          <Link href="/auth/register" style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Зарегистрироваться</Link>
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
