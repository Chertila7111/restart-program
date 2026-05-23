import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Поддержка — выберите направление | Снова с собой',
  description: 'Поддержка после расставания, развода, при сложных отношениях, с границами и самооценкой. Выберите направление, которое ближе всего к вашей ситуации.',
  keywords: ['поддержка после расставания', 'психолог после разрыва', 'помощь в сложных отношениях'],
}

const directions = [
  {
    href: '/support/posle-rasstavaniya',
    title: 'После расставания',
    desc: 'Тревога, пустота, желание написать бывшему — работаем с острым периодом и восстановлением.',
    color: 'var(--primary)',
    bg: 'var(--bg-sage)',
  },
  {
    href: '/support/posle-razvoda',
    title: 'После развода',
    desc: 'Перестройка всей жизни, вопросы о детях, обиды и что будет дальше — разбираем вместе.',
    color: 'var(--primary)',
    bg: 'var(--bg-sage)',
  },
  {
    href: '/support/slozhnye-otnosheniya',
    title: 'Сложные отношения',
    desc: 'Устали от конфликтов, сомневаетесь, боитесь ошибиться — можно разобраться без давления.',
    color: '#5B7FA6',
    bg: '#D6E4F0',
  },
  {
    href: '/support/granitsy-i-samoocenka',
    title: 'Границы и самооценка',
    desc: 'Теряете себя рядом с партнёром, не можете говорить «нет» — помогаем вернуть опору.',
    color: '#7A6BA0',
    bg: '#E8E4F0',
  },
  {
    href: '/support/emotsionalnaya-zavisimost',
    title: 'Эмоциональная зависимость',
    desc: 'Не можете отпустить, всё крутится вокруг одного человека — разбираем, что держит.',
    color: 'var(--secondary)',
    bg: 'var(--secondary-light)',
  },
  {
    href: '/support/toksichnye-otnosheniya',
    title: 'Токсичные отношения',
    desc: 'Манипуляции, газлайтинг, ощущение, что что-то не так — помогаем назвать и выйти.',
    color: '#C0392B',
    bg: '#FDECEA',
  },
]

export default function SupportIndexPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Поддержка
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Какая ситуация ближе к вашей?
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.9)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '40rem' }}>
            Выберите направление — и вы попадёте на страницу с подробным описанием того, что мы разбираем вместе, как проходит поддержка и с чего начать.
          </p>
        </div>
      </section>

      {/* Directions */}
      <section style={{ background: 'var(--bg)', padding: '3.5rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 24rem), 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {directions.map(d => (
              <Link key={d.href} href={d.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: d.bg, border: `1.5px solid ${d.color}22`, borderRadius: '1.25rem', padding: '1.75rem', height: '100%', transition: 'transform 0.15s, box-shadow 0.15s', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontWeight: 800, color: d.color, fontSize: '1.05rem' }}>{d.title}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.65, flex: 1 }}>{d.desc}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: d.color, fontWeight: 600, fontSize: '0.825rem' }}>
                    Подробнее <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Not sure */}
          <div style={{ background: 'var(--bg-soft)', borderRadius: '1.25rem', padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.625rem', fontSize: '1rem' }}>
              Не уверены, что подойдёт?
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: '32rem', margin: '0 auto 1.25rem' }}>
              Пройдите короткий тест — 5 вопросов, и вы получите рекомендацию, какой формат поддержки сейчас наиболее подходит.
            </p>
            <Link href="/quiz" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Пройти тест <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-dark)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '40rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <LogoSvg size={52} />
          </div>
          <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.3rem', marginBottom: '0.625rem', lineHeight: 1.3 }}>
            Начните с вводной встречи
          </h3>
          <p style={{ color: 'rgba(168,184,160,0.85)', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
            90 минут. Небольшая группа. Психолог. Можно просто слушать — без обязательства покупать программу.
          </p>
          <Link href="/checkout?product=intro" className="btn-ghost-dark">
            Записаться — 1 490 ₽ →
          </Link>
        </div>
      </section>
    </div>
  )
}
