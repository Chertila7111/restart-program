import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

function getUserTier(orders: { id: string; product: string; status: string; productName: string; amount: number; createdAt: Date }[]) {
  const paid = orders.filter(o => o.status === 'paid')
  const products = new Set(paid.map(o => o.product))
  if (products.has('personal')) return { tier: 'personal', order: paid.find(o => o.product === 'personal')! }
  if (products.has('plus')) return { tier: 'plus', order: paid.find(o => o.product === 'plus')! }
  if (products.has('base')) return { tier: 'base', order: paid.find(o => o.product === 'base')! }
  if (products.has('intro')) return { tier: 'intro', order: paid.find(o => o.product === 'intro')! }
  return { tier: 'none', order: null }
}

const TIER_INFO: Record<string, { label: string; color: string; features: string[] }> = {
  intro: {
    label: 'Вводная встреча',
    color: '#C28A5E',
    features: ['1 групповая встреча 90 мин', 'Знакомство с форматом', 'Засчитывается при покупке программы'],
  },
  base: {
    label: 'Базовый',
    color: '#4E7B5E',
    features: ['4 групповые встречи', 'Чат с куратором', 'Задания и дневник', 'Записи встреч', 'Материалы программы'],
  },
  plus: {
    label: 'Плюс',
    color: '#4E7B5E',
    features: ['Всё из Базового', 'Персональные рекомендации психолога', 'Приоритетные вопросы в чате', 'Индивидуальный план после программы'],
  },
  personal: {
    label: 'Персональный',
    color: '#3D6249',
    features: ['Всё из Плюс', '2 индивидуальные встречи с психологом (45 мин)', 'Персональная корректировка плана'],
  },
}

const UPGRADE_OPTIONS = [
  { id: 'base', label: 'Базовый', price: '14 990 ₽' },
  { id: 'plus', label: 'Плюс', price: '19 990 ₽' },
  { id: 'personal', label: 'Персональный', price: '24 990 ₽' },
]

export default async function PlanPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const sessionRole = (session.user as any).role as string | undefined

  // Admin: show personal tier without DB query
  if (sessionRole === 'admin') {
    const info = TIER_INFO['personal']
    return (
      <div style={{ maxWidth: '44rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Тариф</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ваш текущий план и доступные обновления</p>
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', borderLeft: `4px solid ${info.color}` }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
            Текущий тариф
          </div>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1rem' }}>{info.label} (Admin)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {info.features.map(f => (
              <div key={f} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: info.color, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  let orders: { id: string; product: string; status: string; productName: string; amount: number; createdAt: Date }[] = []
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await (prisma as any).user.findUnique({
      where: { email: session.user.email! },
      include: { orders: { orderBy: { createdAt: 'desc' } } },
    })
    orders = user?.orders ?? []
  } catch (err) { console.error('[plan] DB error:', err) }

  const { tier, order } = getUserTier(orders)
  const info = tier !== 'none' ? TIER_INFO[tier] : null

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Тариф</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ваш текущий план и доступные обновления</p>

      {/* Current plan */}
      {tier === 'none' ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌱</div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Вы ещё не в программе</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Начните с вводной встречи или выберите полный тариф.
          </p>
          <Link href="/pricing" className="btn-primary">Выбрать тариф →</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', borderLeft: `4px solid ${info!.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
                Текущий тариф
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>{info!.label}</h2>
            </div>
            {order && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: info!.color }}>
                  {order.amount.toLocaleString('ru-RU')} ₽
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  {new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {info!.features.map(f => (
              <div key={f} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle size={14} style={{ color: info!.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade */}
      {tier !== 'personal' && (
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>
            {tier === 'none' ? 'Выберите тариф' : 'Улучшить тариф'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {UPGRADE_OPTIONS.filter(o =>
              tier === 'none' ? true :
              tier === 'intro' ? true :
              tier === 'base' ? ['plus','personal'].includes(o.id) :
              tier === 'plus' ? ['personal'].includes(o.id) : false
            ).map(opt => {
              const optInfo = TIER_INFO[opt.id]
              return (
                <Link key={opt.id} href={`/checkout?product=${opt.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.2rem' }}>{optInfo.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{optInfo.features.slice(0, 2).join(' · ')}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>{opt.price}</div>
                      <ArrowRight size={14} style={{ color: 'var(--text-light)' }} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {tier !== 'none' && tier !== 'personal' && 'Стоимость текущего тарифа засчитывается. '}
            Вопросы — напишите нам:{' '}
            <a href="mailto:support@restart-program.ru" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              support@restart-program.ru
            </a>
          </p>
        </div>
      )}

      {/* Order history */}
      {orders.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>История платежей</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {orders.map(o => (
              <div key={o.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{o.productName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{new Date(o.createdAt).toLocaleDateString('ru-RU')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{o.amount.toLocaleString('ru-RU')} ₽</span>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: '9999px',
                    background: o.status === 'paid' ? 'var(--primary-light)' : '#FEF3C7',
                    color: o.status === 'paid' ? 'var(--primary-dark)' : '#92400E',
                  }}>
                    {o.status === 'paid' ? 'Оплачен' : 'Ожидает'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
