import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { ArrowLeft, Video, Calendar, Clock, Users, MapPin } from 'lucide-react'
import MeetingActions from './MeetingActions'

export default async function MeetingPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login?callbackUrl=/dashboard/meeting')

  await ensureDb()

  const today = new Date().toISOString().split('T')[0]
  const tier = (session.user as any).tier ?? 'intro'

  // Get all upcoming scheduled meetings for this user's tier
  const rows = (await (prisma as any).$queryRawUnsafe(`
    SELECT id, title, description, date, time, duration, meetingLink, doctorId
    FROM "Meeting"
    WHERE status = 'scheduled' AND date >= ?
      AND (targetTiers IS NULL OR targetTiers = '' OR targetTiers LIKE ? OR targetTiers LIKE '%"all"%')
    ORDER BY date ASC, time ASC
    LIMIT 10
  `, today, `%"${tier}"%`).catch(() => [])) as {
    id: string; title: string; description: string; date: string; time: string
    duration: string; meetingLink: string | null; doctorId: string | null
  }[]

  const upcoming = rows[0] ?? null
  const allMeetings = rows

  if (!upcoming) {
    return (
      <div style={{ maxWidth: '44rem' }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.825rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={14} /> Назад
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Ваша встреча</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Расписание вводной встречи</p>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <Calendar size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.75rem' }}>Дата встречи ещё не назначена</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '26rem', margin: '0 auto 1.5rem' }}>
            Расписание публикуется за 3–5 дней до встречи. Вы получите уведомление, как только куратор добавит дату.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/dashboard/calendar"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
            >
              <Calendar size={14} /> Записаться на индивидуальную сессию
            </Link>
            <Link
              href="/dashboard/chats"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: '1.5px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}
            >
              Написать куратору
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Get doctor info
  const doctorProfile = upcoming.doctorId ? (await (prisma as any).$queryRawUnsafe(`
    SELECT u.name, pp.speciality, pp.experience, pp.bio, pp.photoUrl
    FROM "PsychologistProfile" pp
    JOIN "User" u ON u.id = pp.userId
    WHERE pp.userId = ?
    LIMIT 1
  `, upcoming.doctorId).catch(() => [])) as any[] : []
  const doctor = doctorProfile[0] ?? null
  const meetingLink = upcoming.meetingLink ?? ''

  const meetingDate = new Date(`${upcoming.date}T${upcoming.time}:00+03:00`)
  const isSoon = meetingDate.getTime() - Date.now() < 2 * 60 * 60 * 1000 && meetingDate > new Date()
  const isToday = new Date().toDateString() === meetingDate.toDateString()
  const isPast = meetingDate < new Date()

  return (
    <div style={{ maxWidth: '44rem' }}>
      <Link
        href="/dashboard"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.825rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={14} /> Назад
      </Link>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>
        Ваша встреча
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Вся информация о ближайшей встрече
      </p>

      {/* Meeting card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.25rem', borderLeft: '4px solid var(--primary)', position: 'relative' }}>
        {(isSoon || isToday) && !isPast && (
          <div style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: isSoon ? '#DCFCE7' : 'var(--primary-light)',
            color: isSoon ? '#166534' : 'var(--primary-dark)',
            fontSize: '0.72rem', fontWeight: 700,
            padding: '0.2rem 0.625rem', borderRadius: '9999px',
          }}>
            {isSoon ? 'Скоро' : 'Сегодня'}
          </div>
        )}

        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
          Ближайшая встреча
        </div>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
          {upcoming.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {upcoming.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {[
            { icon: Calendar, text: meetingDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }) },
            { icon: Clock, text: `${upcoming.time} МСК · ${upcoming.duration}` },
            { icon: Users, text: 'Группа · до 12 человек' },
            { icon: MapPin, text: 'Онлайн, видеочат' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Icon size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              {text}
            </div>
          ))}
        </div>

        {meetingLink ? (
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
              background: isPast ? 'var(--bg-soft)' : 'var(--primary)',
              color: isPast ? 'var(--text-muted)' : 'white',
              fontWeight: 700, fontSize: '0.925rem', textDecoration: 'none',
            }}
          >
            <Video size={16} />
            {isPast ? 'Встреча прошла' : isSoon ? 'Войти в звонок →' : 'Войти в звонок'}
          </a>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', background: 'var(--bg-soft)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <Video size={16} />
            Ссылка появится за день до встречи
          </div>
        )}
      </div>

      {/* Reminders — client component handles platform detection */}
      <MeetingActions
        meetingDate={upcoming.date}
        meetingTime={upcoming.time}
        meetingTitle={upcoming.title}
        meetingLink={meetingLink}
      />

      {/* Preparation tips */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem' }}>
          Как подготовиться
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            'Найдите тихое место — встреча онлайн, в видеочате',
            'Наушники приветствуются, камера — по желанию',
            'Ничего готовить не нужно — просто приходите',
            'Можно просто слушать и не говорить о себе',
            'Всё, что говорится в группе, остаётся в группе',
          ].map((tip) => (
            <li key={tip} style={{ display: 'flex', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Doctor card */}
      {doctor && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem' }}>
            Ведущий психолог
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '3.5rem', height: '3.5rem', borderRadius: '50%', flexShrink: 0,
              background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {doctor.photoUrl
                ? <img src={doctor.photoUrl} alt={doctor.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                : <span style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>{(doctor.name ?? 'П')[0]}</span>
              }
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>{doctor.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{doctor.speciality}</div>
              {doctor.experience && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{doctor.experience}</div>
              )}
              {doctor.bio && (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{doctor.bio}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All upcoming meetings schedule */}
      {allMeetings.length > 1 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} style={{ color: '#C28A5E' }} />
            Все встречи программы ({allMeetings.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {allMeetings.map((m, i) => {
              const mDate = new Date(`${m.date}T${m.time}:00+03:00`)
              const isFirst = i === 0
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', borderRadius: '0.75rem', background: isFirst ? 'var(--bg-sage)' : 'var(--bg-soft)', border: isFirst ? '1px solid var(--primary-light)' : 'none' }}>
                  <div style={{ width: '2.75rem', flexShrink: 0, textAlign: 'center', background: isFirst ? 'var(--primary)' : 'var(--border)', borderRadius: '0.5rem', padding: '0.3rem 0' }}>
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, color: isFirst ? 'rgba(255,255,255,0.7)' : 'var(--text-light)', textTransform: 'uppercase' }}>
                      {mDate.toLocaleDateString('ru-RU', { month: 'short' })}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isFirst ? 'white' : 'var(--text)', lineHeight: 1 }}>
                      {mDate.getDate()}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {m.time} МСК · {m.duration}
                    </div>
                  </div>
                  {isFirst && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: '9999px', flexShrink: 0 }}>
                      Ближайшая
                    </span>
                  )}
                  {m.meetingLink && (
                    <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', flexShrink: 0 }}>
                      <Video size={14} />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
