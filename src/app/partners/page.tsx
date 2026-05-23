import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Radio, Heart } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Партнёрство — «Снова с собой»',
  description: 'Telegram-каналы, сообщества, медиа и психологи — рассказываем, как сотрудничаем. Бесплатные материалы, взаимные упоминания, партнёрские условия.',
  keywords: ['партнёрство снова с собой', 'сотрудничество психология расставание', 'реклама психология', 'партнёр программа восстановление'],
}

const partners = [
  {
    Icon: Radio,
    title: 'Telegram-каналы и сообщества',
    desc: 'Если у вас аудитория, которой важны темы психологии, отношений, женского или мужского сообщества — предлагаем взаимное упоминание или партнёрский материал.',
    cta: 'Написать о сотрудничестве',
  },
  {
    Icon: Users,
    title: 'Психологи и терапевты',
    desc: 'Направляйте клиентов на вводную встречу, получайте направления от нас. Для активных партнёров — партнёрские условия.',
    cta: 'Стать партнёром',
  },
  {
    Icon: Heart,
    title: 'Медиа и блоги',
    desc: 'Готовы предоставить экспертный комментарий, написать материал или стать источником для вашего контента по темам расставания и восстановления.',
    cta: 'Запросить комментарий',
  },
]

const materials = [
  'Экспертные комментарии психолога по теме расставания и развода',
  'Готовые статьи для вашего блога или медиа (согласование необходимо)',
  'Инфографика по темам тревоги, восстановления, работы с эмоциями',
  'Совместный прямой эфир или подкаст с психологом программы',
]

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Партнёрство
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Работаем с теми, кому важна тема восстановления после потерь.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40rem' }}>
            «Снова с собой» — программа поддержки после расставания. Открыты к сотрудничеству с психологами, Telegram-каналами, сообществами и медиа.
          </p>
          <a href="mailto:snovassoboi@yandex.com" className="btn-ghost-dark" style={{ fontSize: '1rem', display: 'inline-block' }}>
            Написать нам →
          </a>
        </div>
      </section>

      {/* Partner types */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
            С кем сотрудничаем
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {partners.map(({ Icon, title, desc, cta }) => (
              <div key={title} className="card" style={{ padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', borderRadius: '0.875rem', background: 'var(--primary-light)', flexShrink: 0 }}>
                  <Icon size={22} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem', fontSize: '1rem' }}>{title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>{desc}</div>
                  <a href={`mailto:snovassoboi@yandex.com?subject=${encodeURIComponent(cta)}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                    {cta} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Что можем предоставить
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Для медиа, блогов и образовательных проектов.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {materials.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '0.5rem' }} />
                <span style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.6 }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About us */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            О нас кратко
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            «Снова с собой» — онлайн-программа восстановления после расставания и развода. 4 недели, небольшая группа (8–12 человек), практикующий психолог. Работаем с тревогой, пустотой, желанием вернуться, самооценкой и планированием следующего шага. Программа построена на принципах групповой психотерапии — не коучинг и не мотивационный курс.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <Link href="/program" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
              Подробнее о программе →
            </Link>
            <Link href="/blog" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
              Наш блог →
            </Link>
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
            Готовы обсудить сотрудничество?
          </h2>
          <p style={{ color: 'rgba(168,184,160,1)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
            Напишите нам — расскажите о вашем проекте и о том, как видите партнёрство. Отвечаем на все письма.
          </p>
          <a href="mailto:snovassoboi@yandex.com" className="btn-ghost-dark" style={{ display: 'inline-block' }}>
            snovassoboi@yandex.com →
          </a>
        </div>
      </section>
    </>
  )
}
