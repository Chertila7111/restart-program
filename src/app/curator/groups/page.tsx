import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { Users2 } from 'lucide-react'
import { CreateGroupButton } from '@/components/curator/CreateGroupButton'

const STATUS_LABEL: Record<string, string> = {
  recruiting: 'Набор', active: 'Активна', completed: 'Завершена',
}
const STATUS_COLOR: Record<string, string> = {
  recruiting: '#3B82F6', active: '#059669', completed: '#6B7280',
}

export default async function CuratorGroupsPage() {
  const session = await getServerSession(authOptions)
  const curatorId = (session?.user as any)?.id as string
  const role = (session?.user as any)?.role as string

  let groups: any[] = []

  try {
    await ensureDb()
    const raw = await (prisma as any).$queryRawUnsafe(`
      SELECT g.id, g.title, g.status, g.currentWeek, g.createdAt,
             COUNT(gp.id) as participantCount,
             u.name as psychologistName
      FROM "Group" g
      LEFT JOIN "GroupParticipant" gp ON gp.groupId = g.id AND gp.status = 'active'
      LEFT JOIN "User" u ON u.id = g.psychologistId
      WHERE ${role === 'admin' ? '1=1' : 'g.curatorId = ?'}
      GROUP BY g.id
      ORDER BY g.createdAt DESC
    `, ...(role === 'admin' ? [] : [curatorId]))
    groups = Array.isArray(raw) ? raw : []
  } catch { /* DB not ready */ }

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Группы</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{groups.length} групп</p>
        </div>
        <CreateGroupButton />
      </div>

      {groups.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Users2 size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Групп пока нет</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
            Создайте первую группу и добавьте участников.
          </p>
          <CreateGroupButton />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {groups.map((g: any) => (
            <Link key={g.id} href={`/curator/groups/${g.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.5rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '12rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>{g.title}</h3>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: STATUS_COLOR[g.status] || '#6B7280', background: '#F9FAFB', border: `1px solid ${STATUS_COLOR[g.status] || '#6B7280'}`, padding: '0.15rem 0.625rem', borderRadius: '9999px' }}>
                        {STATUS_LABEL[g.status] || g.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Прогресс</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>Неделя {g.currentWeek} из 4</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Участников</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{Number(g.participantCount)}</div>
                      </div>
                      {g.psychologistName && (
                        <div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Психолог</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{g.psychologistName}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ width: '8rem', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.375rem', textAlign: 'right' }}>
                      {Math.round((g.currentWeek / 4) * 100)}%
                    </div>
                    <div style={{ height: '6px', background: 'var(--primary-light)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${(g.currentWeek / 4) * 100}%`, height: '100%', background: '#C28A5E', borderRadius: '9999px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                      <span>Нед 1</span><span>Нед 4</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
