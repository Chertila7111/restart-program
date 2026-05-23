'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getProduct, PRODUCTS } from '@/lib/products'
import Link from 'next/link'
import { CheckCircle, Shield, Lock, ArrowLeft } from 'lucide-react'
import { ymGoal, ymEcommerceCheckout } from '@/lib/metrika'

function CheckoutForm() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product') || 'base'
  const product = getProduct(productId) || PRODUCTS[1]

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const formatPhone = (raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, 11)
    if (!d) return ''
    const local = d.startsWith('7') || d.startsWith('8') ? d.slice(1) : d
    let r = '+7'
    if (local.length > 0) r += ' (' + local.slice(0, 3)
    if (local.length >= 3) r += ') ' + local.slice(3, 6)
    if (local.length >= 6) r += '-' + local.slice(6, 8)
    if (local.length >= 8) r += '-' + local.slice(8, 10)
    return r
  }
  const [message, setMessage] = useState('')

  useEffect(() => {
    ymGoal('checkout_start', { product: product.id, product_name: product.name, price: product.price })
    ymEcommerceCheckout({ productId: product.id, productName: product.name, price: product.price, step: 1 })
  }, [product.id, product.name, product.price])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    ymGoal('checkout_submit', { product: product.id, product_name: product.name, order_price: product.price })
    ymEcommerceCheckout({ productId: product.id, productName: product.name, price: product.price, step: 2 })
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '28rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Заказ оформлен!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{message}</p>
          <Link href="/dashboard" className="btn-primary">Перейти в кабинет →</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '80vh', padding: '3rem 1.5rem' }}>
      <div className="container mx-auto" style={{ maxWidth: '52rem' }}>
        <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem' }}>
          <ArrowLeft size={14} /> Изменить тариф
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))', gap: '2rem' }}>
          {/* Product summary */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1.5rem' }}>Ваш выбор</h2>
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{product.name}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{product.description}</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                {product.price.toLocaleString('ru-RU')} ₽
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {product.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <CheckCircle size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: Shield, text: 'Безопасная оплата через ЮKassa' },
                { icon: Lock, text: 'SSL-шифрование данных' },
                { icon: CheckCircle, text: 'Возврат за неоказанные услуги' },
              ].map((t) => {
                const Icon = t.icon
                return (
                  <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Icon size={14} style={{ color: 'var(--primary)' }} /> {t.text}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1.5rem' }}>Данные для оформления</h2>
            <div className="card" style={{ padding: '1.75rem' }}>
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Имя *</label>
                  <input required placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Email *</label>
                  <input type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Телефон</label>
                  <input type="tel" placeholder="+7 (999) 000-00-00" value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })} />
                </div>

                {status === 'error' && (
                  <div style={{ color: '#B91C1C', fontSize: '0.875rem', background: '#FEF2F2', padding: '0.75rem', borderRadius: '0.75rem' }}>{message}</div>
                )}

                <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ marginTop: '0.5rem' }}>
                  {status === 'loading' ? 'Оформляем...' : `Оплатить ${product.price.toLocaleString('ru-RU')} ₽ →`}
                </button>

                <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', textAlign: 'center', lineHeight: 1.6 }}>
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <Link href="/legal/offer" style={{ color: 'var(--primary)' }}>публичной офертой</Link>{' '}
                  и{' '}
                  <Link href="/legal/privacy" style={{ color: 'var(--primary)' }}>политикой конфиденциальности</Link>
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
