'use client'

import { useState, useEffect } from 'react'
import { Clock, Plus, Trash2, Save } from 'lucide-react'

type Slot = { id?: string; weekday: number; startTime: string; endTime: string; duration: number; type: string }

const WEEKDAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const TYPE_LABEL: Record<string, string> = { individual: 'Индивидуальная', diagnostic: 'Диагностика', intro: 'Вводная встреча' }

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [newSlot, setNewSlot] = useState<Slot>({ weekday: 0, startTime: '10:00', endTime: '12:00', duration: 60, type: 'individual' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/specialist/availability')
      .then(r => r.json())
      .then(d => { setSlots(d.slots ?? []); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  function addSlot() {
    setSlots(prev => [...prev, { ...newSlot }])
  }

  function removeSlot(i: number) {
    setSlots(prev => prev.filter((_, idx) => idx !== i))
  }

  async function save() {
    setStatus('loading')
    try {
      const r = await fetch('/api/specialist/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      })
      setStatus(r.ok ? 'saved' : 'error')
      if (r.ok) setTimeout(() => setStatus('idle'), 2500)
    } catch { setStatus('error') }
  }

  return (
    <div style={{ maxWidth: '44rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Свободные слоты</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Укажите время, когда вы доступны для записи. Участники увидят эти слоты.</p>
      </div>

      {/* Current slots */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem' }}>Текущее расписание</h2>
        {!loaded ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>Загрузка...</p>
        ) : slots.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>Слотов пока нет — добавьте ниже</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {slots.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-soft)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                <Clock size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{WEEKDAYS[s.weekday]}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    {s.startTime}–{s.endTime} · {s.duration} мин · {TYPE_LABEL[s.type] ?? s.type}
                  </span>
                </div>
                <button onClick={() => removeSlot(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0.25rem', display: 'flex' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add slot */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem' }}>Добавить слот</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
          {([
            { label: 'День недели', content: (
              <select value={newSlot.weekday} onChange={e => setNewSlot({ ...newSlot, weekday: +e.target.value })} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', background: 'var(--bg)', color: 'var(--text)' }}>
                {WEEKDAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            )},
            { label: 'Тип встречи', content: (
              <select value={newSlot.type} onChange={e => setNewSlot({ ...newSlot, type: e.target.value })} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', background: 'var(--bg)', color: 'var(--text)' }}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            )},
            { label: 'Начало', content: <input type="time" value={newSlot.startTime} onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })} /> },
            { label: 'Конец', content: <input type="time" value={newSlot.endTime} onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })} /> },
          ] as { label: string; content: React.ReactNode }[]).map(({ label, content }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>{label}</label>
              {content}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.875rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Длительность (мин)</label>
            <select value={newSlot.duration} onChange={e => setNewSlot({ ...newSlot, duration: +e.target.value })} style={{ padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', background: 'var(--bg)', color: 'var(--text)' }}>
              <option value={30}>30</option>
              <option value={45}>45</option>
              <option value={60}>60</option>
              <option value={90}>90</option>
            </select>
          </div>
          <button onClick={addSlot} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Plus size={14} /> Добавить
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={save} disabled={status === 'loading'} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={14} /> {status === 'loading' ? 'Сохранение...' : 'Сохранить расписание'}
        </button>
        {status === 'saved' && <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>✓ Сохранено</span>}
        {status === 'error' && <span style={{ fontSize: '0.875rem', color: '#B91C1C' }}>Ошибка сохранения</span>}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'var(--bg-soft)', borderRadius: '0.875rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Участники увидят слоты и смогут записаться на встречу. После записи вы получите уведомление.
        </p>
      </div>
    </div>
  )
}
