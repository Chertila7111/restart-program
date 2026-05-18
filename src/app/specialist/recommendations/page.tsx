'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Star, Save } from 'lucide-react'

type Rec = { id: string; userId: string; userName: string; type: string; summary: string; focus: string; nextStep: string; createdAt: string }

function RecommendationsInner() {
  const params = useSearchParams()
  const preUserId = params.get('userId') ?? ''

  const [userId, setUserId] = useState(preUserId)
  const [type, setType] = useState('session')
  const [summary, setSummary] = useState('')
  const [focus, setFocus] = useState('')
  const [exercises, setExercises] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [visible, setVisible] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [recs, setRecs] = useState<Rec[]>([])
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetch('/api/specialist/clients').then(r => r.json()).then(d => setClients(d.clients ?? [])).catch(() => {})
    fetch('/api/specialist/recommendations').then(r => r.json()).then(d => setRecs(d.recs ?? [])).catch(() => {})
  }, [])

  async function save() {
    if (!userId || !summary) return
    setStatus('loading')
    try {
      const r = await fetch('/api/specialist/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type, summary, focus, exercises, nextStep, visibleToUser: visible }),
      })
      if (r.ok) {
        setSummary(''); setFocus(''); setExercises(''); setNextStep('')
        setStatus('saved')
        const d = await fetch('/api/specialist/recommendations').then(r => r.json())
        setRecs(d.recs ?? [])
        setTimeout(() => setStatus('idle'), 2000)
      } else setStatus('error')
    } catch { setStatus('error') }
  }

  const TYPE_LABEL: Record<string, string> = {
    session: 'После встречи', diary: 'После дневника', program_end: 'Итог программы', diagnostic: 'После диагностики',
  }

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Рекомендации</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Рекомендации после встреч и просмотра дневников</p>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Новая рекомендация</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Участник</label>
              <select value={userId} onChange={e => setUserId(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', background: 'var(--bg)', color: 'var(--text)' }}>
                <option value="">Выберите участника</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Тип</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', background: 'var(--bg)', color: 'var(--text)' }}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          {[
            { label: 'Что важно сейчас *', val: summary, set: setSummary, placeholder: 'На этой неделе важно не пытаться резко закрыть тему...' },
            { label: 'Фокус до следующей встречи', val: focus, set: setFocus, placeholder: 'Сон, еда, короткие прогулки...' },
            { label: 'Упражнения / практики', val: exercises, set: setExercises, placeholder: 'Если желание написать выше 7/10 — быстрая запись в дневнике...' },
            { label: 'Следующий шаг', val: nextStep, set: setNextStep, placeholder: 'Записаться на следующую встречу 15 мая...' },
          ].map(({ label, val, set, placeholder }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>{label}</label>
              <textarea rows={3} placeholder={placeholder} value={val} onChange={e => set(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical', background: 'var(--bg)', color: 'var(--text)', lineHeight: 1.6, boxSizing: 'border-box' }} />
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={save} disabled={!userId || !summary || status === 'loading'} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={14} /> {status === 'loading' ? 'Сохранение...' : 'Сохранить'}
            </button>
            {status === 'saved' && <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>✓ Сохранено</span>}
            {status === 'error' && <span style={{ fontSize: '0.875rem', color: '#B91C1C' }}>Ошибка</span>}
          </div>
        </div>
      </div>

      {recs.length > 0 && (
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem' }}>Последние рекомендации</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recs.map(r => (
              <div key={r.id} className="card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{r.userName} · {TYPE_LABEL[r.type] ?? r.type}</span>
                  <span>{new Date(r.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>{r.summary}</p>
                {r.focus && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0 0', lineHeight: 1.5 }}>Фокус: {r.focus}</p>}
                {r.nextStep && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', margin: '0.375rem 0 0', fontWeight: 600 }}>→ {r.nextStep}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RecommendationsPage() {
  return <Suspense><RecommendationsInner /></Suspense>
}
