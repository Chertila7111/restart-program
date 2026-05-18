import Link from 'next/link'
import { CheckCircle, MessageCircle, Calendar, ArrowRight, Star } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

function getUserTier(role: string, orders: { product: string; status: string }[]) {
  if (role === 'admin' || role === 'psychologist') return 'personal'
  const paid = orders.filter(o => o.status === 'paid').map(o => o.product)
  if (paid.includes('personal')) return 'personal'
  if (paid.includes('plus')) return 'plus'
  if (paid.includes('base')) return 'base'
  if (paid.includes('intro')) return 'intro'
  return 'none'
}

export default async function PsychologistPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const sessionRole = (session.user as any).role as string | undefined
  let tier = 'none'

  try {
    const user = await (prisma as any).user.findUnique({
      where: { email: session.user.email },
      include: { orders: true },
    })
    tier = getUserTier(sessionRole ?? user?.role ?? 'user', user?.orders ?? [])
  } catch {
    if (sessionRole === 'admin' || sessionRole === 'psychologist') tier = 'personal'
  }

  const isPersonal = tier === 'personal'
  const hasProgram = ['base', 'plus', 'personal'].includes(tier)

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Психолог</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ведущий специалист вашей программы</p>

      <div className="card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
        {/* Avatar + name */}
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
              <span style={{
                display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '9999px',
                background: 'var(--primary-light)', color: 'var(--primary-dark)',
                fontSize: '0.75rem', fontWeight: 700,
              }}>
                {PSYCHOLOGIST.approach}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.25rem 0.75rem', borderRadius: '9999px',
                background: '#FEF3C7', color: '#92400E',
                fontSize: '0.75rem', fontWeight: 700,
              }}>
                <Star size={11} fill="#92400E" /> 9 лет опыта
              </span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <blockquote style={{
          margin: '0 0 1.5rem', padding: '1rem 1.25rem',
          background: 'var(--bg-sage)', borderLeft: '3px solid var(--primary)',
          borderRadius: '0 0.75rem 0.75rem 0',
          fontSize: '0.9rem', color: 'var(--primary-dark)', lineHeight: 1.7,
          fontStyle: 'normal', fontWeight: 500,
        }}>
          «{PSYCHOLOGIST.quote}»
        </blockquote>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
              Образование
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{PSYCHOLOGIST.education}</p>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
              Опыт
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{PSYCHOLOGIST.experience}</p>
          </div>

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

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
              Опыт ведения групп
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{PSYCHOLOGIST.groupExperience}</p>
          </div>
        </div>
      </div>

      {/* ── Booking section ── */}
      {isPersonal ? (
        /* Personal tier: 2 free sessions included */
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
                В вашем тарифе включены <strong>2 встречи по 45 минут</strong> один на один с Марией.
                После использования бесплатных можно купить дополнительные.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
            {[1, 2].map(n => (
              <div key={n} style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                background: 'white', borderRadius: '0.625rem',
                padding: '0.5rem 0.875rem', border: '1.5px solid var(--primary)',
              }}>
                <CheckCircle size={14} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-dark)' }}>Встреча {n}</span>
              </div>
            ))}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>— включены бесплатно</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/dashboard/chats"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
                background: 'var(--primary)', color: 'white',
                fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
              }}
            >
              <Calendar size={15} /> Записаться на встречу
            </Link>
            <Link
              href="/checkout?product=session"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
                background: 'white', color: 'var(--primary-dark)',
                fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                border: '1.5px solid var(--primary-light)',
              }}
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
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
                background: '#C28A5E', color: 'white',
                fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
              }}
            >
              <Calendar size={15} /> Записаться — 2 900 ₽
            </Link>
            <Link
              href="/checkout?product=personal"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.8rem', color: 'var(--primary-dark)', textDecoration: 'none', fontWeight: 600,
              }}
            >
              Или 2 встречи бесплатно в Персональном <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ) : (
        /* None/Intro: upgrade prompt */
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

      {/* Chat with curator */}
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
