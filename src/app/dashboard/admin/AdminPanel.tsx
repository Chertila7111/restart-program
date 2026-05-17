'use client'

import { useState } from 'react'
import { Copy, Database, RefreshCw } from 'lucide-react'

type User = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  hasPaid: boolean
  tier: string
}

const ROLE_LABELS: Record<string, string> = {
  user: 'Участник',
  psychologist: 'Психолог',
  admin: 'Администратор',
}

const TIER_LABELS: Record<string, string> = {
  none: 'Без тарифа',
  intro: 'Вводная',
  base: 'Базовый',
  plus: 'Плюс',
  personal: 'Персональный',
}

function makeInviteLink(email: string, name: string, password: string) {
  const token = btoa(JSON.stringify({ email, name, password }))
  return `${window.location.origin}/auth/invite?token=${token}`
}

export function AdminPanel({ users }: { users: User[] }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [inviteForm, setInviteForm] = useState({ email: '', name: '', password: 'Snova2026', role: 'user' })
  const [inviteLink, setInviteLink] = useState('')
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null)
  const [dbStatus, setDbStatus] = useState<{ ok: boolean; userCount?: number; error?: string } | null>(null)
  const [dbLoading, setDbLoading] = useState(false)

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q || u.email.includes(q) || (u.name?.toLowerCase().includes(q) ?? false)
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  function generateInvite() {
    if (!inviteForm.email || !inviteForm.name) return
    const link = makeInviteLink(inviteForm.email, inviteForm.name, inviteForm.password)
    setInviteLink(link)
  }

  async function copyLink(text: string) {
    await navigator.clipboard.writeText(text).catch(() => {})
  }

  async function changeRole(userId: string, newRole: string) {
    setRoleUpdating(userId)
    try {
      const res = await fetch('/api/admin/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (res.ok) window.location.reload()
    } finally {
      setRoleUpdating(null)
    }
  }

  async function initDb() {
    setDbLoading(true)
    setDbStatus(null)
    try {
      const res = await fetch('/api/admin/init-db', { method: 'POST' })
      const data = await res.json()
      if (res.ok) setDbStatus({ ok: true, userCount: data.userCount })
      else setDbStatus({ ok: false, error: data.error })
    } catch (e: any) {
      setDbStatus({ ok: false, error: e.message })
    } finally {
      setDbLoading(false)
    }
  }

  return (
    <div>
      {/* DB init */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#0D1117', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Database size={15} style={{ color: '#4ADE80' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>База данных</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(168,184,160,0.7)', margin: 0, lineHeight: 1.5 }}>
              Инициализирует все таблицы и создаёт аккаунт психолога (doctor@snova-s-soboy.ru).
              Безопасно вызывать повторно — использует IF NOT EXISTS.
            </p>
          </div>
          <button
            onClick={initDb}
            disabled={dbLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
              background: '#4ADE80', color: '#0D1117', border: 'none', borderRadius: '0.625rem',
              padding: '0.625rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} style={{ animation: dbLoading ? 'spin 1s linear infinite' : 'none' }} />
            {dbLoading ? 'Инициализация…' : 'Инициализировать БД'}
          </button>
        </div>
        {dbStatus && (
          <div style={{ marginTop: '0.875rem', padding: '0.75rem', borderRadius: '0.5rem', background: dbStatus.ok ? '#052e16' : '#450a0a' }}>
            {dbStatus.ok
              ? <span style={{ fontSize: '0.8rem', color: '#4ADE80' }}>✓ Готово. Пользователей в БД: {dbStatus.userCount}</span>
              : <span style={{ fontSize: '0.8rem', color: '#FC8181' }}>✗ Ошибка: {dbStatus.error}</span>
            }
          </div>
        )}
      </div>

      {/* Invite generator */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
          Создать пригласительную ссылку
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>Email</label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
              placeholder="user@email.com"
              style={{ fontSize: '0.875rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>Имя</label>
            <input
              value={inviteForm.name}
              onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Имя пользователя"
              style={{ fontSize: '0.875rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>Пароль</label>
            <input
              value={inviteForm.password}
              onChange={e => setInviteForm(p => ({ ...p, password: e.target.value }))}
              style={{ fontSize: '0.875rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>Роль</label>
            <select
              value={inviteForm.role}
              onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))}
              style={{ fontSize: '0.875rem' }}
            >
              <option value="user">Участник</option>
              <option value="psychologist">Психолог</option>
            </select>
          </div>
        </div>

        <button onClick={generateInvite} className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}>
          Сгенерировать ссылку
        </button>

        {inviteLink && (
          <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'var(--bg-sage)', borderRadius: '0.75rem', border: '1px solid var(--primary-light)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Ссылка готова</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <code style={{ flex: 1, fontSize: '0.7rem', color: 'var(--text-muted)', wordBreak: 'break-all', background: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                {inviteLink}
              </code>
              <button
                onClick={() => copyLink(inviteLink)}
                style={{ flexShrink: 0, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                <Copy size={13} /> Скопировать
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User list */}
      <div>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по email или имени..."
            style={{ flex: 1, minWidth: '14rem', fontSize: '0.875rem', padding: '0.5rem 0.875rem' }}
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{ fontSize: '0.875rem', padding: '0.5rem 0.875rem', width: 'auto' }}
          >
            <option value="all">Все роли</option>
            <option value="user">Участники</option>
            <option value="psychologist">Психологи</option>
            <option value="admin">Администраторы</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            {users.length === 0 ? 'База данных недоступна или пуста' : 'Нет совпадений'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filtered.map(u => (
              <div key={u.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: u.role === 'admin' ? '#1C2B23' : u.role === 'psychologist' ? '#3D6249' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                  {(u.name || u.email)[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.name || '—'} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({u.email})</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                    {new Date(u.createdAt).toLocaleDateString('ru-RU')} · {TIER_LABELS[u.tier] || u.tier}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px',
                    background: u.role === 'admin' ? '#1C2B23' : u.role === 'psychologist' ? 'var(--primary-light)' : 'var(--bg-soft)',
                    color: u.role === 'admin' ? 'white' : u.role === 'psychologist' ? 'var(--primary-dark)' : 'var(--text-light)',
                  }}>
                    {ROLE_LABELS[u.role] || u.role}
                  </span>
                  {u.role !== 'admin' && (
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}
                      disabled={roleUpdating === u.id}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', width: 'auto', borderRadius: '0.5rem' }}
                    >
                      <option value="user">Участник</option>
                      <option value="psychologist">Психолог</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
