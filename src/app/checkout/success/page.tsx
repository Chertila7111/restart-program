'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ymEcommercePurchase } from '@/lib/metrika'
import { LogoSvg } from '@/components/LogoSvg'

function SuccessContent() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const orderId = params.get('order') || ''
    const productId = params.get('product') || ''
    const productName = decodeURIComponent(params.get('name') || '')
    const price = parseInt(params.get('amount') || '0', 10)

    if (orderId && productId && price) {
      ymEcommercePurchase({ orderId, productId, productName, price })
    }

    const t = setTimeout(() => router.replace('/dashboard'), 3000)
    return () => clearTimeout(t)
  }, [params, router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-soft)', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <LogoSvg size={72} />
        </div>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Оплата прошла!
        </h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
          Доступ к программе активирован. Письмо с деталями отправлено на вашу почту.
        </p>
        <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
          Переходим в личный кабинет...
        </p>
        <div style={{ marginTop: '1.5rem', height: '3px', background: 'var(--bg-dark)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--primary)', animation: 'progressBar 3s linear forwards' }} />
        </div>
      </div>
      <style>{`@keyframes progressBar { from { width: 0% } to { width: 100% } }`}</style>
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
