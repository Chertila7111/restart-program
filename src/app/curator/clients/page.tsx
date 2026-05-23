import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { MessageCircle, UserX, Wifi, WifiOff, Calendar, CreditCard, Users, Clock } from 'lucide-react'
import { CuratorStatusActions } from '@/components/curator/CuratorStatusActions'

const TIER_LABEL: Record<string, string> = {
  intro: 'Вводная', base: 'Base', plus: 'Plus', personal: 'Персональный', none: '—',
}
const TIER_COLOR: Record<string, string> = {
  intro: '#6B7280', base: '#4E7B5E', plus: '#3D6249', personal: '#C28A5E', none: '#9CA3AF',
}
const STATUS_LABEL: Record<string, string> = {
  lead:             'Зарегистрирован',
  intro_paid:       'Вводная оплачена',
  intro_scheduled:  'Встреча назначена',
  intro_completed:  'Вводная прошла',
  waiting_group:    'Ожидает группу',
  in_group:         'В группе',
  individual:       'Индивидуальный',
  completed:        'Завершил(а)',
}

function onlineStatus(lastSeenAt: string | null) {
  if (!lastSeenAt) return { label: 'Не заходил(а)', color: '#9CA3AF', isOnline: false }
  const diff = Date.now() - new Date(lastSeenAt).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 5)  return { label: 'Онлайн',          color: '#10B981', isOnline: true }
  if (min < 60) return { label: `${min} мин назад`, color: '#6B7280', isOnline: false }
  const hours = Math.floor(min / 60)
  if (hours < 24) return { label: `${hours} ч назад`, color: '#6B7280', isOnline: false }
  return { label: `${Math.floor(hours / 24)} дн назад`, color: '#9CA3AF', isOnline: false }
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ClientCard({ c, role }: { c: any; role: string }) {
  const tier = c.tier || c.product || 'none'
  const os = onlineStatus(c.lastSeenAt)
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#92400E' }}>
            {(c.name || c.email)[0].toUpperCase()}
          </div>
          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: os.color, border: '2px solid white' }} />
        </div>

        {/* Name + email + group */}
        <div style={{ flex: 1, minWidth: '10rem' }}>
          <Link href={`/curator/clients/${c.id}`} style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', textDecoration: 'none', display: 'block', marginBottom: '0.1rem' }}>
            {c.name || '—'}
          </Link>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{c.email}</div>
          {c.groupTitle && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
              {c.groupTitle} · Неделя {c.currentWeek}/4
            </div>
          )}
        </div>

        {/* Tier badge + online */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: TIER_COLOR[tier] || '#6B7280', background: tier === 'none' ? '#F3F4F6' : '#FEF3C7', padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>
            {TIER_LABEL[tier] || tier}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: os.color }}>
            {os.isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            {os.label}
          </div>
        </div>
      </div>

      {/* Status + actions row */}
      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
        <CuratorStatusActions userId={c.id} currentStatus={c.status || 'lead'} />
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <CreditCard size={12} style={{ color: 'var(--primary)' }} />
          <span>Оплачено: <strong style={{ color: 'var(--text)' }}>{fmtDate(c.paidAt)}</strong></span>
        </div>
        {c.bookingCount !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Calendar size={12} style={{ color: 'var(--primary)' }} />
            <span>Созвонов: <strong style={{ color: 'var(--text)' }}>{c.bookingCount}</strong></span>
          </div>
        )}
        <Link href={`/curator/chats?with=${c.id}&name=${encodeURIComponent(c.name || c.email)}`} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#C28A5E', fontWeight: 600, textDecoration: 'none' }}>
          <MessageCircle size={13} /> Написать
        </Link>
      </div>
    </div>
  )
}

