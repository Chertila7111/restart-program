import type { Metadata } from 'next'
import Link from 'next/link'
import { LogoSvg } from '@/components/LogoSvg'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Помочь близкому после расставания | Снова с собой',
  description: 'Ваш близкий переживает расставание или развод. Как поддержать, что говорить, а что не стоит. Как предложить программу.',
  keywords: ['как помочь другу после расставания', 'что говорить при расставании', 'поддержать близкого после разрыва'],
}

const SIGNS = [
  'Замкнулся/замкнулась, реже выходит на связь',
  'Много говорит о бывшем/бывшей или, наоборот, избегает темы',
  'Плохо спит, мало ест, не следит за собой',
  'Снизилась продуктивность на работе или учёбе',
  'Часто в плохом настроении без видимых причин',
  'Говорит, что не знает, что делать дальше',
]

const DO = [
  { title: 'Просто быть рядом', text: 'Не нужно решать проблему. Достаточно сказать: «Я здесь, я никуда не ухожу».' },
  { title: 'Слушать без советов', text: 'Если не просят — не советуйте. Дайте выговориться. Иногда это важнее любых слов.' },
  { title: 'Предложить конкретную помощь', text: 'Вместо «если что — обращайся» скажите «давай вместе сходим поедим» или «я позвоню завтра».' },
  { title: 'Не торопить с "восстановлением"', text: 'Расставание — настоящая потеря. Дайте время. Не сравнивайте с другими ситуациями.' },
]

const DONT = [
  'Забудь его/её — найдёшь лучше',
  'Сколько можно переживать, прошло уже столько времени',
  'Ты сам(а) виновата/виноват',
  'Бывало и хуже — посмотри на других',
  'Просто займись чем-нибудь, отвлекись',
  'Я же говорил(а), что он/она тебе не подходит',
]

export default function ForFriendsPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-4rem', right: '-3rem', width: '18rem', height: '18rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '48rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <LogoSvg size={52} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.25, marginBottom: '1rem' }}>
            Ваш близкий переживает расставание
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.85)', textAlign: 'center', lineHeight: 1.7, fontSize: '1rem', maxWidth: '36rem', margin: '0 auto' }}>
            Вы хотите помочь, но не знаете как. Эта страница — для вас: что говорить, что не делать, и как предложить профессиональную поддержку.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)', padding: '3.5rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '48rem' }}>

          {/* Signs */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
              Как понять, что человеку тяжело
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>
              Иногда люди не просят о помощи — особенно если не хотят беспокоить окружающих.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '0.75rem' }}>
              {SIGNS.map(s => (
                <div key={s} style={{ display: 'flex', gap: '0.75rem', background: 'white', border: '1.5px solid var(--border)', borderRadius: '0.875rem', padding: '0.875rem 1rem' }}>
                  <span style={{ color: 'var(--primary)', flexShrink: 0, fontWeight: 700 }}>·</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What helps */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
              Что помогает
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>
              Вы не обязаны «решать» проблему. Ваше присутствие — уже поддержка.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {DO.map(item => (
                <div key={item.title} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What not to say */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
              Чего лучше не говорить
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>
              Эти фразы звучат логично, но чаще всего причиняют боль — даже если сказаны из лучших побуждений.
            </p>
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
              {DONT.map(phrase => (
                <div key={phrase} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.625rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#EF4444', flexShrink: 0, fontSize: '0.9rem' }}>✗</span>
                  <span style={{ fontSize: '0.875rem', color: '#7F1D1D', lineHeight: 1.5 }}>«{phrase}»</span>
                </div>
              ))}
            </div>
          </div>

          {/* About program */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
              Когда стоит предложить профессиональную помощь
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>
              Программа «Снова с собой» — это онлайн-курс восстановления после расставания: психолог, небольшая группа в похожих ситуациях, задания и дневник. Без обязательств и жёстких требований.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 21rem), 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
              {[
                { emoji: '👥', title: 'Группа 8–12 человек', desc: 'Люди в похожих ситуациях. Никто не осуждает.' },
                { emoji: '🧑‍⚕️', title: 'Психолог ведёт каждую встречу', desc: '90 минут, 4 встречи за 4 недели.' },
                { emoji: '📖', title: 'Можно просто слушать', desc: 'Не нужно ничего рассказывать о себе.' },
                { emoji: '🏠', title: 'Онлайн, в удобное время', desc: 'Никуда ехать не надо. Камера по желанию.' },
              ].map(item => (
                <div key={item.title} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.2rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div style={{ background: 'var(--bg-dark)', borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', borderRadius: '50%', background: 'rgba(78,123,94,0.15)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.3rem', marginBottom: '0.625rem' }}>
                Как предложить программу
              </h3>
              <p style={{ color: 'rgba(168,184,160,0.85)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Лучший способ — не давать советы, а просто прислать ссылку на тест. Человек сам пройдёт, сам решит. Никакого давления.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/quiz" className="btn-ghost-dark" style={{ fontSize: '0.925rem' }}>
                  Прислать тест →
                </Link>
                <Link
                  href="/checkout?product=intro"
                  style={{ color: 'rgba(168,184,160,0.75)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  Подарить вводную встречу <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
