'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { ymGoal } from '@/lib/metrika'

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('ok')
        setForm({ name: '', email: '', phone: '', message: '' })
        ymGoal('contact_form')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section style={{ background: 'var(--bg-soft)', padding: '5rem 0 3rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '44rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
            Напишите нам
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Если сомневаетесь, подходит ли вам программа — напишите. Мы не будем давить на покупку, а поможем понять, какой формат поддержки сейчас безопаснее.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '56rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))', gap: '3rem' }}>
            {/* Form */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem' }}>Форма обратной связи</h2>

              {status === 'ok' ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
                  <h3 style={{ fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>Сообщение отправлено</h3>
                  <p style={{ color: '#15803D', fontSize: '0.9rem' }}>Ответим в течение нескольких часов в рабочее время.</p>
                </div>
              ) : (
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
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.375rem' }}>Сообщение *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Ваш вопрос или сообщение..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  {status === 'error' && (
                    <p style={{ color: '#B91C1C', fontSize: '0.875rem' }}>Произошла ошибка. Попробуйте ещё раз или напишите напрямую на email.</p>
                  )}
                  <button type="submit" className="btn-primary" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Отправляем...' : 'Отправить →'}
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    Нажимая кнопку, вы соглашаетесь с{' '}
                    <Link href="/legal/privacy" style={{ color: 'var(--primary)' }}>политикой конфиденциальности</Link>
                  </p>
                </form>
              )}
            </div>

            {/* Info */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem' }}>Наши контакты</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.125rem', fontSize: '0.9rem' }}>Email</div>
                    <a href="mailto:snovassoboi@yandex.com" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>snovassoboi@yandex.com</a>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-sage)', border: '1.5px solid var(--primary-light)' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', fontSize: '1rem' }}>Хотите записаться сразу?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.7 }}>
                  Выберите тариф и оплатите онлайн — мы свяжемся с вами для уточнения деталей.
                </p>
                <Link href="/pricing" className="btn-primary" style={{ display: 'inline-flex', fontSize: '0.9rem' }}>
                  Выбрать тариф →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
