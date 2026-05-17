import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CheckCircle, Circle, Clock, Users } from 'lucide-react'
import { PROGRAM_WEEKS, PROGRAM_MEETINGS, PROGRAM_TASKS } from '@/lib/dashboard-data'

export default async function ProgramPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  let taskCompletions: { taskId: string }[] = []
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { taskCompletions: true },
    })
    taskCompletions = user?.taskCompletions ?? []
  } catch { /* DB unavailable */ }

  const completedIds = new Set(taskCompletions.map(t => t.taskId))
  const totalCompleted = PROGRAM_TASKS.filter(t => completedIds.has(t.id)).length
  const currentWeek = Math.min(4, Math.floor(totalCompleted / 3) + 1)

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Программа</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>4 недели · 4 встречи · 12 заданий</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {PROGRAM_WEEKS.map((week) => {
          const meeting = PROGRAM_MEETINGS[week.week - 1]
          const tasks = PROGRAM_TASKS.filter(t => t.week === week.week)
          const weekCompleted = tasks.filter(t => completedIds.has(t.id)).length
          const isCurrent = week.week === currentWeek
          const isPast = week.week < currentWeek

          return (
            <div
              key={week.week}
              className="card"
              style={{
                padding: 0, overflow: 'hidden',
                border: isCurrent ? '2px solid var(--primary)' : undefined,
              }}
            >
              {/* Week header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                background: isCurrent ? 'var(--bg-sage)' : isPast ? 'var(--bg-soft)' : 'white',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                      color: isCurrent ? 'var(--primary)' : 'var(--text-light)',
                    }}>
                      Неделя {week.week}
                    </span>
                    {isCurrent && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'var(--primary)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
                        Текущая
                      </span>
                    )}
                    {isPast && (
                      <CheckCircle size={14} style={{ color: 'var(--primary)' }} />
                    )}
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{week.title}</h2>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{week.theme}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: isPast || isCurrent ? 'var(--primary)' : 'var(--text-light)' }}>
                    {weekCompleted}/{tasks.length}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>заданий</div>
                </div>
              </div>

              {/* Meeting info */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                  <Users size={13} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', marginBottom: '0.2rem' }}>{meeting.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                    <span>{new Date(meeting.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                    <span>{meeting.time} МСК</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={11} />{meeting.duration}</span>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div style={{ padding: '1rem 1.5rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                  Задания
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tasks.map((task) => {
                    const done = completedIds.has(task.id)
                    return (
                      <div key={task.id} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                        {done
                          ? <CheckCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                          : <Circle size={15} style={{ color: 'var(--border)', flexShrink: 0, marginTop: '0.15rem' }} />
                        }
                        <div>
                          <span style={{ fontSize: '0.825rem', color: done ? 'var(--text-muted)' : 'var(--text)', fontWeight: done ? 400 : 500, textDecoration: done ? 'line-through' : 'none' }}>
                            {task.title}
                          </span>
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.68rem', color: 'var(--text-light)', fontWeight: 500, background: 'var(--bg-soft)', padding: '0.1rem 0.375rem', borderRadius: '9999px' }}>
                            {task.type === 'daily' ? 'ежедневно' : task.type === 'practice' ? 'практика' : 'рефлексия'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
