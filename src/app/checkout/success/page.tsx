'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ymEcommercePurchase } from '@/lib/metrika'
import { LogoSvg } from '@/components/LogoSvg'
import Link from 'next/link'
import { Mail, LayoutDashboard, MessageCircle } from 'lucide-react'

function SuccessContent() {
  const params = useSearchParams()

  useEffect(() => {
    const orderId = params.get('order') || ''
    const productId = params.get('product') || ''
    const productName = decodeURIComponent(params.get('name') || '')
    const price = parseInt(params.get('amount') || '0', 10)
    if (orderId && productId && price) {
      ymEcommercePurchase({ orderId, productId, productName, price })
    }
  }, [params])

  const steps = [
    {
      icon: Mail,
      title: 'Проверьте почту',
      desc: 'Мы отправили письмо с вашими данными для входа. Если не видите — загляните в папку «Спам».',
    },
    {
      icon: LayoutDashboard,
      title: 'Войдите в личный кабинет',
      desc: 'Все материалы программы, записи встреч и задания доступны в кабинете.',
    },
    {
      icon: MessageCircle,
      title: 'Куратор свяжется с вами',
      desc: 'В течение рабочего дня куратор напишет вам и расскажет, как начать.',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-soft)',
      padding: '5rem 1.5rem 3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ maxWidth: '34rem', width: '100%' }}>
        {/* Logo + success */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <LogoSvg size={64} />
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '4rem', height: '4rem', borderRadius: '50%',
            background: 'var(--primary)', marginBottom: '1.25rem',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Оплата прошла!
          </h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Доступ к программе активирован. Вот что нужно сделать дальше:
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                  background: 'var(--primary-light)', flexShrink: 0,
                }}>
                  <Icon size={18} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)',
                      background: 'var(--primary-light)', padding: '0.1rem 0.5rem',
                      borderRadius: '9999px',
                    }}>
                      Шаг {i + 1}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="btn-primary"
          style={{ width: '100%', textAlign: 'center', fontSize: '1rem' }}
        >
          Перейти в личный кабинет →
        </Link>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '1.25rem', lineHeight: 1.6 }}>
          Вопросы? Напишите нам на{' '}
          <a href="mailto:snovassoboi@yandex.com" style={{ color: 'var(--primary)' }}>snovassoboi@yandex.com</a>
        </p>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
