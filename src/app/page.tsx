import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Heart, Users, Star, ArrowRight, Shield, Clock, Zap } from 'lucide-react'
import { OrganizationSchema, ServiceSchema, FaqSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Restart — восстановление после расставания',
  description:
    'Программа восстановления и нового старта после расставания. Психолог, группа поддержки, задания и карьерный трек. 4 недели — и вы снова в движении.',
}

const benefits = [
  { icon: Heart, title: 'Эмоциональная поддержка', desc: 'Психолог и группа людей в похожей ситуации — вы не одни.' },
  { icon: Shield, title: 'Безопасное пространство', desc: 'Закрытая группа без осуждения. Только поддержка и честный разговор.' },
  { icon: Zap, title: 'Конкретный план', desc: 'Задания, дневник, чёткий маршрут — не просто разговоры, а действия.' },
  { icon: Users, title: 'Живое сообщество', desc: 'Чат 24/7, групповые встречи, люди, которые понимают вас.' },
  { icon: Clock, title: '4 недели — результат', desc: 'Структурированная программа: каждая неделя — новый этап восстановления.' },
  { icon: ArrowRight, title: 'Карьерный трек', desc: 'Возвращение к работе, доходу и целям — как бонус для участников.' },
]

const steps = [
  { num: '01', title: 'Эмоциональная стабилизация', desc: 'Понимаете, что происходит. Перестаёте бороться с болью — начинаете работать с ней.', week: 'Неделя 1' },
  { num: '02', title: 'Восстановление самооценки', desc: 'Возвращаете ощущение себя. Практики для восстановления уверенности и внутренней опоры.', week: 'Неделя 2' },
  { num: '03', title: 'Личный план жизни', desc: 'Формируете образ будущего: что хотите, к чему идёте, что для вас важно.', week: 'Неделя 3' },
  { num: '04', title: 'Движение вперёд', desc: 'Режим, деньги, работа, социальная жизнь — реальные шаги к новому этапу.', week: 'Неделя 4' },
]

const testimonials = [
  { name: 'Анна, 28 лет', text: 'После расставания я не могла работать и вообще жить нормально. Restart буквально вытащил меня. Через 4 недели я не просто пережила это — я начала строить новую жизнь.', rating: 5, product: 'Restart Plus' },
  { name: 'Михаил, 32 года', text: 'Скептически относился к "группам поддержки", но друг уговорил попробовать. Был поражён: никакой жалости, только конкретные инструменты и люди, которые реально понимают.', rating: 5, product: 'Restart Base' },
  { name: 'Екатерина, 25 лет', text: 'Взяла Career Restart после основной программы — и уже через 2 месяца нашла работу мечты. Расставание оказалось точкой перезапуска не только в личной жизни, но и в карьере.', rating: 5, product: 'Career Restart' },
]

const faqs = [
  { q: 'Это подходит для мужчин?', a: 'Да. Программа создана для всех, кто переживает расставание — независимо от пола. У нас есть и отдельные группы для мужчин.' },
  { q: 'Нужно ли рассказывать подробности своих отношений?', a: 'Нет. Вы делитесь ровно столько, сколько хотите. Группа — безопасное пространство без давления.' },
  { q: 'Что если я не смогу прийти на встречу?', a: 'Все встречи записываются. Вы получите запись и сможете посмотреть в удобное время.' },
  { q: 'Как быстро будет результат?', a: 'Большинство участников замечают изменения уже после первой встречи. Устойчивый результат — к концу программы.' },
]

