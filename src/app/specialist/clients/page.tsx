import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { User, ArrowRight, Filter } from 'lucide-react'

export default async function SpecialistClientsPage() {
  const session = await getServerSession(authOptions)
  const specialistId = (session?.user as any)?.id as string

  let clients: any[] = []
  try {
    await ensureDb()
    // Participants in this specialist's groups
    const raw = await (prisma as any).$queryRawUnsafe(`
      SELECT DISTINCT u.id, u.name, u.email, u.image,
             gp.diaryAccessGranted, gp.status as participantStatus,
             g.title as groupTitle, g.currentWeek,
             (SELECT date FROM "JournalEntry" WHERE userId = u.id ORDER BY createdAt DESC LIMIT 1) as lastJournalDate,
             (SELECT mood FROM "JournalEntry" WHERE userId = u.id ORDER BY createdAt DESC LIMIT 1) as lastMood
      FROM "GroupParticipant" gp
      JOIN "User" u ON u.id = gp.userId
      JOIN "Group" g ON g.id = gp.groupId
      WHERE g.psychologistId = ?
      ORDER BY u.name ASC
    `, specialistId)
    clients = Array.isArray(raw) ? raw : []
  } catch { /* DB not ready */ }

  return (
    <div style={{ maxWidth: '56rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Участники</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Все закреплённые за вами участники</p>
      </div>

      {clients.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <User size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Участников пока нет</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '22rem', margin: '0 auto' }}>
            Участники появятся здесь, когда администратор добавит их в ваши группы.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {clients.map((c: any) => {
            const moodScore = c.lastMood
            const moodColor = moodScore <= 3 ? '#DC2626' : moodScore <= 5 ? '#D97706' : '#059669'
            const initials = c.name
              ? c.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
              : c.email[0].toUpperCase()

            return (
              <Link key={c.id} href={`/specialist/clients/${c.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700, color: 'white', overflow: 'hidden' }}>
                    {c.image ? <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" /> : initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.15rem' }}>
                      {c.name || c.email}
                    </div>
                    <div style={{ display: 'flex', gap: '0.875rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{c.groupTitle} · Неделя {c.currentWeek}</span>
                      {c.diaryAccessGranted ? (
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Дневник открыт</span>
                      ) : (
                        <span>Дневник закрыт</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    {moodScore != null && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: moodColor }}>{moodScore}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-light)' }}>состояние</div>
                      </div>
                    )}
                    {c.lastJournalDate && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(c.lastJournalDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-light)' }}>дневник</div>
                      </div>
                    )}
                    <ArrowRight size={15} style={{ color: 'var(--text-light)' }} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
