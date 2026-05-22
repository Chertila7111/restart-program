import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Выход из токсичных отношений — поддержка психолога | Снова с собой',
  description: 'Токсичные отношения заканчиваются — но боль, вина и тяга вернуться никуда не уходят. Программа «Снова с собой» помогает восстановиться после разрушительных отношений.',
  keywords: ['выход из токсичных отношений', 'восстановление после токсичных отношений', 'помощь после абьюза', 'токсичные отношения психолог'],
  openGraph: {
    title: 'Выход из токсичных отношений — поддержка',
    description: 'Отношения закончились, но боль, вина и тяга вернуться остались. Восстанавливаемся вместе.',
  },
}

const patterns = [
  'Даже после ухода чувствуете тягу вернуться — хотя знаете, что это плохо',
  'Чувствуете вину: «может, я сам(а) виноват(а)», «может, надо было по-другому»',
  'Стыд перед собой и окружением — «как я мог(ла) терпеть»',
  'Тяжело доверять людям после этих отношений',
  'Размытые границы — трудно понять, что нормально, а что нет',
  'Страх снова оказаться в похожей ситуации',
]

const areas = [
  {
    title: 'Работа с виной и стыдом',
    desc: 'Понять разницу между ответственностью и самообвинением. Освободиться от ложной вины без обесценивания своего опыта.',
  },
  {
    title: 'Понять паттерн притяжения',
    desc: 'Почему тянуло именно к такому человеку — и как не повторить это в следующих отношениях.',
  },
  {
    title: 'Восстановить самооценку',
    desc: 'Разрушительные отношения часто бьют по базовому ощущению собственной ценности. Работаем с этим.',
  },
  {
    title: 'Перестроить доверие',
    desc: 'Постепенно вернуть способность доверять — себе, своим реакциям, другим людям.',
  },
]

export default function SupportTokshinyeOtnosheniyaPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Токсичные отношения
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Отношения закончились. Но боль, тяга вернуться и вина — остались.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40rem' }}>
            Выход из разрушительных отношений — это не просто «уйти». Это работа с виной, с размытыми границами, с тягой вернуться и с тем, как это всё произошло. Мы помогаем разобраться — без осуждения.
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

      {/* Note */}
      <section style={{ background: 'var(--bg-sage)', padding: '2rem 0', borderBottom: '1px solid var(--primary-light)' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <p style={{ color: 'var(--primary-dark)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
            <strong>Важно:</strong> если вы сейчас в ситуации физической угрозы или насилия — обратитесь сначала в кризисную службу или по номеру 112. Программа поддержит восстановление, но не заменяет экстренную помощь.
          </p>
        </div>
      </section>

      {/* Patterns */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Узнаёте себя?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            После токсичных отношений часто остаётся много всего запутанного.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '0.875rem' }}>
            {patterns.map((s, i) => (
              <div key={i} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work areas */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
            Над чем работает программа
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1.25rem' }}>
            {areas.map((a) => (
              <div key={a.title} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{a.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{a.desc}</div>
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
            90 минут в небольшой группе с психологом. Без осуждения — мы не спрашиваем «почему вы не ушли раньше».
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
              { href: '/blog/styd-i-vina-posle-rasstavaniya', title: 'Стыд и вина после расставания: как перестать корить себя' },
              { href: '/blog/samoocenka-posle-rasstavaniya', title: 'Самооценка после расставания: как вернуть уверенность' },
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
