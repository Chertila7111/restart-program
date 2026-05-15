'use client'

import { useState } from 'react'
import { Mail, MessageCircle, Clock } from 'lucide-react'

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
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 100%)', padding: '5rem 0 3rem' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center' }}>
          <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', marginBottom: '1.5rem', display: 'inline-flex' }}>Контакты</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#1F1535', marginBottom: '1rem' }}>
            Напишите нам
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
            Ответим в течение нескольких часов в рабочее время
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '56rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: '3rem' }}>
            {/* Form */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F1535', marginBottom: '1.5rem' }}>Форма обратной связи</h2>

              {status === 'ok' ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                  <h3 style={{ fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>Сообщение отправлено!</h3>
                  <p style={{ color: '#15803D' }}>Мы ответим вам в течение нескольких часов.</p>
                </div>
              ) : (
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Имя *</label>
                    <input
                      required
                      placeholder="Ваше имя"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Телефон</label>
                    <input
                      type="tel"
                      placeholder="+7 (999) 000-00-00"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Сообщение *</label>
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
                    <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>Произошла ошибка. Попробуйте ещё раз или напишите на email.</p>
                  )}
                  <button type="submit" className="btn-primary" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Отправляем...' : 'Отправить сообщение →'}
                  </button>
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                    Нажимая кнопку, вы соглашаетесь с{' '}
                    <a href="/legal/privacy" style={{ color: '#7C3AED' }}>политикой конфиденциальности</a>
                  </p>
                </form>
              )}
            </div>

            {/* Info */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F1535', marginBottom: '1.5rem' }}>Наши контакты</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { icon: Mail, title: 'Email', value: 'hello@restart-program.ru', href: 'mailto:hello@restart-program.ru' },
                  { icon: MessageCircle, title: 'Telegram', value: '@restart_support', href: 'https://t.me/restart_support' },
                  { icon: Clock, title: 'Время ответа', value: 'Пн–Пт 9:00–20:00 МСК', href: null },
                ].map((c) => {
                  const Icon = c.icon
                  return (
                    <div key={c.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} style={{ color: '#7C3AED' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1F1535', marginBottom: '0.125rem' }}>{c.title}</div>
                        {c.href ? (
                          <a href={c.href} style={{ color: '#7C3AED', textDecoration: 'none', fontSize: '0.9rem' }}>{c.value}</a>
                        ) : (
                          <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>{c.value}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="card" style={{ padding: '1.5rem', marginTop: '2rem', background: '#F5F3FF' }}>
                <h3 style={{ fontWeight: 700, color: '#1F1535', marginBottom: '0.5rem' }}>Хотите записаться сразу?</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Выберите тариф и оплатите онлайн — мы свяжемся с вами для уточнения деталей.
                </p>
                <a href="/pricing" className="btn-primary" style={{ display: 'inline-flex', fontSize: '0.9rem' }}>
                  Выбрать тариф →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
