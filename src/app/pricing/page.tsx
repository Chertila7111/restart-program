import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock, Users } from 'lucide-react'
import IntroCreditClient from './IntroCreditClient'

export const metadata: Metadata = {
  title: 'Тарифы и цены программы «Снова с собой»',
  description: 'Тарифы программы «Снова с собой»: от вводной встречи за 1 490 ₽ до индивидуальной работы с психологом. Для тех, кто переживает расставание или хочет разобраться в сложных отношениях.',
}

const groupPlans = [
  {
    id: 'base',
    name: 'Base',
    price: 14990,
    badge: null as string | null,
    highlight: false,
    desc: 'Группа и структура. Программа с психологом, заданиями и чатом куратора.',
    features: [
      '4 групповые встречи по 90 минут',
      'Группа 8–12 человек',
      'Чат с куратором в рабочее время',
      'Задания между встречами',
      'Дневник состояния',
      'Записи основных материалов встречи',
      'Материалы программы',
    ],
    cta: 'Выбрать Base',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 19990,
    badge: 'Чаще всего выбирают' as string | null,
    highlight: true,
    desc: 'Base + личная диагностика 30 минут + индивидуальный план восстановления.',
    features: [
      'Всё из Base',
      'Личная диагностика (30 мин) перед началом',
      'Индивидуальный план восстановления',
      'Персональные рекомендации психолога',
      'Приоритетные вопросы в чате',
    ],
    cta: 'Выбрать Plus',
  },
  {
    id: 'plus-pro',
    name: 'Plus Pro',
    price: 24990,
    badge: null as string | null,
    highlight: false,
    desc: 'Plus + 1 индивидуальная встреча с психологом 45 минут + разбор дневника.',
    features: [
      'Всё из Plus',
      '1 индивидуальная встреча с психологом (45 мин)',
      'Разбор личной ситуации',
      'Корректировка индивидуального плана',
      'Рекомендации после встречи',
    ],
    cta: 'Выбрать Plus Pro',
  },
]

const individualPlans = [
  {
    id: 'personal-start',
    name: 'Personal Start',
    price: 19990,
    sessions: 4,
    badge: null as string | null,
    highlight: false,
    desc: 'Для спокойного старта и первичного плана восстановления.',
    features: [
      '4 встречи по 45 минут',
      'Диагностика состояния',
      'Личный план',
      'Задания после встреч',
      'Дневник состояния',
    ],
    cta: 'Выбрать Start',
  },
  {
    id: 'personal-balance',
    name: 'Personal Balance',
    price: 29990,
    sessions: 6 as number,
    badge: 'Чаще всего выбирают' as string | null,
    highlight: true,
    desc: 'Для тех, кто хочет пройти восстановление глубже и без группы.',
    features: [
      '6 встреч по 45 минут',
      'Работа с тревогой и откатами',
      'Работа с самооценкой и границами',
      'Личный план',
      'Задания и дневник',
      'Итоговые рекомендации',
    ],
    cta: 'Выбрать Balance',
  },
  {
    id: 'personal-deep',
    name: 'Personal Deep',
    price: 39990,
    sessions: 8,
    badge: null as string | null,
    highlight: false,
    desc: 'Для более глубокой личной работы и сопровождения.',
    features: [
      '8 встреч по 45 минут',
      'Расширенная диагностика',
      'Работа с эмоциональной зависимостью',
      'Корректировка плана',
      'Задания и дневник',
      'Итоговая встреча',
      'Рекомендации на следующий месяц',
    ],
    cta: 'Выбрать Deep',
  },
]

const careerFeatures = [
  'Диагностика профессиональных компетенций',
  'Помощь с выбором направления / специальности',
  'Составление и упаковка резюме',
  'Поиск подходящих вакансий',
  'Подготовка к собеседованиям',
  'Поддержка куратора в период активного поиска',
  'Помощь с поиском подходящих вакансий и планом откликов',
]

