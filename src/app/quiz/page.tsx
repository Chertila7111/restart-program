'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

const steps = [
  {
    id: 'situation',
    question: 'Что сейчас происходит?',
    hint: 'Выберите то, что ближе к вашей ситуации',
    options: [
      { id: 'fresh', text: 'Мы только расстались — ещё свежо и очень больно' },
      { id: 'months', text: 'Прошло несколько месяцев, но легче не стало' },
      { id: 'divorce', text: 'Я переживаю развод' },
      { id: 'other', text: 'Сложно описать словами, но мне плохо' },
    ],
  },
  {
    id: 'hardest',
    question: 'Что сейчас тяжелее всего?',
    hint: 'Выберите то, что откликается сильнее',
    options: [
      { id: 'thoughts', text: 'Постоянно думаю о нём/ней и хочу написать' },
      { id: 'work', text: 'Не могу нормально работать и держать режим' },
      { id: 'anxiety', text: 'Тревога, пустота, не понимаю что со мной' },
      { id: 'future', text: 'Кажется, жизнь остановилась и будущего нет' },
    ],
  },
  {
    id: 'style',
    question: 'Как вы обычно справляетесь с трудным?',
    hint: 'Нет правильных ответов — просто честно',
    options: [
      { id: 'distract', text: 'Стараюсь не думать и отвлекаться' },
      { id: 'friends', text: 'Говорю с друзьями или близкими' },
      { id: 'research', text: 'Читаю, ищу ответы, разбираюсь сам(а)' },
      { id: 'alone', text: 'Жду, пока само пройдёт, и стараюсь держаться' },
    ],
  },
  {
    id: 'psych',
    question: 'Работали ли вы раньше с психологом?',
    hint: 'Это поможет подобрать подходящий формат',
    options: [
      { id: 'yes_good', text: 'Да, и это хорошо помогало' },
      { id: 'yes_bad', text: 'Да, но не очень подошло' },
      { id: 'no_want', text: 'Нет, хочу попробовать — давно думаю об этом' },
      { id: 'no_unsure', text: 'Нет, и пока немного страшно' },
    ],
  },
]

// Block 1: main insight text — 4 situations × 4 hardest = 16 combinations
const situationTexts: Record<string, Record<string, string>> = {
  fresh: {
    thoughts: 'Похоже, сейчас вам важнее всего остановить навязчивые мысли и справиться с желанием написать. Расставание ещё свежее — это один из самых острых периодов, когда сильно тянет вернуть контакт.',
    work: 'Похоже, расставание выбило вас из привычной жизни: стало сложнее работать, держать режим и собираться с силами. Когда разрыв ещё свежий, это частая реакция на сильную эмоциональную потерю.',
    anxiety: 'Похоже, сейчас сильнее всего ощущаются тревога, пустота и непонимание, что с вами происходит. После свежего расставания состояние может резко меняться — от боли до оцепенения.',
    future: 'Похоже, сейчас тяжелее всего ощущение, что будущего нет и жизнь остановилась. Расставание ещё свежее — это один из самых острых периодов, когда особенно важно не оставаться одному.',
  },
  months: {
    thoughts: 'Похоже, прошло уже время, но мысли о человеке всё ещё возвращаются, и желание написать не отпускает. Это может быть особенно тяжело: внешне жизнь вроде идёт дальше, а внутри связь всё ещё держит.',
    work: 'Похоже, расставание продолжает влиять на вашу обычную жизнь: работу, режим и способность собираться. Даже спустя месяцы состояние может оставаться тяжёлым, если внутри нет опоры и понятного следующего шага.',
    anxiety: 'Похоже, легче так и не стало: внутри остаются тревога, пустота и ощущение, что с вами что-то происходит, но сложно это объяснить. Такое состояние важно не игнорировать, а спокойно разобрать.',
    future: 'Похоже, прошло уже несколько месяцев, но ощущение остановившейся жизни всё ещё держит. Это не значит, что вы «застряли навсегда» — скорее, сейчас не хватает понятной поддержки и маршрута восстановления.',
  },
  divorce: {
    thoughts: 'Похоже, развод сейчас связан не только с болью, но и с сильной тягой к контакту. Когда рушится общая жизнь, привычки и планы, желание написать или всё вернуть может становиться особенно навязчивым.',
    work: 'Похоже, развод сильно выбил вас из режима: стало труднее работать, заниматься делами и держать обычную жизнь. В такой ситуации важно сначала вернуть базовую опору, а уже потом требовать от себя быстрых решений.',
    anxiety: 'Похоже, развод сейчас ощущается как сильная внутренняя потеря: тревога, пустота и непонимание, что будет дальше. Это не просто расставание, а перестройка привычной жизни.',
    future: 'Похоже, развод сейчас ощущается как точка, где жизнь будто остановилась. Когда меняется быт, планы и представление о будущем, особенно важно пройти этот период не в одиночку.',
  },
  other: {
    thoughts: 'Похоже, сейчас сложно описать всё словами, но сильнее всего держат мысли о человеке и желание написать. Когда внутри много чувств, психика часто цепляется за один понятный импульс — вернуть контакт.',
    work: 'Похоже, вам плохо, и это уже влияет на обычную жизнь: работу, режим и повседневные дела. Даже если состояние сложно точно назвать, с ним можно начать разбираться постепенно.',
    anxiety: 'Похоже, сейчас внутри много тревоги, пустоты и непонимания, что происходит. Если сложно подобрать слова — это нормально: иногда сначала нужна не формулировка, а безопасное пространство, где можно разобраться.',
    future: 'Похоже, сейчас тяжело даже представить, что дальше будет лучше. Когда внутри ощущение, что жизнь остановилась, важно начать с маленького шага — не с больших решений, а с возвращения опоры.',
  },
}

