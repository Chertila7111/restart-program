'use client'

import { useState } from 'react'

const STATUS_LABEL: Record<string, string> = {
  lead:             'Зарегистрирован',
  intro_paid:       'Вводная оплачена',
  intro_scheduled:  'Встреча назначена',
  intro_completed:  'Вводная прошла',
  waiting_group:    'Ожидает группу',
  in_group:         'В группе',
  individual:       'Индивидуальный',
  completed:        'Завершил(а)',
}

const STATUS_COLOR: Record<string, string> = {
  lead:             '#9CA3AF',
  intro_paid:       '#3B82F6',
  intro_scheduled:  '#8B5CF6',
  intro_completed:  '#059669',
  waiting_group:    '#D97706',
  in_group:         '#4E7B5E',
  individual:       '#C28A5E',
  completed:        '#6B7280',
}

// Allowed next statuses per current status (curator view)
const NEXT_STATUSES: Record<string, string[]> = {
  lead:             ['intro_paid', 'waiting_group'],
  intro_paid:       ['intro_scheduled', 'intro_completed'],
  intro_scheduled:  ['intro_completed'],
  intro_completed:  ['waiting_group'],
  waiting_group:    ['in_group'],
  in_group:         ['completed'],
  individual:       ['completed'],
  completed:        [],
}

const NEXT_LABEL: Record<string, string> = {
  intro_scheduled:  'Встреча назначена',
  intro_completed:  'Встреча прошла',
  waiting_group:    'Перевести в ожидание группы',
  in_group:         'Добавить в группу',
  completed:        'Отметить как завершившего',
  intro_paid:       'Вводная оплачена',
}

type Props = {
  userId: string
  currentStatus: string
}

export function CuratorStatusActions({ userId, currentStatus }: Props) {
  const [status, setStatus]   = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const next = NEXT_STATUSES[status] ?? []

  async function changeStatus(newStatus: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/curator/set-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus }),
      })
      if (res.ok) {
        setStatus(newStatus)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Ошибка')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      {/* Current status badge */}
      <span style={{
        fontSize: '0.7rem', fontWeight: 700,
        color: STATUS_COLOR[status] || '#6B7280',
        background: '#F9FAFB',
        border: `1px solid ${STATUS_COLOR[status] || '#E5E7EB'}`,
        padding: '0.2rem 0.625rem', borderRadius: '9999px',
      }}>
        {STATUS_LABEL[status] || status}
      </span>

      {/* Action buttons for allowed transitions */}
      {next.map(ns => (
        <button
          key={ns}
          disabled={loading}
          onClick={() => changeStatus(ns)}
          style={{
            fontSize: '0.7rem', fontWeight: 600,
            padding: '0.2rem 0.625rem', borderRadius: '9999px',
            border: `1px solid ${STATUS_COLOR[ns] || '#D1D5DB'}`,
            color: STATUS_COLOR[ns] || '#6B7280',
            background: 'white',
            cursor: loading ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? '…' : `→ ${NEXT_LABEL[ns] || STATUS_LABEL[ns]}`}
        </button>
      ))}

      {error && (
        <span style={{ fontSize: '0.68rem', color: '#DC2626' }}>{error}</span>
      )}
    </div>
  )
}
