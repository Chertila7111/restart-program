import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { Users, ArrowRight, Plus } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  recruiting: 'Набор',
  active: 'Активна',
  completed: 'Завершена',
}
const STATUS_COLOR: Record<string, string> = {
  recruiting: '#D97706',
  active: '#059669',
  completed: '#6B7280',
}

export default async function SpecialistGroupsPage() {
  const session = await getServerSession(authOptions)
  const specialistId = (session?.user as any)?.id as string

  let groups: any[] = []
  try {
    await ensureDb()
    const raw = await (prisma as any).$queryRawUnsafe(
      `SELECT g.id, g.title, g.startDate, g.status, g.currentWeek,
              COUNT(gp.id) as participantCount
       FROM "Group" g
       LEFT JOIN "GroupParticipant" gp ON gp.groupId = g.id AND gp.status = 'active'
       WHERE g.psychologistId = ?
       GROUP BY g.id
       ORDER BY g.createdAt DESC`,
      specialistId
    )
    groups = Array.isArray(raw) ? raw : []
  } catch { /* DB not ready */ }

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Мои группы</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Группы, где вы ведёте встречи</p>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Users size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Групп пока нет</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '24rem', margin: '0 auto' }}>
            Администратор назначит вас в группу. После этого здесь появятся участники, расписание и дневники.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {groups.map((g: any) => (
            <Link key={g.id} href={`/specialist/groups/${g.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Users size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{g.title}</div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>{g.participantCount} участников</span>
                    <span>Неделя {g.currentWeek} из 4</span>
                    {g.startDate && (
                      <span>Старт: {new Date(g.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: STATUS_COLOR[g.status] ?? '#6B7280', background: `${STATUS_COLOR[g.status] ?? '#6B7280'}15`, padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>
                    {STATUS_LABEL[g.status] ?? g.status}
                  </span>
                  <ArrowRight size={16} style={{ color: 'var(--text-light)' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