function ChapterLabel({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
      <span style={{
        fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary)',
        background: 'var(--primary-light)', padding: '0.3rem 0.875rem',
        borderRadius: '9999px', letterSpacing: '0.1em', flexShrink: 0,
        textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        {num}
      </span>
      <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)', minWidth: '2rem' }} />
    </div>
  )
}

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-soft)', padding: '5rem 0 4rem' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center', maxWidth: '44rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
            Выберите свой формат
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Можно начать с короткой вводной встречи — без обязательств. Или сразу выбрать программу.
          </p>
        </div>
      </section>

      {/* ── Шаг 01: Вводная встреча ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '64rem' }}>
          <ChapterLabel num="шаг 01" title="Начните с вводной встречи" />

          <div style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1.5px solid var(--border)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            display: 'flex',
            gap: '2.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {/* Price + CTA */}
            <div style={{ minWidth: '180px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Разово
              </div>
              <div style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text)', lineHeight: 1, marginBottom: '1.5rem' }}>
                1 490{' '}
                <span style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--text-muted)' }}>₽</span>
              </div>
              <Link
                href="/checkout?product=intro"
                className="btn-primary"
                style={{ display: 'block', textAlign: 'center' }}
              >
                Записаться →
              </Link>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.625rem', textAlign: 'center', lineHeight: 1.5 }}>
                Засчитывается в стоимость любого тарифа
              </p>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch', flexShrink: 0, minHeight: '100px' }} />

            {/* Description */}
            <div style={{ flex: 1, minWidth: '240px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Вводная встреча
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} /> 90 минут
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Users size={13} /> Небольшая группа
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {[
                  '90 минут в небольшой группе с психологом',
                  'Можно просто слушать — не нужно рассказывать о себе',
                  'Знакомство с форматом программы',
                  'Первые рекомендации по вашей ситуации',
                  'Ответы на вопросы',
                  'Стоимость засчитывается при покупке программы',
                ].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text)' }}>
                    <CheckCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Шаг 02: Групповые тарифы ── */}
      <section className="section" style={{ background: 'var(--bg-soft)' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '64rem' }}>
          <ChapterLabel num="шаг 02" title="Групповой формат" />

          <IntroCreditClient />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.25rem',
            alignItems: 'stretch',
          }}>
            {groupPlans.map((plan) => {
              return (
              <div
                key={plan.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: plan.highlight ? 'var(--bg-sage)' : 'white',
                  border: plan.highlight ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  position: 'relative',
                  boxShadow: plan.highlight ? '0 8px 32px rgba(78,123,94,0.12)' : undefined,
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: '-0.875rem', left: '50%', transform: 'translateX(-50%)',
                    padding: '0.375rem 1.25rem', borderRadius: '9999px',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white',
                    background: 'var(--primary)', whiteSpace: 'nowrap',
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1C2B23', marginBottom: '0.2rem' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>4 недели · группа</p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '2.4rem', fontWeight: 900, lineHeight: 1,
                    color: plan.highlight ? 'var(--primary)' : '#1C2B23',
                  }}>
                    {plan.price.toLocaleString('ru-RU')}
                  </span>
                  {' '}
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>₽</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  {plan.desc}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#1C2B23' }}>
                      <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 'auto', paddingTop: '1.75rem' }}>
                  <Link
                    href={`/checkout?product=${plan.id}`}
                    className={plan.highlight ? 'btn-primary' : 'btn-secondary'}
                    style={{ display: 'block', textAlign: 'center' }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
              )
            })}
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Чат с куратором работает пн–пт, 10:00–19:00. Ответы в рабочее время, не круглосуточно.
          </p>
        </div>
      </section>

      {/* ── Шаг 03: Индивидуальный формат ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '64rem' }}>
          <ChapterLabel num="шаг 03" title="Индивидуальный формат" />

          <div style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1.5px solid var(--border)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
              Хотите работать только один на один?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0, maxWidth: '52rem' }}>
              Индивидуальный формат для тех, кому сейчас важнее личная работа один на один.
              Если хочется глубже разобрать личную ситуацию, можно выбрать индивидуальный пакет с психологом.
              Все встречи проходят онлайн. После каждой встречи вы получаете упражнения и рекомендации,
              а в личном кабинете можете вести дневник состояния и отслеживать динамику.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.25rem',
            alignItems: 'stretch',
          }}>
            {individualPlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: plan.highlight ? 'var(--bg-sage)' : 'white',
                  border: plan.highlight ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  position: 'relative',
                  boxShadow: plan.highlight ? '0 8px 32px rgba(78,123,94,0.12)' : undefined,
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: '-0.875rem', left: '50%', transform: 'translateX(-50%)',
                    padding: '0.375rem 1.25rem', borderRadius: '9999px',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white',
                    background: 'var(--primary)', whiteSpace: 'nowrap',
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1C2B23', marginBottom: '0.2rem' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{plan.sessions} {plan.sessions === 4 ? 'встречи' : 'встреч'} · один на один</p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '2.4rem', fontWeight: 900, lineHeight: 1,
                    color: plan.highlight ? 'var(--primary)' : '#1C2B23',
                  }}>
                    {plan.price.toLocaleString('ru-RU')}
                  </span>
                  {' '}
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>₽</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  {plan.desc}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#1C2B23' }}>
                      <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 'auto', paddingTop: '1.75rem' }}>
                  <Link
                    href={`/checkout?product=${plan.id}`}
                    className={plan.highlight ? 'btn-primary' : 'btn-secondary'}
                    style={{ display: 'block', textAlign: 'center' }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Шаг 04: Карьерный трек ── */}
      <section className="section" style={{ background: 'var(--bg-soft)' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '64rem' }}>
          <ChapterLabel num="шаг 04" title="Карьерный трек — когда будете готовы" />

          <div style={{ background: 'white', borderRadius: '1.5rem', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
            {/* Top banner */}
            <div style={{
              background: 'var(--secondary-light)',
              padding: '1.25rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              borderBottom: '1px solid #e8d5be',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Карьерный трек
              </span>
              <span style={{ color: '#e8d5be' }}>·</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary)', margin: 0 }}>
                Необязательный следующий шаг — когда эмоциональное состояние стало устойчивее (обычно ближе к 3–4 неделе программы)
              </p>
            </div>

            <div style={{ padding: '2.5rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Left */}
              <div style={{ minWidth: '200px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1C2B23', marginBottom: '0.25rem' }}>
                  14 990 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}>₽</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  <span style={{ textDecoration: 'line-through' }}>29 990 ₽</span>
                  {' '}— скидка 50% для участников программы
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Помогаем с резюме, вакансиями, откликами и подготовкой к собеседованиям. Мы не обещаем работу — результат зависит от рынка и вашей активности.
                </p>
                <Link href="/checkout?product=career" className="btn-secondary" style={{ display: 'inline-flex' }}>
                  Узнать подробнее →
                </Link>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch', flexShrink: 0, minHeight: '80px' }} />

              {/* Right: features */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {careerFeatures.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <CheckCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '1.25rem', lineHeight: 1.6 }}>
                  Не является гарантией трудоустройства.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Шаг 05: FAQ ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '64rem' }}>
          <ChapterLabel num="шаг 05" title="Вопросы об оплате" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
            {[
              { q: 'Какие способы оплаты?', a: 'Карта (Visa, Mastercard, Мир), ЮKassa, СБП. Оплата через защищённое соединение.' },
              { q: 'Есть ли рассрочка?', a: 'Да, при оплате через ЮKassa доступна рассрочка на 3–6 месяцев без переплаты.' },
              { q: 'Возможен ли возврат?', a: 'Возврат только за неоказанные услуги. Вводную можно отменить до начала. По программе и пакетам — за оставшиеся непроведённые встречи. Уже проведённые встречи не возвращаются. Если встреча не состоялась по нашей вине — предложим новую дату или вернём её стоимость. Подробнее — в публичной оферте.' },
              { q: 'Цена включает все материалы?', a: 'Да. В цену входят все встречи, доступ к чату с куратором, задания, записи основных материалов и дневник.' },
            ].map((faq) => (
              <div key={faq.q} style={{
                background: 'white',
                borderRadius: '1.25rem',
                border: '1.5px solid var(--border)',
                padding: '1.5rem',
              }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1C2B23', fontSize: '0.95rem' }}>{faq.q}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
