'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Clock, User, Users, Trash2, Video, Loader2 } from 'lucide-react'

type Slot = {
  id: string
  startAt: string
  durationMin: number
  isBooked: boolean
  note: string | null
  userName?: string | null
  userEmail?: string | null
  bookingStatus?: string | null
}
type Meeting = {
  id: string
  title: string
  date: string
  time: string
  duration: string
  meetingLink: string | null
  groupTitle: string
  status: string
}

const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const DOW_SHORT = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
function fmtTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) } catch { return iso.slice(11, 16) }
}
function isToday(y: number, m: number, d: number) {
  const t = new Date()
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d
}
function isPast(y: number, m: number, d: number) {
  const t = new Date(); t.setHours(0, 0, 0, 0)
  const dt = new Date(y, m, d)
  return dt < t
}

function weeksInMonth(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startDow = (first.getDay() + 6) % 7 // Mon=0
  const weeks: (number | null)[][] = []
  let week: (number | null)[] = Array(startDow).fill(null)
  for (let d = 1; d <= last.getDate(); d++) {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

export function SpecialistMonthCalendar({ specialistId }: { specialistId: string }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [slots, setSlots] = useState<Slot[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [newTime, setNewTime] = useState('10:00')
  const [newDuration, setNewDuration] = useState(45)
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [slotsRes] = await Promise.all([
        fetch('/api/slots/all'),
      ])
      if (slotsRes.ok) {
        const data = await slotsRes.json()
        setSlots(data.slots ?? [])
        setMeetings(data.meetings ?? [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  // All events for a specific date key
  function daySlots(dateKey: string): Slot[] {
    return slots.filter(s => s.startAt.slice(0, 10) === dateKey)
  }
  function dayMeetings(dateKey: string): Meeting[] {
    return meetings.filter(m => m.date === dateKey)
  }

  async function addSlot() {
    if (!selectedDate || saving) return
    setSaving(true)
    try {
      const startAt = new Date(`${selectedDate}T${newTime}:00`).toISOString()
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAt, durationMin: newDuration, note: newNote }),
      })
      if (res.ok) {
        await loadData()
        setAdding(false)
        setNewTime('10:00')
        setNewNote('')
      }
    } finally { setSaving(false) }
  }

  async function deleteSlot(slotId: string) {
    if (!confirm('Удалить этот слот?')) return
    await fetch(`/api/slots?id=${slotId}`, { method: 'DELETE' })
    setSlots(prev => prev.filter(s => s.id !== slotId))
  }

  const weeks = weeksInMonth(year, month)
  const selectedSlots = selectedDate ? daySlots(selectedDate) : []
  const selectedMeetings = selectedDate ? dayMeetings(selectedDate) : []
  const selectedTotal = selectedSlots.length + selectedMeetings.length

  return (
    <div style={{ maxWidth: '62rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Календарь</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Добавляйте свободные слоты — участники смогут записаться.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedDate ? '1fr 20rem' : '1fr', gap: '1.25rem', alignItems: 'start' }}>

        {/* ── Calendar grid ── */}
        <div className="card" style={{ padding: '1.25rem' }}>
          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.375rem', display: 'flex', borderRadius: '0.5rem' }}>
              <ChevronLeft size={18} />
            </button>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
              {MONTHS_RU[month]} {year}
            </div>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.375rem', display: 'flex', borderRadius: '0.5rem' }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day of week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
            {DOW_SHORT.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: i >= 5 ? '#B91C1C' : 'var(--text-muted)', padding: '0.375rem 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Загрузка…
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {weeks.flat().map((day, idx) => {
                if (day === null) return <div key={`e${idx}`} />
                const dateKey = isoDate(year, month, day)
                const isSelected = dateKey === selectedDate
                const today = isToday(year, month, day)
                const past = isPast(year, month, day)
                const slotsOnDay = daySlots(dateKey)
                const meetingsOnDay = dayMeetings(dateKey)
                const hasBooked = slotsOnDay.some(s => s.isBooked)
                const hasFree = slotsOnDay.some(s => !s.isBooked)
                const hasMeeting = meetingsOnDay.length > 0
                const isWeekend = idx % 7 >= 5

                return (
                  <button
                    key={dateKey}
                    onClick={() => { setSelectedDate(isSelected ? null : dateKey); setAdding(false) }}
                    style={{
                      border: 'none', cursor: past && !slotsOnDay.length && !meetingsOnDay.length ? 'default' : 'pointer',
                      padding: '0.5rem 0.25rem',
                      borderRadius: '0.625rem',
                      background: isSelected ? 'var(--primary)' : today ? 'var(--primary-light)' : 'transparent',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                      transition: 'background 0.1s',
                      opacity: past && !slotsOnDay.length && !meetingsOnDay.length ? 0.35 : 1,
                      minHeight: '3.5rem',
                    }}
                    onMouseEnter={e => { if (!isSelected && !past) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-soft)' }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = isSelected ? 'var(--primary)' : today ? 'var(--primary-light)' : 'transparent' }}
                  >
                    <span style={{
                      fontSize: '0.875rem', fontWeight: today ? 800 : isSelected ? 700 : 500,
                      color: isSelected ? 'white' : today ? 'var(--primary-dark)' : isWeekend ? '#B91C1C' : 'var(--text)',
                      lineHeight: 1,
                    }}>
                      {day}
                    </span>
                    {/* Dots */}
                    {(hasFree || hasBooked || hasMeeting) && (
                      <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {hasFree && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--primary)' }} />}
                        {hasBooked && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.8)' : '#2563EB' }} />}
                        {hasMeeting && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.8)' : '#C28A5E' }} />}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
            {[
              { color: 'var(--primary)', label: 'Свободный слот' },
              { color: '#2563EB', label: 'Забронирован' },
              { color: '#C28A5E', label: 'Групповая встреча' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Day detail panel ── */}
        {selectedDate && (
          <div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>
                    {new Date(selectedDate + 'T12:00:00').toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                  {selectedTotal > 0 && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {selectedSlots.length} слот{selectedSlots.length !== 1 ? 'ов' : ''} · {selectedMeetings.length} встреч{selectedMeetings.length !== 1 ? 'и' : 'а'}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', display: 'flex' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Group meetings */}
              {selectedMeetings.length > 0 && (
                <div style={{ marginBottom: '0.875rem' }}>
                  {selectedMeetings.map(m => (
                    <div key={m.id} style={{ padding: '0.75rem 0.875rem', borderRadius: '0.625rem', background: '#FFF7ED', border: '1px solid #FED7AA', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.2rem' }}>
                        <Users size={12} style={{ color: '#C28A5E', flexShrink: 0 }} />
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>{m.title}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.time} МСК · {m.duration} · {m.groupTitle}</div>
                      {m.meetingLink && (
                        <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.3rem', fontSize: '0.7rem', color: '#2563EB', textDecoration: 'none' }}>
                          <Video size={10} /> Ссылка
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Individual slots */}
              {selectedSlots.length > 0 && (
                <div style={{ marginBottom: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedSlots.sort((a, b) => a.startAt.localeCompare(b.startAt)).map(s => (
                    <div key={s.id} style={{ padding: '0.75rem 0.875rem', borderRadius: '0.625rem', background: s.isBooked ? '#EFF6FF' : 'var(--bg-sage)', border: `1px solid ${s.isBooked ? '#BFDBFE' : 'var(--primary-light)'}`, display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.1rem' }}>
                          <Clock size={12} style={{ color: s.isBooked ? '#2563EB' : 'var(--primary)', flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>{fmtTime(s.startAt)}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>· {s.durationMin} мин</span>
                        </div>
                        {s.isBooked ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#2563EB' }}>
                            <User size={10} /> {s.userName || s.userEmail || 'Участник'} · Подтверждена
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>Свободен</div>
                        )}
                        {s.note && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{s.note}</div>}
                      </div>
                      {!s.isBooked && (
                        <button
                          onClick={() => deleteSlot(s.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0.25rem', display: 'flex', flexShrink: 0 }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#B91C1C' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-light)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedTotal === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                  На этот день нет слотов
                </p>
              )}

              {/* Add slot form */}
              {adding ? (
                <div style={{ border: '1.5px solid var(--primary)', borderRadius: '0.875rem', padding: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.875rem' }}>Добавить слот</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Время начала</label>
                      <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={{ width: '100%', padding: '0.4rem 0.625rem', borderRadius: '0.5rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Длительность</label>
                      <select value={newDuration} onChange={e => setNewDuration(+e.target.value)} style={{ width: '100%', padding: '0.4rem 0.625rem', borderRadius: '0.5rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', background: 'var(--bg)' }}>
                        <option value={30}>30 мин</option>
                        <option value={45}>45 мин</option>
                        <option value={60}>60 мин</option>
                        <option value={90}>90 мин</option>
                      </select>
                    </div>
                  </div>
                  <input
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Заметка (необязательно)"
                    style={{ width: '100%', padding: '0.4rem 0.625rem', borderRadius: '0.5rem', border: '1.5px solid var(--border)', fontSize: '0.8rem', boxSizing: 'border-box', marginBottom: '0.75rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={addSlot}
                      disabled={saving}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '0.625rem', background: 'var(--primary)', color: 'white', border: 'none', cursor: saving ? 'wait' : 'pointer', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
                    >
                      {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={13} />}
                      {saving ? 'Сохранение…' : 'Добавить'}
                    </button>
                    <button
                      onClick={() => setAdding(false)}
                      style={{ padding: '0.5rem 0.875rem', borderRadius: '0.625rem', background: 'var(--bg-soft)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.82rem' }}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '0.75rem', border: '1.5px dashed var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginTop: selectedTotal > 0 ? '0.25rem' : 0, transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-light)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <Plus size={14} /> Добавить слот
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
