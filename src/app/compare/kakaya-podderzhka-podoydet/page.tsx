import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/JsonLd'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Какой формат поддержки вам подойдёт после расставания | Снова с собой',
  description: 'Вводная встреча, базовая программа, личная работа или просто почитать статьи? Разбираем, какой формат поддержки лучше всего подходит в вашей ситуации.',
  keywords: ['какая поддержка нужна после расставания', 'как выбрать психолога после разрыва', 'формат поддержки расставание'],
  openGraph: {
    title: 'Какой формат поддержки вам подойдёт',
    description: 'Разбираем, какой формат поддержки лучше всего подходит в вашей ситуации после расставания.',
  },
}

const scenarios = [
  {
    title: 'Мне тяжело, но я хочу сначала просто попробовать',
    desc: 'Вы ещё не уверены, нужна ли вам поддержка, или хотите почувствовать формат без обязательств.',
    recommendation: 'Вводная встреча',
    recDesc: '90 минут в небольшой группе с психологом. Можно просто слушать. Стоимость засчитывается при покупке программы.',
    href: '/checkout?product=intro',
    price: '1 490 ₽',
    color: 'var(--primary)',
    bg: 'var(--bg-sage)',
  },
  {
    title: 'Мне нужна структура — встречи, задания, поддержка куратора',
    desc: 'Вы готовы к 4 неделям работы и хотите конкретный маршрут восстановления.',
    recommendation: 'Базовая программа',
    recDesc: '4 встречи с психологом, чат с куратором, задания между встречами, дневник состояния и личный план в конце.',
    href: '/pricing',
    price: 'от 14 990 ₽',
    color: '#5B7FA6',
    bg: '#D6E4F0',
  },
  {
    title: 'Хочу и группу, и личную диагностику под мою ситуацию',
    desc: 'Вам важно понять именно вашу ситуацию — с учётом истории, паттернов, конкретных вопросов.',
    recommendation: 'Тариф Плюс',
    recDesc: 'Всё из базового + личная диагностика до начала программы (30 мин) и индивидуальный план восстановления.',
    href: '/pricing',
    price: 'от 19 990 ₽',
    color: '#7A6BA0',
    bg: '#E8E4F0',
  },
  {
    title: 'Мне нужна работа один на один с психологом',
    desc: 'Ситуация острая или требует полной конфиденциальности и глубокой личной проработки.',
    recommendation: 'Персональный тариф',
    recDesc: 'Всё из Плюс + две индивидуальные встречи с психологом (45 мин каждая) и корректировка плана.',
    href: '/pricing',
    price: 'от 24 990 ₽',
    color: 'var(--secondary)',
    bg: 'var(--secondary-light)',
  },
]

const signals = [
  { text: 'Боль не снижается больше 3–4 недель', action: 'Нужна программа или психолог' },
  { text: 'Нарушен сон и нет сил на работу', action: 'Нужна поддержка сейчас' },
  { text: 'Постоянно хочется написать бывшему', action: 'Начните с вводной встречи' },
  { text: 'Всё плохо, но «само пройдёт»', action: 'Прочитайте статьи + пройдите тест' },
  { text: 'Есть мысли о причинении себе вреда', action: 'Срочно: 112 или кризисная служба' },
]

export default function KakayaPoddershkaPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Главная', href: '/' },
        { name: 'Сравнения', href: '/compare' },
        { name: 'Какая поддержка подойдёт', href: '/compare/kakaya-podderzhka-podoydet' },
      ]} />

      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Выбор формата
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Какой формат поддержки вам подойдёт
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.9)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '40rem' }}>
            Найдите подходящий формат в зависимости от вашей ситуации — от статей до персональной работы с психологом.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)', padding: '3.5rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>

          {/* Scenarios */}
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Узнайте себя в ситуации</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
            {scenarios.map((s) => (
              <div key={s.title} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${s.color}` }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem', marginBottom: '0.375rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{s.desc}</div>
                <div style={{ background: s.bg, borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: s.color, fontSize: '0.875rem', marginBottom: '0.25rem' }}>→ {s.recommendation}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '28rem' }}>{s.recDesc}</div>
                  </div>
                  <Link href={s.href} style={{ color: s.color, fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    {s.price} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Signals */}
          <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '1rem' }}>Сигналы, которые помогут определиться</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '3rem' }}>
            {signals.map((sig, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.875rem 1.25rem', background: 'var(--bg-soft)', borderRadius: '0.875rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>{sig.text}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{sig.action}</span>
              </div>
            ))}
          </div>

          {/* Also */}
          <div style={{ background: 'var(--bg-soft)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Не уверены? Начните с теста</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Пройдите короткий тест — он поможет понять, на какой стадии вы сейчас и какой формат поддержки наиболее подходит.
            </p>
            <Link href="/quiz" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Пройти тест <ArrowRight size={13} />
            </Link>
          </div>

          {/* Compare link */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/compare/gruppa-ili-psiholog" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none' }}>
              → Группа или индивидуальный психолог
            </Link>
            <Link href="/compare/besplatnye-gruppy-ili-programma" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none' }}>
              → Бесплатные группы vs программа
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-dark)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '40rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><LogoSvg size={52} /></div>
          <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.3rem', marginBottom: '0.625rem', lineHeight: 1.3 }}>
            Начните с вводной встречи — и решите сами
          </h3>
          <p style={{ color: 'rgba(168,184,160,0.85)', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
            90 минут с психологом и небольшой группой. Лучший способ почувствовать, что вам подходит.
          </p>
          <Link href="/checkout?product=intro" className="btn-ghost-dark">Вводная встреча — 1 490 ₽ →</Link>
        </div>
      </section>
    </>
  )
}
