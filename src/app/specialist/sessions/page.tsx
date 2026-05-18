import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Calendar } from 'lucide-react'

export default async function SessionsPage() {
  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Индивидуальные встречи</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Запланированные и прошедшие сессии</p>
      </div>

      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <Calendar size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '22rem', margin: '0 auto' }}>
          Встреч пока нет. Участники смогут записаться через ваши слоты, после чего встречи появятся здесь.
        </p>
      </div>
    </div>
  )
}
