import type { Metadata } from 'next'
import Link from 'next/link'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Правила группы',
  description: 'Правила участия в групповой программе «Снова с собой». Конфиденциальность, уважение и безопасная атмосфера.',
  robots: { index: false, follow: false },
}

const RULES = [
  {
    emoji: '🔒',
    title: 'Конфиденциальность',
    body: 'Всё, что говорится на встречах, остаётся внутри группы. Имена, истории и детали чужих ситуаций не выносятся за пределы группы — ни в разговорах, ни в социальных сетях.',
  },
  {
    emoji: '🤝',
    title: 'Уважение и безопасность',
    body: 'Мы здесь не для того, чтобы давать советы или оценивать чужие решения. Каждый говорит только о своём опыте. Критика, осуждение и обесценивание — вне группы.',
  },
  {
    emoji: '🎙️',
    title: 'Участие',
    body: 'Можно просто слушать — вы не обязаны говорить о себе. Если вы хотите высказаться, говорите от первого лица: «Я чувствую...», «Мне кажется...». Это создаёт безопасную атмосферу.',
  },
  {
    emoji: '⏰',
    title: 'Пунктуальность',
    body: 'Встречи начинаются вовремя. Если вы знаете, что опоздаете или не сможете прийти, предупредите куратора заранее. Это помогает нам планировать встречу.',
  },
  {
    emoji: '📹',
    title: 'Камера',
    body: 'Камера приветствуется, но не обязательна. Микрофон в режиме ожидания лучше держать выключенным и включать, когда говорите. Выберите тихое место.',
  },
  {
    emoji: '🔄',
    title: 'Пропуск встречи',
    body: 'Если вы пропустили встречу — ничего страшного. Запись доступна в разделе «Записи встреч» навсегда. Вы не потеряете материал. Но старайтесь приходить — живое участие даёт больше.',
  },
  {
    emoji: '🆘',
    title: 'Кризисная ситуация',
    body: 'Если во время или после встречи вам стало очень плохо — напишите куратору. Программа не является кризисной службой, но мы поможем найти нужную поддержку.',
  },
  {
    emoji: '📵',
    title: 'Телефон',
    body: 'Во время встречи постарайтесь отложить телефон. 90 минут в неделю — это ваше время. Уведомления могут подождать.',
  },
]

export default function GroupRulesPage() {
  return (
    <>
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '18rem', height: '18rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '44rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <LogoSvg size={52} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: '1rem', lineHeight: 1.25 }}>
            Правила участия в группе
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.85)', textAlign: 'center', lineHeight: 1.7, fontSize: '0.975rem', maxWidth: '34rem', margin: '0 auto' }}>
            Несколько простых договорённостей, которые делают группу безопасным местом для всех участников.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)', padding: '3.5rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '44rem' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {RULES.map((rule) => (
              <div key={rule.title} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', flexShrink: 0, lineHeight: 1 }}>{rule.emoji}</div>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.375rem' }}>{rule.title}</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{rule.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg-sage)', border: '1.5px solid var(--primary-light)', borderRadius: '1.25rem', padding: '1.75rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
              Если у вас есть вопросы о формате или правилах — напишите куратору. Мы всегда рады ответить до первой встречи.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/dashboard/chats" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                Написать куратору →
              </Link>
              <Link href="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
                В кабинет
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
