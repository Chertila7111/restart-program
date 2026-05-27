'use client'

import { useState } from 'react'
import { Copy, Database, RefreshCw, Users, CreditCard, TrendingUp, Activity } from 'lucide-react'

type Stats = {
  totalUsers: number
  clients: number
  psychologists: number
  curators: number
  newUsersWeek: number
  newUsersMonth: number
  activeUsersMonth: number
  journalEntriesTotal: number
  ordersPaid: number
  ordersPending: number
  ordersRefunded: number
  revenueTotal: number
  tierNone: number
  tierIntro: number
  tierBase: number
  tierPlus: number
  tierPersonal: number
  tierClarity: number
  tierOther: number
  revenueByProduct: { product: string; productName: string; count: number; amount: number }[]
  recentOrders: { id: string; name: string; email: string; productName: string; amount: number; createdAt: string }[]
  leads: number
}

type User = {
  id: string
  name: string | null
  email: string
  role: string
  tier: string
  createdAt: string
  hasPaid: boolean
  paidProducts: string[]
}

type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  createdAt: string
}

const ROLE_LABELS: Record<string, string> = {
  user: 'Клиент',
  psychologist: 'Психолог',
  curator: 'Куратор',
  admin: 'Администратор',
}

const TIER_LABELS: Record<string, string> = {
  none: 'Без тарифа',
  intro: 'Вводная',
  base: 'Базовый',
  plus: 'Плюс',
  personal: 'Персональный',
  'clarity-start': 'Ясность',
  'clarity-deep': 'Ясность. Глубже',
  session: 'Сессия',
  career: 'Карьера',
}

function rub(kopecks: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(kopecks / 100)
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ color: color || 'var(--primary)' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>{sub}</div>}
    </div>
  )
}

function TierBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ marginBottom: '0.625rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
      </div>
      <div style={{ height: '6px', borderRadius: '9999px', background: 'var(--bg-soft)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '9999px', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

export function AdminPanel({ stats, users, leads }: { stats: Stats; users: User[]; leads: Lead[] }) {
  const [tab, setTab] = useState<'overview' | 'users' | 'payments' | 'leads'>('overview')
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
    const token = btoa(JSON.stringify({ email: inviteForm.email, name: inviteForm.name, password: inviteForm.password }))
    setInviteLink(`${window.location.origin}/auth/invite?token=${token}`)
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
    } finally { setRoleUpdating(null) }
  }

  async function initDb() {
    setDbLoading(true)
    setDbStatus(null)
    try {
      const res = await fetch('/api/admin/init-db', { method: 'POST' })
      const data = await res.json()
      setDbStatus(res.ok ? { ok: true, userCount: data.userCount } : { ok: false, error: data.error })
    } catch (e: any) {
      setDbStatus({ ok: false, error: e.message })
    } finally { setDbLoading(false) }
  }

  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'users', label: `Пользователи (${users.length})` },
    { id: 'payments', label: `Платежи (${stats.ordersPaid})` },
    { id: 'leads', label: `Заявки (${stats.leads})` },
  ] as const

  const activePaid = stats.tierBase + stats.tierPlus + stats.tierPersonal + stats.tierClarity

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Администратор</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Панель управления программой «Снова с собой»</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.75rem', borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t.id ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-2px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div>
          {/* Main stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard icon={<Users size={16} />} label="Клиентов" value={stats.clients} sub={`+${stats.newUsersMonth} за месяц`} />
            <StatCard icon={<Activity size={16} />} label="Активных (30д)" value={stats.activeUsersMonth} sub="вели дневник" color="#8B5CF6" />
            <StatCard icon={<Users size={16} />} label="Психологи / Кураторы" value={`${stats.psychologists} / ${stats.curators}`} color="#059669" />
            <StatCard icon={<TrendingUp size={16} />} label="Выручка" value={rub(stats.revenueTotal)} sub={`${stats.ordersPaid} оплат`} color="#D97706" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Tier breakdown */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Распределение по тарифам</h3>
              <TierBar label="Без тарифа" count={stats.tierNone < 0 ? 0 : stats.tierNone} total={stats.clients} color="#E5E7EB" />
              <TierBar label="Вводная встреча" count={stats.tierIntro} total={stats.clients} color="#93C5FD" />
              <TierBar label="Базовый (группа)" count={stats.tierBase} total={stats.clients} color="#6EE7B7" />
              <TierBar label="Плюс (группа+)" count={stats.tierPlus} total={stats.clients} color="#34D399" />
              <TierBar label="Персональный" count={stats.tierPersonal} total={stats.clients} color="#059669" />
              <TierBar label="Ясность (инд.)" count={stats.tierClarity} total={stats.clients} color="#8B5CF6" />
              {stats.tierOther > 0 && <TierBar label="Сессии / Карьера" count={stats.tierOther} total={stats.clients} color="#F59E0B" />}
              <div style={{ marginTop: '1rem', padding: '0.625rem 0.875rem', background: 'var(--bg-soft)', borderRadius: '0.625rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Активных платных: <strong style={{ color: 'var(--primary-dark)' }}>{activePaid}</strong> из {stats.clients}
              </div>
            </div>

            {/* Activity */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Активность</h3>
              {[
                { label: 'Новых за эту неделю', value: stats.newUsersWeek, icon: '📥' },
                { label: 'Новых за месяц', value: stats.newUsersMonth, icon: '📆' },
                { label: 'Активных (вели дневник, 30д)', value: stats.activeUsersMonth, icon: '📓' },
                { label: 'Записей в дневнике', value: stats.journalEntriesTotal, icon: '✍️' },
                { label: 'Заявок с сайта', value: stats.leads, icon: '📬' },
                { label: 'Ожидают оплаты', value: stats.ordersPending, icon: '⏳' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{item.icon} {item.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by product */}
          {stats.revenueByProduct.length > 0 && (
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '1rem' }}>Выручка по тарифам</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stats.revenueByProduct.map(p => (
                  <div key={p.product} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.625rem 0.875rem', background: 'var(--bg-soft)', borderRadius: '0.625rem' }}>
                    <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text)', fontWeight: 600 }}>{p.productName}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.count} шт.</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.9rem', minWidth: '7rem', textAlign: 'right' }}>{rub(p.amount)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Итого ({stats.ordersPaid} оплат)</span>
                  <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1rem' }}>{rub(stats.revenueTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* DB init */}
          <div className="card" style={{ padding: '1.25rem', background: '#0D1117', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <Database size={14} style={{ color: '#4ADE80' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white' }}>База данных</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(168,184,160,0.7)', margin: 0 }}>
                  Инициализирует все таблицы. Безопасно вызывать повторно.
                </p>
              </div>
              <button
                onClick={initDb} disabled={dbLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, background: '#4ADE80', color: '#0D1117', border: 'none', borderRadius: '0.625rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer' }}
              >
                <RefreshCw size={13} style={{ animation: dbLoading ? 'spin 1s linear infinite' : 'none' }} />
                {dbLoading ? 'Инициализация…' : 'Инициализировать БД'}
              </button>
            </div>
            {dbStatus && (
              <div style={{ marginTop: '0.75rem', padding: '0.625rem', borderRadius: '0.5rem', background: dbStatus.ok ? '#052e16' : '#450a0a' }}>
                {dbStatus.ok
                  ? <span style={{ fontSize: '0.78rem', color: '#4ADE80' }}>✓ Готово. Пользователей: {dbStatus.userCount}</span>
                  : <span style={{ fontSize: '0.78rem', color: '#FC8181' }}>✗ {dbStatus.error}</span>}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <a href="/dashboard/admin/meetings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.825rem' }}>
              📅 Встречи
            </a>
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div>
          {/* Invite generator */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '1rem' }}>Создать пригласительную ссылку</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {[
                { key: 'email', label: 'Email', type: 'email', placeholder: 'user@email.com' },
                { key: 'name', label: 'Имя', type: 'text', placeholder: 'Имя пользователя' },
                { key: 'password', label: 'Пароль', type: 'text', placeholder: 'Пароль' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.3rem' }}>{f.label}</label>
                  <input type={f.type} value={(inviteForm as any)[f.key]} onChange={e => setInviteForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={{ fontSize: '0.85rem' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.3rem' }}>Роль</label>
                <select value={inviteForm.role} onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))} style={{ fontSize: '0.85rem' }}>
                  <option value="user">Клиент</option>
                  <option value="psychologist">Психолог</option>
                  <option value="curator">Куратор</option>
                </select>
              </div>
            </div>
            <button onClick={generateInvite} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Сгенерировать ссылку</button>
            {inviteLink && (
              <div style={{ marginTop: '0.875rem', padding: '0.75rem', background: 'var(--bg-sage)', borderRadius: '0.625rem', border: '1px solid var(--primary-light)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>Ссылка готова</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <code style={{ flex: 1, fontSize: '0.67rem', color: 'var(--text-muted)', wordBreak: 'break-all', background: 'white', padding: '0.4rem 0.625rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>{inviteLink}</code>
                  <button onClick={() => navigator.clipboard.writeText(inviteLink)} style={{ flexShrink: 0, padding: '0.4rem 0.625rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                    <Copy size={12} /> Скопировать
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по email или имени..." style={{ flex: 1, minWidth: '14rem', fontSize: '0.85rem', padding: '0.5rem 0.875rem' }} />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ fontSize: '0.85rem', padding: '0.5rem 0.875rem', width: 'auto' }}>
              <option value="all">Все роли</option>
              <option value="user">Клиенты</option>
              <option value="psychologist">Психологи</option>
              <option value="curator">Кураторы</option>
              <option value="admin">Администраторы</option>
            </select>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{filtered.length} из {users.length}</div>

          {filtered.length === 0
            ? <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{users.length === 0 ? 'База данных недоступна' : 'Нет совпадений'}</div>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filtered.map(u => {
                  const effectiveTier = u.paidProducts.includes('personal') ? 'personal'
                    : u.paidProducts.includes('plus') ? 'plus'
                    : u.paidProducts.includes('base') ? 'base'
                    : u.paidProducts.includes('clarity-deep') ? 'clarity-deep'
                    : u.paidProducts.includes('clarity-start') ? 'clarity-start'
                    : u.paidProducts.includes('session') ? 'session'
                    : u.paidProducts.includes('career') ? 'career'
                    : u.paidProducts.includes('intro') ? 'intro' : 'none'
                  return (
                    <div key={u.id} className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: u.role === 'admin' ? '#1C2B23' : u.role === 'psychologist' ? '#3D6249' : u.role === 'curator' ? '#4338CA' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                        {(u.name || u.email)[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.name || '—'} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({u.email})</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                          {new Date(u.createdAt).toLocaleDateString('ru-RU')} · {TIER_LABELS[effectiveTier] || effectiveTier}
                          {u.hasPaid && <span style={{ marginLeft: '0.375rem', color: '#059669' }}>✓ оплачен</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: u.role === 'admin' ? '#1C2B23' : u.role === 'psychologist' ? 'var(--primary-light)' : u.role === 'curator' ? '#EEF2FF' : 'var(--bg-soft)', color: u.role === 'admin' ? 'white' : u.role === 'psychologist' ? 'var(--primary-dark)' : u.role === 'curator' ? '#4338CA' : 'var(--text-light)' }}>
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                        {u.role !== 'admin' && (
                          <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} disabled={roleUpdating === u.id} style={{ fontSize: '0.72rem', padding: '0.2rem 0.4rem', width: 'auto', borderRadius: '0.5rem' }}>
                            <option value="user">Клиент</option>
                            <option value="psychologist">Психолог</option>
                            <option value="curator">Куратор</option>
                          </select>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {tab === 'payments' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard icon={<CreditCard size={16} />} label="Оплачено" value={stats.ordersPaid} color="#059669" />
            <StatCard icon={<CreditCard size={16} />} label="Ожидают оплаты" value={stats.ordersPending} color="#D97706" />
            <StatCard icon={<CreditCard size={16} />} label="Возвраты" value={stats.ordersRefunded} color="#DC2626" />
          </div>
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.125rem', color: 'var(--text)' }}>Итого выручка</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{rub(stats.revenueTotal)}</div>
          </div>

          <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.75rem' }}>Последние оплаты</h3>
          {stats.recentOrders.length === 0
            ? <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Оплат пока нет</div>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stats.recentOrders.map(o => (
                  <div key={o.id} className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{o.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.email} · {o.productName}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.9rem' }}>{rub(o.amount)}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{new Date(o.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {/* ── LEADS ── */}
      {tab === 'leads' && (
        <div>
          {leads.length === 0
            ? <div className="card" style={{ padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Заявок пока нет</div>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {leads.map(lead => (
                  <div key={lead.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{lead.name}</span>
                        {' · '}
                        <a href={`mailto:${lead.email}`} style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>{lead.email}</a>
                        {lead.phone && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{lead.phone}</span>}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                        {new Date(lead.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {lead.message && (
                      <p style={{ margin: '0 0 0.625rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, background: 'var(--bg-soft)', padding: '0.625rem 0.875rem', borderRadius: '0.5rem' }}>
                        {lead.message}
                      </p>
                    )}
                    <a href={`mailto:${lead.email}?subject=Ответ на вашу заявку`} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Ответить →
                    </a>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}
    </div>
  )
}
