import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { BookOpen, MessageCircle, Video, FileText, ArrowRight } from 'lucide-react'
import SignOutButton from './SignOutButton'

export default async function CabinetPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login?callbackUrl=/cabinet')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { orders: { orderBy: { createdAt: 'desc' } } },
  })

  if (!user) redirect('/auth/login')

  const activeOrder = user.orders.find((o) => o.status === 'paid')

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 100%)', padding: '4rem 0 2rem' }}>
        <div className="container mx-auto px-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F1535' }}>
                Добро пожаловать, {user.name || 'участник'}!
              </h1>
              <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>{user.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6">
          {activeOrder ? (
            <>
              {/* Active program */}
              <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #EDE9FE, #FCE7F3)', border: '2px solid #7C3AED' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge" style={{ background: '#7C3AED', color: 'white', marginBottom: '0.75rem', display: 'inline-flex' }}>Активная программа</span>
                    <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1F1535' }}>{activeOrder.productName}</h2>
                    <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>Оплачено: {new Date(activeOrder.createdAt).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7C3AED' }}>
                      {activeOrder.amount.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1F1535', marginBottom: '1.5rem' }}>Материалы программы</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
                {[
                  { icon: Video, title: 'Встречи', desc: 'Расписание и записи групповых встреч', href: '#meetings' },
                  { icon: MessageCircle, title: 'Чат поддержки', desc: 'Закрытая группа участников программы', href: '#chat' },
                  { icon: BookOpen, title: 'Задания', desc: 'Задания и дневник состояния', href: '#tasks' },
                  { icon: FileText, title: 'Материалы', desc: 'PDF-материалы и рабочие тетради', href: '#materials' },
                ].map((r) => {
                  const Icon = r.icon
                  return (
                    <div key={r.title} className="card" style={{ padding: '1.5rem' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <Icon size={18} style={{ color: '#7C3AED' }} />
                      </div>
                      <h3 style={{ fontWeight: 700, color: '#1F1535', marginBottom: '0.25rem' }}>{r.title}</h3>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{r.desc}</p>
                      <a href={r.href} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#7C3AED', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                        Открыть <ArrowRight size={14} />
                      </a>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            /* No active program */
            <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '36rem', margin: '0 auto' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
              <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#1F1535', marginBottom: '0.75rem' }}>
                Вы ещё не в программе
              </h2>
              <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                Выберите тариф и начните восстановление. Первая встреча — уже на следующей неделе.
              </p>
              <Link href="/pricing" className="btn-primary">Выбрать тариф →</Link>
            </div>
          )}

          {/* Order history */}
          {user.orders.length > 0 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1F1535', marginBottom: '1.5rem' }}>История заказов</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {user.orders.map((order) => (
                  <div key={order.id} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1F1535' }}>{order.productName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 700, color: '#1F1535' }}>{order.amount.toLocaleString('ru-RU')} ₽</span>
                      <span className="badge" style={{
                        background: order.status === 'paid' ? '#D1FAE5' : '#FEF3C7',
                        color: order.status === 'paid' ? '#065F46' : '#92400E',
                        fontSize: '0.75rem',
                      }}>
                        {order.status === 'paid' ? 'Оплачен' : 'Ожидает оплаты'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
