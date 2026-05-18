import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { MessageCircle, CheckCircle, Clock, UserX } from 'lucide-react'

const TIER_LABEL: Record<string, string> = {
  intro: 'Вводная', base: 'Base', plus: 'Plus', 'plus-pro': 'Plus Pro', personal: 'Personal', none: 'Нет тарифа',
}
const TIER_COLOR: Record<string, string> = {
  intro: '#6B7280', base: '#4E7B5E', plus: '#3D6249', 'plus-pro': '#2D5A3D', personal: '#C28A5E', none: '#9CA3AF',
}

export default async function CuratorClientsPage() {
  const session = await getServerSession(authOptions)
  const curatorId = (session?.user as any)?.id as string
  const role = (session?.user as any)?.role as string

  let clients: any[] = []

  try {
    await ensureDb()
    const raw = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, u.createdAt,
             COALESCE(o.product, 'none') as product,
             g.title as groupTitle, g.currentWeek
      FROM "User" u
      LEFT JOIN (
        SELECT userId, product, status FROM "Order"
        WHERE status = 'paid'
        GROUP BY userId
      ) o ON o.userId = u.id
      JOIN "GroupParticipant" gp ON gp.userId = u.id AND gp.status = 'active'
      JOIN "Group" g ON g.id = gp.groupId AND ${role === 'admin' ? '1=1' : 'g.curatorId = ?'}
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY u.createdAt DESC
    `, ...(role === 'admin' ? [] : [curatorId]))
    clients = Array.isArray(raw) ? raw : []
  } catch { /* DB not ready */ }

  return (
    <div style={{ maxWidth: '52rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Мои участники</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{clients.length} активных участников</p>
      </div>

      {clients.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <UserX size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Участников пока нет</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Участники появятся после того как администратор добавит вас как куратора в группу.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {clients.map((c: any) => {
            const tier = c.product || 'none'
            return (
              <div key={c.id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#92400E', flexShrink: 0 }}>
                  {(c.name || c.email)[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: '10rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.15rem' }}>
                    {c.name || '—'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{c.email}</div>
                  {c.groupTitle && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                      {c.groupTitle} · Неделя {c.currentWeek} из 4
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: TIER_COLOR[tier] || '#6B7280', background: tier === 'none' ? '#F3F4F6' : '#FEF3C7', padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>
                    {TIER_LABEL[tier] || tier}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href="/curator/chats" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#C28A5E', fontWeight: 600, textDecoration: 'none' }}>
                      <MessageCircle size={13} /> Написать
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
