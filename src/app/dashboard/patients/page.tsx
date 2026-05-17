import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MessageCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default async function PatientsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const sessionRole = (session.user as any).role as string | undefined
  if (sessionRole !== 'psychologist' && sessionRole !== 'admin') redirect('/dashboard')

  let participants: {
    id: string; name: string | null; email: string; role: string; createdAt: Date
    orders: { status: string; product: string }[]
    journalEntries: { sharedWithSpecialist: boolean; date: string; type: string }[]
  }[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any[] = await prisma.user.findMany({
      where: { role: 'user' },
      include: {
        orders: true,
        journalEntries: {
          where: { sharedWithSpecialist: true } as any,
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    participants = raw
  } catch { /* DB unavailable */ }

  return (
    <div style={{ maxWidth: '52rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Участники</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {participants.length} участников программы
      </p>

      {participants.length === 0 ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👥</div>
          <p style={{ color: 'var(--text-muted)' }}>
            {participants.length === 0 ? 'База данных недоступна или участников нет' : 'Нет участников'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {participants.map(p => {
            const paid = p.orders.filter(o => o.status === 'paid').map(o => o.product)
            const tier = paid.includes('personal') ? 'Персональный' : paid.includes('plus') ? 'Плюс' : paid.includes('base') ? 'Базовый' : paid.includes('intro') ? 'Вводная' : 'Без тарифа'
            const sharedCount = p.journalEntries.length

            return (
              <div key={p.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
                    {(p.name || p.email)[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                      {p.name || p.email.split('@')[0]}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>
                      {p.email} · {tier} · с {new Date(p.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    </div>
                    {sharedCount > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                        <BookOpen size={12} />
                        {sharedCount} записей дневника поделились
                      </div>
                    )}
                  </div>
                  <Link href="/dashboard/chats" style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.5rem 0.875rem', borderRadius: '0.75rem',
                    background: 'var(--primary-light)', color: 'var(--primary-dark)',
                    fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none', flexShrink: 0,
                  }}>
                    <MessageCircle size={13} /> Написать
                  </Link>
                </div>

                {sharedCount > 0 && (
                  <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                      Поделился записями
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {p.journalEntries.map(e => (
                        <span key={e.date + e.type} style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: 'var(--bg-sage)', color: 'var(--primary-dark)', fontWeight: 600 }}>
                          {new Date(e.date + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} · {e.type === 'daily' ? 'День' : e.type === 'quick' ? 'Кризис' : 'Итоги'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
