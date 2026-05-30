'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, CheckCircle, Clock } from 'lucide-react'

type Slot = { id?: string; weekday: number; startTime: string; endTime: string; duration: number; type: string }

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const DAYS_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8..20
const TYPE_LABEL: Record<string, string> = {
  individual: 'Индивидуальная',
  diagnostic: 'Диагностика',
  intro: 'Вводная встреча',
}
const TYPE_COLOR: Record<string, string> = {
  individual: 'var(--primary)',
  diagnostic: '#7C3AED',
  intro: '#D97706',
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}
function minutesToTime(m: number) {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

// Check if a slot covers a given hour block on a given weekday
function slotCoversHour(slot: Slot, weekday: number, hour: number): boolean {
  if (slot.weekday !== weekday) return false
  const start = timeToMinutes(slot.startTime)
  const end = timeToMinutes(slot.endTime)
  return start <= hour * 60 && hour * 60 < end
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [loaded, setLoaded] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('individual')
  const [selectedDuration, setSelectedDuration] = useState<number>(60)
  // Active cell being drawn: { weekday, hour }
  const [dragging, setDragging] = useState(false)
  const [editSlot, setEditSlot] = useState<{ weekday: number; hour: number } | null>(null)

  useEffect(() => {
    fetch('/api/specialist/availability')
      .then(r => r.json())
      .then(d => { setSlots(d.slots ?? []); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  function getSlotAt(weekday: number, hour: number): Slot | undefined {
    return slots.find(s => slotCoversHour(s, weekday, hour))
  }

  function toggleHour(weekday: number, hour: number) {
    const existing = getSlotAt(weekday, hour)

    if (existing) {
      // Remove or shrink this slot
      setSlots(prev => {
        const startMin = timeToMinutes(existing.startTime)
        const endMin = timeToMinutes(existing.endTime)
        const clickMin = hour * 60
        const nextMin = (hour + 1) * 60

        // If the slot is exactly 1h, remove entirely
        if (endMin - startMin <= 60) {
          return prev.filter(s => s !== existing)
        }
        // Otherwise split: keep before and keep after
        const result = prev.filter(s => s !== existing)
        if (clickMin > startMin) {
          result.push({ ...existing, endTime: minutesToTime(clickMin) })
        }
        if (nextMin < endMin) {
          result.push({ ...existing, startTime: minutesToTime(nextMin) })
        }
        return result
      })
    } else {
      // Try to extend adjacent slot on same weekday
      setSlots(prev => {
        const adjacent = prev.find(s =>
          s.weekday === weekday &&
          s.type === selectedType &&
          (timeToMinutes(s.endTime) === hour * 60 || timeToMinutes(s.startTime) === (hour + 1) * 60)
        )
        if (adjacent) {
          return prev.map(s => s === adjacent ? {
            ...s,
            startTime: timeToMinutes(s.startTime) === (hour + 1) * 60 ? minutesToTime(hour * 60) : s.startTime,
            endTime: timeToMinutes(s.endTime) === hour * 60 ? minutesToTime((hour + 1) * 60) : s.endTime,
          } : s)
        }
        // New slot
        return [...prev, {
          weekday,
          startTime: minutesToTime(hour * 60),
          endTime: minutesToTime((hour + 1) * 60),
          duration: selectedDuration,
          type: selectedType,
        }]
      })
    }
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
      if (r.ok) setTimeout(() => setStatus('idle'), 3000)
    } catch { setStatus('error') }
  }

  function clearDay(weekday: number) {
    setSlots(prev => prev.filter(s => s.weekday !== weekday))
  }

  const totalHours = slots.reduce((sum, s) => sum + (timeToMinutes(s.endTime) - timeToMinutes(s.startTime)) / 60, 0)

  return (
    <div style={{ maxWidth: '62rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Расписание приёма</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Нажмите на ячейку чтобы добавить или убрать слот. Участники смогут записаться на встречу.</p>
      </div>

      {/* Controls */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Тип:</span>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setSelectedType(k)}
              style={{
                padding: '0.35rem 0.875rem', borderRadius: '9999px', border: `1.5px solid ${selectedType === k ? TYPE_COLOR[k] : 'var(--border)'}`,
                background: selectedType === k ? `${TYPE_COLOR[k]}15` : 'transparent',
                color: selectedType === k ? TYPE_COLOR[k] : 'var(--text-muted)',
                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Длительность слота:</span>
          {[30, 45, 60, 90].map(d => (
            <button
              key={d}
              onClick={() => setSelectedDuration(d)}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '9999px', border: `1.5px solid ${selectedDuration === d ? 'var(--primary)' : 'var(--border)'}`,
                background: selectedDuration === d ? 'var(--primary-light)' : 'transparent',
                color: selectedDuration === d ? 'var(--primary-dark)' : 'var(--text-muted)',
                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {d} мин
            </button>
          ))}
        </div>
        {totalHours > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
            <Clock size={13} />
            {totalHours} ч в неделю
          </div>
        )}
      </div>

      {/* Weekly grid */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
        {!loaded ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <Loader2 size={24} style={{ margin: '0 auto 0.75rem', animation: 'spin 1s linear infinite' }} />
            Загрузка…
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '3.5rem repeat(7, 1fr)', gap: 0, minWidth: '36rem' }}>
            {/* Header row */}
            <div />
            {DAYS.map((day, di) => (
              <div key={di} style={{ textAlign: 'center', padding: '0.5rem 0.25rem', borderBottom: '2px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.1rem' }}>{day}</div>
                {slots.some(s => s.weekday === di) && (
                  <button
                    onClick={() => clearDay(di)}
                    style={{ fontSize: '0.6rem', color: '#B91C1C', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    очистить
                  </button>
                )}
              </div>
            ))}

            {/* Hour rows */}
            {HOURS.map(hour => (
              <>
                {/* Time label */}
                <div key={`t${hour}`} style={{ padding: '0 0.5rem 0 0', textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-light)', paddingTop: '0.3rem', borderRight: '1px solid var(--border)' }}>
                  {`${hour}:00`}
                </div>

                {/* Day cells */}
                {DAYS.map((_, di) => {
                  const slot = getSlotAt(di, hour)
                  const isFirst = slot && timeToMinutes(slot.startTime) === hour * 60
                  const bgColor = slot ? `${TYPE_COLOR[slot.type]}20` : 'transparent'
                  const borderColor = slot ? TYPE_COLOR[slot.type] : 'var(--border)'

                  return (
                    <div
                      key={`${di}-${hour}`}
                      onClick={() => toggleHour(di, hour)}
                      style={{
                        height: '2.25rem',
                        background: slot ? bgColor : 'transparent',
                        borderLeft: `2px solid ${slot ? TYPE_COLOR[slot.type] : 'transparent'}`,
                        borderBottom: `1px solid var(--border)`,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.1s',
                        borderRight: di === 6 ? '1px solid var(--border)' : 'none',
                      }}
                      onMouseEnter={e => { if (!slot) (e.currentTarget as HTMLDivElement).style.background = `${TYPE_COLOR[selectedType]}10` }}
                      onMouseLeave={e => { if (!slot) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                    >
                      {slot && isFirst && (
                        <div style={{
                          position: 'absolute', top: '50%', left: '4px', transform: 'translateY(-50%)',
                          fontSize: '0.6rem', fontWeight: 700,
                          color: TYPE_COLOR[slot.type],
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%',
                        }}>
                          {slot.startTime}–{slot.endTime}
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        )}

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: `${TYPE_COLOR[k]}30`, border: `2px solid ${TYPE_COLOR[k]}` }} />
              {v}
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--bg-soft)', border: '1px dashed var(--border)' }} />
            Нажмите чтобы добавить
          </div>
        </div>
      </div>

      {/* Slot list summary */}
      {slots.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>Итоговое расписание</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[...slots].sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime)).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', background: 'var(--bg-soft)', borderRadius: '0.625rem', padding: '0.625rem 0.875rem' }}>
                <div style={{ width: '3px', height: '1.5rem', borderRadius: '9999px', background: TYPE_COLOR[s.type] ?? 'var(--primary)', flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: '0.84rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{DAYS_FULL[s.weekday]}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.625rem' }}>{s.startTime}–{s.endTime} · {s.duration} мин слоты · {TYPE_LABEL[s.type] ?? s.type}</span>
                </div>
                <button
                  onClick={() => setSlots(prev => prev.filter((_, idx) => idx !== i))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '1rem', padding: '0.25rem', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={save}
          disabled={status === 'loading'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.875rem', background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.8 : 1 }}
        >
          {status === 'loading' ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
          {status === 'loading' ? 'Сохранение…' : 'Сохранить расписание'}
        </button>
        {status === 'saved' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: '#059669', fontWeight: 600 }}>
            <CheckCircle size={15} /> Сохранено
          </div>
        )}
        {status === 'error' && <span style={{ fontSize: '0.875rem', color: '#B91C1C' }}>Ошибка сохранения</span>}
      </div>

      <div style={{ marginTop: '1.25rem', padding: '0.875rem 1.125rem', background: 'var(--bg-soft)', borderRadius: '0.875rem' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          После сохранения участники увидят свободные слоты и смогут записаться. Вы получите уведомление о каждой записи.
        </p>
      </div>
    </div>
  )
}
