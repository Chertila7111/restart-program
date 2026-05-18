'use client'

import { useState } from 'react'
import { MEETING_TEMPLATES, type MeetingTemplate } from '@/lib/meeting-templates'
import { Calendar, Clock, Video, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'

type Doctor = { id: string; name: string | null }
type Meeting = {
  id: string; type: string; title: string; description: string
  date: string; time: string; duration: string; meetingLink: string | null
  doctorName: string | null; status: string; targetTiers: string
}

const QUICK_TIMES = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','18:30','19:00','19:30','20:00','20:30','21:00']
const TIER_LABELS: Record<string, string> = { intro: 'Вводная', base: 'Базовый', plus: 'Плюс', personal: 'Персональный' }

function getQuickDates() {
  const dates = []
  const today = new Date()
  for (let i = 0; i <= 30; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const val = d.toISOString().split('T')[0]
    const label = i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short' })
    dates.push({ val, label, weekday: d.toLocaleDateString('ru-RU', { weekday: 'long' }) })
  }
  return dates
}

export default function MeetingsManager({ doctors, initial }: { doctors: Doctor[]; initial: Meeting[] }) {
  const [meetings, setMeetings] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [template, setTemplate] = useState<MeetingTemplate>(MEETING_TEMPLATES[0])
  const [customTitle, setCustomTitle] = useState('')
  const [customDesc, setCustomDesc] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [customDate, setCustomDate] = useState('')
  const [showAllDates, setShowAllDates] = useState(false)
  const [selectedTime, setSelectedTime] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [doctorId, setDoctorId] = useState(doctors[0]?.id ?? '')
  const [meetingLink, setMeetingLink] = useState('')
  const [duration, setDuration] = useState('90 мин')
  const [targetTiers, setTargetTiers] = useState<string[]>(MEETING_TEMPLATES[0].targetTiers)

  const quickDates = getQuickDates()
  const visibleDates = showAllDates ? quickDates : quickDates.slice(0, 7)

  const finalDate = customDate || selectedDate
  const finalTime = customTime || selectedTime
  const finalTitle = template.type === 'custom' ? customTitle : template.title
  const finalDesc = template.type === 'custom' ? customDesc : template.description

  const selectTemplate = (t: MeetingTemplate) => {
    setTemplate(t)
    setTargetTiers(t.targetTiers)
    setDuration(t.duration)
    if (t.type !== 'custom') { setCustomTitle(''); setCustomDesc('') }
  }

  const submit = async () => {
    if (!finalTitle || !finalDate || !finalTime) {
      setError('Выберите шаблон, дату и время')
      return
    }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: template.type, title: finalTitle, description: finalDesc,
        date: finalDate, time: finalTime, duration,
        meetingLink: meetingLink || null,
        doctorId: doctorId || null,
        targetTiers,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Ошибка'); setSaving(false); return }

    // Reload meetings
    const r2 = await fetch('/api/admin/meetings')
    const d2 = await r2.json()
    setMeetings(d2.meetings ?? [])
    setShowForm(false)
    setSelectedDate(''); setCustomDate(''); setSelectedTime(''); setCustomTime(''); setMeetingLink('')
    setSaving(false)
  }

  const deleteMeeting = async (id: string) => {
    if (!confirm('Удалить встречу?')) return
    await fetch('/api/admin/meetings', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setMeetings(m => m.filter(x => x.id !== id))
  }

  const updateLink = async (id: string, link: string) => {
    await fetch('/api/admin/meetings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, meetingLink: link }),
    })
  }

  const label: React.CSSProperties = { display: 'block', fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', marginBottom: '0.5rem' }
  const section = (title: string) => (
    <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', marginTop: '0.5rem' }}>{title}</div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>Встречи</h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
            {meetings.filter(m => m.status === 'scheduled').length} запланировано
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.625rem 1.125rem', borderRadius: '0.75rem',
            background: 'var(--primary)', color: 'white', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.875rem',
          }}
        >
          <Plus size={15} /> Запланировать встречу
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          {/* Step 1: Template */}
          {section('1. Тип встречи')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.625rem', marginBottom: '1.5rem' }}>
            {MEETING_TEMPLATES.map(t => (
              <button
                key={t.type}
                onClick={() => selectTemplate(t)}
                style={{
                  padding: '0.75rem', borderRadius: '0.75rem', textAlign: 'left', cursor: 'pointer',
                  border: template.type === t.type ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: template.type === t.type ? 'var(--primary-light)' : 'white',
                  fontFamily: 'inherit', transition: 'all 0.12s',
                }}
              >
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{t.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: template.type === t.type ? 'var(--primary-dark)' : 'var(--text)', lineHeight: 1.3 }}>{t.label}</div>
              </button>
            ))}
          </div>

          {/* Custom title/desc */}
          {template.type === 'custom' && (
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={label}>Название *</label>
                <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Название встречи" style={{ fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={label}>Описание</label>
                <textarea value={customDesc} onChange={e => setCustomDesc(e.target.value)} placeholder="О чём будет встреча..." rows={2} style={{ fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>
            </div>
          )}

          {/* Step 2: Date */}
          {section('2. Дата')}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {visibleDates.map(d => (
                <button
                  key={d.val}
                  onClick={() => { setSelectedDate(d.val); setCustomDate('') }}
                  style={{
                    padding: '0.5rem 0.875rem', borderRadius: '0.625rem', cursor: 'pointer', fontFamily: 'inherit',
                    border: selectedDate === d.val && !customDate ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: selectedDate === d.val && !customDate ? 'var(--primary-light)' : 'white',
                    color: selectedDate === d.val && !customDate ? 'var(--primary-dark)' : 'var(--text)',
                    fontWeight: selectedDate === d.val && !customDate ? 700 : 400,
                    fontSize: '0.825rem', whiteSpace: 'nowrap',
                  }}
                >
                  {d.label}
                </button>
              ))}
              <button
                onClick={() => setShowAllDates(!showAllDates)}
                style={{ padding: '0.5rem 0.875rem', borderRadius: '0.625rem', cursor: 'pointer', fontFamily: 'inherit', border: '1.5px solid var(--border)', background: 'white', color: 'var(--text-muted)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {showAllDates ? <><ChevronUp size={13} /> Свернуть</> : <><ChevronDown size={13} /> Ещё 23 дня</>}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Или выберите дату:</span>
              <input
                type="date"
                value={customDate}
                onChange={e => { setCustomDate(e.target.value); setSelectedDate('') }}
                style={{ fontSize: '0.875rem', width: 'auto', padding: '0.375rem 0.625rem' }}
              />
            </div>
            {(finalDate) && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                ✓ {new Date(finalDate + 'T12:00:00').toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>

          {/* Step 3: Time */}
          {section('3. Время (МСК)')}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {QUICK_TIMES.map(t => (
                <button
                  key={t}
                  onClick={() => { setSelectedTime(t); setCustomTime('') }}
                  style={{
                    padding: '0.5rem 0.75rem', borderRadius: '0.625rem', cursor: 'pointer', fontFamily: 'inherit',
                    border: selectedTime === t && !customTime ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: selectedTime === t && !customTime ? 'var(--primary-light)' : 'white',
                    color: selectedTime === t && !customTime ? 'var(--primary-dark)' : 'var(--text)',
                    fontWeight: selectedTime === t && !customTime ? 700 : 400, fontSize: '0.875rem',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Другое время:</span>
              <input
                type="time"
                value={customTime}
                onChange={e => { setCustomTime(e.target.value); setSelectedTime('') }}
                style={{ fontSize: '0.875rem', width: 'auto', padding: '0.375rem 0.625rem' }}
              />
            </div>
          </div>

          {/* Step 4: Details */}
          {section('4. Детали')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={label}>Психолог</label>
              <select
                value={doctorId}
                onChange={e => setDoctorId(e.target.value)}
                style={{ fontSize: '0.875rem', fontFamily: 'inherit' }}
              >
                <option value="">— не назначен —</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name ?? d.id}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Продолжительность</label>
              <select value={duration} onChange={e => setDuration(e.target.value)} style={{ fontSize: '0.875rem', fontFamily: 'inherit' }}>
                {['30 мин', '45 мин', '60 мин', '90 мин', '120 мин'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={label}>Ссылка на звонок</label>
            <input
              type="url"
              value={meetingLink}
              onChange={e => setMeetingLink(e.target.value)}
              placeholder="https://telemost.yandex.ru/... (можно добавить позже)"
              style={{ fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={label}>Кому показывать</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['intro', 'base', 'plus', 'personal'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setTargetTiers(prev =>
                    prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
                  )}
                  style={{
                    padding: '0.375rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'inherit',
                    border: targetTiers.includes(tier) ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: targetTiers.includes(tier) ? 'var(--primary-light)' : 'white',
                    color: targetTiers.includes(tier) ? 'var(--primary-dark)' : 'var(--text-muted)',
                    fontWeight: targetTiers.includes(tier) ? 600 : 400, fontSize: '0.8rem',
                  }}
                >
                  {TIER_LABELS[tier]}
                </button>
              ))}
            </div>
          </div>

          {error && <div style={{ color: '#EF4444', fontSize: '0.825rem', marginBottom: '0.75rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: '0.625rem' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={submit}
              disabled={saving}
              style={{
                padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.9rem',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Создаём...' : 'Запланировать встречу'}
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'none', border: '1.5px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Meetings list */}
      {meetings.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Нет запланированных встреч
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {meetings.map(m => {
            const tiers: string[] = (() => { try { return JSON.parse(m.targetTiers) } catch { return [] } })()
            const isPast = new Date(`${m.date}T${m.time}:00+03:00`) < new Date()
            return (
              <div key={m.id} className="card" style={{ padding: '1.25rem', opacity: m.status === 'cancelled' || isPast ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{m.title}</span>
                      {m.status === 'cancelled' && <span style={{ fontSize: '0.7rem', background: '#FEE2E2', color: '#991B1B', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>Отменена</span>}
                      {isPast && m.status !== 'cancelled' && <span style={{ fontSize: '0.7rem', background: 'var(--bg-soft)', color: 'var(--text-light)', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>Прошла</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {new Date(m.date + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {m.time} МСК · {m.duration}</span>
                      {m.doctorName && <span>👩‍⚕️ {m.doctorName}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                      {tiers.map(t => <span key={t} style={{ fontSize: '0.7rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>{TIER_LABELS[t]}</span>)}
                    </div>
                    {/* Inline link edit */}
                    <MeetingLinkEdit id={m.id} initial={m.meetingLink ?? ''} onSave={updateLink} />
                  </div>
                  <button
                    onClick={() => deleteMeeting(m.id)}
                    style={{ padding: '0.375rem', borderRadius: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', flexShrink: 0 }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MeetingLinkEdit({ id, initial, onSave }: { id: string; initial: string; onSave: (id: string, link: string) => Promise<void> }) {
  const [link, setLink] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Video size={12} /> Войти в звонок
          </a>
        ) : (
          <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Video size={12} /> Ссылка не добавлена
          </span>
        )}
        <button onClick={() => setEditing(true)} style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
          {link ? 'изменить' : '+ добавить ссылку'}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input
        value={link}
        onChange={e => setLink(e.target.value)}
        placeholder="https://telemost.yandex.ru/..."
        style={{ fontSize: '0.825rem', flex: 1, padding: '0.375rem 0.625rem' }}
        autoFocus
      />
      <button
        onClick={async () => { setSaving(true); await onSave(id, link); setSaving(false); setEditing(false) }}
        disabled={saving}
        style={{ padding: '0.375rem 0.75rem', borderRadius: '0.5rem', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}
      >
        {saving ? '...' : 'Сохранить'}
      </button>
      <button onClick={() => { setLink(initial); setEditing(false) }} style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem' }}>✕</button>
    </div>
  )
}
