import { Video, Clock, Lock } from 'lucide-react'
import { PROGRAM_MEETINGS } from '@/lib/dashboard-data'

export default function RecordingsPage() {
  const now = new Date()

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Записи встреч</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Записи появляются в течение суток после встречи</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {PROGRAM_MEETINGS.map((meeting) => {
          const meetingDate = new Date(meeting.date + 'T20:00:00')
          const isAvailable = meetingDate < now

          return (
            <div key={meeting.week} className="card" style={{ padding: '1.25rem', opacity: isAvailable ? 1 : 0.7 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                  width: '3rem', height: '3rem', borderRadius: '0.875rem',
                  background: isAvailable ? 'var(--primary-light)' : 'var(--bg-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {isAvailable
                    ? <Video size={18} style={{ color: 'var(--primary)' }} />
                    : <Lock size={18} style={{ color: 'var(--text-light)' }} />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                    Неделя {meeting.week} · {new Date(meeting.date + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                    {meeting.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    {meeting.duration}
                  </div>
                </div>
                {isAvailable ? (
                  <span style={{
                    background: 'var(--primary)', color: 'white',
                    borderRadius: '0.625rem', padding: '0.5rem 1rem',
                    fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
                  }}>
                    Скоро
                  </span>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', flexShrink: 0, textAlign: 'right' }}>
                    После<br />встречи
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
