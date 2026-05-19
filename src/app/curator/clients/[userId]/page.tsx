import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Calendar, CreditCard, Wifi, WifiOff, Users2 } from 'lucide-react'

const TIER_LABEL: Record<string, string> = {
  intro: 'Вводная', base: 'Base', plus: 'Plus', 'plus-pro': 'Plus Pro', personal: 'Personal', none: 'Нет тарифа',
}

function onlineStatus(lastSeenAt: string | null): { label: string; color: string; isOnline: boolean } {
  if (!lastSeenAt) return { label: 'Не заходил(а)', color: '#9CA3AF', isOnline: false }
  const diff = Date.now() - new Date(lastSeenAt).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 5) return { label: 'Онлайн', color: '#10B981', isOnline: true }
  if (min < 60) return { label: `${min} мин назад`, color: '#6B7280', isOnline: false }
  const hours = Math.floor(min / 60)
  if (hours < 24) return { label: `${hours} ч назад`, color: '#6B7280', isOnline: false }
  const days = Math.floor(hours / 24)
  return { label: `${days} дн назад`, color: '#9CA3AF', isOnline: false }
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function CuratorClientProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const session = await getServerSession(authOptions)
  const curatorId = (session?.user as any)?.id as string
  const role = (session?.user as any)?.role as string

  let client: any = null
  let groupInfo: any = null

  try {
    await ensureDb()

    const users = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, u.createdAt, u.lastSeenAt,
             COALESCE(o.product, 'none') as product, o.paidAt,
             COALESCE(b.bookingCount, 0) as bookingCount,
             up.about, up.photoUrl
      FROM "User" u
      LEFT JOIN (
        SELECT userId, product, createdAt as paidAt FROM "Order"
        WHERE status = 'paid' GROUP BY userId
      ) o ON o.userId = u.id
      LEFT JOIN (
        SELECT userId, COUNT(*) as bookingCount FROM "Booking" GROUP BY userId
      ) b ON b.userId = u.id
      LEFT JOIN "UserProfile" up ON up.userId = u.id
      WHERE u.id = ? LIMIT 1
    `, userId)

    if (!Array.isArray(users) || users.length === 0) return notFound()
    client = users[0]

    const groupCheck = await (prisma as any).$queryRawUnsafe(`
      SELECT g.title as groupTitle, g.currentWeek, g.id as groupId
      FROM "GroupParticipant" gp
      JOIN "Group" g ON g.id = gp.groupId
      WHERE gp.userId = ? AND (? = 'admin' OR g.curatorId = ?) AND gp.status = 'active'
      LIMIT 1
    `, userId, role, curatorId)

    if (!Array.isArray(groupCheck) || groupCheck.length === 0) return notFound()
    groupInfo = groupCheck[0]
  } catch { return notFound() }

  if (!client) return notFound()

  const os = onlineStatus(client.lastSeenAt)
  const initials = client.name
    ? client.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : client.email[0].toUpperCase()

  return (
    <div style={{ maxWidth: '52rem' }}>
      <Link href="/curator/clients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={13} /> Все участники
      </Link>

      {/* Header card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem', fontWeight: 700, color: '#92400E', overflow: 'hidden' }}>
          {client.photoUrl
            ? <img src={client.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
            : initials
          }
        </div>
        <div style={{ flex: 1, minWidth: '12rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.2rem' }}>{client.name || client.email}</h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{client.email}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: os.color }}>
            {os.isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            {os.label}
          </div>
        </div>
        <Link
          href={`/curator/chats?with=${userId}&name=${encodeURIComponent(client.name || client.email)}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.75rem', background: '#FEF3C7', color: '#92400E', fontWeight: 600, fontSize: '0.825rem', textDecoration: 'none', flexShrink: 0 }}
        >
          <MessageCircle size={14} /> Написать
        </Link>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,13rem),1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link href={`/curator/groups/${groupInfo.groupId}`} style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Users2 size={13} style={{ color: '#C28A5E' }} />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Группа</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{groupInfo.groupTitle}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Неделя {groupInfo.currentWeek} из 4</div>
          </div>
        </Link>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <CreditCard size={13} style={{ color: '#C28A5E' }} />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Тариф</div>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{TIER_LABEL[client.product] || client.product}</div>
          {client.paidAt && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>с {fmtDate(client.paidAt)}</div>}
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Calendar size={13} style={{ color: '#C28A5E' }} />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Созвонов</div>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>{Number(client.bookingCount)}</div>
        </div>
      </div>

      {/* Bio */}
      {client.about && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.75rem' }}>О себе</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{client.about}</p>
        </div>
      )}

      {/* Footer */}
      <div className="card-flat" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <Calendar size={15} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Зарегистрирован(а): <strong style={{ color: 'var(--text)' }}>{fmtDate(client.createdAt)}</strong>
        </span>
      </div>
    </div>
  )
}
