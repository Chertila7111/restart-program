'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, X, Users, Video, ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react'

type Slot = { id: string; startAt: string; durationMin: number; note: string | null; doctor: { name: string | null } }
type Booking = { id: string; slotId: string; status: string; slot: { startAt: string; durationMin: number } }
type Meeting = { id: string; title: string; date: string; time: string; duration: string; meetingLink: string | null }

const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
}
function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
function isToday(y: number, m: number, d: number) {
  const t = new Date()
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d
}
function weeksOf(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startDow = (first.getDay() + 6) % 7
  const weeks: (number | null)[][] = []
  let week: (number | null)[] = Array(startDow).fill(null)
  for (let d = 1; d <= last.getDate(); d++) {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week) }
  return weeks
}

// Group slots and meetings by date key
function buildDayMap(slots: Slot[], bookings: Booking[], meetings: Meeting[]) {
  const bookedSlotIds = new Set(bookings.map(b => b.slotId))
  const map: Record<string, { freeSlots: Slot[]; myBookings: Booking[]; meetings: Meeting[] }> = {}

  const ensure = (k: string) => {
    if (!map[k]) map[k] = { freeSlots: [], myBookings: [], meetings: [] }
    return map[k]
  }

  for (const s of slots) {
    if (bookedSlotIds.has(s.id)) continue // already booked by user
    const k = s.startAt.slice(0, 10)
    ensure(k).freeSlots.push(s)
  }
  for (const b of bookings) {
    const k = b.slot.startAt.slice(0, 10)
    ensure(k).myBookings.push(b)
  }
  for (const m of meetings) {
    ensure(m.date).meetings.push(m)
  }
  return map
}

