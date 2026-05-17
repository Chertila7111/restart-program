'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getProduct, PRODUCTS } from '@/lib/products'
import Link from 'next/link'
import { CheckCircle, Shield, Lock } from 'lucide-react'

function CheckoutForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('product') || 'base'
  const product = getProduct(productId) || PRODUCTS[1]

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, ...form }),
      })
      const data = await res.json()
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        setStatus('success')
        setMessage(data.message || 'Заказ создан! Мы свяжемся с вами.')
      }
    } catch {
      setStatus('error')
      setMessage('Произошла ошибка. Попробуйте ещё раз.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F3FF', padding: '2rem' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '28rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontWeight: 800, color: '#1F1535', marginBottom: '0.75rem' }}>Заказ оформлен!</h2>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>{message}</p>
          <Link href="/cabinet" className="btn-primary">Перейти в кабинет →</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3FF', padding: '5rem 1.5rem' }}>
      <div className="container mx-auto" style={{ maxWidth: '52rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))', gap: '2rem' }}>
          {/* Product summary */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1F1535', marginBottom: '1.5rem' }}>Ваш выбор</h2>
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1F1535', marginBottom: '0.25rem' }}>{product.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>{product.description}</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#7C3AED', marginBottom: '1.5rem' }}>
                {product.price.toLocaleString('ru-RU')} ₽
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {product.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563' }}>
                    <CheckCircle size={14} style={{ color: '#7C3AED', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: Shield, text: 'Безопасная оплата через ЮKassa' },
                { icon: Lock, text: 'SSL-шифрование данных' },
                { icon: CheckCircle, text: 'Возврат в течение 7 дней' },
              ].map((t) => {
                const Icon = t.icon
                return (
                  <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#6B7280' }}>
                    <Icon size={14} style={{ color: '#10B981' }} /> {t.text}
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <Link href="/pricing" style={{ color: '#7C3AED', fontSize: '0.875rem', textDecoration: 'none' }}>
                ← Изменить тариф
              </Link>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1F1535', marginBottom: '1.5rem' }}>Данные для оформления</h2>
            <div className="card" style={{ padding: '1.75rem' }}>
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Имя *</label>
                  <input required placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Email *</label>
                  <input type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>Телефон</label>
                  <input type="tel" placeholder="+7 (999) 000-00-00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>

                {status === 'error' && (
                  <div style={{ color: '#EF4444', fontSize: '0.875rem', background: '#FEF2F2', padding: '0.75rem', borderRadius: '0.5rem' }}>{message}</div>
                )}

                <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ marginTop: '0.5rem' }}>
                  {status === 'loading' ? 'Оформляем...' : `Оплатить ${product.price.toLocaleString('ru-RU')} ₽ →`}
                </button>

                <p style={{ fontSize: '0.7rem', color: '#9CA3AF', textAlign: 'center' }}>
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <Link href="/legal/offer" style={{ color: '#7C3AED' }}>публичной офертой</Link>{' '}
                  и{' '}
                  <Link href="/legal/privacy" style={{ color: '#7C3AED' }}>политикой конфиденциальности</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  )
}
