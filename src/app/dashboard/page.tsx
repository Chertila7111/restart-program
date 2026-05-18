import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { ArrowRight, BookOpen, CheckSquare, PenLine, Calendar, Sparkles } from 'lucide-react'
import { PROGRAM_TASKS } from '@/lib/dashboard-data'
import { LogoSvg } from '@/components/LogoSvg'

function getUserTier(role: string, orders: { product: string; status: string }[]) {
  if (role === 'admin' || role === 'psychologist') return 'personal'
  const paid = orders.filter(o => o.status === 'paid').map(o => o.product)
  if (paid.includes('personal')) return 'personal'
  if (paid.includes('plus')) return 'plus'
  if (paid.includes('base')) return 'base'
  if (paid.includes('intro')) return 'intro'
  return 'none'
}

const DEMO_EMAIL_TIERS: Record<string, string> = {
  'test@snova-s-soboy.ru':   'intro',
  'doctor@snova-s-soboy.ru': 'personal',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login?callbackUrl=/dashboard')

  const sessionRole = (session.user as any).role as string | undefined

  let user: {
    name: string | null; email: string; role: string
    orders: { product: string; status: string }[]
    journalEntries: { date: string }[]
    taskCompletions: { taskId: string }[]
  } | null = null

  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: true,
        journalEntries: { orderBy: { date: 'desc' }, take: 7 },
        taskCompletions: true,
      },
    })
  } catch { /* DB unavailable — use session data only */ }

  // Admin via env or DB role; for demo/session-only accounts fall back to sessionRole
  const effectiveRole = sessionRole === 'admin' ? 'admin' : (user?.role ?? sessionRole ?? 'user')
  const effectiveUser = user ?? {
    name: session.user.name ?? null,
    email: session.user.email!,
    role: effectiveRole,
    orders: [],
    journalEntries: [],
    taskCompletions: [],
  }

  const emailKey = (session.user.email ?? '').toLowerCase()
  const hardcodedTier = DEMO_EMAIL_TIERS[emailKey]
  const sessionTier = (session.user as any).tier as string | undefined
  const dbTier = getUserTier(effectiveRole, effectiveUser.orders)
  const tier = hardcodedTier ?? (dbTier !== 'none'
    ? dbTier
    : (sessionTier ?? (effectiveRole === 'user' ? 'intro' : 'none')))
  const today = new Date().toISOString().split('T')[0]
  const hasJournalToday = effectiveUser.journalEntries.some(e => e.date === today)
  const completedTaskIds = new Set(effectiveUser.taskCompletions.map(t => t.taskId))
  const firstName = effectiveUser.name?.split(' ')[0] || 'друг'

  // Fetch next scheduled meeting from DB for this tier
  type DbMeeting = { id: string; title: string; description: string; date: string; time: string; duration: string; meetingLink: string | null }
  let nextMeeting: DbMeeting | null = null
  try {
    await ensureDb()
    const rows = (await (prisma as any).$queryRawUnsafe(
      `SELECT id, title, description, date, time, duration, meetingLink
       FROM "Meeting"
       WHERE status = 'scheduled' AND date >= ? AND targetTiers LIKE ?
       ORDER BY date ASC, time ASC LIMIT 1`,
      today, `%"${tier}"%`
    )) as DbMeeting[]
    nextMeeting = rows[0] ?? null
  } catch { /* DB unavailable */ }

  // ── Psychologist dashboard ───────────────────────────────────
  if (effectiveRole === 'psychologist') {
    return (
      <div style={{ maxWidth: '44rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
          Добро пожаловать, {firstName}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Кабинет психолога</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { href: '/dashboard/admin/meetings', icon: '📅', title: 'Встречи', desc: 'Запланировать и управлять созвонами' },
            { href: '/dashboard/patients', icon: '👥', title: 'Участники', desc: 'Список участников программы и их записи' },
            { href: '/dashboard/chats',    icon: '💬', title: 'Чаты',      desc: 'Переписка с участниками' },
            { href: '/dashboard/psych-profile', icon: '✏️', title: 'Мой профиль', desc: 'Информация о вас для участников' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.25rem', height: '100%' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-sage)', border: '1px solid var(--primary-light)' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Кабинет психолога</div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            Вы видите записи дневника участников, которые поделились с вами. Отвечайте в чате от своего аккаунта. Заполните профиль — участники увидят его в разделе «Психолог».
          </p>
        </div>
      </div>
    )
  }

  // ── No purchase ─────────────────────────────────────────────
  if (tier === 'none') {
    return (
      <div style={{ maxWidth: '44rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>
          Привет, {firstName}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Рады, что вы здесь. Посмотрите, как устроена программа.
        </p>

        {/* CTA card */}
        <div style={{
          background: 'var(--bg-dark)', borderRadius: '1.25rem', padding: '2rem',
          marginBottom: '1.5rem', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '10rem', height: '10rem', borderRadius: '50%', background: 'rgba(78,123,94,0.15)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <LogoSvg size={40} />
              <span style={{ color: 'rgba(168,184,160,1)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>С чего начать</span>
            </div>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
              Начните с вводной встречи
            </h2>
            <p style={{ color: 'rgba(168,184,160,0.85)', fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              90 минут в небольшой группе с психологом. Можно просто слушать — не нужно рассказывать о себе. Стоимость засчитывается при покупке программы.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/checkout?product=intro" className="btn-ghost-dark">
                Записаться — 1 490 ₽ →
              </Link>
              <Link href="/quiz" style={{ color: 'rgba(168,184,160,0.7)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                Пройти тест →
              </Link>
            </div>
          </div>
        </div>

        {/* What's inside */}
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>Что входит в программу</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 13rem), 1fr))', gap: '1rem' }}>
          {[
            { icon: Calendar, title: '4 групповые встречи', desc: 'По 90 минут с психологом. Расписание удобное.' },
            { icon: PenLine, title: 'Дневник состояния', desc: 'Отслеживайте, как меняется ваше состояние день за днём.' },
            { icon: CheckSquare, title: 'Задания между встречами', desc: 'Практики для восстановления — 5–15 минут в день.' },
            { icon: BookOpen, title: 'Материалы и записи', desc: 'Все встречи записываются. Доступ навсегда.' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <Icon size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/pricing" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
            Смотреть все тарифы →
          </Link>
        </div>
      </div>
    )
  }

  // ── Intro only ───────────────────────────────────────────────
  if (tier === 'intro') {
    return (
      <div style={{ maxWidth: '44rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>
          Привет, {firstName}!
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {nextMeeting ? 'Вы записались на вводную встречу. Вот всё, что нужно знать.' : 'Рады, что вы здесь! Встреча скоро будет назначена куратором.'}
        </p>

        {nextMeeting ? (
          <Link href="/dashboard/meeting" style={{ textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>
                Ваша встреча →
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                {nextMeeting.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {nextMeeting.description}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>📅 {new Date(nextMeeting.date + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                <span>🕖 {nextMeeting.time} МСК</span>
                <span>⏱ {nextMeeting.duration}</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--border)' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              📅 Дата встречи будет назначена куратором и появится здесь автоматически
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem' }}>Как подготовиться</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Найдите тихое место — встреча онлайн, в видеочате',
              'Наушники приветствуются, камера — по желанию',
              'Ничего готовить не нужно — просто приходите',
              'Можно просто слушать и не говорить о себе',
            ].map((tip) => (
              <li key={tip} style={{ display: 'flex', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: 'var(--bg-dark)', borderRadius: '1.25rem', padding: '1.5rem' }}>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Хотите полную программу?</h3>
          <p style={{ color: 'rgba(168,184,160,0.85)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Стоимость вводной встречи засчитывается при покупке. 4 встречи, дневник, задания и поддержка психолога.
          </p>
          <Link href="/pricing" className="btn-ghost-dark" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
            Выбрать тариф →
          </Link>
        </div>
      </div>
    )
  }

  // ── Full program (base / plus / personal) ────────────────────
  const completedTasks = PROGRAM_TASKS.filter(t => completedTaskIds.has(t.id))
  const progress = Math.round((completedTasks.length / PROGRAM_TASKS.length) * 100)
  const currentWeek = Math.min(4, Math.floor(completedTasks.length / 3) + 1)
  const streak = effectiveUser.journalEntries.length

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>
        Привет, {firstName}!
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Неделя {currentWeek} из 4 · {progress}% программы выполнено
      </p>

      {/* Progress bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Прогресс программы</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary)' }}>{progress}%</span>
        </div>
        <div style={{ height: '6px', background: 'var(--primary-light)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: '9999px', transition: 'width 0.3s' }} />
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>✅ Заданий: {completedTasks.length}/{PROGRAM_TASKS.length}</span>
          <span>📓 Дней дневника: {streak}</span>
        </div>
      </div>

      {/* Today's journal prompt */}
      {!hasJournalToday && (
        <Link href="/dashboard/journal" style={{ textDecoration: 'none', display: 'block', marginBottom: '1.25rem' }}>
          <div style={{
            background: 'var(--bg-sage)', borderRadius: '1rem', padding: '1.25rem',
            border: '1px solid var(--primary-light)', display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PenLine size={16} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                Как ты сегодня?
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Дневник сегодня ещё не заполнен. Займёт 3 минуты.</div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          </div>
        </Link>
      )}

      {/* Next meeting */}
      {nextMeeting ? (
        <Link href="/dashboard/meeting" style={{ textDecoration: 'none', display: 'block', marginBottom: '1.25rem' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--primary)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              Следующая встреча →
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{nextMeeting.title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
              <span>{new Date(nextMeeting.date + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
              <span>{nextMeeting.time} МСК</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📅 Следующая встреча будет назначена куратором</div>
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem', marginBottom: '1.25rem' }}>
        {[
          { href: '/dashboard/tasks', icon: CheckSquare, label: 'Задания', sub: `${completedTasks.length} выполнено` },
          { href: '/dashboard/journal', icon: PenLine, label: 'Дневник', sub: hasJournalToday ? 'Заполнен сегодня ✓' : 'Не заполнен сегодня' },
          { href: '/dashboard/chats', icon: Sparkles, label: 'Сообщения', sub: 'Рабочее время' },
          { href: '/dashboard/program', icon: BookOpen, label: 'Программа', sub: `Неделя ${currentWeek} из 4` },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', height: '100%' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.625rem' }}>
                  <Icon size={14} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', marginBottom: '0.15rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Upsell: Base → Plus */}
      {tier === 'base' && (
        <Link href="/checkout?product=plus" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            borderRadius: '1rem', padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, #FFF7F0, #FEF3C7)',
            border: '1.5px solid #F59E0B33',
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '12rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#92400E', marginBottom: '0.2rem' }}>
                ✨ Хотите личную диагностику?
              </div>
              <div style={{ fontSize: '0.78rem', color: '#78350F', lineHeight: 1.5 }}>
                Тариф <strong>Плюс</strong> — добавьте 30-минутную диагностику + индивидуальный план от психолога.
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#92400E' }}>19 990 ₽</div>
              <div style={{ fontSize: '0.72rem', color: '#78350F', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                Узнать больше <ArrowRight size={11} />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Upsell: Plus → Personal */}
      {tier === 'plus' && (
        <Link href="/checkout?product=personal" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            borderRadius: '1rem', padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, var(--primary-light), #FFE4E1)',
            border: '1.5px solid var(--primary-light)',
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '12rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary-dark)', marginBottom: '0.2rem' }}>
                💎 Хотите встречи с психологом?
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Тариф <strong>Персональный</strong> — 2 индивидуальные встречи по 45 минут включены.
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>24 990 ₽</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                Улучшить тариф <ArrowRight size={11} />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Personal: quick book session */}
      {tier === 'personal' && (
        <Link href="/dashboard/psychologist" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            borderRadius: '1rem', padding: '1rem 1.25rem',
            background: 'var(--bg-sage)', border: '1px solid var(--primary-light)',
            display: 'flex', alignItems: 'center', gap: '0.875rem',
          }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={14} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--text)', marginBottom: '0.15rem' }}>
                Записаться на встречу с психологом
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>2 встречи включены в ваш тариф</div>
            </div>
            <ArrowRight size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          </div>
        </Link>
      )}
    </div>
  )
}
