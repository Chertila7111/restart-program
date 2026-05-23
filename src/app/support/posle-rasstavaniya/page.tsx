import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Heart, Users, BookOpen, ArrowRight } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Поддержка после расставания — программа с психологом | Снова с собой',
  description: 'Переживаете расставание? Программа «Снова с собой»: психолог, небольшая группа, 4 недели. Тревога, пустота, желание написать — разбираем вместе. Начните с вводной встречи.',
  keywords: ['поддержка после расставания', 'помощь после разрыва', 'психолог расставание онлайн', 'группа поддержки расставание'],
  openGraph: {
    title: 'Поддержка после расставания — программа с психологом',
    description: 'Психолог + небольшая группа + 4 недели. Тревога, пустота, желание написать — разбираем вместе.',
  },
}

const symptoms = [
  'Мысли не останавливаются, прокручиваете разговоры снова и снова',
  'Очень хочется написать — и понимаете, что лучше не надо',
  'Пропал аппетит, нарушился сон, нет сил на обычные дела',
  'Внутри пустота или тревога, непонятно что дальше',
  'Упала самооценка — «меня не выбрали»',
  'Прошло несколько недель, но легче не становится',
]

const steps = [
  {
    num: '1',
    title: 'Вводная встреча',
    desc: '90 минут в небольшой группе с психологом. Можно просто слушать. Без обязательства покупать программу.',
    price: '1 490 ₽',
  },
  {
    num: '2',
    title: '4 недели программы',
    desc: 'Встречи, задания, чат с куратором, дневник. Психолог, группа и конкретный план восстановления.',
    price: 'от 14 990 ₽',
  },
  {
    num: '3',
    title: 'Личный план',
    desc: 'В конце — письменный план: что делать при откатах, как двигаться дальше без группы.',
    price: 'включено',
  },
]

const included = [
  '4 групповые встречи с психологом (видео)',
  'Чат с куратором в течение всей программы',
  'Задания и практики после каждой встречи',
  'Дневник состояния и отслеживание прогресса',
  'Личный план восстановления в конце',
  'Записи основных материалов встречи — можно пересматривать',
]

export default function SupportPosleRasstavaniyaPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div style={{ position: 'absolute', bottom: '-3rem', left: '5%', width: '14rem', height: '14rem', borderRadius: '50%', background: 'rgba(78,123,94,0.07)' }} />

        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Поддержка после расставания
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Расставание — это больно.<br />Не нужно проходить через это одному.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40rem' }}>
            Программа «Снова с собой» помогает пережить разрыв: разобраться с тревогой и пустотой, восстановить режим, вернуть уверенность в себе — с психологом и небольшой группой.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro&from=rasstalis" className="btn-ghost-dark" style={{ fontSize: '1rem' }}>
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
            Если сейчас что-то из этого — это нормальная реакция на потерю. И с этим можно работать.
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

      {/* How it works */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Как это работает
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Начать можно с вводной встречи — без обязательства покупать программу.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {steps.map((step) => (
              <div key={step.num} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.375rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>{step.title}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', flexShrink: 0 }}>{step.price}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
            Что входит в программу
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '0.875rem', marginBottom: '2rem' }}>
            {included.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                <span style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { Icon: Users, label: '8–12 человек в группе' },
              { Icon: Heart, label: 'Психолог с практикой 8+ лет' },
              { Icon: BookOpen, label: 'Практики между встречами' },
            ].map(({ Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <Icon size={16} style={{ color: 'var(--primary)' }} />
                {label}
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
            90 минут в небольшой группе с психологом. Можно просто слушать, не рассказывая о себе. Без обязательства покупать программу.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro&from=rasstalis" className="btn-ghost-dark">
              Записаться — 1 490 ₽ →
            </Link>
            <Link href="/pricing?from=rasstalis" style={{ color: 'rgba(168,184,160,0.75)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center' }}>
              Смотреть все форматы →
            </Link>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '1.5rem' }}>
            Если что-то идёт не так — пишите на snovassoboi@yandex.com
          </p>
        </div>
      </section>

      {/* Topic hub link */}
      <section style={{ background: 'var(--bg-soft)', padding: '1.5rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Все материалы по теме «Расставание»</span>
          <Link href="/topics/rasstavanie" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            Перейти к теме →
          </Link>
        </div>
      </section>

      {/* Related articles */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Читайте также</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { href: '/blog/kak-perezhit-rasstavanie', title: 'Как пережить расставание и не остаться с этим одному' },
              { href: '/blog/trevoga-posle-rasstavaniya', title: 'Тревога после расставания: почему не проходит и что делать' },
              { href: '/blog/pustota-posle-rasstavaniya', title: 'Пустота после расставания: почему внутри как будто ничего не осталось' },
            ].map((a) => (
              <Link key={a.href} href={a.href} style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                → {a.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