// Block 2: 3 bullets for the intro meeting card — by Q2 (hardest)
const hardestBullets: Record<string, string[]> = {
  thoughts: [
    'Разберём, почему так сильно тянет написать',
    'Покажем, что делать в момент отката',
    'Объясним, как программа помогает не оставаться в этом цикле',
  ],
  work: [
    'Разберём, почему после разрыва проседают силы и режим',
    'Поможем наметить первые маленькие шаги к обычной жизни',
    'Покажем, как в программе возвращается структура недели',
  ],
  anxiety: [
    'Поможем разложить состояние на понятные части',
    'Дадим первые способы стабилизации',
    'Объясним, какой формат поддержки сейчас может подойти',
  ],
  future: [
    'Разберём, почему сейчас так сложно думать о будущем',
    'Поможем найти первые точки опоры',
    'Покажем, как программа постепенно возвращает движение вперёд',
  ],
}

// Block 3: coping style note — by Q3 (style)
const styleNotes: Record<string, string> = {
  distract: 'Похоже, вы стараетесь держаться через отвлечение. Это может помогать на короткое время, но если боль возвращается снова, лучше добавить более устойчивую поддержку.',
  friends: 'Хорошо, что рядом есть люди, с кем можно говорить. Вводная встреча добавит к этому профессиональную структуру и понимание, что именно с вами происходит.',
  research: 'Похоже, вы уже пытаетесь разобраться самостоятельно. На встрече можно будет собрать эти мысли в более понятную картину и понять следующий шаг.',
  alone: 'Похоже, вы сейчас просто стараетесь выдержать это состояние. Иногда этого мало — поддержка помогает не ждать, пока станет совсем тяжело.',
}

// Block 4: psychologist experience note — by Q4 (psych)
const psychNotes: Record<string, string> = {
  yes_good: 'Значит, формат поддержки вам уже знаком — вводная встреча поможет понять, подойдёт ли именно групповая программа.',
  yes_bad: 'На вводной встрече можно спокойно посмотреть формат без обязательств и понять, подходит ли вам такой подход.',
  no_want: 'Вводная встреча подойдёт как мягкий первый шаг: можно просто слушать и не рассказывать о себе.',
  no_unsure: 'Можно прийти без готовности говорить о личном. На встрече разрешено просто слушать и знакомиться с форматом.',
}

