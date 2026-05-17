'use client'

import { useState, useTransition } from 'react'
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import type { ProgramTask } from '@/lib/dashboard-data'

type Completion = { taskId: string; notes: string | null; createdAt: string }

type Props = {
  tasks: ProgramTask[]
  weeks: { week: number; title: string; theme: string }[]
  initialCompletions: Completion[]
}

export function TaskList({ tasks, weeks, initialCompletions }: Props) {
  const [completions, setCompletions] = useState<Completion[]>(initialCompletions)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const completedIds = new Set(completions.map(c => c.taskId))

  function toggle(taskId: string) {
    startTransition(async () => {
      const wasCompleted = completedIds.has(taskId)
      // Optimistic update
      setCompletions(prev =>
        wasCompleted
          ? prev.filter(c => c.taskId !== taskId)
          : [...prev, { taskId, notes: null, createdAt: new Date().toISOString() }]
      )
      try {
        await fetch('/api/dashboard/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId }),
        })
      } catch {
        // revert on error
        setCompletions(prev =>
          wasCompleted
            ? [...prev, { taskId, notes: null, createdAt: new Date().toISOString() }]
            : prev.filter(c => c.taskId !== taskId)
        )
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {weeks.map(week => {
        const weekTasks = tasks.filter(t => t.week === week.week)
        const weekDone = weekTasks.filter(t => completedIds.has(t.id)).length

        return (
          <div key={week.week}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Неделя {week.week}
                </span>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{week.title}</h2>
              </div>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: weekDone === weekTasks.length ? 'var(--primary)' : 'var(--text-muted)' }}>
                {weekDone}/{weekTasks.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {weekTasks.map(task => {
                const done = completedIds.has(task.id)
                const isExpanded = expanded === task.id

                return (
                  <div
                    key={task.id}
                    className="card"
                    style={{ padding: 0, overflow: 'hidden', opacity: isPending ? 0.85 : 1 }}
                  >
                    <button
                      onClick={() => setExpanded(isExpanded ? null : task.id)}
                      style={{
                        width: '100%', textAlign: 'left', background: 'none', border: 'none',
                        cursor: 'pointer', padding: '1rem 1.25rem',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                      }}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(task.id) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, display: 'flex' }}
                        aria-label={done ? 'Отметить невыполненным' : 'Отметить выполненным'}
                      >
                        {done
                          ? <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                          : <Circle size={20} style={{ color: 'var(--border)' }} />
                        }
                      </button>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600, fontSize: '0.875rem', color: done ? 'var(--text-muted)' : 'var(--text)',
                          textDecoration: done ? 'line-through' : 'none',
                        }}>
                          {task.title}
                        </div>
                        <span style={{
                          fontSize: '0.67rem', fontWeight: 600, color: 'var(--text-light)',
                          background: 'var(--bg-soft)', padding: '0.1rem 0.375rem', borderRadius: '9999px',
                          display: 'inline-block', marginTop: '0.2rem',
                        }}>
                          {task.type === 'daily' ? 'ежедневно' : task.type === 'practice' ? 'практика' : 'рефлексия'}
                        </span>
                      </div>

                      {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} />}
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '0.875rem', marginBottom: '1rem' }}>
                          {task.description}
                        </p>
                        {!done && (
                          <button
                            onClick={() => toggle(task.id)}
                            style={{
                              background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem',
                              padding: '0.5rem 1.125rem', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer',
                            }}
                          >
                            Отметить выполненным ✓
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
