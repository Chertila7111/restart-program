import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Heart, Users, BookOpen, ArrowRight } from 'lucide-react'
import { BreadcrumbSchema, FaqSchema } from '@/components/JsonLd'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Поддержка в сложных отношениях — разобраться без давления | Снова с собой',
  description: 'Устали от конфликтов, сомневаетесь в своих чувствах или не знаете, что делать дальше? Безопасное пространство, чтобы разобраться — без готовых ответов и без давления.',
  keywords: ['помощь при сложных отношениях', 'психолог при конфликтах в отношениях', 'что делать если устал от отношений'],
  openGraph: {
    title: 'Поддержка в сложных отношениях',
    description: 'Разобраться без давления: понять, что происходит, и найти следующий шаг.',
  },
}

const faq = [
  { q: 'Мне помогут, только если я решу расстаться?', a: 'Нет. На встрече нет задачи подтолкнуть к расставанию. Задача — помочь разобраться, что происходит, и найти следующий шаг, который будет безопасен для вас. Решение остаётся за вами.' },
  { q: 'Можно ли прийти, если партнёр не знает?', a: 'Да. Вы можете работать над своей стороной ситуации независимо от партнёра. Начать можно с себя.' },
  { q: 'Нужно ли точно знать, что я хочу сделать?', a: 'Нет. На вводную встречу можно прийти именно тогда, когда ещё не понятно, что делать. Это и есть хорошее начало.' },
  { q: 'Что если мне кажется, что моя ситуация «недостаточно серьёзная»?', a: 'Если вам тяжело — этого достаточно. Не нужно ждать, пока станет совсем плохо.' },
]

const situations = [
  'Устали от постоянных конфликтов и не знаете, как разорвать этот круг',
  'Сомневаетесь в своих чувствах — и не понимаете, любовь это или привычка',
  'Боитесь принять неправильное решение и жалеть об этом',
  'Хотите уйти, но пугает одиночество или ответственность',
  'Чувствуете, что теряете себя рядом с партнёром',
  'Не можете понять, это кризис или конец',
]

const states = [
  'Тревога и усталость, которая не проходит',
  'Желание всё бросить — и тут же страх это сделать',
  'Ощущение, что вас не слышат и не видят',
  'Чувство вины — хотя непонятно, в чём',
  'Злость, которую некуда деть',
  'Ощущение, что застряли и не можете двинуться',
]

const introPoints = [
  'Что именно происходит в ваших отношениях — без советов «расставайтесь»',
  'Что вы на самом деле чувствуете и чего хотите',
  'Какой следующий шаг будет безопаснее — для вас',
  'Как не принимать решение в момент сильных эмоций',
  'Как начать говорить с партнёром — если это важно для вас',
]

const included = [
  '4 групповые встречи с психологом (видео)',
  'Чат с куратором в течение всей программы',
  'Задания и практики между встречами',
  'Дневник состояния и отслеживание прогресса',
  'Личный план в конце: что делать дальше',
  'Запись встреч — можно пересматривать',
]

export default function SlozhnyeOtnosheniyaPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Главная', href: '/' },
        { name: 'Поддержка', href: '/support/posle-rasstavaniya' },
        { name: 'Сложные отношения', href: '/support/slozhnye-otnosheniya' },
      ]} />
      <FaqSchema items={faq} />

      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div style={{ position: 'absolute', bottom: '-3rem', left: '5%', width: '14rem', height: '14rem', borderRadius: '50%', background: 'rgba(78,123,94,0.07)' }} />

        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Поддержка в сложных отношениях
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Устали от отношений?<br />Можно разобраться без давления.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '42rem' }}>
            Если вы в сложных отношениях — и не понимаете, что делать дальше — можно начать с вводной встречи. На ней не нужно знать ответ. Важно просто разобраться, что сейчас происходит.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro&from=slozhnye" className="btn-ghost-dark" style={{ fontSize: '1rem' }}>
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
            Эти ситуации не требуют готового решения — ни «расстаться», ни «остаться». Нужно просто понять, что происходит.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '0.875rem' }}>
            {situations.map((s, i) => (
              <div key={i} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Состояния */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            С какими состояниями приходят
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Не нужно знать точное название своего состояния. Если что-то из этого откликается — этого достаточно.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '0.875rem' }}>
            {states.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.25rem', background: 'var(--bg-sage)', borderRadius: '1rem', border: '1px solid var(--primary-light)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '0.45rem' }} />
                <span style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Почему не стоит принимать решение на эмоциях */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 24rem), 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.3 }}>
                Почему не стоит принимать решение прямо сейчас
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
                В момент острого конфликта или накопившейся усталости мозг склонен к крайностям. Решения, принятые в таком состоянии, редко отражают то, чего вы на самом деле хотите.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                Сначала полезнее понять, что именно происходит. Только потом — что делать дальше. Это не «тянуть время». Это разумный порядок действий.
              </p>
            </div>
            <div style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '1.25rem', padding: '1.75rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1rem', fontSize: '0.95rem' }}>Что можно понять на вводной встрече</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {introPoints.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                    <CheckCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.55 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Как проходит поддержка */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Как проходит поддержка
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Начать можно с вводной встречи — без обязательства покупать программу.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { num: '1', title: 'Вводная встреча', desc: '90 минут в небольшой группе с психологом. Можно просто слушать. Никаких обязательств продолжать. Стоимость засчитывается при покупке программы.', price: '1 490 ₽' },
              { num: '2', title: '4 недели программы', desc: 'Встречи, задания, чат с куратором. Психолог ведёт группу: безопасная динамика, структура, конкретные шаги.', price: 'от 14 990 ₽' },
              { num: '3', title: 'Личный план', desc: 'В конце — письменный план: что делать при откатах, как двигаться дальше. Независимо от того, что решили.', price: 'включено' },
            ].map(step => (
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
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
            90 минут. Небольшая группа. Психолог. Никаких обязательств продолжать — и никакого давления принять решение прямо сейчас.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro&from=slozhnye" className="btn-ghost-dark">
              Записаться — 1 490 ₽ →
            </Link>
            <Link href="/quiz" style={{ color: 'rgba(168,184,160,0.75)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Пройти тест <ArrowRight size={13} />
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
              { href: '/blog/kak-ponyat-chto-otnosheniya-zakonchilis', title: 'Как понять, что отношения закончились' },
              { href: '/blog/hochu-rasstatsya-no-boyus', title: 'Хочу расстаться, но боюсь: что делать с этим страхом' },
              { href: '/blog/kak-skazat-o-rasstavanii', title: 'Как сказать о расставании спокойно' },
              { href: '/blog/ustal-ot-otnosheniy', title: 'Усталость от отношений: как понять, что происходит' },
              { href: '/blog/postoyannye-ssory-v-otnosheniyah', title: 'Постоянные ссоры в отношениях: как не потерять себя' },
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