function getMainText(situation: string, hardest: string): string {
  return situationTexts[situation]?.[hardest]
    ?? 'То, через что вы сейчас проходите — это серьёзно. На вводной встрече можно разобраться, какая поддержка подойдёт именно вам.'
}

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  const currentStep = steps[step]
  const isResult = step === steps.length

  const handleSelect = (optionId: string) => setSelected(optionId)

  const handleNext = () => {
    if (!selected) return
    const newAnswers = { ...answers, [currentStep.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step === 0) return
    setStep(step - 1)
    setSelected(answers[steps[step - 1].id] || null)
    const prev = { ...answers }
    delete prev[currentStep.id]
    setAnswers(prev)
  }

  const bullets = isResult ? (hardestBullets[answers.hardest] ?? hardestBullets.thoughts) : []
  const styleNote = isResult ? (styleNotes[answers.style] ?? '') : ''
  const psychNote = isResult ? (psychNotes[answers.psych] ?? '') : ''
  const mainText = isResult ? getMainText(answers.situation, answers.hardest) : ''

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '4rem' }}>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(250,247,243,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        height: '4rem',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="container mx-auto px-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <Image src="/logo-icon.png" alt="Снова с собой" width={56} height={56} style={{ objectFit: 'contain', height: '40px', width: 'auto' }} />
          </Link>

          {!isResult && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {steps.map((_, i) => (
                <div key={i} style={{
                  width: i === step ? '1.75rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '9999px',
                  background: i <= step ? 'var(--primary)' : 'var(--primary-light)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
          )}

          {!isResult && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {step + 1} из {steps.length}
            </span>
          )}
          {isResult && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Ваш результат</span>}
        </div>
      </div>

      <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* ── Question screen ── */}
        {!isResult && (
          <div>
            {step > 0 && (
              <button
                onClick={handleBack}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem', padding: 0 }}
              >
                <ArrowLeft size={16} /> Назад
              </button>
            )}

            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.625rem', lineHeight: 1.3 }}>
              {currentStep.question}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              {currentStep.hint}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {currentStep.options.map((option) => {
                const isActive = selected === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '1.25rem 1.5rem', borderRadius: '1rem',
                      border: isActive ? '2px solid var(--primary)' : '2px solid var(--border)',
                      background: isActive ? 'var(--bg-sage)' : 'white',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                    }}
                  >
                    <div style={{
                      width: '1.375rem', height: '1.375rem', borderRadius: '50%', flexShrink: 0,
                      border: isActive ? '2px solid var(--primary)' : '2px solid var(--border)',
                      background: isActive ? 'var(--primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}>
                      {isActive && <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'white' }} />}
                    </div>
                    <span style={{ fontSize: '0.975rem', color: isActive ? 'var(--primary-dark)' : 'var(--text)', fontWeight: isActive ? 600 : 400, lineHeight: 1.4 }}>
                      {option.text}
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={!selected}
              className="btn-primary"
              style={{ width: '100%', opacity: selected ? 1 : 0.45, cursor: selected ? 'pointer' : 'not-allowed', fontSize: '1rem', padding: '0.875rem' }}
            >
              {step === steps.length - 1 ? 'Получить рекомендацию →' : 'Продолжить →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '1rem' }}>
              Ответы анонимны и не записываются
            </p>
          </div>
        )}

        {/* ── Result screen ── */}
        {isResult && (
          <div>
            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Image src="/logo-icon.png" alt="" width={64} height={64} style={{ objectFit: 'contain', height: '64px', width: 'auto' }} />
            </div>

            {/* Block 1: "Ваша ситуация" */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.75rem' }}>
                Ваша ситуация
              </div>
              <div style={{ background: 'white', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.5rem 1.75rem', borderLeft: '4px solid var(--primary)' }}>
                <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
                  {mainText}
                </p>
              </div>
            </div>

            {/* Block 3: coping style note */}
            {styleNote && (
              <div style={{ marginBottom: '1.5rem', padding: '0 0.25rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>
                  {styleNote}
                </p>
              </div>
            )}

            {/* Block 2: intro meeting card */}
            <div style={{ background: 'var(--primary)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '10rem', height: '10rem', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Рекомендуем начать с
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '0.625rem' }}>
                  Вводной встречи
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  90 минут в небольшой группе с психологом. Можно просто слушать, не рассказывая о себе. Без обязательства покупать программу.
                </p>

                {/* Bullets from Block 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
                  {bullets.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <CheckCircle size={15} style={{ color: 'rgba(255,255,255,0.7)', flexShrink: 0, marginTop: '0.175rem' }} />
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Block 4: psych note — before button */}
                {psychNote && (
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1.25rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.825rem', lineHeight: 1.65, margin: 0 }}>
                      {psychNote}
                    </p>
                  </div>
                )}

                {/* Price + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.12)', borderRadius: '0.875rem', padding: '1rem 1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>1 490 ₽</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>разово · засчитается в тариф</div>
                  </div>
                  <Link
                    href="/pricing"
                    style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', textDecoration: 'none', whiteSpace: 'nowrap' }}
                  >
                    Записаться →
                  </Link>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Если после вводной встречи формат не подойдёт — вернём деньги.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <Link href="/contacts" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                Есть вопросы? Напишите нам →
              </Link>
              <button
                onClick={() => { setStep(0); setAnswers({}); setSelected(null) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'underline' }}
              >
                Пройти тест заново
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
