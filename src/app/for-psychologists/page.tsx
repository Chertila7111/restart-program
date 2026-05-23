import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Users, BookOpen, MessageCircle } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Для психологов — сотрудничество с программой «Снова с собой»',
  description: 'Ведёте работу с темой расставаний, развода или потери? Рассказываем, как мы сотрудничаем с психологами: направление клиентов, участие в программе, партнёрство.',
  keywords: ['психолог сотрудничество', 'партнёрство с психологами расставание', 'направить клиента психолог', 'программа восстановления расставание'],
}

const benefits = [
  {
    Icon: Users,
    title: 'Направляйте клиентов',
    desc: 'Если клиент на индивидуальной терапии хочет дополнить её групповой работой — вводная встреча или программа могут стать хорошим дополнением.',
  },
  {
    Icon: BookOpen,
    title: 'Получайте направления',
    desc: 'Мы направляем участников программы к индивидуальным специалистам, когда групповой формат не покрывает запрос полностью.',
  },
  {
    Icon: MessageCircle,
    title: 'Ведите группу',
    desc: 'Если у вас есть опыт ведения групп и специализация на теме расставаний — расскажите нам о себе. Мы периодически расширяем команду.',
  },
]

const faq = [
  {
    q: 'Какой формат у программы?',
    a: '4 групповые встречи раз в неделю (видео), чат с куратором, задания между встречами, дневник состояния. Группы 8–12 человек.',
  },
  {
    q: 'Какие специалисты ведут группы?',
    a: 'Практикующие психологи с опытом ведения групп и специализацией на теме потерь и расставаний. Каждый прошёл внутренний отбор.',
  },
  {
    q: 'Как направить клиента?',
    a: 'Напишите нам на snovassoboi@yandex.com — расскажите о запросе клиента. Мы подберём подходящий формат и при необходимости дадим скидку на вводную встречу.',
  },
  {
    q: 'Как попасть в команду психологов?',
    a: 'Напишите на snovassoboi@yandex.com с коротким рассказом о себе: опыт, подход, специализация, опыт ведения групп. Мы отвечаем на все письма.',
  },
]

export default function ForPsychologistsPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Для психологов
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Работаете с темой расставаний и потерь?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40rem' }}>
            «Снова с собой» — программа групповой поддержки для людей после расставания. Мы открыты к сотрудничеству с частнопрактикующими психологами: взаимные направления, участие в программе, партнёрство.
          </p>
          <a href="mailto:snovassoboi@yandex.com" className="btn-ghost-dark" style={{ fontSize: '1rem', display: 'inline-block' }}>
            Написать нам →
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
            Форматы сотрудничества
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {benefits.map(({ Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.75rem', height: '2.75rem', borderRadius: '0.875rem', background: 'var(--primary-light)', flexShrink: 0 }}>
                  <Icon size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem' }}>{title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About program */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            О программе
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Кратко — для понимания формата.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 20rem), 1fr))', gap: '0.875rem' }}>
            {[
              'Групповой формат, 8–12 человек',
              'Психолог с опытом 8+ лет, специализация — потери и расставания',
              '4 встречи раз в неделю (видео), 90–120 минут',
              'Чат с куратором в течение всей программы',
              'Задания и практики между встречами',
              'Дневник состояния и отслеживание изменений',
              'Личный план восстановления в конце',
              'Вводная встреча без обязательства купить программу',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                <span style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
            Вопросы и ответы
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {faq.map((item) => (
              <div key={item.q} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{item.q}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.a}</div>
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
            Готовы к разговору?
          </h2>
          <p style={{ color: 'rgba(168,184,160,1)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
            Напишите нам на почту — расскажите о своей специализации и о том, как видите сотрудничество. Мы отвечаем на все письма.
          </p>
          <a href="mailto:snovassoboi@yandex.com" className="btn-ghost-dark" style={{ display: 'inline-block' }}>
            snovassoboi@yandex.com →
          </a>
        </div>
      </section>
    </>
  )
}
