import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { ArrowLeft, Users, Calendar, CheckCircle, Clock, Video } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  recruiting: 'Набор', active: 'Активна', completed: 'Завершена',
}
const STATUS_COLOR: Record<string, string> = {
  recruiting: '#D97706', active: '#059669', completed: '#6B7280',
}
const MTG_STATUS: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Запланирована', color: '#2563EB' },
  completed:  { label: 'Проведена',    color: '#059669' },
  cancelled:  { label: 'Отменена',     color: '#B91C1C' },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtTime(d: string, t: string) {
  return `${d} · ${t} МСК`
}

export default async function SpecialistGroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const { groupId } = await params

  let group: any = null
  let participants: any[] = []
  let meetings: any[] = []

  try {
    await ensureDb()

    const rows = await (prisma as any).$queryRawUnsafe(`
      SELECT g.id, g.title, g.status, g.currentWeek, g.startDate,
             COUNT(gp.id) as participantCount
      FROM "Group" g
      LEFT JOIN "GroupParticipant" gp ON gp.groupId = g.id AND gp.status = 'active'
      WHERE g.id = ?
      GROUP BY g.id
    `, groupId) as any[]

    if (!rows?.length) notFound()
    group = rows[0]

    participants = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, gp.status, gp.joinedAt
      FROM "GroupParticipant" gp
      JOIN "User" u ON u.id = gp.userId
      WHERE gp.groupId = ?
      ORDER BY gp.joinedAt ASC
    `, groupId) as any[]

    meetings = await (prisma as any).$queryRawUnsafe(`
      SELECT id, title, date, time, duration, meetingLink, status, type
      FROM "Meeting"
      WHERE groupId = ?
      ORDER BY date ASC, time ASC
    `, groupId) as any[]

  } catch { notFound() }

  if (!group) notFound()

  const active = participants.filter((p: any) => p.status === 'active')
  const upcoming = meetings.filter((m: any) => m.status === 'scheduled')
  const past = meetings.filter((m: any) => m.status !== 'scheduled')

  return (
    <div style={{ maxWidth: '52rem' }}>
      <Link href="/specialist/groups" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.825rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Все группы
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>{group.title}</h1>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: STATUS_COLOR[group.status] ?? '#6B7280', background: `${STATUS_COLOR[group.status] ?? '#6B7280'}18`, padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>
            {STATUS_LABEL[group.status] ?? group.status}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
          Неделя {group.currentWeek} из 4
          {group.startDate ? ` · Старт: ${fmtDate(group.startDate)}` : ''}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Участников', value: active.length, icon: Users },
          { label: 'Встреч всего', value: meetings.length, icon: Calendar },
          { label: 'Предстоящих', value: upcoming.length, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <Icon size={18} style={{ color: 'var(--primary)', margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming meetings */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={15} style={{ color: '#2563EB' }} /> Предстоящие встречи
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {upcoming.map((m: any) => (
              <div key={m.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', borderLeft: '4px solid #2563EB' }}>
                <div style={{ flex: 1, minWidth: '10rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.2rem' }}>{m.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fmtTime(m.date, m.time)} · {m.duration}</div>
                </div>
                {m.meetingLink && (
                  <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.875rem', borderRadius: '0.625rem', background: 'var(--primary)', color: 'white', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                    <Video size={13} /> Войти
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participants */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={15} style={{ color: 'var(--primary)' }} /> Участники ({active.length})
        </h2>
        {active.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Участники ещё не добавлены</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {active.map((p: any) => (
              <Link key={p.id} href={`/specialist/clients/${p.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
                      {(p.name || p.email)?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{p.name || p.email}</div>
                    {p.name && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.email}</div>}
                  </div>
                  <CheckCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Past meetings */}
      {past.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} style={{ color: '#6B7280' }} /> Прошедшие встречи ({past.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {past.map((m: any) => {
              const st = MTG_STATUS[m.status] ?? { label: m.status, color: '#6B7280' }
              return (
                <div key={m.id} className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{m.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fmtTime(m.date, m.time)}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: st.color, border: `1px solid ${st.color}`, borderRadius: '9999px', padding: '0.15rem 0.5rem', flexShrink: 0 }}>
                    {st.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {meetings.length === 0 && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <Calendar size={32} style={{ color: 'var(--text-light)', margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Встречи ещё не назначены. Куратор добавит расписание.</p>
        </div>
      )}
    </div>
  )
}
