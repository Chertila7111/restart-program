import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PenLine, Zap, BarChart2, Calendar } from 'lucide-react'

type Entry = {
  id: string
  date: string
  type: string
  mood: number
  anxiety: number
  energy: number
  triggers: string | null
  note: string | null
  situation: string | null
  createdAt: string
}

function moodColor(v: number) {
  if (v <= 3) return '#EF4444'
  if (v <= 5) return '#F59E0B'
  if (v <= 7) return '#10B981'
  return '#4E7B5E'
}

function moodEmoji(v: number) {
  if (v <= 3) return '😔'
  if (v <= 5) return '😐'
  if (v <= 7) return '🙂'
  return '😊'
}

export default async function JournalPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const today = new Date().toISOString().split('T')[0]
  let entries: Entry[] = []
  let todayDaily: Entry | null = null
  let todayQuick: Entry | null = null

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: any[] = await (prisma.journalEntry as any).findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
      })
      entries = raw.map(e => ({
        id: e.id,
        date: e.date,
        type: e.type,
        mood: e.mood,
        anxiety: e.anxiety,
        energy: e.energy,
        triggers: e.triggers,
        note: e.note,
        situation: e.situation,
        createdAt: e.createdAt.toISOString(),
      }))
      todayDaily = (entries as Entry[]).find(e => e.date === today && e.type === 'daily') ?? null
      todayQuick = (entries as Entry[]).find(e => e.date === today && e.type === 'quick') ?? null
    }
  } catch { /* DB unavailable */ }

  const last7 = entries.filter(e => e.type === 'daily').slice(0, 7).reverse()
  const avgMood = last7.length ? Math.round(last7.reduce((s, e) => s + e.mood, 0) / last7.length * 10) / 10 : null
  const avgAnxiety = last7.length ? Math.round(last7.reduce((s, e) => s + e.anxiety, 0) / last7.length * 10) / 10 : null

  return (
    <div style={{ maxWidth: '48rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Дневник</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {entries.filter(e => e.type === 'daily').length > 0
              ? `${entries.filter(e => e.type === 'daily').length} записей · ведёшь уже молодец`
              : 'Начни вести дневник — это помогает'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <Link href="/dashboard/journal/quick" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.5rem 1rem', borderRadius: '0.75rem',
            background: '#FEF3C7', color: '#92400E',
            fontWeight: 600, fontSize: '0.825rem', textDecoration: 'none',
          }}>
            <Zap size={14} /> Кризис
          </Link>
          <Link href="/dashboard/journal/new" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.825rem' }}>
            <PenLine size={14} style={{ marginRight: '0.375rem' }} /> Запись
          </Link>
        </div>
      </div>

      {/* Today's status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
        <Link href="/dashboard/journal/new" style={{ textDecoration: 'none' }}>
          <div className="card" style={{
            padding: '1.25rem',
            border: todayDaily ? '2px solid var(--primary)' : '2px dashed var(--border)',
            background: todayDaily ? 'white' : 'var(--bg-soft)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <PenLine size={14} style={{ color: todayDaily ? 'var(--primary)' : 'var(--text-light)' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Сегодня
              </span>
            </div>
            {todayDaily ? (
              <>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{moodEmoji(todayDaily.mood)}</div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>
                  Настроение: {todayDaily.mood}/10
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                  ✓ Записано
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                  Как ты сегодня?
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Добавь ежедневную запись →
                </div>
              </>
            )}
          </div>
        </Link>

        <Link href="/dashboard/journal/week-summary" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '1.25rem', border: '1.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Calendar size={14} style={{ color: 'var(--text-light)' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Итоги недели
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
              Рефлексия
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              5 вопросов про неделю →
            </div>
          </div>
        </Link>
      </div>

      {/* Analytics */}
      {last7.length >= 3 && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BarChart2 size={14} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Последние {last7.length} дней
            </span>
          </div>

          {/* Sparkline */}
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'flex-end', height: '3rem', marginBottom: '0.875rem' }}>
            {last7.map(e => (
              <div
                key={e.id}
                title={`${e.date}: настроение ${e.mood}`}
                style={{
                  flex: 1, borderRadius: '0.25rem',
                  background: moodColor(e.mood),
                  height: `${(e.mood / 10) * 100}%`,
                  minWidth: '0.5rem',
                  opacity: 0.85,
                }}
              />
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {avgMood !== null && (
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: moodColor(avgMood) }}>{avgMood}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>ср. настроение</div>
              </div>
            )}
            {avgAnxiety !== null && (
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#C28A5E' }}>{avgAnxiety}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>ср. тревога</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>{last7.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>дней подряд</div>
            </div>
          </div>
        </div>
      )}

      {/* Entry list */}
      {entries.length > 0 ? (
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.875rem' }}>История записей</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {entries.map(e => (
              <div key={e.id} className="card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)' }}>
                        {new Date(e.date + 'T00:00:00').toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '9999px',
                        background: e.type === 'quick' ? '#FEF3C7' : e.type === 'week_summary' ? 'var(--primary-light)' : 'var(--bg-soft)',
                        color: e.type === 'quick' ? '#92400E' : e.type === 'week_summary' ? 'var(--primary-dark)' : 'var(--text-light)',
                      }}>
                        {e.type === 'quick' ? 'Кризис' : e.type === 'week_summary' ? 'Итоги' : 'День'}
                      </span>
                    </div>
                    {e.type === 'daily' && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {moodEmoji(e.mood)} настроение {e.mood} · тревога {e.anxiety}
                        {e.note && ` · «${e.note.slice(0, 40)}${e.note.length > 40 ? '...' : ''}»`}
                      </div>
                    )}
                    {e.type === 'quick' && e.situation && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{e.situation}</div>
                    )}
                    {e.type === 'week_summary' && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Рефлексия за неделю</div>
                    )}
                  </div>
                  {e.type === 'daily' && (
                    <div style={{
                      width: '2rem', height: '2rem', borderRadius: '50%',
                      background: moodColor(e.mood),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: 'white', fontSize: '0.7rem', fontWeight: 800,
                    }}>
                      {e.mood}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📓</div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Начни вести дневник</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '24rem', margin: '0 auto 1.5rem' }}>
            Ежедневные записи помогают отслеживать прогресс и понять, что тебе помогает восстановиться.
          </p>
          <Link href="/dashboard/journal/new" className="btn-primary">
            Первая запись →
          </Link>
        </div>
      )}
    </div>
  )
}
