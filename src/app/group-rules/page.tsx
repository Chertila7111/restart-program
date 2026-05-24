import type { Metadata } from 'next'
import Link from 'next/link'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Правила группы',
  description: 'Правила участия в групповой программе «Снова с собой». Конфиденциальность, уважение и безопасная атмосфера.',
  robots: { index: false, follow: false },
}

const TECH_RULES = [
  {
    emoji: '🎙️',
    title: 'Микрофон',
    body: 'Используйте наушники с микрофоном или гарнитуру — это сильно улучшает качество звука для всей группы. Выберите тихое место без фонового шума. В режиме ожидания держите микрофон выключенным и включайте только когда говорите.',
  },
  {
    emoji: '📹',
    title: 'Камера',
    body: 'Камера — по желанию. Если включаете: поставьте ракурс ровно, убедитесь в хорошем освещении (свет должен падать на лицо, а не сзади). Тёмный экран или засветка мешают контакту.',
  },
  {
    emoji: '🌐',
    title: 'Интернет',
    body: 'Проверьте соединение за 5–10 минут до встречи. Нестабильный интернет прерывает звук и отвлекает всю группу. Лучше проводное соединение или Wi-Fi вблизи роутера.',
  },
  {
    emoji: '🚪',
    title: 'Зайдите заранее',
    body: 'Подключайтесь за 2–3 минуты до начала — не в последнюю секунду. Это даёт время проверить звук, видео и устроиться комфортно, не отвлекая других.',
  },
  {
    emoji: '📵',
    title: 'Уведомления и телефон',
    body: 'Переведите телефон и компьютер в режим «Не беспокоить». Всплывающие уведомления и звонки отвлекают — и вас, и группу. 90 минут в неделю — это ваше время.',
  },
  {
    emoji: '🏠',
    title: 'Место',
    body: 'Найдите уединённое место, где вас не побеспокоят. Разговоры в транспорте, кафе или при других людях нарушают конфиденциальность всей группы.',
  },
]

const CONDUCT_RULES = [
  {
    emoji: '🔒',
    title: 'Конфиденциальность',
    body: 'Всё, что говорится на встречах, остаётся внутри группы. Имена, истории и детали чужих ситуаций не выносятся за пределы — ни в разговорах, ни в социальных сетях, ни в мессенджерах.',
  },
  {
    emoji: '🤝',
    title: 'Уважение',
    body: 'Мы здесь не для того, чтобы давать советы или оценивать чужие решения. Каждый говорит только о своём опыте. Критика, осуждение и обесценивание — вне группы.',
  },
  {
    emoji: '🗣️',
    title: 'Не перебивать',
    body: 'Пока говорит другой участник — вы слушаете. Перебивать, заканчивать фразы за другого или говорить поверх — это нарушение безопасного пространства. Если хочется что-то сказать — дождитесь паузы.',
  },
  {
    emoji: '💬',
    title: 'Говорите от первого лица',
    body: 'Формулируйте через «Я чувствую...», «Мне кажется...», «Меня задело...». Избегайте обобщений «все так думают» и оценок в адрес других. Это создаёт безопасную атмосферу для всех.',
  },
  {
    emoji: '🙅',
    title: 'Советы без запроса',
    body: 'Не давайте советов, если человек не просил. «Тебе нужно...», «На твоём месте я бы...» — это не поддержка, а оценка. Лучший отклик — признать чувства человека, а не предлагать решение.',
  },
  {
    emoji: '🎥',
    title: 'Не записывать',
    body: 'Запрещено записывать встречи любым способом: скриншоты, аудио, видео. Исполнитель ведёт запись только материальной части (объяснения психолога, упражнения) — личные обсуждения не записываются.',
  },
  {
    emoji: '⏰',
    title: 'Пунктуальность',
    body: 'Встречи начинаются вовремя. Если знаете, что опоздаете или не сможете прийти — предупредите куратора заранее. Это помогает нам и группе планировать встречу.',
  },
  {
    emoji: '🔄',
    title: 'Пропуск встречи',
    body: 'Если пропустили — запись доступна в разделе «Записи встреч». Материал не потеряете. Но живое участие даёт значительно больше: старайтесь присутствовать.',
  },
  {
    emoji: '🆘',
    title: 'Кризисная ситуация',
    body: 'Если во время или после встречи вам стало очень плохо — напишите куратору. Программа не является кризисной службой, но мы поможем найти нужную поддержку. Экстренная помощь: 112, телефон доверия 8-800-2000-122.',
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
            Правила участия в программе
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.85)', textAlign: 'center', lineHeight: 1.7, fontSize: '0.975rem', maxWidth: '34rem', margin: '0 auto' }}>
            Несколько договорённостей, которые делают группу безопасным местом — технически и эмоционально.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)', padding: '3.5rem 0 2rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '44rem' }}>

          {/* Техническая подготовка */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.875rem', borderRadius: '9999px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Часть 1
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Техническая подготовка перед встречей</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
              Проверьте это до первой встречи — один раз. Потом войдёт в привычку.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '3rem' }}>
            {TECH_RULES.map((rule) => (
              <div key={rule.title} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.35rem', flexShrink: 0, lineHeight: 1 }}>{rule.emoji}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{rule.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{rule.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Правила поведения */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.875rem', borderRadius: '9999px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Часть 2
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Правила поведения во время встречи</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
              Эти правила создают безопасную атмосферу для каждого участника.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '3rem' }}>
            {CONDUCT_RULES.map((rule) => (
              <div key={rule.title} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.35rem', flexShrink: 0, lineHeight: 1 }}>{rule.emoji}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{rule.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{rule.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Нарушение правил */}
          <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <h2 style={{ fontWeight: 800, fontSize: '1rem', color: '#92400E', margin: 0 }}>Нарушение правил</h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#78350F', lineHeight: 1.75, marginBottom: '0.875rem' }}>
              Если поведение участника мешает группе, нарушает безопасность или правила программы, психолог или куратор имеет право:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                'Замутить микрофон участника без предупреждения',
                'Попросить участника покинуть текущую встречу',
                'Отстранить от дальнейшего участия в программе',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#92400E' }}>
                  <span style={{ color: '#F97316', flexShrink: 0 }}>→</span> {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '0.8rem', color: '#B45309', lineHeight: 1.65, margin: 0 }}>
              При отстранении от программы возврат средств за оставшиеся неоказанные услуги не производится, если нарушение правил подтверждено. Подробнее — в{' '}
              <Link href="/legal/terms" style={{ color: '#92400E', fontWeight: 600 }}>пользовательском соглашении</Link>{' '}
              (раздел 5).
            </p>
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
