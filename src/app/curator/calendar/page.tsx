'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ChevronLeft, ChevronRight, ExternalLink, Plus, X, User } from 'lucide-react'

const MEETING_TYPE_LABEL: Record<string, string> = {
  group: 'Группа', intro: 'Вводная', individual: 'Индивидуальная', diagnostic: 'Диагностика',
}
const MEETING_TYPE_COLOR: Record<string, string> = {
  group: '#7C3AED', intro: '#0EA5E9', individual: '#C28A5E', diagnostic: '#059669',
}
const MEETING_STATUS_LABEL: Record<string, string> = {
  scheduled: 'Запланирована', completed: 'Проведена', cancelled: 'Отменена',
}

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']

function toISODate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
function calendarDays(year: number, month: number) {
  const first = new Date(year, month, 1).getDay()
  const startOffset = first === 0 ? 6 : first - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function CuratorCalendarPage() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [persons, setPersons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [filterUserId, setFilterUserId] = useState<string>('')
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const todayIso = toISODate(today.getFullYear(), today.getMonth(), today.getDate())

  // Create meeting modal state
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ groupId: '', type: 'group', title: '', time: '19:00', duration: '90 мин', meetingLink: '' })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  function loadCalendar(userId = '') {
    const url = userId ? `/api/curator/calendar?userId=${encodeURIComponent(userId)}` : '/api/curator/calendar'
    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (d.meetings) setMeetings(d.meetings)
        if (d.persons) setPersons(d.persons)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCalendar()
    fetch('/api/curator/groups').then(r => r.json()).then(d => { if (Array.isArray(d)) setGroups(d) }).catch(() => {})
  }, [])

  function onFilterChange(userId: string) {
    setFilterUserId(userId)
    setLoading(true)
    loadCalendar(userId)
  }

  function prevMonth() { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) } else setViewMonth(m => m - 1) }
  function nextMonth() { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) } else setViewMonth(m => m + 1) }

  const cells = calendarDays(viewYear, viewMonth)

  const visibleMeetings = meetings

  const byDate: Record<string, any[]> = {}
  for (const m of visibleMeetings) {
    if (!byDate[m.date]) byDate[m.date] = []
    byDate[m.date].push(m)
  }

  const selectedMeetings = selectedDate ? (byDate[selectedDate] ?? []) : []
  const upcoming = visibleMeetings.filter(m => m.date >= todayIso && m.status === 'scheduled').slice(0, 10)

  async function createMeeting() {
    if (!form.groupId) { setCreateError('Выберите группу'); return }
    if (!form.title.trim()) { setCreateError('Введите название'); return }
    if (!selectedDate) return
    setCreating(true)
    setCreateError('')
    try {
      const r = await fetch(`/api/curator/groups/${form.groupId}/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: selectedDate }),
      })
      const d = await r.json()
      if (r.ok && d.id) {
        setShowCreate(false)
        setForm({ groupId: '', type: 'group', title: '', time: '19:00', duration: '90 мин', meetingLink: '' })
        loadCalendar(filterUserId)
      } else {
        setCreateError(d.error || 'Ошибка создания')
      }
    } catch { setCreateError('Ошибка соединения') }
    finally { setCreating(false) }
  }

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} style={{ color: '#C28A5E' }} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Календарь встреч</h1>
        </div>
        {/* Person filter */}
        {persons.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={13} style={{ color: 'var(--text-muted)' }} />
            <select
              value={filterUserId}
              onChange={e => onFilterChange(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '0.375rem 0.625rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', color: 'var(--text)', background: 'white' }}
            >
              <option value=''>Все участники</option>
              {persons.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name || p.email || p.id}{p.role === 'psychologist' ? ' (психолог)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Calendar grid */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button onClick={prevMonth} style={{ padding: '0.35rem 0.625rem', border: '1.5px solid var(--border)', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} style={{ padding: '0.35rem 0.625rem', border: '1.5px solid var(--border)', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.25rem' }}>
          {WEEK_DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.25rem 0' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const iso = toISODate(viewYear, viewMonth, day)
            const hasMeetings = (byDate[iso]?.length ?? 0) > 0
            const isToday = iso === todayIso
            const isSelected = iso === selectedDate
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(isSelected ? null : iso)}
                style={{
                  padding: '0.5rem 0.25rem', borderRadius: '0.5rem',
                  border: isSelected ? '2px solid #C28A5E' : isToday ? '1.5px solid #C28A5E' : '1.5px solid transparent',
                  background: isSelected ? '#FEF3C7' : isToday ? '#FFFBEB' : 'transparent',
                  cursor: 'pointer', position: 'relative', display: 'flex',
                  flexDirection: 'column', alignItems: 'center', gap: '0.2rem', minHeight: '2.5rem',
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: isToday || isSelected ? 700 : 400, color: isSelected ? '#92400E' : isToday ? '#C28A5E' : 'var(--text)' }}>
                  {day}
                </span>
                {hasMeetings && (
                  <div style={{ display: 'flex', gap: '0.15rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {(byDate[iso] ?? []).slice(0, 3).map((m: any, idx: number) => (
                      <div key={idx} style={{ width: '0.35rem', height: '0.35rem', borderRadius: '50%', background: MEETING_TYPE_COLOR[m.type] ?? '#6B7280' }} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
          {Object.entries(MEETING_TYPE_COLOR).map(([type, color]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: color }} />
              {MEETING_TYPE_LABEL[type]}
            </div>
          ))}
        </div>
      </div>

      {/* Selected date meetings */}
      {selectedDate && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            {groups.length > 0 && (
              <button
                onClick={() => { setShowCreate(true); setCreateError('') }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: '0.75rem', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                <Plus size={13} /> Создать встречу
              </button>
            )}
          </div>
          {selectedMeetings.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>В этот день встреч нет.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {selectedMeetings.map((m: any) => <MeetingCard key={m.id} m={m} />)}
            </div>
          )}
        </div>
      )}

      {/* Upcoming */}
      {!selectedDate && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <Clock size={15} style={{ color: '#C28A5E' }} />
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>Ближайшие встречи</h2>
          </div>
          {loading ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Загрузка...</p>
          ) : upcoming.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Нет запланированных встреч.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {upcoming.map((m: any) => <MeetingCard key={m.id} m={m} />)}
            </div>
          )}
        </div>
      )}

      {/* Create meeting modal */}
      {showCreate && selectedDate && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(28,43,35,0.55)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreate(false) }}
        >
          <div style={{ background: 'var(--card)', borderRadius: '1.25rem', padding: '1.75rem', maxWidth: '440px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>
                Новая встреча · {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </h3>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem' }}>Группа</label>
                <select
                  value={form.groupId}
                  onChange={e => setForm(f => ({ ...f, groupId: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', color: 'var(--text)' }}
                >
                  <option value=''>Выберите группу...</option>
                  {groups.map((g: any) => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem' }}>Тип</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', color: 'var(--text)' }}
                  >
                    <option value='group'>Группа</option>
                    <option value='intro'>Вводная</option>
                    <option value='individual'>Индивидуальная</option>
                    <option value='diagnostic'>Диагностика</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem' }}>Время</label>
                  <input
                    type='time'
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', color: 'var(--text)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem' }}>Название</label>
                <input
                  type='text'
                  placeholder='Встреча 1 — Что происходит и почему так больно'
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem' }}>Длительность</label>
                  <input
                    type='text'
                    placeholder='90 мин'
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem' }}>Ссылка (необяз.)</label>
                  <input
                    type='url'
                    placeholder='https://zoom.us/...'
                    value={form.meetingLink}
                    onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {createError && <p style={{ fontSize: '0.8rem', color: '#B91C1C', marginTop: '0.75rem', margin: '0.75rem 0 0' }}>{createError}</p>}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                onClick={createMeeting}
                disabled={creating}
                className='btn-primary'
                style={{ flex: 1, opacity: creating ? 0.75 : 1 }}
              >
                {creating ? 'Создание...' : 'Создать встречу'}
              </button>
              <button onClick={() => setShowCreate(false)} className='btn-outline' style={{ flex: 1 }}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MeetingCard({ m }: { m: any }) {
  const typeColor = MEETING_TYPE_COLOR[m.type] ?? '#6B7280'
  return (
    <div style={{ padding: '0.875rem 1rem', borderRadius: '0.875rem', background: 'var(--bg-soft)', border: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <div style={{ width: '3px', borderRadius: '9999px', background: typeColor, alignSelf: 'stretch', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.15rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>{m.title}</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: typeColor, border: `1px solid ${typeColor}`, borderRadius: '9999px', padding: '0.1rem 0.5rem', opacity: 0.8 }}>
            {MEETING_TYPE_LABEL[m.type] ?? m.type}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span>{new Date(m.date + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}, {m.time}</span>
          <span>· {m.duration}</span>
          {m.groupTitle && (
            <Link href={`/curator/groups/${m.groupId}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px dotted var(--border)' }}>
              {m.groupTitle}
            </Link>
          )}
          <span style={{ fontWeight: 600, color: m.status === 'completed' ? '#059669' : m.status === 'cancelled' ? '#B91C1C' : '#6B7280' }}>
            · {MEETING_STATUS_LABEL[m.status] ?? m.status}
          </span>
        </div>
        {m.meetingLink && (
          <a href={m.meetingLink} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.72rem', color: '#2563EB', textDecoration: 'none' }}>
            <ExternalLink size={11} /> Ссылка
          </a>
        )}
      </div>
    </div>
  )
}
