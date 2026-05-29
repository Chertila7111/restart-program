import Link from 'next/link'
import { CheckCircle, MessageCircle, Calendar, ArrowRight, Star, Clock } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

const PSYCHOLOGIST = {
  name: 'Мария Соколова',
  title: 'Клинический психолог',
  approach: 'КПТ и схема-терапия',
  education: 'МГУ, факультет психологии · Сертификат КПТ (Beck Institute)',
  experience: '9 лет практики · 300+ индивидуальных клиентов · 4 года ведения групп',
  groupExperience: 'Ведёт группы поддержки с 2021 года, специализируется на работе с потерями и переходными периодами.',
  requests: [
    'Расставания и разводы',
    'Восстановление самооценки',
    'Тревога и навязчивые мысли',
    'Одиночество и изоляция',
    'Поиск смыслов после утраты',
  ],
  quote: 'Боль после расставания — это не слабость. Это цена за то, что вы умеете любить. Моя задача — помочь вам пройти через неё, не разрушив себя.',
  color: '#4E7B5E',
}

// Sessions included free by tier
const TIER_SESSIONS: Record<string, number> = {
  personal: 2,
  'clarity-start': 3,
  'clarity-deep': 5,
}

function getTopTier(orders: { product: string; status: string }[]): string {
  const paid = orders.filter(o => o.status === 'paid').map(o => o.product)
  const priority = ['personal', 'clarity-deep', 'clarity-start', 'plus', 'base', 'session', 'intro']
  for (const p of priority) { if (paid.includes(p)) return p }
  return 'none'
}