export default async function CuratorClientsPage() {
  const session = await getServerSession(authOptions)
  const curatorId = (session?.user as any)?.id as string
  const role      = (session?.user as any)?.role as string

  let activeClients:  any[] = []
  let pendingClients: any[] = []
  let doctors:        any[] = []

  try {
    await ensureDb()

    // ── Active: users in curator's groups ──
    const rawActive = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, u.createdAt, u.lastSeenAt,
             COALESCE(u.tier, 'none') as tier,
             COALESCE(u.status, 'lead') as status,
             COALESCE(o.product, 'none') as product,
             o.paidAt,
             g.title as groupTitle, g.currentWeek,
             COALESCE(b.bookingCount, 0) as bookingCount
      FROM "User" u
      LEFT JOIN (
        SELECT userId, product, status, createdAt as paidAt FROM "Order"
        WHERE status IN ('paid','paid_email_failed')
        GROUP BY userId
      ) o ON o.userId = u.id
      JOIN "GroupParticipant" gp ON gp.userId = u.id AND gp.status = 'active'
      JOIN "Group" g ON g.id = gp.groupId AND ${role === 'admin' ? '1=1' : 'g.curatorId = ?'}
      LEFT JOIN (
        SELECT userId, COUNT(*) as bookingCount FROM "Booking" GROUP BY userId
      ) b ON b.userId = u.id
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY u.createdAt DESC
    `, ...(role === 'admin' ? [] : [curatorId]))
    activeClients = Array.isArray(rawActive) ? rawActive : []

    // ── Pending: users with paid orders but no active group ──
    const rawPending = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, u.createdAt, u.lastSeenAt,
             COALESCE(u.tier, 'none') as tier,
             COALESCE(u.status, 'lead') as status,
             o.product, o.paidAt
      FROM "User" u
      JOIN (
        SELECT userId, product, createdAt as paidAt FROM "Order"
        WHERE status IN ('paid','paid_email_failed')
        GROUP BY userId
      ) o ON o.userId = u.id
      LEFT JOIN "GroupParticipant" gp ON gp.userId = u.id AND gp.status = 'active'
      WHERE u.role = 'user' AND gp.id IS NULL
        AND u.status IN ('lead','intro_paid','intro_scheduled','intro_completed','waiting_group')
      ORDER BY o.paidAt DESC
    `)
    pendingClients = Array.isArray(rawPending) ? rawPending : []

    // ── Doctors ──
    const rawDocs = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, u.lastSeenAt, pp.speciality, pp.experience
      FROM "User" u
      LEFT JOIN "PsychologistProfile" pp ON pp.userId = u.id
      WHERE u.role = 'psychologist'
      ORDER BY u.name
    `)
    doctors = Array.isArray(rawDocs) ? rawDocs : []
  } catch { /* DB not ready */ }

  return (
    <div style={{ maxWidth: '52rem' }}>

      {/* ── Pending (unassigned) clients ── */}
      {pendingClients.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock size={16} style={{ color: '#D97706' }} />
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>
              Ожидают распределения
            </h2>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#FEF3C7', color: '#92400E', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
              {pendingClients.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingClients.map((c: any) => (
              <ClientCard key={c.id} c={c} role={role} />
            ))}
          </div>
        </div>
      )}

      {/* ── Active clients (in groups) ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Мои участники</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{activeClients.length} в группах</p>
        </div>

        {activeClients.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <UserX size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Участников пока нет</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Участники появятся после добавления в группу.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeClients.map((c: any) => (
              <ClientCard key={c.id} c={c} role={role} />
            ))}
          </div>
        )}
      </div>

      {/* ── Doctors ── */}
      {doctors.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Users size={16} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>Специалисты программы</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {doctors.map((d: any) => {
              const os = onlineStatus(d.lastSeenAt)
              return (
                <div key={d.id} className="card" style={{ padding: '1.125rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                      {(d.name || d.email)[0].toUpperCase()}
                    </div>
                    <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: os.color, border: '2px solid white' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.1rem' }}>{d.name || d.email}</div>
                    {d.speciality && <div style={{ fontSize: '0.78rem', color: 'var(--primary-dark)', fontWeight: 600, marginBottom: '0.15rem' }}>{d.speciality}</div>}
                    {d.experience && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.experience}</div>}
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary-dark)', background: 'var(--primary-light)', padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>Психолог</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
