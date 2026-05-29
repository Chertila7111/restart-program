'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export function MarkCompleteButton({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  if (status === 'completed') {
    return (
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', border: '1px solid #059669', borderRadius: '9999px', padding: '0.15rem 0.625rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
        <CheckCircle size={11} /> Проведена
      </span>
    )
  }

  async function mark() {
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })
      if (res.ok) setStatus('completed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={mark}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        background: '#059669', color: 'white', border: 'none',
        borderRadius: '0.625rem', padding: '0.35rem 0.75rem',
        fontWeight: 700, fontSize: '0.75rem', cursor: loading ? 'default' : 'pointer',
        opacity: loading ? 0.7 : 1,
      }}
    >
      <CheckCircle size={12} />
      {loading ? '…' : 'Проведена'}
    </button>
  )
}
