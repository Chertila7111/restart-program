import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { Calendar, Users, User, Video, ExternalLink } from 'lucide-react'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

type DayEvents = {
  date: string
  items: Array<{
    type: 'booking' | 'group'
    time: string
    title: string
    subtitle: string
    link?: string
    color: string
  }>
}

export default async function SpecialistCalendarPage() {
  const session = await getServerSession(authOptions)
  const specialistId = (session?.user as any)?.id as string

  const month = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

  let dayMap: Record<string, DayEvents['items']> = {}

  try {
    await ensureDb()

    // Individual bookings (slots)
    const slots = await (prisma as any).$queryRawUnsafe(`
      SELECT s.startAt, s.durationMin, s.isBooked,
             b.status as bookingStatus,
             u.name as userName, u.email as userEmail
      FROM "AvailableSlot" s
      LEFT JOIN "Booking" b ON b.slotId = s.id
      LEFT JOIN "User" u ON u.id = b.userId
      WHERE s.doctorId = ? AND s.startAt > datetime('now', '-1 day')
      ORDER BY s.startAt ASC
      LIMIT 60
    `, specialistId)

    if (Array.isArray(slots)) {
      for (const s of slots) {
        const dateKey = s.startAt.slice(0, 10)
        if (!dayMap[dateKey]) dayMap[dateKey] = []
        dayMap[dateKey].push({
          type: 'booking',
          time: fmtTime(s.startAt),
          title: s.isBooked ? (s.userName || s.userEmail || 'Участник') : 'Свободный слот',
          subtitle: `${s.durationMin} мин · ${s.isBooked ? (s.bookingStatus === 'confirmed' ? 'Подтверждена' : s.bookingStatus) : 'Доступен'}`,
          color: s.isBooked ? '#2563EB' : '#6B7280',
        })
      }
    }

    // Group meetings (where specialist is psychologist)
    const meetings = await (prisma as any).$queryRawUnsafe(`
      SELECT m.id, m.type, m.title, m.date, m.time, m.duration, m.meetingLink, m.status,
             g.title as groupTitle
      FROM "Meeting" m
      JOIN "Group" g ON g.id = m.groupId
      WHERE g.psychologistId = ? AND m.date >= date('now', '-1 day')
      ORDER BY m.date ASC, m.time ASC
      LIMIT 60
    `, specialistId)

    if (Array.isArray(meetings)) {
      for (const m of meetings) {
        const dateKey = m.date
        if (!dayMap[dateKey]) dayMap[dateKey] = []
        dayMap[dateKey].push({
          type: 'group',
          time: m.time,
          title: m.title,
          subtitle: `Группа «${m.groupTitle}» · ${m.duration}`,
          link: m.meetingLink || undefined,
          color: '#C28A5E',
        })
      }
    }
  } catch { /* DB not ready */ }

  const days = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Календарь</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'capitalize' }}>{month}</p>
      </div>

      {days.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Calendar size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '24rem', margin: '0 auto 1rem' }}>
            Встречи появятся здесь, когда участники запишутся через ваши слоты или куратор назначит групповые встречи.
          </p>
          <Link href="/specialist/availability" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1.25rem', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            Добавить слоты
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {days.map(([dateKey, items]) => (
            <div key={dateKey}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
                {fmtDate(dateKey)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {items.sort((a, b) => a.time.localeCompare(b.time)).map((item, i) => (
                  <div key={i} className="card" style={{ padding: '0.875rem 1.125rem', display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                    <div style={{ width: '3.5rem', flexShrink: 0, textAlign: 'center', paddingTop: '0.1rem' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: item.color }}>{item.time}</div>
                    </div>
                    <div style={{ width: '1px', background: item.color, alignSelf: 'stretch', flexShrink: 0, borderRadius: '9999px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        {item.type === 'group'
                          ? <Users size={13} style={{ color: item.color, flexShrink: 0 }} />
                          : <User size={13} style={{ color: item.color, flexShrink: 0 }} />
                        }
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>{item.title}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.subtitle}</div>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.3rem', fontSize: '0.72rem', color: '#2563EB', textDecoration: 'none' }}>
                          <Video size={11} /> Ссылка на встречу
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
