'use client'

import { useState } from 'react'
import { LighthouseIcon } from '@/components/LighthouseIcon'
import Link from 'next/link'

export default function SetupPage() {
  const [form, setForm] = useState({
    setupKey: '',
    email: '',
    name: '',
    password: 'Restart2026',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/admin/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const text = await res.text()
      let data: { message?: string; error?: string } = {}
      try { data = JSON.parse(text) } catch { data = { error: 'Сервер вернул не JSON: ' + text.slice(0, 120) } }
      if (res.ok) {
        setStatus('done')
        setMessage(data.message || 'Готово')
      } else {
        setStatus('error')
        setMessage(data.error || 'HTTP ' + res.status)
      }
    } catch (e) {
      setStatus('error')
      setMessage('Сетевая ошибка: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-soft)', padding: '5rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '26rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', boxShadow: '0 4px 16px rgba(78,123,94,0.25)' }}>
            <LighthouseIcon size={22} color="white" />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)' }}>Создать Admin-аккаунт</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Одноразовая страница настройки</p>
        </div>

        {status === 'done' ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>{message}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Аккаунт с ролью admin создан. Теперь войдите в кабинет.
            </p>
            <Link href="/auth/login" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
              Войти в кабинет →
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: '2rem' }}>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                  Ключ доступа
                </label>
                <input
                  required
                  placeholder="restart-setup-2026"
                  value={form.setupKey}
                  onChange={e => setForm({ ...form, setupKey: e.target.value })}
                />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  Ключ: <strong>restart-setup-2026</strong>
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Email</label>
                <input type="email" required placeholder="ваш@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Имя</label>
                <input required placeholder="Ваше имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Пароль</label>
                <input required placeholder="Пароль" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  Временный пароль уже стоит: <strong>Restart2026</strong> — поменяйте если нужно
                </p>
              </div>

              {status === 'error' && (
                <div style={{ color: '#B91C1C', background: '#FEF2F2', padding: '0.75rem', borderRadius: '0.625rem', fontSize: '0.825rem' }}>
                  {message}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ marginTop: '0.25rem' }}>
                {status === 'loading' ? 'Создаём...' : 'Создать admin-аккаунт →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
