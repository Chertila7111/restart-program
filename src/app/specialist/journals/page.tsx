import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { FileText, ArrowRight, AlertCircle } from 'lucide-react'

export default async function SpecialistJournalsPage() {
  const session = await getServerSession(authOptions)
  const specialistId = (session?.user as any)?.id as string

  let journals: any[] = []
  try {
    await ensureDb()
    journals = await (prisma as any).$queryRawUnsafe(`
      SELECT j.id, j.date, j.mood, j.anxiety, j.urgeToWrite, j.energy, j.note, j.sharedWithSpecialist, j.createdAt,
             u.id as userId, u.name as userName, g.title as groupTitle
      FROM "JournalEntry" j
      JOIN "User" u ON u.id = j.userId
      JOIN "GroupParticipant" gp ON gp.userId = j.userId
      JOIN "Group" g ON g.id = gp.groupId
      WHERE g.psychologistId = ? AND gp.diaryAccessGranted = 1
      ORDER BY j.createdAt DESC
      LIMIT 50
    `, specialistId)
  } catch { /* DB not ready */ }

  const needsAttention = journals.filter(j => j.mood <= 3 || j.anxiety >= 8 || j.urgeToWrite >= 8)

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Дневники участников</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Только участники, которые открыли вам доступ к дневнику
        </p>
      </div>

      {needsAttention.length > 0 && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '1rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <AlertCircle size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: '0.15rem' }} />
          <p style={{ fontSize: '0.825rem', color: '#78350F', margin: 0, lineHeight: 1.5 }}>
            {needsAttention.length} записей с тревогой или низким состоянием — посмотрите при возможности.
          </p>
        </div>
      )}

      {journals.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <FileText size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Нет записей. Участники появятся здесь, когда откроют вам доступ к дневнику.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {journals.map((j: any) => {
            const alert = j.mood <= 3 || j.anxiety >= 8 || j.urgeToWrite >= 8
            return (
              <div key={j.id} className="card" style={{ padding: '1rem 1.25rem', borderLeft: alert ? '3px solid #F59E0B' : '3px solid transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
                  <div>
                    <Link href={`/specialist/clients/${j.userId}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>
                      {j.userName}
                    </Link>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{j.groupTitle}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {j.sharedWithSpecialist && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--primary)' }}>отправлено вам</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(j.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: j.note ? '0.5rem' : 0 }}>
                  {[
                    { label: 'Состояние', val: j.mood },
                    { label: 'Тревога', val: j.anxiety },
                    { label: 'Желание написать', val: j.urgeToWrite },
                    { label: 'Энергия', val: j.energy },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: val <= 3 ? '#DC2626' : val >= 8 ? '#D97706' : '#059669' }}>{val}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-light)' }}>{label}</div>
                    </div>
                  ))}
                </div>
                {j.note && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0 0', lineHeight: 1.5 }}>
                    {j.note}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
