import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PROGRAM_TASKS, PROGRAM_WEEKS } from '@/lib/dashboard-data'
import { TaskList } from './TaskList'

export default async function TasksPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      taskCompletions: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!user) redirect('/auth/login')

  const completions = user.taskCompletions.map(c => ({
    taskId: c.taskId,
    notes: c.notes,
    createdAt: c.createdAt.toISOString(),
  }))

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Задания</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {completions.length} из {PROGRAM_TASKS.length} выполнено
      </p>
      <TaskList tasks={PROGRAM_TASKS} weeks={PROGRAM_WEEKS} initialCompletions={completions} />
    </div>
  )
}
