'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, CheckCircle, Clock, Plus, X } from 'lucide-react'

type Slot = { id?: string; weekday: number; startTime: string; endTime: string; duration: number; type: string }
type MeetingType = { key: string; label: string; color: string }

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const DAYS_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8..20

const DEFAULT_TYPES: MeetingType[] = [
  { key: 'individual', label: 'Индивидуальная', color: '#4E7B5E' },
  { key: 'diagnostic',  label: 'Диагностика',    color: '#7C3AED' },
  { key: 'intro',       label: 'Вводная встреча', color: '#D97706' },
]

const PALETTE = [
  '#4E7B5E','#7C3AED','#D97706','#DC2626','#2563EB',
  '#059669','#DB2777','#D97706','#4338CA','#0891B2',
]

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}
function minutesToTime(m: number) {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
function slotCoversHour(slot: Slot, weekday: number, hour: number): boolean {
  if (slot.weekday !== weekday) return false
  const start = timeToMinutes(slot.startTime)
  const end = timeToMinutes(slot.endTime)
  return start <= hour * 60 && hour * 60 < end
}
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [types, setTypes] = useState<MeetingType[]>(DEFAULT_TYPES)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [loaded, setLoaded] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('individual')
  const [selectedDuration, setSelectedDuration] = useState<number>(60)
  // Add custom type modal
  const [showAddType, setShowAddType] = useState(false)
  const [newTypeName, setNewTypeName] = useState('')
  const [newTypeColor, setNewTypeColor] = useState('#2563EB')

  // Load slots + custom types from server/localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('specialist_types')
      if (saved) {
        const custom: MeetingType[] = JSON.parse(saved)
        setTypes(prev => {
          const keys = new Set(prev.map(t => t.key))
          return [...prev, ...custom.filter(c => !keys.has(c.key))]
        })
      }
    } catch {}

    fetch('/api/specialist/availability')
      .then(r => r.json())
      .then(d => { setSlots(d.slots ?? []); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  function typeByKey(key: string): MeetingType {
    return types.find(t => t.key === key) ?? { key, label: key, color: '#6B7280' }
  }

  function getSlotAt(weekday: number, hour: number): Slot | undefined {
    return slots.find(s => slotCoversHour(s, weekday, hour))
  }

  function toggleHour(weekday: number, hour: number) {
    const existing = getSlotAt(weekday, hour)
    if (existing) {
      setSlots(prev => {
        const startMin = timeToMinutes(existing.startTime)
        const endMin = timeToMinutes(existing.endTime)
        const clickMin = hour * 60
        const nextMin = (hour + 1) * 60
        if (endMin - startMin <= 60) return prev.filter(s => s !== existing)
        const result = prev.filter(s => s !== existing)
        if (clickMin > startMin) result.push({ ...existing, endTime: minutesToTime(clickMin) })
        if (nextMin < endMin) result.push({ ...existing, startTime: minutesToTime(nextMin) })
        return result
      })
    } else {
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
        return [...prev, { weekday, startTime: minutesToTime(hour * 60), endTime: minutesToTime((hour + 1) * 60), duration: selectedDuration, type: selectedType }]
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

  function addCustomType() {
    const label = newTypeName.trim()
    if (!label) return
    const key = `custom_${Date.now()}`
    const newType: MeetingType = { key, label, color: newTypeColor }
    const updated = [...types, newType]
    setTypes(updated)
    // Persist custom types to localStorage
    const custom = updated.filter(t => !DEFAULT_TYPES.some(d => d.key === t.key))
    try { localStorage.setItem('specialist_types', JSON.stringify(custom)) } catch {}
    setSelectedType(key)
    setShowAddType(false)
    setNewTypeName('')
    setNewTypeColor('#2563EB')
  }

  function removeCustomType(key: string) {
    setTypes(prev => prev.filter(t => t.key !== key))
    setSlots(prev => prev.filter(s => s.type !== key))
    if (selectedType === key) setSelectedType('individual')
    const updated = types.filter(t => t.key !== key && !DEFAULT_TYPES.some(d => d.key === t.key))
    try { localStorage.setItem('specialist_types', JSON.stringify(updated)) } catch {}
  }

  const totalHours = slots.reduce((sum, s) => sum + (timeToMinutes(s.endTime) - timeToMinutes(s.startTime)) / 60, 0)
  const activeSel = typeByKey(selectedType)

  return (
    <div style={{ maxWidth: '64rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Расписание приёма</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Нажмите на ячейку чтобы добавить или убрать слот.</p>
      </div>

      {/* Controls */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Types */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>Тип:</span>
            {types.map(t => {
              const isActive = selectedType === t.key
              const isCustom = !DEFAULT_TYPES.some(d => d.key === t.key)
              return (
                <div key={t.key} style={{ position: 'relative', display: 'inline-flex' }}>
                  <button
                    onClick={() => setSelectedType(t.key)}
                    style={{
                      padding: '0.35rem 0.875rem', borderRadius: '9999px',
                      border: `1.5px solid ${isActive ? t.color : '#E2E8F0'}`,
                      background: isActive ? hexToRgba(t.color, 0.12) : 'transparent',
                      color: isActive ? t.color : 'var(--text-muted)',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                      paddingRight: isCustom ? '1.75rem' : '0.875rem',
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                    {t.label}
                  </button>
                  {isCustom && (
                    <button
                      onClick={e => { e.stopPropagation(); removeCustomType(t.key) }}
                      style={{ position: 'absolute', right: '0.35rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0.1rem', display: 'flex' }}
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              )
            })}

            {/* Add custom type button */}
            <button
              onClick={() => setShowAddType(true)}
              style={{ padding: '0.35rem 0.75rem', borderRadius: '9999px', border: '1.5px dashed #CBD5E0', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={12} /> Свой вариант
            </button>
          </div>

          {/* Duration */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>Слот:</span>
            {[30, 45, 60, 90].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDuration(d)}
                style={{
                  padding: '0.35rem 0.625rem', borderRadius: '9999px',
                  border: `1.5px solid ${selectedDuration === d ? 'var(--primary)' : '#E2E8F0'}`,
                  background: selectedDuration === d ? hexToRgba('#4E7B5E', 0.1) : 'transparent',
                  color: selectedDuration === d ? '#4E7B5E' : 'var(--text-muted)',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {d} мин
              </button>
            ))}
            {totalHours > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#4E7B5E', fontWeight: 600, marginLeft: '0.5rem' }}>
                <Clock size={12} /> {totalHours} ч/нед
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add type modal */}
      {showAddType && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9100, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={e => { if (e.target === e.currentTarget) setShowAddType(false) }}>
          <div className="card" style={{ padding: '1.75rem', maxWidth: '22rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>Новый тип встречи</h3>
              <button onClick={() => setShowAddType(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', display: 'flex' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Название</label>
              <input
                value={newTypeName}
                onChange={e => setNewTypeName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomType()}
                placeholder="Например: Супервизия"
                autoFocus
                style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.625rem' }}>Цвет</label>
              {/* Color palette */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {PALETTE.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewTypeColor(c)}
                    style={{
                      width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: c, border: `3px solid ${newTypeColor === c ? 'var(--text)' : 'transparent'}`,
                      cursor: 'pointer', boxShadow: newTypeColor === c ? '0 0 0 2px white inset' : 'none', transition: 'all 0.15s',
                    }}
                  />
                ))}
              </div>
              {/* Custom color input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <input
                  type="color"
                  value={newTypeColor}
                  onChange={e => setNewTypeColor(e.target.value)}
                  style={{ width: '2.5rem', height: '2rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', padding: 0 }}
                />
                <input
                  value={newTypeColor}
                  onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setNewTypeColor(e.target.value) }}
                  style={{ flex: 1, padding: '0.375rem 0.625rem', borderRadius: '0.5rem', border: '1.5px solid var(--border)', fontSize: '0.8rem', fontFamily: 'monospace' }}
                />
                {/* Preview */}
                <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: newTypeColor, flexShrink: 0, border: '1px solid var(--border)' }} />
              </div>
            </div>

            {/* Preview badge */}
            {newTypeName.trim() && (
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Предпросмотр:</span>
                <span style={{ padding: '0.25rem 0.875rem', borderRadius: '9999px', border: `1.5px solid ${newTypeColor}`, background: hexToRgba(newTypeColor, 0.12), color: newTypeColor, fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: newTypeColor }} />
                  {newTypeName.trim()}
                </span>
              </div>
            )}

            <button
              onClick={addCustomType}
              disabled={!newTypeName.trim()}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: newTypeName.trim() ? newTypeColor : '#CBD5E0', color: 'white', border: 'none', cursor: newTypeName.trim() ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.15s' }}
            >
              Добавить тип
            </button>
          </div>
        </div>
      )}

      {/* Weekly grid */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
        {!loaded ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            Загрузка…
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '3.5rem repeat(7, 1fr)', gap: 0, minWidth: '36rem' }}>
            {/* Header */}
            <div />
            {DAYS.map((day, di) => (
              <div key={di} style={{ textAlign: 'center', padding: '0.5rem 0.25rem', borderBottom: '2px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.1rem' }}>{day}</div>
                {slots.some(s => s.weekday === di) && (
                  <button onClick={() => setSlots(prev => prev.filter(s => s.weekday !== di))} style={{ fontSize: '0.6rem', color: '#B91C1C', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    очистить
                  </button>
                )}
              </div>
            ))}

            {/* Hour rows */}
            {HOURS.map(hour => (
              <>
                <div key={`t${hour}`} style={{ padding: '0 0.5rem 0 0', textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-light)', paddingTop: '0.3rem', borderRight: '1px solid var(--border)' }}>
                  {`${hour}:00`}
                </div>
                {DAYS.map((_, di) => {
                  const slot = getSlotAt(di, hour)
                  const t = slot ? typeByKey(slot.type) : null
                  const isFirst = slot && timeToMinutes(slot.startTime) === hour * 60
                  const color = t?.color ?? '#4E7B5E'

                  return (
                    <div
                      key={`${di}-${hour}`}
                      onClick={() => toggleHour(di, hour)}
                      style={{
                        height: '2.25rem',
                        background: slot ? hexToRgba(color, 0.15) : 'transparent',
                        borderLeft: slot ? `3px solid ${color}` : '1px solid transparent',
                        borderBottom: '1px solid var(--border)',
                        borderRight: di === 6 ? '1px solid var(--border)' : 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { if (!slot) (e.currentTarget as HTMLDivElement).style.background = hexToRgba(activeSel.color, 0.08) }}
                      onMouseLeave={e => { if (!slot) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                    >
                      {slot && isFirst && (
                        <div style={{ position: 'absolute', top: '50%', left: '5px', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 700, color: color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%' }}>
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
          {types.map(t => (
            <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: hexToRgba(t.color, 0.2), border: `2px solid ${t.color}` }} />
              {t.label}
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
            {[...slots].sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime)).map((s, i) => {
              const t = typeByKey(s.type)
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', background: 'var(--bg-soft)', borderRadius: '0.625rem', padding: '0.625rem 0.875rem' }}>
                  <div style={{ width: '3px', height: '1.5rem', borderRadius: '9999px', background: t.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: '0.84rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{DAYS_FULL[s.weekday]}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.625rem' }}>{s.startTime}–{s.endTime} · {s.duration} мин · {t.label}</span>
                  </div>
                  <button onClick={() => setSlots(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '1rem', padding: '0.25rem', lineHeight: 1 }}>
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={save}
          disabled={status === 'loading'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.875rem', background: '#4E7B5E', color: 'white', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.8 : 1 }}
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
          После сохранения участники увидят свободные слоты и смогут записаться на встречу.
        </p>
      </div>
    </div>
  )
}
