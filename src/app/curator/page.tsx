import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { Users, Users2, MessageCircle, ArrowRight, CheckCircle, Clock } from 'lucide-react'

export default async function CuratorHomePage() {
  const session = await getServerSession(authOptions)
  const curatorId = (session?.user as any)?.id as string

  let clientsCount = 0
  let groupsCount = 0
  let unreadCount = 0
  let recentClients: { id: string; name: string; email: string; product: string; status: string }[] = []

  try {
    await ensureDb()

    const clients = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email,
             COALESCE(o.product, 'none') as product,
             COALESCE(o.status, 'none') as status
      FROM "User" u
      LEFT JOIN "Order" o ON o.userId = u.id AND o.status = 'paid'
      JOIN "GroupParticipant" gp ON gp.userId = u.id
      JOIN "Group" g ON g.id = gp.groupId AND g.curatorId = ?
      WHERE gp.status = 'active'
      GROUP BY u.id
      ORDER BY u.createdAt DESC
    `, curatorId)
    const clientsArr = Array.isArray(clients) ? clients : []
    clientsCount = clientsArr.length
    recentClients = clientsArr.slice(0, 5)

    const groups = await (prisma as any).$queryRawUnsafe(`
      SELECT COUNT(*) as cnt FROM "Group" WHERE curatorId = ? AND status != 'completed'
    `, curatorId)
    groupsCount = Array.isArray(groups) && groups[0] ? Number(groups[0].cnt) : 0

    const unread = await (prisma as any).$queryRawUnsafe(`
      SELECT COUNT(*) as cnt FROM "Message" m
      JOIN "ConversationMember" cm ON cm.conversationId = m.conversationId AND cm.userId = ?
      WHERE m.senderId != ?
        AND m.createdAt > datetime('now', '-7 days')
    `, curatorId, curatorId)
    unreadCount = Array.isArray(unread) && unread[0] ? Number(unread[0].cnt) : 0
  } catch { /* DB not ready */ }

  const firstName = session?.user?.name?.split(' ')[0] || 'Куратор'
  const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
          Добро пожаловать, {firstName}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{today}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,11rem),1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { icon: Users,         label: 'Мои участники',   value: clientsCount, href: '/curator/clients' },
          { icon: Users2,        label: 'Активных групп',  value: groupsCount,  href: '/curator/groups' },
          { icon: MessageCircle, label: 'Непрочитанных',   value: unreadCount,  href: '/curator/chats' },
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Icon size={16} style={{ color: '#C28A5E' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent clients */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Последние участники</h2>
          <Link href="/curator/clients" style={{ fontSize: '0.8rem', color: '#C28A5E', textDecoration: 'none', fontWeight: 600 }}>
            Все →
          </Link>
        </div>
        {recentClients.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <Users size={32} style={{ color: 'var(--text-light)', margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Участники появятся после распределения по группам.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {recentClients.map((c: any) => (
              <Link key={c.id} href="/curator/clients" style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#92400E', flexShrink: 0 }}>
                    {(c.name || c.email)[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name || c.email}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: c.status === 'paid' ? '#059669' : 'var(--text-light)', flexShrink: 0 }}>
                    {c.status === 'paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {c.product !== 'none' ? c.product : 'нет тарифа'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,15rem),1fr))', gap: '0.875rem' }}>
        {[
          { href: '/curator/clients', icon: Users,         label: 'Участники',    sub: 'Список закреплённых за вами' },
          { href: '/curator/groups',  icon: Users2,        label: 'Группы',       sub: 'Состав и расписание' },
          { href: '/curator/chats',   icon: MessageCircle, label: 'Чаты',         sub: 'Переписка с участниками' },
        ].map(({ href, icon: Icon, label, sub }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1.125rem' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.625rem' }}>
                <Icon size={14} style={{ color: '#C28A5E' }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', marginBottom: '0.15rem' }}>{label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center' }}>
        Кабинет куратора · Снова с собой
      </p>
    </div>
  )
}
