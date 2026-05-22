import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Эмоциональная зависимость в отношениях — помощь психолога | Снова с собой',
  description: 'Без этого человека невыносимо, а рядом с ним — постоянная тревога? Это эмоциональная зависимость. Программа «Снова с собой» помогает разобраться и выйти из этого паттерна.',
  keywords: ['эмоциональная зависимость помощь', 'зависимые отношения психолог', 'как выйти из эмоциональной зависимости', 'зависимость от человека'],
  openGraph: {
    title: 'Эмоциональная зависимость — помощь психолога',
    description: 'Психолог помогает разобраться с паттерном зависимых отношений — без осуждения, шаг за шагом.',
  },
}

const signs = [
  'Без этого человека физически плохо — тревога, боль, невозможно думать',
  'Настроение полностью зависит от его/её реакции',
  'Страшно выражать несогласие — вдруг уйдёт',
  'Постоянно нужно подтверждение: «ты меня любишь?»',
  'Возврат к отношениям, которые причиняют вред — лишь бы не быть одному',
  'После расставания — ощущение полного краха, нет жизни без этого человека',
]

const steps = [
  {
    num: '1',
    title: 'Понять паттерн',
    desc: 'Психолог помогает увидеть, откуда берётся зависимость: стиль привязанности, детский опыт, самооценка.',
  },
  {
    num: '2',
    title: 'Пережить расставание',
    desc: 'Если отношения уже закончились — разобраться с острой болью разлуки и не вернуться только ради снятия тревоги.',
  },
  {
    num: '3',
    title: 'Строить опору внутри',
    desc: 'Постепенно перестать зависеть от внешнего подтверждения — через маленькие практики и понимание своих потребностей.',
  },
]

export default function SupportEmotionalnyaZavisiomostPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Эмоциональная зависимость
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Когда без него/неё невыносимо, а с ним/ней — постоянная тревога.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40rem' }}>
            Эмоциональная зависимость — это не «любить слишком сильно». Это выученный паттерн. Его можно изменить — если понять откуда он берётся.
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

      {/* Signs */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Признаки эмоциональной зависимости
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Если узнаёте себя — это не значит, что вы «слабый». Это значит, что паттерн требует внимания.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '0.875rem' }}>
            {signs.map((s, i) => (
              <div key={i} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
            Как работает программа с этой темой
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {steps.map((step) => (
              <div key={step.num} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem' }}>{step.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-sage)', border: '1px solid var(--primary-light)' }}>
            <p style={{ color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              <strong>Важно:</strong> эмоциональная зависимость — не патология и не признак слабости. Это паттерн привязанности, который формируется в определённых условиях и поддаётся изменению. Программа не «лечит», а помогает понять и постепенно трансформировать отношение к себе и близости.
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
            90 минут в небольшой группе с психологом. Безопасно, без осуждения. Можно просто слушать.
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
              { href: '/blog/emotsionalnaya-zavisimost-v-otnosheniyakh', title: 'Эмоциональная зависимость в отношениях: как понять и выйти' },
              { href: '/blog/kak-ne-budit-nadezhdu-na-vozvrat', title: 'Надежда на возврат после расставания: как перестать ждать' },
              { href: '/blog/pochemu-ne-mogu-otpustit-cheloveka', title: 'Почему не могу отпустить человека после расставания' },
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
