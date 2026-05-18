import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { Calendar } from 'lucide-react'

export default async function SpecialistCalendarPage() {
  const session = await getServerSession(authOptions)
  const specialistId = (session?.user as any)?.id as string

  const month = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Календарь</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'capitalize' }}>{month}</p>
      </div>

      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <Calendar size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '24rem', margin: '0 auto' }}>
          Встречи появятся здесь, когда участники запишутся через ваши слоты или администратор назначит встречи.
        </p>
      </div>
    </div>
  )
}
