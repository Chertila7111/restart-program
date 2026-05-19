import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { MessageCircle, UserX, Wifi, WifiOff, Calendar, CreditCard, Users } from 'lucide-react'

const TIER_LABEL: Record<string, string> = {
  intro: 'Вводная', base: 'Base', plus: 'Plus', 'plus-pro': 'Plus Pro', personal: 'Personal', none: 'Нет тарифа',
}
const TIER_COLOR: Record<string, string> = {
  intro: '#6B7280', base: '#4E7B5E', plus: '#3D6249', 'plus-pro': '#2D5A3D', personal: '#C28A5E', none: '#9CA3AF',
}

function onlineStatus(lastSeenAt: string | null): { label: string; color: string; isOnline: boolean } {
  if (!lastSeenAt) return { label: 'Не заходил(а)', color: '#9CA3AF', isOnline: false }
  const diff = Date.now() - new Date(lastSeenAt).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 5) return { label: 'Онлайн', color: '#10B981', isOnline: true }
  if (min < 60) return { label: `${min} мин назад`, color: '#6B7280', isOnline: false }
  const hours = Math.floor(min / 60)
  if (hours < 24) return { label: `${hours} ч назад`, color: '#6B7280', isOnline: false }
  const days = Math.floor(hours / 24)
  return { label: `${days} дн назад`, color: '#9CA3AF', isOnline: false }
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function CuratorClientsPage() {
  const session = await getServerSession(authOptions)
  const curatorId = (session?.user as any)?.id as string
  const role = (session?.user as any)?.role as string

  let clients: any[] = []
  let doctors: any[] = []

  try {
    await ensureDb()

    const raw = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, u.createdAt, u.lastSeenAt,
             COALESCE(o.product, 'none') as product,
             o.paidAt,
             g.title as groupTitle, g.currentWeek,
             COALESCE(b.bookingCount, 0) as bookingCount
      FROM "User" u
      LEFT JOIN (
        SELECT userId, product, status, createdAt as paidAt FROM "Order"
        WHERE status = 'paid'
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
    clients = Array.isArray(raw) ? raw : []

    // Fetch doctors (psychologists)
    const rawDocs = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, u.lastSeenAt,
             pp.speciality, pp.experience, pp.bio
      FROM "User" u
      LEFT JOIN "PsychologistProfile" pp ON pp.userId = u.id
      WHERE u.role = 'psychologist'
      ORDER BY u.name
    `)
    doctors = Array.isArray(rawDocs) ? rawDocs : []
  } catch { /* DB not ready */ }

  return (
    <div style={{ maxWidth: '52rem' }}>
      {/* ── Clients ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Мои участники</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{clients.length} активных участников</p>
        </div>

        {clients.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <UserX size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Участников пока нет</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Участники появятся после того как администратор добавит вас как куратора в группу.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {clients.map((c: any) => {
              const tier = c.product || 'none'
              const os = onlineStatus(c.lastSeenAt)
              return (
                <div key={c.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    {/* Avatar + online dot */}
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

                    {/* Right info block */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem', flexShrink: 0 }}>
                      {/* Tier badge */}
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: TIER_COLOR[tier] || '#6B7280', background: tier === 'none' ? '#F3F4F6' : '#FEF3C7', padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>
                        {TIER_LABEL[tier] || tier}
                      </span>
                      {/* Online status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: os.color }}>
                        {os.isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                        {os.label}
                      </div>
                    </div>
                  </div>

                  {/* Extra stats row */}
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <CreditCard size={12} style={{ color: 'var(--primary)' }} />
                      <span>Оплачено: <strong style={{ color: 'var(--text)' }}>{fmtDate(c.paidAt)}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Calendar size={12} style={{ color: 'var(--primary)' }} />
                      <span>Созвонов: <strong style={{ color: 'var(--text)' }}>{c.bookingCount}</strong></span>
                    </div>
                    <Link href={`/curator/chats?with=${c.id}&name=${encodeURIComponent(c.name || c.email)}`} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#C28A5E', fontWeight: 600, textDecoration: 'none' }}>
                      <MessageCircle size={13} /> Написать
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Doctors / Specialists ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Users size={16} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Специалисты программы</h2>
        </div>
        {doctors.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Специалисты не найдены.</p>
        ) : (
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary-dark)', background: 'var(--primary-light)', padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>Психолог</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: os.color }}>
                      {os.isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                      {os.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
