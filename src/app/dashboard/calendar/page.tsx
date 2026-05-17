import { Clock, Users, Video } from 'lucide-react'
import { PROGRAM_MEETINGS } from '@/lib/dashboard-data'

export default function CalendarPage() {
  const now = new Date()

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Календарь</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Расписание групповых встреч</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {PROGRAM_MEETINGS.map((meeting) => {
          const meetingDate = new Date(meeting.date + 'T' + meeting.time + ':00')
          const isPast = meetingDate < now
          const isNext = !isPast && PROGRAM_MEETINGS.filter(m => new Date(m.date) < now).length === meeting.week - 1

          return (
            <div
              key={meeting.week}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                border: isNext ? '2px solid var(--primary)' : undefined,
                opacity: isPast ? 0.65 : 1,
              }}
            >
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                {/* Date block */}
                <div style={{
                  width: '3.5rem', flexShrink: 0, textAlign: 'center',
                  background: isNext ? 'var(--primary)' : isPast ? 'var(--bg-soft)' : 'var(--bg-sage)',
                  borderRadius: '0.875rem', padding: '0.625rem 0.5rem',
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: isNext ? 'rgba(255,255,255,0.7)' : 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {new Date(meeting.date + 'T00:00:00').toLocaleDateString('ru-RU', { month: 'short' })}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isNext ? 'white' : 'var(--text)', lineHeight: 1 }}>
                    {new Date(meeting.date + 'T00:00:00').getDate()}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Неделя {meeting.week}
                    </span>
                    {isNext && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'var(--primary)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
                        Следующая
                      </span>
                    )}
                    {isPast && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', background: 'var(--bg-soft)', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>
                        Прошла
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                    {meeting.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> {meeting.time} МСК
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Users size={12} /> Групповая
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Video size={12} /> {meeting.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--bg-sage)', borderRadius: '1rem', border: '1px solid var(--primary-light)' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--primary-dark)' }}>Как попасть на встречу:</strong> Ссылка на Zoom приходит на почту за 30 минут до начала. Если вы пропустили встречу — запись будет доступна в разделе «Записи» в течение суток.
        </p>
      </div>
    </div>
  )
}
