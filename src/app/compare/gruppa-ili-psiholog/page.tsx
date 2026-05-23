import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'
import { BreadcrumbSchema, FaqSchema } from '@/components/JsonLd'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Группа или индивидуальный психолог после расставания | Снова с собой',
  description: 'Что лучше — групповая работа с психологом или индивидуальная? Честное сравнение двух форматов поддержки после расставания и развода.',
  keywords: ['группа поддержки или психолог', 'групповая терапия или индивидуальная', 'какой формат поддержки выбрать'],
  openGraph: {
    title: 'Группа или психолог: что выбрать',
    description: 'Честное сравнение двух форматов поддержки после расставания.',
  },
}

const faq = [
  { q: 'Группа — это как АА? Нужно будет рассказывать всё о себе?', a: 'Нет. В программе «Снова с собой» никто не заставляет исповедоваться. Можно несколько встреч просто слушать — многие участники начинают именно так. Когда появляется ощущение безопасности, появляется и желание говорить.' },
  { q: 'Можно ли совмещать группу и индивидуального психолога?', a: 'Да, и это часто самый эффективный формат. Группа даёт структуру и социальный контакт, индивидуальная работа — глубокую личную проработку. Тарифы «Плюс» и «Персональный» включают оба элемента.' },
  { q: 'Если у меня никогда не было опыта с психологом — как начать?', a: 'Вводная встреча — идеальный вход. 90 минут в небольшой группе с психологом. Никаких обязательств продолжать. Можно просто посмотреть, как это работает.' },
  { q: 'Насколько конфиденциально в группе?', a: 'На первой встрече психолог объясняет правила: всё, что сказано в группе — остаётся в группе. Это не просто пожелание, это правило участия.' },
]

export default function GruppaIliPsikhologPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Главная', href: '/' },
        { name: 'Сравнения', href: '/compare' },
        { name: 'Группа или психолог', href: '/compare/gruppa-ili-psiholog' },
      ]} />
      <FaqSchema items={faq} />

      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Сравнение форматов
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Группа или индивидуальный психолог: что выбрать
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.9)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '40rem' }}>
            Оба формата работают — но подходят для разных нужд и ситуаций. Разбираем честно, без продаж.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ background: 'var(--bg)', padding: '3.5rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>

            {/* Group card */}
            <div style={{ background: 'var(--bg-sage)', border: '2px solid var(--primary)', borderRadius: '1.25rem', padding: '1.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.375rem' }}>Группа с психологом</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Программа «Снова с собой»</div>
              {[
                'Слышите людей в похожих ситуациях — «я не один/одна»',
                'Структура: 4 встречи + задания + куратор + план',
                'Стоимость в 3–4 раза ниже индивидуальной работы',
                'Социальный контакт — ключевой элемент восстановления',
                'Можно просто слушать, не рассказывая о себе',
                'Психолог видит групповую динамику и помогает в реальном времени',
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.625rem' }}>
                  <Check size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--primary-light)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Ограничения</div>
                {[
                  'Меньше времени один на один с психологом',
                  'Нужно подстраиваться под расписание встреч',
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <X size={13} style={{ color: 'var(--text-light)', flexShrink: 0, marginTop: '0.2rem' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '0.375rem' }}>Индивидуальный психолог</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Один на один</div>
              {[
                'Полная конфиденциальность — только вы и психолог',
                'Глубокое погружение именно в вашу ситуацию',
                'Гибкое расписание под ваш темп',
                'Лучше для острых состояний или долгосрочной проработки',
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.625rem' }}>
                  <Check size={14} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Ограничения</div>
                {[
                  'Значительно дороже групповой работы',
                  'Нет социальной поддержки от людей в похожих ситуациях',
                  'Требует поиска «своего» специалиста',
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <X size={13} style={{ color: 'var(--text-light)', flexShrink: 0, marginTop: '0.2rem' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scenarios */}
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Когда что выбрать</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1rem', fontSize: '0.95rem' }}>Выберите группу, если:</div>
              {[
                'Вам важно не чувствовать себя одиноким с этой болью',
                'Нужна структура: конкретные встречи, задания, план',
                'Бюджет ограничен, но важна качественная поддержка',
                'Вы только начинаете и хотите попробовать без обязательств',
                'Важно видеть, что другие тоже проходят через это',
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                  <ArrowRight size={13} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', fontSize: '0.95rem' }}>Выберите индивидуально, если:</div>
              {[
                'Ситуация требует полной конфиденциальности',
                'Есть острые состояния: панические атаки, суицидальные мысли',
                'Нужна долгосрочная работа с детскими травмами или паттернами',
                'Хотите работать полностью в своём темпе без группы',
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                  <ArrowRight size={13} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro tip */}
          <div style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Совет: начните с вводной встречи</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              Не знаете, подойдёт ли вам группа? Вводная встреча — 90 минут в небольшой группе с психологом — без обязательства покупать программу. Это лучший способ почувствовать формат изнутри.
            </p>
          </div>

          {/* FAQ */}
          <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '1rem' }}>Частые вопросы</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
            {faq.map((item, i) => (
              <div key={i} style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.925rem', marginBottom: '0.5rem' }}>{item.q}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-dark)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '40rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><LogoSvg size={52} /></div>
          <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.3rem', marginBottom: '0.625rem', lineHeight: 1.3 }}>
            Попробуйте группу без обязательств
          </h3>
          <p style={{ color: 'rgba(168,184,160,0.85)', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
            90 минут с психологом. Небольшая группа. Можно просто слушать.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro" className="btn-ghost-dark">Вводная встреча — 1 490 ₽ →</Link>
            <Link href="/compare/kakaya-podderzhka-podoydet" style={{ color: 'rgba(168,184,160,0.7)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Ещё не знаю что подойдёт <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
