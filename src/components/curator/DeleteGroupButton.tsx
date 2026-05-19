'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, X } from 'lucide-react'

export function DeleteGroupButton({ groupId, groupTitle }: { groupId: string; groupTitle: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function deleteGroup() {
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`/api/curator/groups/${groupId}`, { method: 'DELETE' })
      if (r.ok) {
        setOpen(false)
        router.refresh()
      } else {
        const d = await r.json()
        setError(d.error || 'Ошибка удаления')
      }
    } catch {
      setError('Ошибка соединения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(true); setError('') }}
        title="Удалить группу"
        style={{
          background: 'none', border: '1.5px solid #FECACA', borderRadius: '0.5rem',
          padding: '0.375rem 0.625rem', cursor: 'pointer', color: '#B91C1C',
          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
          fontSize: '0.75rem', fontWeight: 600, flexShrink: 0,
        }}
      >
        <Trash2 size={13} />
        Удалить
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'rgba(28,43,35,0.55)', backdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div style={{
            background: 'var(--card)', borderRadius: '1.25rem',
            padding: '1.75rem', maxWidth: '400px', width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#B91C1C' }}>Удалить группу</h3>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Вы уверены, что хотите удалить группу <strong style={{ color: 'var(--text)' }}>«{groupTitle}»</strong>?
              Все участники и встречи будут удалены. Это действие нельзя отменить.
            </p>

            {error && (
              <p style={{ fontSize: '0.8rem', color: '#B91C1C', marginBottom: '0.75rem' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={deleteGroup}
                disabled={loading}
                style={{
                  flex: 1, padding: '0.625rem', borderRadius: '0.75rem', border: 'none',
                  background: '#B91C1C', color: 'white', fontWeight: 700, fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1,
                }}
              >
                {loading ? 'Удаление...' : 'Да, удалить'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="btn-outline"
                style={{ flex: 1 }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
