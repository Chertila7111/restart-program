'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Video, CheckCircle, Clock, XCircle, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

const MEETING_TYPE_LABEL: Record<string, string> = {
  group: 'Группа',
  intro: 'Вводная',
  individual: 'Индивидуальная',
  diagnostic: 'Диагностика',
}

const MEETING_TYPE_COLOR: Record<string, string> = {
  group: '#7C3AED',
  intro: '#0EA5E9',
  individual: '#C28A5E',
  diagnostic: '#059669',
}

const MEETING_STATUS_LABEL: Record<string, string> = {
  scheduled: 'Запланирована',
  completed: 'Проведена',
  cancelled: 'Отменена',
}

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

function toISODate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function calendarDays(year: number, month: number) {
  const first = new Date(year, month, 1).getDay()
  const startOffset = first === 0 ? 6 : first - 1 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function CuratorCalendarPage() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const todayIso = toISODate(today.getFullYear(), today.getMonth(), today.getDate())

  useEffect(() => {
    fetch('/api/curator/calendar')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMeetings(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const cells = calendarDays(viewYear, viewMonth)

  // Map date → meetings
  const byDate: Record<string, any[]> = {}
  for (const m of meetings) {
    if (!byDate[m.date]) byDate[m.date] = []
    byDate[m.date].push(m)
  }

  const selectedMeetings = selectedDate ? (byDate[selectedDate] ?? []) : []

  // Upcoming meetings (future + today, scheduled)
  const upcoming = meetings
    .filter(m => m.date >= todayIso && m.status === 'scheduled')
    .slice(0, 10)

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Calendar size={18} style={{ color: '#C28A5E' }} />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Календарь встреч</h1>
      </div>

      {/* Calendar grid */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button
            onClick={prevMonth}
            style={{ padding: '0.35rem 0.625rem', border: '1.5px solid var(--border)', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            style={{ padding: '0.35rem 0.625rem', border: '1.5px solid var(--border)', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.25rem' }}>
          {WEEK_DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.25rem 0' }}>{d}</div>
          ))}
        </div>

        {/* Days */}
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
                  padding: '0.5rem 0.25rem',
                  borderRadius: '0.5rem',
                  border: isSelected ? '2px solid #C28A5E' : isToday ? '1.5px solid #C28A5E' : '1.5px solid transparent',
                  background: isSelected ? '#FEF3C7' : isToday ? '#FFFBEB' : 'transparent',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  minHeight: '2.5rem',
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

        {/* Legend */}
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
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.875rem', margin: 0, marginBottom: '0.875rem' }}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          {selectedMeetings.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>В этот день встреч нет.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {selectedMeetings.map((m: any) => (
                <MeetingCard key={m.id} m={m} />
              ))}
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
              {upcoming.map((m: any) => (
                <MeetingCard key={m.id} m={m} />
              ))}
            </div>
          )}
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
          <span>
            {new Date(m.date + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}, {m.time}
          </span>
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
          <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.72rem', color: '#2563EB', textDecoration: 'none' }}>
            <ExternalLink size={11} /> Ссылка
          </a>
        )}
      </div>
    </div>
  )
}