export default async function PsychologistPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const sessionRole = (session.user as any).role as string | undefined
  const userId = (session.user as any).id as string
  let tier = 'none'
  let completedCount = 0
  let upcomingCount = 0
  let nextBooking: { startAt: string; durationMin: number } | null = null

  try {
    await ensureDb()
    const user = await (prisma as any).user.findUnique({
      where: { email: session.user.email },
      include: { orders: true },
    })
    tier = sessionRole === 'admin' || sessionRole === 'psychologist'
      ? 'personal'
      : getTopTier(user?.orders ?? [])

    // Count completed individual sessions for this user
    const completedRows = await (prisma as any).$queryRawUnsafe(`
      SELECT COUNT(*) as cnt FROM "Booking" b
      JOIN "AvailableSlot" s ON s.id = b.slotId
      WHERE b.userId = ? AND b.status = 'completed'
    `, userId) as { cnt: number | bigint }[]
    completedCount = Number(completedRows?.[0]?.cnt ?? 0)

    // Count upcoming confirmed bookings
    const upcomingRows = await (prisma as any).$queryRawUnsafe(`
      SELECT COUNT(*) as cnt, MIN(s.startAt) as nextAt, s.durationMin
      FROM "Booking" b
      JOIN "AvailableSlot" s ON s.id = b.slotId
      WHERE b.userId = ? AND b.status = 'confirmed' AND s.startAt > datetime('now')
    `, userId) as { cnt: number | bigint; nextAt: string | null; durationMin: number }[]
    upcomingCount = Number(upcomingRows?.[0]?.cnt ?? 0)
    if (upcomingRows?.[0]?.nextAt) {
      nextBooking = { startAt: upcomingRows[0].nextAt, durationMin: upcomingRows[0].durationMin }
    }
  } catch {
    if (sessionRole === 'admin' || sessionRole === 'psychologist') tier = 'personal'
  }

  const totalSessions = TIER_SESSIONS[tier] ?? 0
  const hasIncluded = totalSessions > 0
  const hasProgram = ['base', 'plus'].includes(tier)
  const hasPaidAny = tier !== 'none' && tier !== 'intro'

  // Build per-slot state: completed → upcoming → available
  const slotStates: ('completed' | 'upcoming' | 'available')[] = Array.from({ length: totalSessions }, (_, i) => {
    if (i < completedCount) return 'completed'
    if (i < completedCount + upcomingCount) return 'upcoming'
    return 'available'
  })

  const remaining = Math.max(0, totalSessions - completedCount - upcomingCount)
  const allUsed = completedCount >= totalSessions && totalSessions > 0

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Психолог</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ведущий специалист вашей программы</p>

      {/* Profile card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{
            width: '4rem', height: '4rem', borderRadius: '50%',
            background: PSYCHOLOGIST.color, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
            fontSize: '1.4rem', fontWeight: 800, color: 'white',
          }}>
            {PSYCHOLOGIST.name[0]}
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
              {PSYCHOLOGIST.name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{PSYCHOLOGIST.title}</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: '0.75rem', fontWeight: 700 }}>
                {PSYCHOLOGIST.approach}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: '#FEF3C7', color: '#92400E', fontSize: '0.75rem', fontWeight: 700 }}>
                <Star size={11} fill="#92400E" /> 9 лет опыта
              </span>
            </div>
          </div>
        </div>

        <blockquote style={{ margin: '0 0 1.5rem', padding: '1rem 1.25rem', background: 'var(--bg-sage)', borderLeft: '3px solid var(--primary)', borderRadius: '0 0.75rem 0.75rem 0', fontSize: '0.9rem', color: 'var(--primary-dark)', lineHeight: 1.7, fontStyle: 'normal', fontWeight: 500 }}>
          «{PSYCHOLOGIST.quote}»
        </blockquote>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Образование', text: PSYCHOLOGIST.education },
            { label: 'Опыт', text: PSYCHOLOGIST.experience },
            { label: 'Опыт ведения групп', text: PSYCHOLOGIST.groupExperience },
          ].map(({ label, text }) => (
            <div key={label}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
                {label}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{text}</p>
            </div>
          ))}

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              С чем работает
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {PSYCHOLOGIST.requests.map(r => (
                <div key={r} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking section ── */}
      {hasIncluded ? (
        /* Tiers with included sessions: personal (2), clarity-start (3), clarity-deep (5) */
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.25rem', borderLeft: '4px solid var(--primary)', background: 'var(--bg-sage)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={16} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                Индивидуальные встречи
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                В вашем тарифе включены <strong>{totalSessions} встречи по 45 минут</strong> один на один с Марией.
                После использования бесплатных можно купить дополнительные.
              </div>
            </div>
          </div>

          {/* Session slot indicators */}
          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {slotStates.map((state, i) => {
              const isCompleted = state === 'completed'
              const isUpcoming = state === 'upcoming'
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  background: isCompleted ? '#F3F4F6' : isUpcoming ? '#EFF6FF' : 'white',
                  borderRadius: '0.625rem',
                  padding: '0.5rem 0.875rem',
                  border: `1.5px solid ${isCompleted ? '#D1D5DB' : isUpcoming ? '#93C5FD' : 'var(--primary)'}`,
                  opacity: isCompleted ? 0.75 : 1,
                }}>
                  {isCompleted
                    ? <CheckCircle size={14} style={{ color: '#6B7280' }} />
                    : isUpcoming
                    ? <Clock size={14} style={{ color: '#2563EB' }} />
                    : <CheckCircle size={14} style={{ color: 'var(--primary)' }} />
                  }
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 600,
                    color: isCompleted ? '#6B7280' : isUpcoming ? '#1D4ED8' : 'var(--primary-dark)',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                  }}>
                    Встреча {i + 1}
                  </span>
                  {isCompleted && (
                    <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>— проведена</span>
                  )}
                  {isUpcoming && (
                    <span style={{ fontSize: '0.7rem', color: '#2563EB' }}>— запланирована</span>
                  )}
                </div>
              )
            })}
            {remaining > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                — включены бесплатно
              </span>
            )}
          </div>

          {/* Next booking info */}
          {nextBooking && (
            <div style={{ background: '#EFF6FF', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} />
              Ближайшая встреча: {new Date(nextBooking.startAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
              {' · '}{new Date(nextBooking.startAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} МСК
              {' · '}{nextBooking.durationMin} мин
            </div>
          )}

          {/* Summary line */}
          {completedCount > 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Использовано <strong>{completedCount}</strong> из <strong>{totalSessions}</strong> встреч
              {remaining > 0 ? ` · осталось ${remaining}` : ' · все встречи использованы'}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {allUsed ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: '#F3F4F6', color: '#6B7280', fontWeight: 600, fontSize: '0.875rem' }}>
                <CheckCircle size={15} /> Все встречи использованы
              </div>
            ) : (
              <Link
                href="/dashboard/calendar"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
              >
                <Calendar size={15} /> Записаться на встречу
              </Link>
            )}
            <Link
              href="/checkout?product=session"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: 'white', color: 'var(--primary-dark)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', border: '1.5px solid var(--primary-light)' }}
            >
              + Доп. встреча — 2 900 ₽
            </Link>
          </div>
        </div>
      ) : hasProgram ? (
        /* Base/Plus: paid session option */
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.25rem', background: 'linear-gradient(135deg, #FAFFF8, #FFF7F0)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: '#C28A5E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={16} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                Индивидуальная встреча — 2 900 ₽
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                45 минут один на один с Марией. Разбор вашей ситуации, индивидуальные рекомендации и корректировка плана.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              href="/checkout?product=session"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: '#C28A5E', color: 'white', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
            >
              <Calendar size={15} /> Записаться — 2 900 ₽
            </Link>
            <Link
              href="/checkout?product=personal"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--primary-dark)', textDecoration: 'none', fontWeight: 600 }}
            >
              Или 2 встречи бесплатно в Персональном <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ) : hasPaidAny ? (
        /* session/intro: can buy individual */
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
            Индивидуальная встреча — 2 900 ₽
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem', margin: '0 0 1.25rem' }}>
            45 минут один на один с Марией.
          </p>
          <Link
            href="/checkout?product=session"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
          >
            <Calendar size={15} /> Записаться — 2 900 ₽
          </Link>
        </div>
      ) : (
        /* None: upgrade prompt */
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.25rem', background: 'var(--bg-dark)', border: 'none' }}>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
            Индивидуальная встреча с психологом
          </h3>
          <p style={{ color: 'rgba(168,184,160,0.85)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            45 минут один на один — 2 900 ₽. Или выберите тариф Персональный — включает 2 встречи.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=session" className="btn-ghost-dark" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
              Записаться — 2 900 ₽
            </Link>
            <Link href="/checkout?product=personal" style={{ color: 'rgba(168,184,160,0.7)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              Персональный тариф →
            </Link>
          </div>
        </div>
      )}

      {/* Chat with psychologist */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MessageCircle size={16} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>Написать психологу</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.875rem', lineHeight: 1.6 }}>
            Задайте вопрос напрямую в чате. Психолог отвечает в рабочее время (пн–пт, 10:00–19:00 МСК).
          </p>
          <Link href="/dashboard/chats" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}>
            Открыть чат →
          </Link>
        </div>
      </div>
    </div>
  )
}
