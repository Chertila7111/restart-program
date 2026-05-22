import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Тревога после расставания — помощь психолога | Снова с собой',
  description: 'После разрыва накрывает тревога: мысли по кругу, пульс, невозможность расслабиться? Программа «Снова с собой» помогает разобраться с тревогой и вернуть опору.',
  keywords: ['тревога после расставания помощь', 'тревога после разрыва психолог', 'как справиться с тревогой расставание', 'паника после расставания'],
  openGraph: {
    title: 'Тревога после расставания — помощь психолога',
    description: 'Мысли по кругу, пульс, невозможность расслабиться. Разбираемся с тревогой вместе.',
  },
}

const manifestations = [
  'Мысли о человеке не останавливаются — по кругу, без остановки',
  'Учащённый пульс, ком в горле, тяжесть в груди без физической причины',
  'Невозможно расслабиться — постоянное напряжение в теле',
  'Вечером и ночью тревога резко усиливается',
  'Постоянно проверяете телефон — вдруг напишет',
  'Нарушен сон: трудно засыпать, часто просыпаетесь',
  'Мелкие триггеры вызывают резкие волны боли',
]

const methods = [
  {
    title: 'Понять природу тревоги',
    desc: 'Психолог объясняет, что происходит в мозге при острой потере — это снижает страх перед самим состоянием.',
  },
  {
    title: 'Конкретные техники «здесь и сейчас»',
    desc: 'Дыхательные практики, заземление, пауза 10 минут — для острых моментов тревоги.',
  },
  {
    title: 'Снижение триггерной нагрузки',
    desc: 'Разбираем, что конкретно подпитывает тревогу — мониторинг соцсетей, переписка, изоляция — и как это уменьшить.',
  },
  {
    title: 'Восстановление режима',
    desc: 'Сон, режим дня, движение напрямую влияют на уровень тревоги. Помогаем вернуть базу.',
  },
]

export default function SupportTrevogaPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Тревога после расставания
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Мысли по кругу, пульс, невозможность расслабиться — это не с вами что-то не так.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40rem' }}>
            Тревога после расставания — физиологическая реакция на потерю. Мозг воспринимает разрыв как угрозу. Но с этим состоянием можно работать — есть конкретные техники и понятный путь.
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

      {/* Manifestations */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Как проявляется тревога после разрыва
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Если узнаёте себя в нескольких пунктах — это не случайность и не слабость.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '0.875rem' }}>
            {manifestations.map((s, i) => (
              <div key={i} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methods */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
            Как помогает программа
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1.25rem' }}>
            {methods.map((m) => (
              <div key={m.title} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{m.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{m.desc}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-sage)', border: '1px solid var(--primary-light)' }}>
            <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
              <strong>Если тревога очень сильная</strong> — сопровождается паническими атаками, мыслями о причинении себе вреда, невозможностью делать базовые вещи — рекомендуем обратиться к психиатру или в кризисную службу (112) параллельно с программой.
            </p>
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
            90 минут в небольшой группе с психологом. Тревога снижается, когда понимаешь, что происходит. И когда ты не один.
          </p>
          <Link href="/checkout?product=intro" className="btn-ghost-dark">
            Записаться — 1 490 ₽ →
          </Link>
        </div>
      </section>

      {/* Related */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Читайте также</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { href: '/blog/trevoga-posle-rasstavaniya', title: 'Тревога после расставания: почему не проходит и что делать' },
              { href: '/blog/pochemu-tak-bolno-posle-rasstavaniya', title: 'Почему после расставания так больно — объясняет психология' },
              { href: '/blog/posle-rasstavaniya-ne-mogu-rabotat', title: 'После расставания не получается работать и держать режим' },
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