const faqSchemaItems = [
  { q: 'Что такое программа Restart?', a: 'Restart — 4-недельная онлайн-программа восстановления после расставания с психологом, группой поддержки, заданиями и карьерным треком.' },
  { q: 'Сколько стоит программа Restart?', a: 'Базовая программа Restart Base стоит 14 990 рублей. Доступны тарифы от 1 490 рублей (вводная встреча) до 24 990 рублей (Restart Personal).' },
  { q: 'Подходит ли программа для мужчин?', a: 'Да, программа одинаково эффективна для мужчин и женщин. Есть опция отдельных групп для мужчин.' },
  { q: 'Как пережить расставание?', a: 'Программа Restart помогает пережить расставание через эмоциональную стабилизацию, восстановление самооценки, построение личного плана и возвращение к активной жизни за 4 недели.' },
]

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <ServiceSchema />
      <FaqSchema items={faqSchemaItems} />
      {/* Hero */}
      <section
        style={{ background: 'linear-gradient(135deg, #1F1535 0%, #3B1D6B 50%, #6D28D9 100%)', minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: '5rem', right: 0, width: '24rem', height: '24rem', borderRadius: '50%', background: 'radial-gradient(circle, #EC4899, transparent)', opacity: 0.2 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16rem', height: '16rem', borderRadius: '50%', background: 'radial-gradient(circle, #7C3AED, transparent)', opacity: 0.15 }} />

        <div className="container mx-auto px-6 py-24" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '48rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', color: '#DDD6FE', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem' }}>
              <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
              Набор в новую группу открыт
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              Расставание выбивает из жизни.{' '}
              <span style={{ color: '#F9A8D4' }}>Restart</span>{' '}
              помогает вернуться.
            </h1>

            <p style={{ fontSize: '1.25rem', color: '#D1D5DB', marginBottom: '2rem', lineHeight: 1.7, maxWidth: '38rem' }}>
              4 недели поддержки с психологом, группой людей в похожей ситуации и практическим планом восстановления: эмоции, самооценка, режим, работа, деньги и новые цели.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
              {[{ num: '500+', label: 'участников программы' }, { num: '4.9', label: 'средняя оценка' }, { num: '92%', label: 'довольны результатом' }].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{s.num}</div>
                  <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link href="/pricing" className="btn-accent" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                Начать программу →
              </Link>
              <Link href="/program" style={{ display: 'inline-flex', alignItems: 'center', padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '0.75rem', fontSize: '1.125rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>
                Узнать подробнее
              </Link>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '1rem' }}>
              Программа не является медицинской услугой. Результаты индивидуальны.
            </p>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <div style={{ background: '#F5F3FF', borderBottom: '1px solid #E9D5FF', padding: '0.75rem 0' }}>
        <div className="container mx-auto px-6">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '2rem', fontSize: '0.875rem', color: '#4B5563' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#FBBF24' }}>★★★★★</span>
              <span>4.9 на основе 200+ отзывов</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} style={{ color: '#7C3AED' }} />
              <span>Дипломированные психологи</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} style={{ color: '#10B981' }} />
              <span>Возврат в течение 7 дней</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', marginBottom: '1rem', display: 'inline-flex' }}>Почему Restart</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1F1535', marginTop: '0.5rem' }}>
              Не просто поговорить.<br />
              <span className="gradient-text">Собрать себя заново.</span>
            </h2>
            <p style={{ color: '#6B7280', marginTop: '1rem', maxWidth: '36rem', margin: '1rem auto 0' }}>
              Restart — это не разовая консультация. Это структурированный маршрут из состояния кризиса в состояние действия.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1.5rem' }}>
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.title} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Icon size={24} style={{ color: '#7C3AED' }} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem', color: '#1F1535' }}>{b.title}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: '#F5F3FF' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', marginBottom: '1rem', display: 'inline-flex' }}>Программа</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1F1535', marginTop: '0.5rem' }}>4 недели — 4 этапа</h2>
            <p style={{ color: '#6B7280', marginTop: '1rem' }}>Каждая неделя — новый уровень. Не торопим, не давим. Идём в вашем темпе.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: '1.5rem', maxWidth: '56rem', margin: '0 auto' }}>
            {steps.map((s) => (
              <div key={s.num} className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: '0.5rem', fontSize: '6rem', fontWeight: 900, color: '#7C3AED', opacity: 0.05, lineHeight: 1, userSelect: 'none' }}>{s.num}</div>
                <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', fontSize: '0.75rem', display: 'inline-flex', marginBottom: '0.75rem' }}>{s.week}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1F1535' }}>{s.title}</h3>
                <p style={{ color: '#6B7280' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/program" className="btn-primary">Подробнее о программе →</Link>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge" style={{ background: '#FCE7F3', color: '#BE185D', marginBottom: '1rem', display: 'inline-flex' }}>Тарифы</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1F1535', marginTop: '0.5rem' }}>Выберите свой формат</h2>
            <p style={{ color: '#6B7280', marginTop: '1rem' }}>От вводной встречи до полного карьерного сопровождения</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1.5rem', maxWidth: '60rem', margin: '0 auto' }}>
            {/* Base */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem', color: '#1F1535' }}>Restart Base</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '1rem' }}>4-недельная группа</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3AED', marginBottom: '1.5rem' }}>14 990 <span style={{ fontSize: '1rem', color: '#9CA3AF', fontWeight: 400 }}>₽</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['4 групповые встречи', 'Чат поддержки 24/7', 'Задания и дневник', 'Запись встреч'].map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#4B5563' }}>
                    <CheckCircle size={16} style={{ color: '#10B981', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="btn-secondary" style={{ display: 'block', textAlign: 'center' }}>Выбрать</Link>
            </div>

            {/* Plus — highlight */}
            <div className="card" style={{ padding: '2rem', border: '2px solid #7C3AED', background: 'linear-gradient(135deg, #FEFBF8 0%, #F5F3FF 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-0.75rem', left: '50%', transform: 'translateX(-50%)', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', whiteSpace: 'nowrap' }}>
                Популярный
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem', color: '#1F1535' }}>Restart Plus</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '1rem' }}>Base + диагностика</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3AED', marginBottom: '1.5rem' }}>19 990 <span style={{ fontSize: '1rem', color: '#9CA3AF', fontWeight: 400 }}>₽</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Всё из Restart Base', 'Личная диагностика', 'Индивидуальный план', 'Приоритет в чате', 'Доступ навсегда'].map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#4B5563' }}>
                    <CheckCircle size={16} style={{ color: '#7C3AED', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>Выбрать →</Link>
            </div>

            {/* Career */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem', color: '#1F1535' }}>Career Restart</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Карьерный трек</p>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F59E0B' }}>14 990 <span style={{ fontSize: '1rem', color: '#9CA3AF', fontWeight: 400 }}>₽</span></div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textDecoration: 'line-through' }}>29 990 ₽ — скидка 50% для участников</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Выбор направления', 'Резюме и отклики', 'Подготовка к собеседованию', 'Поддержка в поиске'].map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#4B5563' }}>
                    <CheckCircle size={16} style={{ color: '#F59E0B', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="btn-accent" style={{ display: 'block', textAlign: 'center' }}>Выбрать</Link>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/pricing" style={{ color: '#7C3AED', fontWeight: 500, textDecoration: 'none' }}>Посмотреть все тарифы →</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #1F1535 0%, #3B1D6B 100%)' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#DDD6FE', marginBottom: '1rem', display: 'inline-flex' }}>Отзывы участников</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginTop: '0.5rem' }}>Реальные истории восстановления</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{ borderRadius: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ color: '#D1D5DB', marginBottom: '1.5rem', lineHeight: 1.7 }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight: 600, color: 'white' }}>{t.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#A78BFA' }}>{t.product}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/reviews" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.875rem 2rem', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>
              Читать все отзывы
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '48rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1F1535' }}>Частые вопросы</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq) => (
              <div key={faq.q} className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1F1535' }}>{faq.q}</h3>
                <p style={{ color: '#6B7280' }}>{faq.a}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" style={{ color: '#7C3AED', fontWeight: 500, textDecoration: 'none' }}>Все вопросы и ответы →</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center', maxWidth: '40rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Готовы к новому старту?</h2>
          <p style={{ fontSize: '1.125rem', color: '#EDE9FE', marginBottom: '2rem' }}>Вступайте в следующую группу. Первая встреча уже меняет многое.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/pricing" className="btn-accent" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>Начать программу →</Link>
            <Link href="/contacts" style={{ display: 'inline-flex', alignItems: 'center', padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '0.75rem', fontSize: '1.125rem', fontWeight: 600, textDecoration: 'none' }}>
              Задать вопрос
            </Link>
          </div>
          <p style={{ color: '#C4B5FD', fontSize: '0.875rem', marginTop: '1rem' }}>Или начните с вводной встречи за 1 490 ₽</p>
        </div>
      </section>
    </>
  )
}
