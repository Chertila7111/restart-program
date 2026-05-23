import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/JsonLd'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Бесплатные группы поддержки или программа с психологом | Снова с собой',
  description: 'Честное сравнение: бесплатные онлайн-группы взаимопомощи vs программа «Снова с собой» с психологом. Когда что подходит.',
  keywords: ['бесплатная группа поддержки расставание', 'бесплатная помощь после разрыва', 'группа взаимопомощи или психолог'],
  openGraph: {
    title: 'Бесплатные группы или программа с психологом?',
    description: 'Честное сравнение форматов поддержки после расставания.',
  },
}

export default function BesplatnyyeGruppyPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Главная', href: '/' },
        { name: 'Сравнения', href: '/compare' },
        { name: 'Бесплатные группы или программа', href: '/compare/besplatnye-gruppy-ili-programma' },
      ]} />

      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Честное сравнение
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Бесплатные группы поддержки или программа с психологом?
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.9)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '40rem' }}>
            Мы не будем говорить, что платная программа всегда лучше. Честный разбор, когда что подходит.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)', padding: '3.5rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>

          {/* Comparison grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>

            {/* Free */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.25rem' }}>Бесплатные форматы</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Онлайн-сообщества, форумы, группы взаимопомощи</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Работает</div>
              {[
                'Снижает ощущение изоляции — можно читать чужой опыт',
                'Доступно в любое время, анонимно',
                'Ноль финансовых обязательств',
                'Хорошо для первого шага — просто найти похожих людей',
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                  <Check size={13} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Ограничения</div>
                {[
                  'Нет профессионального ведения — советы от таких же растерянных',
                  'Часто токсичная динамика: «бывшие — козлы», обесценивание боли',
                  'Нет структуры: читаете, но непонятно, что делать',
                  'Риск «завязнуть» в обсуждении боли без движения вперёд',
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                    <X size={13} style={{ color: '#C0392B', flexShrink: 0, marginTop: '0.2rem' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Program */}
            <div style={{ background: 'var(--bg-sage)', border: '2px solid var(--primary)', borderRadius: '1.25rem', padding: '1.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Программа «Снова с собой»</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Психолог + группа + структура + план</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Работает</div>
              {[
                'Ведёт психолог — есть профессиональная навигация',
                'Структура: конкретные встречи, задания, куратор, дневник',
                'Безопасная динамика в группе — психолог следит за этим',
                'В конце — письменный план: что делать при откатах',
                'Начать можно с вводной встречи без обязательств',
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                  <Check size={13} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--primary-light)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Ограничения</div>
                {[
                  'Стоит денег — от 14 990 ₽ за программу',
                  'Расписание встреч — нужно подстраиваться',
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                    <X size={13} style={{ color: 'var(--text-light)', flexShrink: 0, marginTop: '0.2rem' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Honest answer */}
          <div style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '3rem' }}>
            <div style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1rem', marginBottom: '0.75rem' }}>Честный ответ</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.75, margin: 0 }}>
              Бесплатные ресурсы — хорошее начало, если вы просто ищете людей в похожей ситуации. Но если цель — реально пройти через расставание и двигаться дальше, они почти никогда не дают структуру и профессиональную навигацию. Программа с психологом не потому что «лучше», а потому что у неё другая задача: не «поговорить», а восстановиться.
            </p>
          </div>

          {/* When free works */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Бесплатный формат подойдёт, если:</div>
              {[
                'Вам нужно просто выговориться анонимно',
                'Хотите почитать чужой опыт прежде чем что-то решить',
                'Прямо сейчас нет финансовой возможности',
                'Прошло немного времени и вы справляетесь в целом',
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                  <ArrowRight size={12} style={{ color: 'var(--text-light)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Программа нужна, если:</div>
              {[
                'Прошло больше месяца, а легче не становится',
                'Нарушен сон, нет сил работать',
                'Постоянно хочется написать бывшему',
                'Чувствуете, что застряли и не двигаетесь',
                'Хотите понять паттерн, а не просто пережить боль',
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                  <ArrowRight size={12} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Also free resources */}
          <div style={{ border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '3rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Бесплатные ресурсы на сайте</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
              У нас есть бесплатные статьи, тест и инструменты — без обязательства покупать программу.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/blog" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>→ Статьи</Link>
              <Link href="/quiz" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>→ Тест</Link>
              <Link href="/tools/pauza-10-minut" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>→ Инструменты</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-dark)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '40rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><LogoSvg size={52} /></div>
          <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.3rem', marginBottom: '0.625rem', lineHeight: 1.3 }}>
            Попробуйте группу без обязательств — за 1 490 ₽
          </h3>
          <p style={{ color: 'rgba(168,184,160,0.85)', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Вводная встреча. 90 минут. Небольшая группа с психологом. Стоимость засчитывается при покупке программы.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro" className="btn-ghost-dark">Записаться →</Link>
            <Link href="/quiz" style={{ color: 'rgba(168,184,160,0.7)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Пройти тест <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
