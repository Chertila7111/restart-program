'use client'
import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

export default function ShareLink({ url, label }: { url: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <div style={{ background: 'var(--bg-soft)', border: '1.5px solid var(--border)', borderRadius: '0.875rem', padding: '1rem 1.125rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {url}
        </div>
      </div>
      <button
        onClick={copy}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          background: copied ? 'var(--primary)' : 'white',
          border: '1.5px solid var(--border)',
          borderRadius: '0.625rem',
          padding: '0.5rem 0.875rem',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: copied ? 'white' : 'var(--text)',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
      >
        {copied ? <Check size={13} /> : <Share2 size={13} />}
        {copied ? 'Скопировано' : 'Скопировать'}
      </button>
    </div>
  )
}
