'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Users, UserPlus, UserMinus, Search, Loader2,
  CalendarPlus, Video, CheckCircle, Clock, XCircle, ExternalLink,
} from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'recruiting', label: 'Набор',     color: '#3B82F6' },
  { value: 'active',     label: 'Активна',   color: '#059669' },
  { value: 'completed',  label: 'Завершена', color: '#6B7280' },
]

const MEETING_TYPE_LABEL: Record<string, string> = {
  group: 'Групповая',
  intro: 'Вводная',
  individual: 'Индивидуальная',
  diagnostic: 'Диагностика',
}

const MEETING_STATUS_COLOR: Record<string, string> = {
  scheduled: '#3B82F6',
  completed: '#059669',
  cancelled: '#B91C1C',
}
const MEETING_STATUS_LABEL: Record<string, string> = {
  scheduled: 'Запланирована',
  completed: 'Проведена',
  cancelled: 'Отменена',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

export default function GroupDetailPage() {
  const params = useParams()
  const groupId = params.groupId as string

  const [group, setGroup] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddMember, setShowAddMember] = useState(false)
  const [showCreateMeeting, setShowCreateMeeting] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const [showPsychologistPanel, setShowPsychologistPanel] = useState(false)
  const [psychologistSearchQ, setPsychologistSearchQ] = useState('')
  const [psychologistResults, setPsychologistResults] = useState<any[]>([])
  const [psychologistSearchLoading, setPsychologistSearchLoading] = useState(false)

  // New meeting form
  const [mForm, setMForm] = useState({
    type: 'group', title: '', date: '', time: '18:00', duration: '90 мин', meetingLink: '', description: '',
  })
  const [mSaving, setMSaving] = useState(false)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async () => {
    try {
      const [gr, mr] = await Promise.all([
        fetch(`/api/curator/groups/${groupId}`),
        fetch(`/api/curator/groups/${groupId}/meetings`),
      ])
      if (!gr.ok) { setError('Группа не найдена или нет доступа'); return }
      const gd = await gr.json()
      setGroup(gd.group)
      setParticipants(gd.participants)
      if (mr.ok) setMeetings(await mr.json())
    } catch { setError('Ошибка загрузки') } finally { setLoading(false) }
  }, [groupId])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!showAddMember) { setSearchResults([]); return }
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const r = await fetch(`/api/curator/users?q=${encodeURIComponent(searchQ)}&excludeGroup=${groupId}`)
        if (r.ok) setSearchResults(await r.json())
      } finally { setSearchLoading(false) }
    }, 300)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
  }, [searchQ, showAddMember, groupId])

  useEffect(() => {
    if (!showPsychologistPanel) { setPsychologistResults([]); return }
    const timer = setTimeout(async () => {
      setPsychologistSearchLoading(true)
      try {
        const r = await fetch(`/api/curator/users?role=psychologist&q=${encodeURIComponent(psychologistSearchQ)}`)
        if (r.ok) setPsychologistResults(await r.json())
      } finally { setPsychologistSearchLoading(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [psychologistSearchQ, showPsychologistPanel])

  async function patch(body: object): Promise<boolean> {
    const r = await fetch(`/api/curator/groups/${groupId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    return r.ok
  }

  async function addMember(userId: string) {
    setActionLoading(`add-${userId}`)
    const ok = await patch({ action: 'addMember', userId })
    if (ok) { await load(); setSearchQ(''); setSearchResults([]) }
    setActionLoading('')
  }

  async function removeMember(userId: string, name: string) {
    if (!confirm(`Удалить ${name || 'участника'} из группы?`)) return
    setActionLoading(`remove-${userId}`)
    const ok = await patch({ action: 'removeMember', userId })
    if (ok) await load()
    setActionLoading('')
  }

  async function setStatus(status: string) {
    setActionLoading('status')
    const ok = await patch({ action: 'setStatus', status })
    if (ok) setGroup((g: any) => ({ ...g, status }))
    setActionLoading('')
  }

  async function setWeek(week: number) {
    if (week < 1 || week > 12) return
    setActionLoading('week')
    const ok = await patch({ action: 'setWeek', week })
    if (ok) setGroup((g: any) => ({ ...g, currentWeek: week }))
    setActionLoading('')
  }

  async function assignPsychologist(psychologistId: string | null) {
    setActionLoading('psychologist')
    const ok = await patch({ action: 'setPsychologist', psychologistId })
    if (ok) {
      await load()
      setShowPsychologistPanel(false)
      setPsychologistSearchQ('')
    }
    setActionLoading('')
  }

  async function createMeeting() {
    if (!mForm.title.trim() || !mForm.date || !mForm.time) return
    setMSaving(true)
    try {
      const r = await fetch(`/api/curator/groups/${groupId}/meetings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mForm),
      })
      if (r.ok) {
        setShowCreateMeeting(false)
        setMForm({ type: 'group', title: '', date: '', time: '18:00', duration: '90 мин', meetingLink: '', description: '' })
        const mr = await fetch(`/api/curator/groups/${groupId}/meetings`)
        if (mr.ok) setMeetings(await mr.json())
      }
    } finally { setMSaving(false) }
  }

  async function setMeetingStatus(meetingId: string, status: string) {
    setActionLoading(`mstatus-${meetingId}`)
    await fetch(`/api/curator/groups/${groupId}/meetings`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetingId, action: 'setStatus', status }),
    })
    const mr = await fetch(`/api/curator/groups/${groupId}/meetings`)
    if (mr.ok) setMeetings(await mr.json())
    setActionLoading('')
  }

  async function deleteMeeting(meetingId: string) {
    if (!confirm('Удалить встречу?')) return
    setActionLoading(`mdel-${meetingId}`)
    await fetch(`/api/curator/groups/${groupId}/meetings`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetingId, action: 'delete' }),
    })
    setMeetings(m => m.filter(x => x.id !== meetingId))
    setActionLoading('')
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
      <Loader2 size={24} style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (error || !group) return (
    <div style={{ maxWidth: '52rem' }}>
      <Link href="/curator/groups" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={13} /> Все группы
      </Link>
      <p style={{ color: '#B91C1C', fontSize: '0.875rem' }}>{error || 'Группа не найдена'}</p>
    </div>
  )

  const currentStatus = STATUS_OPTIONS.find(s => s.value === group.status) || STATUS_OPTIONS[0]
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div style={{ maxWidth: '52rem' }}>
      <Link href="/curator/groups" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={13} /> Все группы
      </Link>

      {/* Group header */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', margin: 0, flex: 1 }}>{group.title}</h1>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: currentStatus.color, border: `1px solid ${currentStatus.color}`, padding: '0.2rem 0.75rem', borderRadius: '9999px', background: '#F9FAFB', flexShrink: 0 }}>
              {currentStatus.label}
            </span>
          </div>
        </div>

        {/* Status change */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>Статус группы</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map(s => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                disabled={actionLoading === 'status' || group.status === s.value}
                style={{
                  padding: '0.375rem 0.875rem', borderRadius: '0.625rem', fontSize: '0.8rem', fontWeight: 600,
                  cursor: group.status === s.value ? 'default' : 'pointer',
                  border: `1.5px solid ${group.status === s.value ? s.color : 'var(--border)'}`,
                  background: group.status === s.value ? s.color : 'transparent',
                  color: group.status === s.value ? 'white' : s.color,
                  opacity: actionLoading === 'status' ? 0.6 : 1, transition: 'all 0.15s',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Week control */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>Текущая неделя</div>
          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
            <button
              onClick={() => setWeek(group.currentWeek - 1)}
              disabled={actionLoading === 'week' || group.currentWeek <= 1}
              style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >−</button>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', minWidth: '5rem', textAlign: 'center' }}>
              Неделя {group.currentWeek}
            </span>
            <button
              onClick={() => setWeek(group.currentWeek + 1)}
              disabled={actionLoading === 'week' || group.currentWeek >= 12}
              style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >+</button>
          </div>
        </div>

        {/* Psychologist */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>Психолог группы</div>
            <button
              onClick={() => { setShowPsychologistPanel(v => !v); setPsychologistSearchQ('') }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: `1.5px solid ${showPsychologistPanel ? 'var(--primary)' : 'var(--border)'}`, background: showPsychologistPanel ? 'var(--primary-light)' : 'var(--bg)', fontSize: '0.75rem', fontWeight: 600, color: showPsychologistPanel ? 'var(--primary-dark)' : 'var(--text)', cursor: 'pointer' }}
            >
              {group.psychologistId ? 'Изменить' : 'Назначить'}
            </button>
          </div>

          {group.psychologistName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {group.psychologistName[0].toUpperCase()}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', flex: 1 }}>{group.psychologistName}</span>
              <button
                onClick={() => assignPsychologist(null)}
                disabled={actionLoading === 'psychologist'}
                style={{ fontSize: '0.72rem', color: '#B91C1C', background: '#FEE2E2', border: 'none', borderRadius: '0.5rem', padding: '0.25rem 0.625rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Открепить
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Не назначен</div>
          )}

          {showPsychologistPanel && (
            <div style={{ marginTop: '0.75rem', padding: '0.875rem', background: 'var(--bg-sage)', borderRadius: '0.875rem', border: '1px solid var(--primary-light)' }}>
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <Search size={13} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  placeholder="Поиск психолога..."
                  value={psychologistSearchQ}
                  onChange={e => setPsychologistSearchQ(e.target.value)}
                  autoFocus
                  style={{ paddingLeft: '1.875rem', fontSize: '0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', padding: '0.5rem 0.75rem 0.5rem 1.875rem', width: '100%', outline: 'none', background: 'white', boxSizing: 'border-box' as const }}
                />
              </div>
              {psychologistSearchLoading ? (
                <div style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Поиск...</div>
              ) : psychologistResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {psychologistSearchQ ? 'Не найдено' : 'Начните вводить имя или email'}
                </div>
              ) : (
                psychologistResults.map((p: any) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.625rem', borderRadius: '0.625rem', background: 'white', marginBottom: '0.375rem' }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {(p.name || p.email)[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name || p.email}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.email}</div>
                    </div>
                    <button
                      onClick={() => assignPsychologist(p.id)}
                      disabled={actionLoading === 'psychologist'}
                      style={{ padding: '0.3rem 0.75rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                    >
                      {actionLoading === 'psychologist' ? '...' : 'Назначить'}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meetings */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Video size={16} style={{ color: '#C28A5E' }} />
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
              Встречи ({meetings.length})
            </h2>
          </div>
          <button
            onClick={() => setShowCreateMeeting(v => !v)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.875rem', borderRadius: '0.625rem', border: `1.5px solid ${showCreateMeeting ? 'var(--primary)' : 'var(--border)'}`, background: showCreateMeeting ? 'var(--primary-light)' : 'var(--bg)', fontSize: '0.8rem', fontWeight: 600, color: showCreateMeeting ? 'var(--primary-dark)' : 'var(--text)', cursor: 'pointer' }}
          >
            <CalendarPlus size={13} /> Добавить
          </button>
        </div>

        {/* Create meeting form */}
        {showCreateMeeting && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-sage)', borderRadius: '0.875rem', border: '1px solid var(--primary-light)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.875rem' }}>Новая встреча</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Тип</label>
                <select
                  value={mForm.type}
                  onChange={e => setMForm(f => ({ ...f, type: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', background: 'white', outline: 'none' }}
                >
                  <option value="group">Групповая</option>
                  <option value="intro">Вводная</option>
                  <option value="individual">Индивидуальная</option>
                  <option value="diagnostic">Диагностика</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Длительность</label>
                <select
                  value={mForm.duration}
                  onChange={e => setMForm(f => ({ ...f, duration: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', background: 'white', outline: 'none' }}
                >
                  <option>30 мин</option>
                  <option>45 мин</option>
                  <option>60 мин</option>
                  <option>90 мин</option>
                  <option>120 мин</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '0.625rem' }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Название *</label>
              <input
                type="text"
                placeholder="Например: Встреча 1 — Знакомство"
                value={mForm.title}
                onChange={e => setMForm(f => ({ ...f, title: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', background: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Дата *</label>
                <input
                  type="date"
                  value={mForm.date}
                  min={today}
                  onChange={e => setMForm(f => ({ ...f, date: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', background: 'white', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Время *</label>
                <input
                  type="time"
                  value={mForm.time}
                  onChange={e => setMForm(f => ({ ...f, time: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', background: 'white', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Ссылка на встречу</label>
              <input
                type="url"
                placeholder="https://zoom.us/..."
                value={mForm.meetingLink}
                onChange={e => setMForm(f => ({ ...f, meetingLink: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', background: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateMeeting(false)}
                style={{ padding: '0.45rem 1rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', background: 'none', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >Отмена</button>
              <button
                onClick={createMeeting}
                disabled={mSaving || !mForm.title.trim() || !mForm.date || !mForm.time}
                style={{ padding: '0.45rem 1.25rem', borderRadius: '0.625rem', border: 'none', background: '#C28A5E', color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', opacity: (mSaving || !mForm.title.trim() || !mForm.date) ? 0.6 : 1 }}
              >
                {mSaving ? 'Создаю...' : 'Создать'}
              </button>
            </div>
          </div>
        )}

        {meetings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Встреч пока нет. Нажмите «Добавить».
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {meetings.map((m: any) => {
              const sColor = MEETING_STATUS_COLOR[m.status] ?? '#6B7280'
              const isPast = m.date < today
              return (
                <div key={m.id} style={{ padding: '0.875rem 1rem', borderRadius: '0.875rem', background: isPast ? 'var(--bg-soft)' : 'white', border: `1px solid ${isPast ? 'var(--border)' : '#E5E7EB'}`, display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '10rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>{m.title}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '9999px', padding: '0.1rem 0.5rem' }}>
                        {MEETING_TYPE_LABEL[m.type] ?? m.type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span>{fmtDate(m.date)}, {m.time}</span>
                      <span>· {m.duration}</span>
                      <span style={{ color: sColor, fontWeight: 600 }}>· {MEETING_STATUS_LABEL[m.status] ?? m.status}</span>
                    </div>
                    {m.meetingLink && (
                      <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.72rem', color: '#2563EB', textDecoration: 'none' }}>
                        <ExternalLink size={11} /> Ссылка на встречу
                      </a>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0, alignItems: 'center' }}>
                    {m.status !== 'completed' && (
                      <button
                        onClick={() => setMeetingStatus(m.id, 'completed')}
                        disabled={actionLoading === `mstatus-${m.id}`}
                        title="Отметить проведённой"
                        style={{ padding: '0.3rem 0.5rem', borderRadius: '0.5rem', border: 'none', background: '#D1FAE5', color: '#065F46', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <CheckCircle size={12} /> Провели
                      </button>
                    )}
                    {m.status === 'scheduled' && (
                      <button
                        onClick={() => setMeetingStatus(m.id, 'cancelled')}
                        disabled={actionLoading === `mstatus-${m.id}`}
                        title="Отменить"
                        style={{ padding: '0.3rem 0.5rem', borderRadius: '0.5rem', border: 'none', background: '#FEE2E2', color: '#B91C1C', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <XCircle size={12} /> Отменить
                      </button>
                    )}
                    {m.status !== 'scheduled' && (
                      <button
                        onClick={() => setMeetingStatus(m.id, 'scheduled')}
                        disabled={actionLoading === `mstatus-${m.id}`}
                        title="Вернуть в запланированные"
                        style={{ padding: '0.3rem 0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <Clock size={12} /> План
                      </button>
                    )}
                    <button
                      onClick={() => deleteMeeting(m.id)}
                      disabled={!!actionLoading}
                      title="Удалить"
                      style={{ padding: '0.3rem 0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'none', color: 'var(--text-light)', fontSize: '0.72rem', cursor: 'pointer' }}
                    >✕</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Participants */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} style={{ color: '#C28A5E' }} />
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
              Участники ({participants.length})
            </h2>
          </div>
          <button
            onClick={() => { setShowAddMember(v => !v); setSearchQ('') }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', background: showAddMember ? 'var(--primary-light)' : 'var(--bg)', fontSize: '0.8rem', fontWeight: 600, color: showAddMember ? 'var(--primary-dark)' : 'var(--text)', cursor: 'pointer', borderColor: showAddMember ? 'var(--primary)' : 'var(--border)' }}
          >
            <UserPlus size={13} /> Добавить
          </button>
        </div>

        {/* Add member panel */}
        {showAddMember && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-sage)', borderRadius: '0.875rem', border: '1px solid var(--primary-light)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.625rem' }}>Поиск пользователя</div>
            <div style={{ position: 'relative', marginBottom: '0.625rem' }}>
              <Search size={13} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="text"
                placeholder="Имя или email..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                autoFocus
                style={{ paddingLeft: '1.875rem', fontSize: '0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', padding: '0.5rem 0.75rem 0.5rem 1.875rem', width: '100%', outline: 'none', background: 'white' }}
              />
            </div>
            {searchLoading ? (
              <div style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Поиск...</div>
            ) : searchQ && searchResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Не найдено</div>
            ) : (
              searchResults.map((u: any) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.625rem', borderRadius: '0.625rem', background: 'white', marginBottom: '0.375rem' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#92400E', flexShrink: 0 }}>
                    {(u.name || u.email)[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name || u.email}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                  </div>
                  <button
                    onClick={() => addMember(u.id)}
                    disabled={actionLoading === `add-${u.id}`}
                    style={{ padding: '0.3rem 0.75rem', borderRadius: '0.5rem', border: 'none', background: '#C28A5E', color: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                  >
                    {actionLoading === `add-${u.id}` ? '...' : 'Добавить'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {participants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Участников пока нет. Нажмите «Добавить» чтобы добавить первого.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {participants.map((p: any) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.875rem', background: 'var(--bg-soft)' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#92400E', flexShrink: 0 }}>
                  {(p.name || p.email)[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    href={`/curator/clients/${p.id}`}
                    style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {p.name || p.email}
                  </Link>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <Link
                    href={`/curator/chats?with=${p.id}&name=${encodeURIComponent(p.name || p.email)}`}
                    style={{ padding: '0.3rem 0.625rem', borderRadius: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Написать
                  </Link>
                  <button
                    onClick={() => removeMember(p.id, p.name || p.email)}
                    disabled={actionLoading === `remove-${p.id}`}
                    title="Удалить из группы"
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '0.5rem', border: 'none', background: '#FEE2E2', color: '#B91C1C', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <UserMinus size={12} />
                    {actionLoading === `remove-${p.id}` ? '...' : 'Удалить'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
