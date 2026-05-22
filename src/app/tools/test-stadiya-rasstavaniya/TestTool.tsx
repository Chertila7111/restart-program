'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const QUESTIONS = [
  {
    text: 'Как давно произошло расставание?',
    options: [
      { label: 'Меньше 2 недель', score: 0 },
      { label: '2–6 недель', score: 1 },
      { label: '1–3 месяца', score: 2 },
      { label: 'Больше 3 месяцев', score: 3 },
    ],
  },
  {
    text: 'Как вы спите?',
    options: [
      { label: 'Очень плохо — практически не сплю', score: 0 },
      { label: 'Нарушен, часто просыпаюсь', score: 1 },
      { label: 'В целом нормально, бывают сложные ночи', score: 2 },
      { label: 'Сплю хорошо', score: 3 },
    ],
  },
  {
    text: 'Как часто вы думаете о бывшем партнёре?',
    options: [
      { label: 'Постоянно, мысли не отпускают', score: 0 },
      { label: 'Очень часто, особенно вечерами', score: 1 },
      { label: 'Периодически, но уже не весь день', score: 2 },
      { label: 'Иногда, без сильной боли', score: 3 },
    ],
  },
  {
    text: 'Есть ли у вас силы на повседневные дела — работу, встречи с людьми?',
    options: [
      { label: 'Нет, всё даётся с огромным трудом', score: 0 },
      { label: 'Кое-как справляюсь, но сил мало', score: 1 },
      { label: 'В основном да, хотя бывают провалы', score: 2 },
      { label: 'Да, справляюсь нормально', score: 3 },
    ],
  },
  {
    text: 'Как вы представляете своё будущее?',
    options: [
      { label: 'Не вижу будущего без этого человека', score: 0 },
      { label: 'Туманно, трудно что-то планировать', score: 1 },
      { label: 'Начинаю видеть возможности', score: 2 },
      { label: 'Строю планы и жду новых событий', score: 3 },
    ],
  },
]

type ResultKey = 'acute' | 'adapting' | 'recovering' | 'moving'

const RESULTS: Record<ResultKey, {
  title: string
  subtitle: string
  desc: string
  color: string
  articles: { label: string; slug: string }[]
  cta: string
}> = {
  acute: {
    title: 'Острый период',
    subtitle: '0–5 баллов',
    desc: 'Вы в самом начале — боль максимальная, и это нормально. Сейчас важно не застрять в изоляции и не принимать больших решений. Поддержка нужна уже сейчас.',
    color: '#C0392B',
    articles: [
      { label: 'Почему так больно после расставания', slug: 'pochemu-tak-bolno-posle-rasstavaniya' },
      { label: 'Как пережить расставание', slug: 'kak-perezhit-rasstavanie' },
      { label: 'Пустота после расставания', slug: 'pustota-posle-rasstavaniya' },
    ],
    cta: 'Острый период — лучшее время начать работу с психологом.',
  },
  adapting: {
    title: 'Адаптация',
    subtitle: '6–9 баллов',
    desc: 'Первый шок прошёл, но стабильности ещё нет. Чередуются хорошие и плохие дни. Это стадия, когда важна структура — иначе легко застрять.',
    color: '#E67E22',
    articles: [
      { label: 'Тревога после расставания', slug: 'trevoga-posle-rasstavaniya' },
      { label: 'Стыд и вина после расставания', slug: 'styd-i-vina-posle-rasstavaniya' },
      { label: 'Как не написать бывшему', slug: 'kak-ne-napisat-byvshemu' },
    ],
    cta: 'На стадии адаптации группа с психологом даёт нужную структуру.',
  },
  recovering: {
    title: 'Восстановление',
    subtitle: '10–12 баллов',
    desc: 'Вы уже прошли самое тяжёлое. Боль стала тише, жизнь продолжается. Сейчас хорошее время понять паттерны и не повторить их в следующих отношениях.',
    color: 'var(--primary)',
    articles: [
      { label: 'Самооценка после расставания', slug: 'samoocenka-posle-rasstavaniya' },
      { label: 'Как улучшить самооценку', slug: 'kak-uluchshit-samoocenku-posle-rasstavaniya' },
      { label: 'Эмоциональная зависимость', slug: 'emotsionalnaya-zavisimost-v-otnosheniyakh' },
    ],
    cta: 'Хорошее время — разобрать паттерны и двигаться осознанно.',
  },
  moving: {
    title: 'Движение вперёд',
    subtitle: '13–15 баллов',
    desc: 'Вы справились. Прошлые отношения перестали определять настоящее. Можно смотреть вперёд. Если остались вопросы о паттернах — их тоже можно закрыть.',
    color: 'var(--primary)',
    articles: [
      { label: 'Как начать новую жизнь после расставания', slug: 'kak-nachat-novuyu-zhizn-posle-rasstavaniya' },
      { label: 'Почему не могу отпустить человека', slug: 'pochemu-ne-mogu-otpustit-cheloveka' },
    ],
    cta: 'Вы уже на финишной прямой. Оставшиеся вопросы — дорешите.',
  },
}

