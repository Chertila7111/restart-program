'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
          Что-то пошло не так
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '24rem' }}>
          Произошла ошибка. Попробуйте обновить страницу или вернитесь на главную.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} className="btn-primary">Попробовать снова</button>
          <Link href="/" className="btn-outline">На главную</Link>
        </div>
      </div>
    </div>
  )
}
