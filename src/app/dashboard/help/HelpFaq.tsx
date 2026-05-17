'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type Item = { q: string; a: string }

export function HelpFaq({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
      {items.map((item, i) => (
        <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none',
              cursor: 'pointer', padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.4 }}>
              {item.q}
            </span>
            {open === i
              ? <ChevronUp size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              : <ChevronDown size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
            }
          </button>
          {open === i && (
            <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0.875rem 0 0' }}>
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
