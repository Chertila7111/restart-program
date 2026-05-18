'use client'

import { useState } from 'react'

export function AddNoteForm({ userId }: { userId: string }) {
  const [note, setNote] = useState('')
  const [tags, setTags] = useState('')
  const [important, setImportant] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')

  async function save() {
    if (!note.trim()) return
    setStatus('loading')
    try {
      const r = await fetch('/api/specialist/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, note, tags, isImportant: important }),
      })
      if (r.ok) {
        setNote(''); setTags(''); setImportant(false)
        setStatus('saved')
        setTimeout(() => { setStatus('idle'); window.location.reload() }, 1000)
      } else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <div>
      <textarea
        rows={3}
        placeholder="Заметка по участнику (видна только вам)..."
        value={note}
        onChange={e => setNote(e.target.value)}
        style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical', background: 'var(--bg)', color: 'var(--text)', lineHeight: 1.6, marginBottom: '0.625rem', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Теги (через запятую)"
          value={tags}
          onChange={e => setTags(e.target.value)}
          style={{ flex: 1, minWidth: '8rem' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={important} onChange={e => setImportant(e.target.checked)} />
          Важно
        </label>
        <button
          onClick={save}
          disabled={!note.trim() || status === 'loading'}
          className="btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.825rem' }}
        >
          {status === 'loading' ? 'Сохранение...' : status === 'saved' ? '✓ Сохранено' : 'Добавить заметку'}
        </button>
      </div>
      {status === 'error' && <p style={{ color: '#B91C1C', fontSize: '0.8rem', marginTop: '0.5rem' }}>Ошибка сохранения</p>}
    </div>
  )
}
