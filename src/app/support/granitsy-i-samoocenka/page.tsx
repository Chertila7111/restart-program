import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Heart, Users, BookOpen, ArrowRight } from 'lucide-react'
import { BreadcrumbSchema, FaqSchema } from '@/components/JsonLd'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Границы и самооценка в отношениях — поддержка | Снова с собой',
  description: 'Теряете себя в отношениях, боитесь говорить «нет», чувствуете вину? Программа помогает восстановить опору на себя — без давления и готовых ответов.',
  keywords: ['личные границы в отношениях помощь', 'низкая самооценка в отношениях', 'психолог границы самооценка'],
  openGraph: {
    title: 'Границы и самооценка в отношениях',
    description: 'Поддержка для тех, кто теряет себя в отношениях и хочет вернуть опору.',
  },
}

const faq = [
  { q: 'Это только для тех, кто расстался?', a: 'Нет. Страница создана специально для тех, кто сейчас в отношениях — и чувствует, что теряет себя, не может говорить о своих потребностях или постоянно чувствует вину.' },
  { q: 'Нужно ли идти с партнёром?', a: 'Нет. Вы можете работать над своей стороной ситуации самостоятельно. Часто изменения с одной стороны меняют динамику в целом.' },
  { q: 'Поможет ли это сохранить отношения?', a: 'Работа с границами и самооценкой помогает вам чувствовать себя устойчивее — независимо от того, продолжаются ли отношения. Это не «терапия пары», а поддержка для вас.' },
  { q: 'Мне стыдно говорить об этом в группе — что если узнают?', a: 'Конфиденциальность — одно из правил группы, которое психолог объясняет на первой встрече. Всё, что сказано в группе, остаётся в группе.' },
]

const symptoms = [
  'Соглашаетесь на то, с чем внутри не согласны — чтобы не было конфликта',
  'Говорите «всё нормально», когда это не так',
  'Чувствуете вину, когда хотите что-то для себя',
  'Боитесь сказать «нет» — вдруг обидите или потеряете человека',
  'Ставите чужие потребности выше своих автоматически',
  'После разговоров с партнёром чувствуете себя меньше — хотя не понимаете почему',
]

const boundary_signs = [
  'Ваши слова «нет» не воспринимаются всерьёз',
  'Вас критикуют за то, что вы «слишком много хотите»',
  'Вы перестали делать что-то важное для себя — и сами не заметили, как',
  'Вам неловко за свои потребности — хотя они вполне обычные',
]

const selfesteem_impact = [
  'Когда вы всё время подстраиваетесь — внутри растёт ощущение, что вы «не важны»',
  'Каждый раз, когда не говорите о своих потребностях — немного больше теряете контакт с собой',
  'Привычка ставить других выше себя — это не добродетель, а сигнал, что что-то важное не получает места',
]

const introPoints = [
  'Что именно мешает говорить о своих потребностях',
  'Что происходит в момент, когда вы замолкаете или соглашаетесь',
  'Как начать говорить о своих границах — не из агрессии, а из опоры на себя',
  'Какой следующий шаг будет безопасен именно для вас',
]

const programPoints = [
  'Практики, которые помогают услышать свои потребности',
  'Психолог, который ведёт группу в безопасном пространстве',
  'Конкретные задания между встречами — не абстрактные, а про вашу ситуацию',
  'Личный план в конце: как поддерживать опору на себя дальше',
  'Группа людей в похожих ситуациях — без осуждения',
]

const included = [
  '4 групповые встречи с психологом (видео)',
  'Чат с куратором в течение всей программы',
  'Задания и практики между встречами',
  'Дневник состояния и отслеживание прогресса',
  'Личный план в конце программы',
  'Запись встреч — можно пересматривать',
]

export default function GranitsyISamootsenkPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Главная', href: '/' },
        { name: 'Поддержка', href: '/support/posle-rasstavaniya' },
        { name: 'Границы и самооценка', href: '/support/granitsy-i-samoocenka' },
      ]} />
      <FaqSchema items={faq} />

      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div style={{ position: 'absolute', bottom: '-3rem', left: '5%', width: '14rem', height: '14rem', borderRadius: '50%', background: 'rgba(78,123,94,0.07)' }} />

        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Границы и самооценка
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Теряете себя в отношениях?<br />Можно вернуть опору.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '42rem' }}>
            Когда сложно говорить «нет», когда чужие потребности всегда важнее, когда вина появляется раньше, чем желание — это не черта характера. Это то, с чем можно работать.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro" className="btn-ghost-dark" style={{ fontSize: '1rem' }}>
              Записаться на вводную встречу — 1 490 ₽
            </Link>
            <Link href="/quiz" style={{ color: 'rgba(168,184,160,0.8)', textDecoration: 'none', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Пройти тест <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Кому подойдёт */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Узнаёте себя?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Это не слабость и не особенность характера. Это паттерны, которые складываются годами — и с которыми можно разобраться.
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

      {/* Как проявляются сложности с границами */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 24rem), 1fr))', gap: '2rem', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.3 }}>
                Как проявляются сложности с границами
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {boundary_signs.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', padding: '0.875rem 1rem', background: 'var(--bg-soft)', borderRadius: '0.875rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '0.45rem' }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.55 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.3 }}>
                Почему это влияет на самооценку
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selfesteem_impact.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', padding: '0.875rem 1rem', background: 'var(--bg-sage)', borderRadius: '0.875rem', border: '1px solid var(--primary-light)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '0.45rem' }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.55 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Вводная встреча + программа */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 24rem), 1fr))', gap: '2rem' }}>
            <div style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '1.25rem', padding: '1.75rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1rem', marginBottom: '1rem' }}>Что можно разобрать на вводной встрече</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {introPoints.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                    <CheckCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.55 }}>{p}</span>
                  </div>
                ))}
              </div>
              <Link href="/checkout?product=intro" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                Вводная встреча — 1 490 ₽ <ArrowRight size={14} />
              </Link>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1rem', marginBottom: '1rem' }}>Как программа помогает вернуть опору</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {programPoints.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                    <CheckCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.55 }}>{p}</span>
                  </div>
                ))}
              </div>
              <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                Смотреть форматы <ArrowRight size={14} />
              </Link>
            </div>
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
            90 минут с психологом. Небольшая группа. Можно просто слушать — никаких обязательств говорить о личном. Без обязательства продолжать.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro" className="btn-ghost-dark">
              Записаться — 1 490 ₽ →
            </Link>
            <Link href="/pricing" style={{ color: 'rgba(168,184,160,0.75)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center' }}>
              Смотреть все форматы →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Частые вопросы</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
            {faq.map((item, i) => (
              <div key={i} style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.925rem', marginBottom: '0.5rem' }}>{item.q}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.a}</div>
              </div>
            ))}
          </div>

          {/* Related articles */}
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1rem' }}>Читайте также</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[
              { href: '/blog/kak-postavit-granitsy-v-otnosheniyah', title: 'Как поставить границы в отношениях без чувства вины' },
              { href: '/blog/postoyannye-ssory-v-otnosheniyah', title: 'Постоянные ссоры в отношениях: как не потерять себя' },
              { href: '/blog/samoocenka-posle-rasstavaniya', title: 'Самооценка после расставания: как вернуть уверенность' },
              { href: '/blog/styd-i-vina-posle-rasstavaniya', title: 'Стыд и вина после расставания' },
            ].map(a => (
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
