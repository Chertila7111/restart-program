'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { LighthouseIcon } from '@/components/LighthouseIcon'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Пароли не совпадают')
      return
    }
    setStatus('loading')
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Ошибка регистрации')
      setStatus('error')
      return
    }

    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-soft)',
      padding: '5rem 1.5rem',
    }}>
      <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: '28rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: '3rem', height: '3rem', borderRadius: '0.875rem',
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(78,123,94,0.25)',
            }}>
              <LighthouseIcon size={24} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>Restart</span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginTop: '1.25rem', marginBottom: '0.25rem' }}>
            Создать аккаунт
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Присоединяйтесь к программе Restart</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.375rem' }}>Имя *</label>
            <input required placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.375rem' }}>Email *</label>
            <input type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.375rem' }}>Телефон</label>
            <input type="tel" placeholder="+7 (999) 000-00-00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.375rem' }}>Пароль *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={8}
                placeholder="Минимум 8 символов"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.375rem' }}>Повторите пароль *</label>
            <input type="password" required placeholder="Повторите пароль" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </div>

          {error && (
            <div style={{ color: '#B91C1C', fontSize: '0.875rem', background: '#FEF2F2', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #FCA5A5' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ marginTop: '0.5rem' }}>
            {status === 'loading' ? 'Создаём аккаунт...' : 'Создать аккаунт →'}
          </button>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center' }}>
            Регистрируясь, вы соглашаетесь с{' '}
            <Link href="/legal/terms" style={{ color: 'var(--primary)' }}>условиями использования</Link>
            {' '}и{' '}
            <Link href="/legal/privacy" style={{ color: 'var(--primary)' }}>политикой конфиденциальности</Link>
          </p>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Уже есть аккаунт? </span>
          <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Войти</Link>
        </div>
      </div>
    </div>
  )
}
