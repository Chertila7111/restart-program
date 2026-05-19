'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, UserPlus, UserMinus, Search, Loader2 } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'recruiting', label: 'Набор',     color: '#3B82F6' },
  { value: 'active',     label: 'Активна',   color: '#059669' },
  { value: 'completed',  label: 'Завершена', color: '#6B7280' },
]

export default function GroupDetailPage() {
  const params = useParams()
  const groupId = params.groupId as string

  const [group, setGroup] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddMember, setShowAddMember] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/curator/groups/${groupId}`)
      if (!r.ok) { setError('Группа не найдена или нет доступа'); return }
      const d = await r.json()
      setGroup(d.group)
      setParticipants(d.participants)
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

  async function patch(body: object): Promise<boolean> {
    const r = await fetch(`/api/curator/groups/${groupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
          {group.psychologistName && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Психолог: {group.psychologistName}</div>
          )}
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
                  padding: '0.375rem 0.875rem', borderRadius: '0.625rem', fontSize: '0.8rem', fontWeight: 600, cursor: group.status === s.value ? 'default' : 'pointer',
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
        <div>
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
