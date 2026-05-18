import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { Users, Calendar, FileText, Star, Clock, ArrowRight, AlertCircle } from 'lucide-react'

export default async function SpecialistHomePage() {
  const session = await getServerSession(authOptions)
  const specialistId = (session?.user as any)?.id as string

  let groups: { id: string; title: string; status: string; currentWeek: number }[] = []
  let recentJournals: { userId: string; date: string; mood: number; anxiety: number }[] = []
  let pendingRecs = 0

  try {
    await ensureDb()
    const raw = await (prisma as any).$queryRawUnsafe(
      `SELECT id, title, status, currentWeek FROM "Group" WHERE psychologistId = ? AND status != 'completed' LIMIT 5`,
      specialistId
    )
    groups = Array.isArray(raw) ? raw : []

    const journals = await (prisma as any).$queryRawUnsafe(`
      SELECT DISTINCT j.userId, j.date, j.mood, j.anxiety
      FROM "JournalEntry" j
      JOIN "GroupParticipant" gp ON gp.userId = j.userId
      JOIN "Group" g ON g.id = gp.groupId
      WHERE g.psychologistId = ? AND g.status != 'completed' AND gp.status = 'active'
        AND j.sharedWithSpecialist = 1
      ORDER BY j.createdAt DESC LIMIT 10
    `, specialistId)
    recentJournals = Array.isArray(journals) ? journals : []
  } catch { /* DB not ready */ }

  const alertParticipants = recentJournals.filter((j: any) => j.mood <= 3 || j.anxiety >= 8)
  const firstName = session?.user?.name?.split(' ')[0] || 'Психолог'
  const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
          Добро пожаловать, {firstName}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{today}</p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 11rem), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: Users,    label: 'Групп',       value: groups.length,           href: '/specialist/groups' },
          { icon: FileText, label: 'Новых дневников', value: recentJournals.length, href: '/specialist/journals' },
          { icon: Star,     label: 'Ожид. рекомендаций', value: pendingRecs,       href: '/specialist/recommendations' },
          { icon: Calendar, label: 'Встреч сегодня',  value: 0,                   href: '/specialist/calendar' },
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Icon size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Alerts */}
      {alertParticipants.length > 0 && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <AlertCircle size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#92400E', marginBottom: '0.25rem' }}>
                {alertParticipants.length} {alertParticipants.length === 1 ? 'участник отметил' : 'участника отметили'} низкое состояние
              </div>
              <p style={{ fontSize: '0.8rem', color: '#78350F', margin: 0, lineHeight: 1.5 }}>
                Посмотрите записи дневников — возможно, нужен дополнительный контакт до следующей встречи.
              </p>
              <Link href="/specialist/journals" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.625rem', fontSize: '0.8rem', fontWeight: 600, color: '#D97706', textDecoration: 'none' }}>
                Открыть дневники <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Groups */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Мои группы</h2>
          <Link href="/specialist/groups" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            Все группы →
          </Link>
        </div>
        {groups.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <Users size={32} style={{ color: 'var(--text-light)', margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Групп пока нет. Администратор назначит вас в группу.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {groups.map((g: any) => (
              <Link key={g.id} href={`/specialist/groups/${g.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.2rem' }}>{g.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Неделя {g.currentWeek} из 4 · {g.status === 'active' ? 'Активна' : g.status === 'recruiting' ? 'Набор' : 'Завершена'}
                    </div>
                  </div>
                  <ArrowRight size={15} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }}>
        {[
          { href: '/specialist/availability', icon: Clock,     label: 'Настроить слоты',    sub: 'Свободное время для записи' },
          { href: '/specialist/sessions',     icon: Calendar,  label: 'Встречи',            sub: 'Запланированные и прошедшие' },
          { href: '/specialist/clients',      icon: Users,     label: 'Участники',          sub: 'Все закреплённые за вами' },
          { href: '/specialist/profile',      icon: Star,      label: 'Мой профиль',        sub: 'Специализация и подход' },
        ].map(({ href, icon: Icon, label, sub }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.625rem' }}>
                <Icon size={14} style={{ color: 'var(--primary)' }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', marginBottom: '0.15rem' }}>{label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center', lineHeight: 1.6 }}>
        Кабинет психолога · Снова с собой
      </p>
    </div>
  )
}
