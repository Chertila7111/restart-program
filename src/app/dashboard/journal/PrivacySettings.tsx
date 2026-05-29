'use client'

import { useState } from 'react'
import { Lock, Eye, Check, Loader } from 'lucide-react'

const OPTIONS = [
  {
    key: 'private',
    icon: Lock,
    label: 'Только я',
    sub: 'Психолог не видит дневник',
    color: '#16A34A',
    bg: '#F0FDF4',
    border: '#86EFAC',
  },
  {
    key: 'specialist',
    icon: Eye,
    label: 'Мой психолог',
    sub: 'Видит все мои записи',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#93C5FD',
  },
]

export function PrivacySettings({ initial }: { initial: string }) {
  const [current, setCurrent] = useState(initial || 'private')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function setAccess(access: string) {
    if (access === current || saving) return
    setSaving(true)
    setSaved(false)
    try {
      const r = await fetch('/api/journal/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access }),
      })
      if (r.ok) {
        setCurrent(access)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  const active = OPTIONS.find(o => o.key === current) ?? OPTIONS[0]

  return (
    <div>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>
        Кто видит дневник
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {OPTIONS.map(opt => {
          const Icon = opt.icon
          const isActive = current === opt.key
          return (
            <button
              key={opt.key}
              onClick={() => setAccess(opt.key)}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', borderRadius: '0.625rem',
                border: `1.5px solid ${isActive ? opt.border : '#D1FAE5'}`,
                background: isActive ? opt.bg : 'rgba(255,255,255,0.6)',
                color: isActive ? opt.color : '#166534',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.825rem', cursor: saving ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={14} />
              {opt.label}
              {isActive && !saving && <Check size={12} style={{ opacity: 0.7 }} />}
              {isActive && saving && <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />}
            </button>
          )
        })}
      </div>

      {/* Description of current state */}
      <div style={{ marginTop: '0.5rem', fontSize: '0.775rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        {saved && <Check size={12} style={{ color: '#16A34A' }} />}
        {saved ? 'Настройки сохранены' : active.sub}
        {current === 'specialist' && !saved && (
          <span style={{ marginLeft: '0.25rem', color: '#2563EB' }}>· Психолог получит доступ к новым записям</span>
        )}
      </div>
    </div>
  )
}
