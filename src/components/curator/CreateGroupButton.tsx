'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'

export function CreateGroupButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleOpen() {
    setOpen(true)
    setTitle('')
    setError('')
  }

  async function create() {
    if (!title.trim()) { setError('Введите название группы'); return }
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/curator/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })
      const d = await r.json()
      if (r.ok && d.id) {
        setOpen(false)
        setTitle('')
        router.push(`/curator/groups/${d.id}`)
        router.refresh()
      } else {
        setError(d.error || 'Ошибка создания')
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
        onClick={handleOpen}
        className="btn-primary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
      >
        <Plus size={15} />
        Создать группу
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
            padding: '1.75rem', maxWidth: '420px', width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Создать группу</h3>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Название группы
              </label>
              <input
                type="text"
                placeholder='Группа «Снова с собой» — Лето 2026'
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && create()}
                autoFocus
              />
            </div>

            {error && (
              <p style={{ fontSize: '0.8rem', color: '#B91C1C', marginBottom: '0.75rem', margin: '0 0 0.75rem' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={create}
                disabled={loading}
                className="btn-primary"
                style={{ flex: 1, opacity: loading ? 0.75 : 1 }}
              >
                {loading ? 'Создание...' : 'Создать'}
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
