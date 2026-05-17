'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FaqItem {
  q: string
  a: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{ borderBottom: '1px solid #EBE5F5' }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              gap: '1.5rem',
            }}
          >
            <span style={{
              fontWeight: 600,
              fontSize: '1.05rem',
              color: open === i ? 'var(--primary)' : 'var(--text)',
              lineHeight: 1.4,
              transition: 'color 0.2s'
            }}>
              {item.q}
            </span>
            <span style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: open === i ? 'var(--primary)' : 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s'
            }}>
              {open === i
                ? <Minus size={14} color="white" />
                : <Plus size={14} color="var(--primary)" />
              }
            </span>
          </button>

          <div style={{
            overflow: 'hidden',
            maxHeight: open === i ? '400px' : '0',
            transition: 'max-height 0.35s ease',
          }}>
            <p style={{
              paddingBottom: '1.75rem',
              color: '#64748B',
              lineHeight: 1.8,
              fontSize: '0.975rem',
            }}>
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
