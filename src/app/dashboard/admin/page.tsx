import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminPanel } from './AdminPanel'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const sessionRole = (session.user as any).role as string | undefined
  if (sessionRole !== 'admin') redirect('/dashboard')

  let users: { id: string; name: string | null; email: string; role: string; createdAt: Date; orders: { status: string; product: string }[] }[] = []
  let leads: { id: string; name: string; email: string; phone: string | null; message: string | null; createdAt: Date }[] = []
  let totalUsers = 0
  let totalPaid = 0

  try {
    users = await prisma.user.findMany({
      include: { orders: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    totalUsers = await prisma.user.count()
    totalPaid = await prisma.order.count({ where: { status: 'paid' } })
    leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  } catch { /* DB unavailable */ }

  const serialized = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    orders: u.orders,
    hasPaid: u.orders.some(o => o.status === 'paid'),
    tier: (() => {
      const paid = u.orders.filter(o => o.status === 'paid').map(o => o.product)
      if (paid.includes('personal')) return 'personal'
      if (paid.includes('plus')) return 'plus'
      if (paid.includes('base')) return 'base'
      if (paid.includes('intro')) return 'intro'
      return 'none'
    })(),
  }))

  return (
    <div style={{ maxWidth: '56rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Панель администратора</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Управление пользователями и статистика</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Пользователей', value: totalUsers || users.length, icon: '👥' },
          { label: 'Платных', value: users.filter(u => u.orders.some(o => o.status === 'paid')).length, icon: '💳' },
          { label: 'Психологов', value: users.filter(u => u.role === 'psychologist').length, icon: '🧠' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>{stat.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <a href="/dashboard/admin/meetings" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.625rem 1.125rem', borderRadius: '0.75rem',
          background: 'var(--primary)', color: 'white', textDecoration: 'none',
          fontWeight: 600, fontSize: '0.875rem',
        }}>
          📅 Управление встречами
        </a>
      </div>

      <AdminPanel users={serialized} />

      {/* Leads */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
          Заявки с сайта ({leads.length})
        </h2>
        {leads.length === 0 ? (
          <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Заявок пока нет</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {leads.map(lead => (
              <div key={lead.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{lead.name}</span>
                    {' · '}
                    <a href={`mailto:${lead.email}`} style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>{lead.email}</a>
                    {lead.phone && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{lead.phone}</span>}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                    {new Date(lead.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {lead.message && (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, background: 'var(--bg-soft)', padding: '0.625rem 0.875rem', borderRadius: '0.5rem' }}>
                    {lead.message}
                  </p>
                )}
                <div style={{ marginTop: '0.625rem' }}>
                  <a href={`mailto:${lead.email}?subject=Ответ на вашу заявку`} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                    Ответить →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
