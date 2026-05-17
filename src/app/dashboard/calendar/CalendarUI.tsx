'use client'

import { useState } from 'react'
import { Calendar, Clock, CheckCircle, X, Plus } from 'lucide-react'

type Slot = { id: string; startAt: string; durationMin: number; note: string | null; doctor: { name: string | null } }
type Booking = { id: string; slotId: string; status: string; slot: { startAt: string; durationMin: number } }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export function CalendarUI({
  slots: initial,
  bookings: initialBookings,
  userRole,
}: {
  slots: Slot[]
  bookings: Booking[]
  userRole: string
}) {
  const [slots, setSlots] = useState<Slot[]>(initial)
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [booking, setBooking] = useState<Slot | null>(null)
  const [bookingNote, setBookingNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Admin slot creation
  const isAdmin = userRole === 'admin' || userRole === 'psychologist'
  const [showAdd, setShowAdd] = useState(false)
  const [newSlot, setNewSlot] = useState({ date: '', time: '', duration: '45', note: '' })
  const [addError, setAddError] = useState('')
  const [addLoading, setAddLoading] = useState(false)

  const bookedIds = new Set(bookings.map(b => b.slotId))

  async function confirmBooking() {
    if (!booking) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: booking.id, notes: bookingNote }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Ошибка бронирования')
        return
      }
      const b = await res.json()
      setBookings(prev => [...prev, b])
      setSlots(prev => prev.filter(s => s.id !== booking.id))
      setSuccess(true)
      setTimeout(() => {
        setBooking(null)
        setSuccess(false)
        setBookingNote('')
      }, 2000)
    } finally {
      setSubmitting(false)
    }
  }

  async function addSlot() {
    if (!newSlot.date || !newSlot.time) { setAddError('Укажите дату и время'); return }
    setAddLoading(true)
    setAddError('')
    try {
      const startAt = new Date(`${newSlot.date}T${newSlot.time}:00`).toISOString()
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAt, durationMin: Number(newSlot.duration), note: newSlot.note }),
      })
      if (!res.ok) {
        const d = await res.json()
        setAddError(d.error ?? 'Ошибка')
        return
      }
      const s = await res.json()
      setSlots(prev => [...prev, { ...s, startAt: s.startAt, doctor: { name: 'Мария Соколова' } }].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()))
      setNewSlot({ date: '', time: '', duration: '45', note: '' })
      setShowAdd(false)
    } finally {
      setAddLoading(false)
    }
  }

  async function deleteSlot(slotId: string) {
    if (!confirm('Удалить этот слот?')) return
    const res = await fetch(`/api/slots?id=${slotId}`, { method: 'DELETE' })
    if (res.ok) setSlots(prev => prev.filter(s => s.id !== slotId))
  }

  return (
    <div>
      {/* My bookings */}
      {bookings.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.875rem' }}>Мои записи</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {bookings.map(b => (
              <div key={b.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '4px solid var(--primary)' }}>
                <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>
                    {formatDate(b.slot.startAt)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatTime(b.slot.startAt)} · {b.slot.durationMin} минут · Подтверждена
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin: add slot */}
      {isAdmin && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', background: 'var(--bg-dark)', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showAdd ? '1rem' : 0 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>Добавить доступный слот</span>
            <button
              onClick={() => setShowAdd(p => !p)}
              style={{ background: 'var(--primary)', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.875rem', color: 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Plus size={13} /> {showAdd ? 'Свернуть' : 'Добавить'}
            </button>
          </div>
          {showAdd && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(168,184,160,0.8)', display: 'block', marginBottom: '0.25rem' }}>Дата</label>
                <input type="date" value={newSlot.date} onChange={e => setNewSlot(p => ({ ...p, date: e.target.value }))} style={{ fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(168,184,160,0.8)', display: 'block', marginBottom: '0.25rem' }}>Время (МСК)</label>
                <input type="time" value={newSlot.time} onChange={e => setNewSlot(p => ({ ...p, time: e.target.value }))} style={{ fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(168,184,160,0.8)', display: 'block', marginBottom: '0.25rem' }}>Длительность (мин)</label>
                <select value={newSlot.duration} onChange={e => setNewSlot(p => ({ ...p, duration: e.target.value }))} style={{ fontSize: '0.875rem', width: '100%' }}>
                  <option value="30">30 минут</option>
                  <option value="45">45 минут</option>
                  <option value="60">60 минут</option>
                  <option value="90">90 минут</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(168,184,160,0.8)', display: 'block', marginBottom: '0.25rem' }}>Заметка (необязательно)</label>
                <input value={newSlot.note} onChange={e => setNewSlot(p => ({ ...p, note: e.target.value }))} placeholder="Например: онлайн via Zoom" style={{ fontSize: '0.875rem' }} />
              </div>
              {addError && <div style={{ gridColumn: '1 / -1', fontSize: '0.8rem', color: '#FC8181' }}>{addError}</div>}
              <div style={{ gridColumn: '1 / -1' }}>
                <button onClick={addSlot} disabled={addLoading} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem', padding: '0.625rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                  {addLoading ? 'Сохранение…' : 'Сохранить слот'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Available slots */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.875rem' }}>Свободные окна записи</h2>

      {slots.length === 0 ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <Calendar size={32} style={{ color: 'var(--border)', marginBottom: '0.875rem' }} />
          <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem', fontSize: '0.9rem' }}>Нет доступных слотов</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Психолог пока не открыл запись. Напишите напрямую в чате, чтобы договориться о времени.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {slots.map(slot => (
            <div key={slot.id} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              {/* Date badge */}
              <div style={{
                width: '3.25rem', flexShrink: 0, textAlign: 'center',
                background: 'var(--bg-sage)', borderRadius: '0.875rem', padding: '0.5rem 0.375rem',
              }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {new Date(slot.startAt).toLocaleDateString('ru-RU', { month: 'short' })}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
                  {new Date(slot.startAt).getDate()}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                  {new Date(slot.startAt).toLocaleDateString('ru-RU', { weekday: 'long' })}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> {formatTime(slot.startAt)} МСК
                  </span>
                  <span>{slot.durationMin} мин · {slot.doctor.name ?? 'Мария Соколова'}</span>
                </div>
                {slot.note && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{slot.note}</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => setBooking(slot)}
                  style={{
                    background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem',
                    padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                  }}
                >
                  Записаться
                </button>
                {isAdmin && (
                  <button
                    onClick={() => deleteSlot(slot.id)}
                    style={{ background: 'var(--bg-soft)', border: 'none', borderRadius: '0.625rem', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={14} style={{ color: 'var(--text-light)' }} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking modal */}
      {booking && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="card" style={{ padding: '2rem', maxWidth: '22rem', width: '100%' }}>
            {success ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Запись подтверждена!</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {formatDate(booking.startAt)}, {formatTime(booking.startAt)}
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Подтвердить запись</h3>
                  <button onClick={() => { setBooking(null); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ background: 'var(--bg-sage)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                    {formatDate(booking.startAt)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {formatTime(booking.startAt)} · {booking.durationMin} мин · {booking.doctor.name ?? 'Мария Соколова'}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>
                    Что хотите обсудить? (необязательно)
                  </label>
                  <textarea
                    value={bookingNote}
                    onChange={e => setBookingNote(e.target.value)}
                    placeholder="Опишите ситуацию кратко..."
                    rows={3}
                    style={{ width: '100%', padding: '0.625rem', fontSize: '0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {error && <div style={{ fontSize: '0.8rem', color: '#E53E3E', marginBottom: '0.875rem' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={confirmBooking}
                    disabled={submitting}
                    style={{ flex: 1, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    {submitting ? 'Отправка…' : 'Записаться'}
                  </button>
                  <button
                    onClick={() => { setBooking(null); setError('') }}
                    style={{ padding: '0.75rem 1rem', background: 'var(--bg-soft)', border: 'none', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
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