function scoreToResult(score: number): ResultKey {
  if (score <= 5) return 'acute'
  if (score <= 9) return 'adapting'
  if (score <= 12) return 'recovering'
  return 'moving'
}

export function TestTool() {
  const [answers, setAnswers] = useState<number[]>([])
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)

  const totalScore = answers.reduce((s, a) => s + a, 0)
  const resultKey = scoreToResult(totalScore)
  const result = RESULTS[resultKey]

  const selectAnswer = (score: number) => {
    const next = [...answers, score]
    setAnswers(next)
    if (next.length === QUESTIONS.length) {
      setDone(true)
    } else {
      setCurrent(current + 1)
    }
  }

  const reset = () => { setAnswers([]); setCurrent(0); setDone(false) }

  const progress = done ? 100 : (current / QUESTIONS.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <section style={{ background: 'var(--bg-dark)', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '16rem', height: '16rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '40rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Тест
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.25 }}>
            На какой стадии после расставания вы сейчас?
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.85)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            5 вопросов — и вы получите чёткое понимание своей стадии и рекомендации, что делать дальше.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '36rem' }}>

          {/* Progress */}
          <div style={{ height: '4px', background: 'var(--border)', borderRadius: '9999px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', transition: 'width 0.4s ease', borderRadius: '9999px' }} />
          </div>

          {!done ? (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.875rem', fontWeight: 600 }}>
                Вопрос {current + 1} из {QUESTIONS.length}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                {QUESTIONS[current].text}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {QUESTIONS[current].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectAnswer(opt.score)}
                    style={{ textAlign: 'left', padding: '0.875rem 1.25rem', background: 'var(--bg-soft)', border: '1.5px solid var(--border)', borderRadius: '0.875rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500, transition: 'border-color 0.15s, background 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-sage)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-soft)' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Result */}
              <div className="card" style={{ padding: '2rem', borderTop: `4px solid ${result.color}`, marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Ваша стадия
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: result.color, marginBottom: '0.25rem' }}>
                  {result.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '1.25rem' }}>
                  {result.subtitle} · {totalScore} из 15 баллов
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  {result.desc}
                </p>
                <div style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '0.75rem', padding: '0.875rem 1.125rem', fontSize: '0.875rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
                  {result.cta}
                </div>
              </div>

              {/* Article recommendations */}
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  Статьи для вашей стадии
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.articles.map(a => (
                    <Link key={a.slug} href={`/blog/${a.slug}`} style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ArrowRight size={12} /> {a.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                <Link href="/checkout?product=intro" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.875rem', padding: '0.875rem 2rem', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-block' }}>
                  Вводная встреча — 1 490 ₽ →
                </Link>
                <button onClick={reset} style={{ background: 'transparent', color: 'var(--text-light)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.5rem 1.5rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>
                  Пройти тест заново
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
