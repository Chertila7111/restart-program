import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { Calendar, CheckCircle, Clock, User } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Подтверждена',
  cancelled: 'Отменена',
  completed: 'Проведена',
}
const STATUS_COLOR: Record<string, string> = {
  confirmed: '#2563EB',
  cancelled: '#B91C1C',
  completed: '#059669',
}

function fmtDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export default async function SessionsPage() {
  const session = await getServerSession(authOptions)
  const specialistId = (session?.user as any)?.id as string

  let upcoming: any[] = []
  let past: any[] = []

  try {
    await ensureDb()
    const rows = await (prisma as any).$queryRawUnsafe(`
      SELECT b.id, b.status, b.notes, b.createdAt,
             s.startAt, s.durationMin,
             u.id as userId, u.name as userName, u.email as userEmail
      FROM "Booking" b
      JOIN "AvailableSlot" s ON s.id = b.slotId
      JOIN "User" u ON u.id = b.userId
      WHERE s.doctorId = ?
      ORDER BY s.startAt DESC
    `, specialistId)
    const all = Array.isArray(rows) ? rows : []
    const now = new Date().toISOString()
    upcoming = all.filter((b: any) => b.startAt >= now).reverse()
    past = all.filter((b: any) => b.startAt < now)
  } catch { /* DB not ready */ }

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Индивидуальные встречи</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Записи участников на ваши слоты</p>
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Calendar size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '22rem', margin: '0 auto 1rem' }}>
            Встреч пока нет. Участники смогут записаться через ваши слоты.
          </p>
          <Link href="/specialist/availability" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1.25rem', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            Управление слотами
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={15} style={{ color: '#2563EB' }} /> Предстоящие ({upcoming.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {upcoming.map((b: any) => (
                  <div key={b.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={14} style={{ color: '#2563EB' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: '10rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>
                        {b.userName || b.userEmail}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {fmtDateTime(b.startAt)} · {b.durationMin} мин
                      </div>
                      {b.notes && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                          {b.notes}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: STATUS_COLOR[b.status] || '#6B7280', border: `1px solid ${STATUS_COLOR[b.status] || '#6B7280'}`, borderRadius: '9999px', padding: '0.15rem 0.625rem', flexShrink: 0 }}>
                      {STATUS_LABEL[b.status] || b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={15} style={{ color: '#6B7280' }} /> Прошедшие ({past.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {past.map((b: any) => (
                  <div key={b.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', opacity: 0.8 }}>
                    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: '10rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>
                        {b.userName || b.userEmail}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {fmtDateTime(b.startAt)} · {b.durationMin} мин
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', flexShrink: 0 }}>
                      {STATUS_LABEL[b.status] || b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
