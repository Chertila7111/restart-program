import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Поддержка после развода — психолог и группа онлайн | Снова с собой',
  description: 'Развод — это не только конец брака, но и острая боль, одиночество и полная перестройка жизни. Программа «Снова с собой»: психолог, небольшая группа, конкретный план.',
  keywords: ['поддержка после развода', 'помощь после развода', 'психолог после развода онлайн', 'как пережить развод'],
  openGraph: {
    title: 'Поддержка после развода — психолог и группа',
    description: 'Психолог + небольшая группа + 4 недели. Боль, одиночество, потеря идентичности — разбираем вместе.',
  },
}

const symptoms = [
  'Ощущение, что рухнуло всё: планы, роль, привычный образ жизни',
  'Не знаете, кем быть без этих отношений — потеря идентичности',
  'Общие друзья, семья, быт — всё нужно перестраивать',
  'Сильная тревога о детях, жилье, деньгах — и всё сразу',
  'Стыд и чувство провала: «не смог(ла) сохранить»',
  'Долгие отношения — и теперь непонятно, что делать с этим временем',
]

const unique = [
  {
    title: 'Про потерю идентичности',
    desc: 'Когда «мы» исчезает после многих лет, нужно заново найти «я». Психолог помогает сделать это постепенно, без давления.',
  },
  {
    title: 'Про практические вопросы',
    desc: 'Дети, жильё, деньги, документы — это реальный стресс поверх эмоционального. Разбираем, как не утонуть в хаосе.',
  },
  {
    title: 'Про социальную перестройку',
    desc: 'Общие друзья, изменение статуса, реакция окружения — всё это часть восстановления после развода.',
  },
]

export default function SupportPosleRazvodaPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Поддержка после развода
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Развод — это большая потеря.<br />Её не нужно переживать в одиночку.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40rem' }}>
            После развода рушатся не только чувства, но и привычная роль, образ будущего, социальный круг и быт. Программа «Снова с собой» помогает восстановиться — шаг за шагом.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro" className="btn-ghost-dark" style={{ fontSize: '1rem' }}>
              Записаться на вводную встречу — 1 490 ₽
            </Link>
            <Link href="/quiz" style={{ color: 'rgba(168,184,160,0.8)', textDecoration: 'none', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center' }}>
              Пройти тест →
            </Link>
          </div>
        </div>
      </section>

      {/* Symptoms */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Узнаёте себя?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            После развода одновременно может быть много всего — эмоционального и практического. Это нормально.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '0.875rem' }}>
            {symptoms.map((s, i) => (
              <div key={i} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's different about divorce */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Развод отличается от просто расставания
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Программа учитывает специфику: потерю роли, долгосрочных привычек и практические вопросы, которые возникают после развода.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {unique.map((item) => (
              <div key={item.title} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>{item.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center', maxWidth: '40rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <LogoSvg size={64} />
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'white', marginBottom: '0.875rem', lineHeight: 1.3 }}>
            Начните с вводной встречи
          </h2>
          <p style={{ color: 'rgba(168,184,160,1)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
            90 минут в небольшой группе с психологом. Можно просто слушать, не рассказывая о себе. Без обязательства.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro" className="btn-ghost-dark">
              Записаться — 1 490 ₽ →
            </Link>
            <Link href="/pricing" style={{ color: 'rgba(168,184,160,0.75)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center' }}>
              Все форматы →
            </Link>
          </div>
        </div>
      </section>

      {/* Topic hub link */}
      <section style={{ background: 'var(--bg-soft)', padding: '1.5rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Все материалы по теме «Развод»</span>
          <Link href="/topics/razvod" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            Перейти к теме <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Related */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Читайте также</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { href: '/blog/kak-perezhit-razvod', title: 'Как пережить развод и не потерять себя' },
              { href: '/blog/rasstavanie-posle-dolgikh-otnosheniy', title: 'Расставание после долгих отношений: почему особенно тяжело' },
              { href: '/blog/pervye-shagi-posle-razvoda', title: 'Первые шаги после развода: что делать в первые недели' },
            ].map((a) => (
              <Link key={a.href} href={a.href} style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                → {a.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