export function CalendarUI({
  slots: initialSlots,
  bookings: initialBookings,
  userRole,
  meetings = [],
}: {
  slots: Slot[]
  bookings: Booking[]
  userRole: string
  meetings?: Meeting[]
}) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [slots, setSlots] = useState(initialSlots)
  const [bookings, setBookings] = useState(initialBookings)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  // Booking flow
  const [bookingSlot, setBookingSlot] = useState<Slot | null>(null)
  const [bookingNote, setBookingNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  // Admin slot add
  const isAdmin = userRole === 'admin' || userRole === 'psychologist'
  const [showAdd, setShowAdd] = useState(false)
  const [newSlot, setNewSlot] = useState({ date: '', time: '', duration: '45' })
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')

  const dayMap = buildDayMap(slots, bookings, meetings)
  const todayKey = now.toISOString().slice(0, 10)

  // Selected date defaults to today if it has events, else first future date with events
  useEffect(() => {
    if (!selectedDate) {
      if (dayMap[todayKey]) {
        setSelectedDate(todayKey)
      } else {
        const future = Object.keys(dayMap).filter(k => k >= todayKey).sort()[0]
        if (future) setSelectedDate(future)
      }
    }
  }, []) // eslint-disable-line

  // Upcoming events for "next event" banner
  const allUpcoming = [
    ...slots.map(s => ({ type: 'slot' as const, ts: s.startAt, data: s })),
    ...bookings.map(b => ({ type: 'booking' as const, ts: b.slot.startAt, data: b })),
    ...meetings.map(m => ({ type: 'meeting' as const, ts: `${m.date}T${m.time}:00`, data: m })),
  ].filter(e => new Date(e.ts) > now).sort((a, b) => a.ts.localeCompare(b.ts))

  const nextEvent = allUpcoming[0] ?? null

  function prevMonth() { if (month === 0) { setYear(y => y-1); setMonth(11) } else setMonth(m => m-1) }
  function nextMonth() { if (month === 11) { setYear(y => y+1); setMonth(0) } else setMonth(m => m+1) }

  async function confirmBooking() {
    if (!bookingSlot) return
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: bookingSlot.id, notes: bookingNote }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Ошибка'); return }
      const b = await res.json()
      setBookings(prev => [...prev, b])
      setSlots(prev => prev.filter(s => s.id !== bookingSlot.id))
      setSuccess(true)
      setTimeout(() => { setBookingSlot(null); setSuccess(false); setBookingNote('') }, 2500)
    } finally { setSubmitting(false) }
  }

  async function addSlot() {
    if (!newSlot.date || !newSlot.time) { setAddError('Укажите дату и время'); return }
    setAddLoading(true); setAddError('')
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAt: new Date(`${newSlot.date}T${newSlot.time}:00`).toISOString(), durationMin: Number(newSlot.duration) }),
      })
      if (!res.ok) { const d = await res.json(); setAddError(d.error ?? 'Ошибка'); return }
      const s = await res.json()
      setSlots(prev => [...prev, { ...s, startAt: s.startAt, doctor: { name: 'Мария Соколова' } }].sort((a, b) => a.startAt.localeCompare(b.startAt)))
      setNewSlot({ date: '', time: '', duration: '45' })
      setShowAdd(false)
    } finally { setAddLoading(false) }
  }

  async function deleteSlot(slotId: string) {
    const res = await fetch(`/api/slots?id=${slotId}`, { method: 'DELETE' })
    if (res.ok) setSlots(prev => prev.filter(s => s.id !== slotId))
  }

  const selDay = selectedDate ? dayMap[selectedDate] : null
  const weeks = weeksOf(year, month)

  return (
    <div>
      {/* ── Next event banner ── */}
      {nextEvent && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', borderRadius: '1rem', background: 'linear-gradient(135deg, var(--bg-sage), var(--primary-light))', border: '1px solid var(--primary-light)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {nextEvent.type === 'meeting' ? <Users size={16} color="white" /> : <Clock size={16} color="white" />}
          </div>
          <div style={{ flex: 1, minWidth: '12rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.1rem' }}>
              Ближайшее событие
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
              {nextEvent.type === 'meeting'
                ? (nextEvent.data as Meeting).title
                : nextEvent.type === 'booking'
                ? `Встреча с психологом · ${fmtTime((nextEvent.data as Booking).slot.startAt)}`
                : `Свободный слот · ${fmtTime((nextEvent.data as Slot).startAt)}`
              }
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {nextEvent.type === 'meeting'
                ? `${fmtDateShort((nextEvent.data as Meeting).date)} · ${(nextEvent.data as Meeting).time} МСК`
                : fmtDate(nextEvent.ts)
              }
            </div>
          </div>
          {nextEvent.type === 'meeting' && (nextEvent.data as Meeting).meetingLink && (
            <a href={(nextEvent.data as Meeting).meetingLink!} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: '0.625rem', background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', flexShrink: 0 }}>
              <Video size={13} /> Войти
            </a>
          )}
          {nextEvent.type === 'slot' && (
            <button onClick={() => setBookingSlot(nextEvent.data as Slot)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: '0.625rem', background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: '0.82rem', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <Calendar size={13} /> Записаться
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 22rem', gap: '1.25rem', alignItems: 'start' }}>

        {/* ── Mini calendar + admin add ── */}
        <div>
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', display: 'flex', borderRadius: '0.5rem' }}>
                <ChevronLeft size={18} />
              </button>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', textTransform: 'capitalize' }}>
                {MONTHS_RU[month]} {year}
              </span>
              <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', display: 'flex', borderRadius: '0.5rem' }}>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* DOW headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
              {DOW.map((d, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: '0.68rem', fontWeight: 700, color: i >= 5 ? '#B91C1C' : 'var(--text-muted)', padding: '0.25rem 0' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {weeks.flat().map((day, idx) => {
                if (day === null) return <div key={`e${idx}`} />
                const k = isoDate(year, month, day)
                const isSelected = k === selectedDate
                const today = isToday(year, month, day)
                const dayData = dayMap[k]
                const hasFree = (dayData?.freeSlots?.length ?? 0) > 0
                const hasBooked = (dayData?.myBookings?.length ?? 0) > 0
                const hasMtg = (dayData?.meetings?.length ?? 0) > 0
                const isPast = new Date(k) < new Date(todayKey)
                return (
                  <button
                    key={k}
                    onClick={() => setSelectedDate(isSelected ? null : k)}
                    style={{
                      border: 'none', cursor: 'pointer',
                      padding: '0.4rem 0.2rem',
                      borderRadius: '0.5rem',
                      background: isSelected ? 'var(--primary)' : today ? 'var(--primary-light)' : 'transparent',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                      opacity: isPast && !dayData ? 0.3 : 1,
                      minHeight: '2.75rem',
                    }}
                    onMouseEnter={e => { if (!isSelected && !isPast) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-soft)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isSelected ? 'var(--primary)' : today ? 'var(--primary-light)' : 'transparent' }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: today ? 800 : 400, color: isSelected ? 'white' : today ? 'var(--primary-dark)' : idx % 7 >= 5 ? '#B91C1C' : 'var(--text)', lineHeight: 1 }}>
                      {day}
                    </span>
                    {(hasFree || hasBooked || hasMtg) && (
                      <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                        {hasFree && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--primary)' }} />}
                        {hasBooked && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.8)' : '#2563EB' }} />}
                        {hasMtg && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.8)' : '#C28A5E' }} />}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.875rem', paddingTop: '0.625rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
              {[
                { color: 'var(--primary)', label: 'Свободно' },
                { color: '#2563EB', label: 'Моя запись' },
                { color: '#C28A5E', label: 'Групповая' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Admin: add slot */}
          {isAdmin && (
            <div className="card" style={{ padding: '1rem', background: 'var(--bg-dark)', border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Добавить слот</span>
                <button onClick={() => setShowAdd(p => !p)} style={{ background: 'var(--primary)', border: 'none', borderRadius: '0.5rem', padding: '0.35rem 0.75rem', color: 'white', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Plus size={12} /> {showAdd ? 'Свернуть' : 'Добавить'}
                </button>
              </div>
              {showAdd && (
                <div style={{ marginTop: '0.875rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'rgba(168,184,160,0.8)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>Дата</label>
                    <input type="date" value={newSlot.date} onChange={e => setNewSlot(p => ({ ...p, date: e.target.value }))} style={{ fontSize: '0.825rem', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'rgba(168,184,160,0.8)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>Время</label>
                    <input type="time" value={newSlot.time} onChange={e => setNewSlot(p => ({ ...p, time: e.target.value }))} style={{ fontSize: '0.825rem', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.7rem', color: 'rgba(168,184,160,0.8)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>Длительность</label>
                    <select value={newSlot.duration} onChange={e => setNewSlot(p => ({ ...p, duration: e.target.value }))} style={{ fontSize: '0.825rem', width: '100%' }}>
                      {['30','45','60','90'].map(d => <option key={d} value={d}>{d} мин</option>)}
                    </select>
                  </div>
                  {addError && <div style={{ gridColumn: '1/-1', fontSize: '0.75rem', color: '#FC8181' }}>{addError}</div>}
                  <div style={{ gridColumn: '1/-1' }}>
                    <button onClick={addSlot} disabled={addLoading} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      {addLoading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={13} />}
                      {addLoading ? 'Сохранение…' : 'Сохранить'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Day detail ── */}
        <div>
          {selectedDate ? (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.875rem', textTransform: 'capitalize', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{fmtDate(selectedDate + 'T12:00:00')}</span>
                <button onClick={() => setSelectedDate(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0.25rem', display: 'flex' }}>
                  <X size={15} />
                </button>
              </div>

              {/* Group meetings */}
              {(selDay?.meetings ?? []).map(m => (
                <div key={m.id} className="card" style={{ padding: '1rem', marginBottom: '0.625rem', borderLeft: '4px solid #C28A5E', background: '#FFF7ED' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Users size={13} style={{ color: '#C28A5E' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>{m.title}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: m.meetingLink ? '0.625rem' : 0 }}>
                    {m.time} МСК · {m.duration}
                  </div>
                  {m.meetingLink && (
                    <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.375rem 0.875rem', borderRadius: '0.5rem', background: '#C28A5E', color: 'white', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                      <Video size={12} /> Войти в встречу
                    </a>
                  )}
                </div>
              ))}

              {/* My bookings */}
              {(selDay?.myBookings ?? []).map(b => (
                <div key={b.id} className="card" style={{ padding: '1rem', marginBottom: '0.625rem', borderLeft: '4px solid #2563EB', background: '#EFF6FF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <CheckCircle size={13} style={{ color: '#2563EB' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>Индивидуальная встреча</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 600 }}>
                    {fmtTime(b.slot.startAt)} · {b.slot.durationMin} мин · Подтверждена
                  </div>
                </div>
              ))}

              {/* Free slots to book */}
              {(selDay?.freeSlots ?? []).map(s => (
                <div key={s.id} className="card" style={{ padding: '1rem', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.1rem' }}>
                      {fmtTime(s.startAt)} · {s.durationMin} мин
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {s.doctor.name ?? 'Мария Соколова'} · Свободно
                    </div>
                    {s.note && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{s.note}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                    <button
                      onClick={() => setBookingSlot(s)}
                      style={{ padding: '0.45rem 1rem', borderRadius: '0.625rem', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}
                    >
                      Записаться
                    </button>
                    {isAdmin && (
                      <button onClick={() => deleteSlot(s.id)} style={{ padding: '0.45rem 0.5rem', borderRadius: '0.625rem', background: 'var(--bg-soft)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <X size={13} style={{ color: 'var(--text-light)' }} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {!selDay && (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <Calendar size={28} style={{ color: 'var(--border)', margin: '0 auto 0.5rem' }} />
                  На этот день ничего нет
                </div>
              )}
            </div>
          ) : (
            /* Upcoming list (no date selected) */
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.875rem' }}>
                Ближайшие события
              </div>
              {allUpcoming.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <Calendar size={32} style={{ color: 'var(--border)', margin: '0 auto 0.75rem' }} />
                  Запланированных событий нет.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {allUpcoming.slice(0, 8).map((e, i) => {
                    const isBooking = e.type === 'booking'
                    const isMtg = e.type === 'meeting'
                    const m = e.data as Meeting
                    const b = e.data as Booking
                    const s = e.data as Slot
                    return (
                      <div
                        key={i}
                        className="card"
                        style={{ padding: '0.875rem 1rem', display: 'flex', gap: '0.875rem', alignItems: 'center', cursor: 'pointer', borderLeft: `4px solid ${isMtg ? '#C28A5E' : isBooking ? '#2563EB' : 'var(--primary)'}` }}
                        onClick={() => { setSelectedDate(e.ts.slice(0, 10)); setYear(+e.ts.slice(0, 4)); setMonth(+e.ts.slice(5, 7) - 1) }}
                      >
                        <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: isMtg ? '#FFF7ED' : isBooking ? '#EFF6FF' : 'var(--bg-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isMtg ? <Users size={15} style={{ color: '#C28A5E' }} /> : isBooking ? <CheckCircle size={15} style={{ color: '#2563EB' }} /> : <Clock size={15} style={{ color: 'var(--primary)' }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.845rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {isMtg ? m.title : isBooking ? 'Встреча с психологом' : 'Свободный слот'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isMtg ? `${fmtDateShort(m.date)} · ${m.time} МСК` : isBooking ? `${fmtDateShort(b.slot.startAt)} · ${fmtTime(b.slot.startAt)} · ${b.slot.durationMin} мин` : `${fmtDateShort(s.startAt)} · ${fmtTime(s.startAt)} · ${s.durationMin} мин`}
                          </div>
                        </div>
                        {e.type === 'slot' && (
                          <button
                            onClick={ev => { ev.stopPropagation(); setBookingSlot(e.data as Slot) }}
                            style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}
                          >
                            Записаться
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Booking modal ── */}
      {bookingSlot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ padding: '2rem', maxWidth: '24rem', width: '100%' }}>
            {success ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Запись подтверждена!</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {fmtDate(bookingSlot.startAt)}, {fmtTime(bookingSlot.startAt)}
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>Запись на встречу</h3>
                  <button onClick={() => { setBookingSlot(null); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                    <X size={18} />
                  </button>
                </div>
                <div style={{ background: 'var(--bg-sage)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                    {fmtDate(bookingSlot.startAt)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {fmtTime(bookingSlot.startAt)} · {bookingSlot.durationMin} мин · {bookingSlot.doctor.name ?? 'Мария Соколова'}
                  </div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>
                    Что хотите обсудить? <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(необязательно)</span>
                  </label>
                  <textarea
                    value={bookingNote}
                    onChange={e => setBookingNote(e.target.value)}
                    placeholder="Опишите коротко..."
                    rows={3}
                    style={{ width: '100%', padding: '0.625rem', fontSize: '0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {error && <div style={{ fontSize: '0.8rem', color: '#E53E3E', marginBottom: '0.875rem' }}>{error}</div>}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={confirmBooking} disabled={submitting} style={{ flex: 1, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    {submitting ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={15} />}
                    {submitting ? 'Подтверждение…' : 'Подтвердить запись'}
                  </button>
                  <button onClick={() => { setBookingSlot(null); setError('') }} style={{ padding: '0.75rem 1rem', background: 'var(--bg-soft)', border: 'none', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    Отмена
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
