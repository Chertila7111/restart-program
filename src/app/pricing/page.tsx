import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, X } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Тарифы и цены программы Restart',
  description: 'Тарифы программы Restart: от вводной встречи за 1 490 ₽ до карьерного сопровождения. Выберите подходящий формат восстановления после расставания.',
}

const plans = [
  {
    id: 'intro',
    name: 'Вводная встреча',
    price: 1490,
    period: 'разово',
    desc: '90 минут 1 на 1 с психологом. Разбор вашей ситуации и первые шаги.',
    color: '#6D28D9',
    features: [
      { text: '90 минут с психологом', included: true },
      { text: 'Анализ вашего состояния', included: true },
      { text: 'Первые конкретные шаги', included: true },
      { text: 'Рекомендации по программе', included: true },
      { text: 'Групповые встречи', included: false },
      { text: 'Чат поддержки', included: false },
    ],
    cta: 'Записаться на встречу',
    note: 'Стоимость засчитывается при покупке любого тарифа',
  },
  {
    id: 'base',
    name: 'Restart Base',
    price: 14990,
    period: '4 недели',
    desc: '4-недельная групповая программа с психологом и закрытым чатом.',
    color: '#7C3AED',
    features: [
      { text: '4 групповые встречи (90 мин)', included: true },
      { text: 'Закрытый чат 24/7', included: true },
      { text: 'Задания и дневник состояния', included: true },
      { text: 'Запись всех встреч', included: true },
      { text: 'Личная диагностика', included: false },
      { text: 'Индивидуальный план', included: false },
    ],
    cta: 'Выбрать Base',
  },
  {
    id: 'plus',
    name: 'Restart Plus',
    price: 19990,
    period: '4 недели',
    desc: 'Base + личная диагностика и индивидуальный план восстановления.',
    color: '#EC4899',
    highlight: true,
    badge: 'Популярный',
    features: [
      { text: '4 групповые встречи (90 мин)', included: true },
      { text: 'Закрытый чат 24/7', included: true },
      { text: 'Задания и дневник состояния', included: true },
      { text: 'Запись всех встреч', included: true },
      { text: 'Личная диагностика', included: true },
      { text: 'Индивидуальный план', included: true },
    ],
    cta: 'Выбрать Plus',
  },
  {
    id: 'personal',
    name: 'Restart Personal',
    price: 24990,
    period: '4 недели',
    desc: 'Plus + индивидуальная 60-минутная сессия с психологом.',
    color: '#F43F5E',
    features: [
      { text: '4 групповые встречи (90 мин)', included: true },
      { text: 'Закрытый чат 24/7', included: true },
      { text: 'Задания и дневник состояния', included: true },
      { text: 'Запись всех встреч', included: true },
      { text: 'Личная диагностика', included: true },
      { text: 'Индивидуальный план', included: true },
      { text: '1 индивидуальная сессия (60 мин)', included: true },
    ],
    cta: 'Выбрать Personal',
  },
]

const careerPlan = {
  name: 'Career Restart',
  price: 14990,
  oldPrice: 29990,
  desc: 'Полный карьерный трек: выбор направления, резюме, отклики, подготовка к собеседованиям и поддержка в поиске работы.',
  features: [
    'Диагностика профессиональных компетенций',
    'Помощь с выбором направления / специальности',
    'Составление и упаковка резюме',
    'Отклики на вакансии под вас',
    'Подготовка к собеседованиям',
    'Поддержка куратора до результата*',
    'Доступ к базе партнёрских вакансий',
  ],
}

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 100%)', padding: '5rem 0 3rem' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center' }}>
          <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', marginBottom: '1.5rem', display: 'inline-flex' }}>Тарифы</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#1F1535', marginBottom: '1rem' }}>
            Выберите свой формат восстановления
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6B7280', maxWidth: '36rem', margin: '0 auto' }}>
            От вводной встречи до полного сопровождения — найдите то, что подходит именно вам
          </p>
        </div>
      </section>

      {/* Main plans */}
      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))', gap: '1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="card"
                style={{
                  padding: '2rem',
                  position: 'relative',
                  border: plan.highlight ? `2px solid ${plan.color}` : undefined,
                  background: plan.highlight ? 'linear-gradient(135deg, #FEFBF8, #F5F3FF)' : undefined,
                }}
              >
                {plan.badge && (
                  <div style={{ position: 'absolute', top: '-0.875rem', left: '50%', transform: 'translateX(-50%)', padding: '0.375rem 1.25rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, color: 'white', background: `linear-gradient(135deg, #7C3AED, #EC4899)`, whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1F1535', marginBottom: '0.25rem' }}>{plan.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '1rem' }}>{plan.period}</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: plan.color, marginBottom: '0.5rem' }}>
                  {plan.price.toLocaleString('ru-RU')} <span style={{ fontSize: '1rem', color: '#9CA3AF', fontWeight: 400 }}>₽</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>{plan.desc}</p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {plan.features.map((f) => (
                    <li key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: f.included ? '#374151' : '#D1D5DB' }}>
                      {f.included
                        ? <CheckCircle size={16} style={{ color: plan.color, flexShrink: 0 }} />
                        : <X size={16} style={{ color: '#D1D5DB', flexShrink: 0 }} />
                      }
                      {f.text}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?product=${plan.id}`}
                  className={plan.highlight ? 'btn-primary' : 'btn-secondary'}
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  {plan.cta}
                </Link>

                {plan.note && (
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.75rem', textAlign: 'center' }}>{plan.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career track */}
      <section className="section" style={{ background: '#FFFBEB' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <div
            className="card"
            style={{ padding: '3rem', border: '2px solid #F59E0B', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: '16rem' }}>
                <span className="badge" style={{ background: '#FEF3C7', color: '#92400E', marginBottom: '1rem', display: 'inline-flex' }}>Карьерный трек</span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F1535', marginBottom: '1rem' }}>{careerPlan.name}</h2>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F59E0B' }}>{careerPlan.price.toLocaleString('ru-RU')} ₽</span>
                  <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                    <span style={{ textDecoration: 'line-through' }}>{careerPlan.oldPrice.toLocaleString('ru-RU')} ₽</span>
                    {' — скидка 50% для участников Restart'}
                  </div>
                </div>
                <p style={{ color: '#4B5563', marginBottom: '1.5rem', lineHeight: 1.7 }}>{careerPlan.desc}</p>
                <Link href="/checkout?product=career" className="btn-accent" style={{ display: 'inline-flex' }}>
                  Начать карьерный трек →
                </Link>
              </div>
              <div style={{ flex: 1, minWidth: '16rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {careerPlan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>
                      <CheckCircle size={16} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.125rem' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '1rem' }}>
                  * "До результата" — поддержка в активном поиске при выполнении плана. Не является гарантией трудоустройства.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '44rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F1535', marginBottom: '2rem', textAlign: 'center' }}>Вопросы об оплате</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { q: 'Какие способы оплаты?', a: 'Карта (Visa, Mastercard, Мир), ЮKassa, СБП. Оплата безопасная, через защищённое соединение.' },
              { q: 'Есть ли рассрочка?', a: 'Да, при оплате через ЮKassa доступна рассрочка на 3–6 месяцев без переплаты.' },
              { q: 'Возможен ли возврат?', a: 'Да, в течение 7 дней с момента первой встречи при наличии обоснованных претензий — полный возврат.' },
              { q: 'Цена включает все материалы?', a: 'Да. В цену включены все встречи, доступ к чату, материалы и запись встреч.' },
            ].map((faq) => (
              <div key={faq.q} className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#1F1535' }}>{faq.q}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
