'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowLeft, Phone, BookOpen } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'
import { BLOG_POSTS } from '@/lib/blog'

const articlesByCategory: Record<string, string[]> = {
  thoughts: ['kak-ne-napisat-byvshemu', 'kak-ne-budit-nadezhdu-na-vozvrat', 'emotsionalnaya-zavisimost-v-otnosheniyakh'],
  anxiety:  ['trevoga-posle-rasstavaniya', 'pustota-posle-rasstavaniya', 'pochemu-tak-bolno-posle-rasstavaniya'],
  future:   ['kak-perezhit-rasstavanie', 'samoocenka-posle-rasstavaniya', 'kak-nachat-novuyu-zhizn-posle-rasstavaniya'],
  work:     ['posle-rasstavaniya-ne-mogu-rabotat', 'kak-nachat-novuyu-zhizn-posle-rasstavaniya', 'kogda-obrashchatsya-k-psikhologu-posle-rasstavaniya'],
}

// ── Step definitions ──────────────────────────────────────────────────────────

type StepId =
  | 'situation'
  | 'fresh_when' | 'fresh_hard'
  | 'months_when' | 'months_block'
  | 'divorce_kids' | 'divorce_hard'
  | 'other_when' | 'other_hard'
  | 'psych'
  | 'crisis'

type QuizStep = {
  id: StepId
  question: string
  hint: string
  options: { id: string; text: string }[]
}

const allSteps: Record<StepId, QuizStep> = {
  situation: {
    id: 'situation',
    question: 'Что сейчас происходит?',
    hint: 'Выберите то, что ближе всего к вашей ситуации',
    options: [
      { id: 'fresh',   text: 'Мы только расстались — ещё свежо и очень больно' },
      { id: 'months',  text: 'Прошло несколько месяцев, но легче не стало' },
      { id: 'divorce', text: 'Я переживаю развод' },
      { id: 'other',   text: 'Сложно описать словами, но мне плохо' },
    ],
  },

  // ── FRESH branch ─────────────────────────────────────────────────────────
  fresh_when: {
    id: 'fresh_when',
    question: 'Как давно это случилось?',
    hint: 'Это поможет понять, на каком этапе вы сейчас',
    options: [
      { id: 'days',  text: 'Несколько дней или меньше недели' },
      { id: 'weeks', text: '1-4 недели назад' },
      { id: 'month', text: 'Около месяца назад' },
    ],
  },
  fresh_hard: {
    id: 'fresh_hard',
    question: 'Что сейчас тяжелее всего?',
    hint: 'Выберите то, что резонирует сильнее',
    options: [
      { id: 'thoughts',    text: 'Постоянно думаю о нём/ней — хочется написать' },
      { id: 'body',        text: 'Физически плохо: не сплю, ничего не ем' },
      { id: 'understand',  text: 'Не понимаю за что — ищу объяснение этому' },
      { id: 'alone',       text: 'Страшно оставаться одной/одним' },
    ],
  },

  // ── MONTHS branch ────────────────────────────────────────────────────────
  months_when: {
    id: 'months_when',
    question: 'Сколько времени прошло?',
    hint: 'Примерно — точность не важна',
    options: [
      { id: 'three_six',  text: '3–6 месяцев' },
      { id: 'six_year',   text: '6–12 месяцев' },
      { id: 'over_year',  text: 'Больше года' },
    ],
  },
  months_block: {
    id: 'months_block',
    question: 'Что мешает двигаться дальше?',
    hint: 'Что резонирует сильнее всего?',
    options: [
      { id: 'social',   text: 'Слежу за ним/ней в соцсетях и сравниваю себя' },
      { id: 'compare',  text: 'Сравниваю всех новых людей с бывшим/бывшей' },
      { id: 'fear',     text: 'Боюсь новых отношений — не хочу снова ошибиться' },
      { id: 'empty',    text: 'Просто пусто и нет интереса к жизни' },
    ],
  },

  // ── DIVORCE branch ───────────────────────────────────────────────────────
  divorce_kids: {
    id: 'divorce_kids',
    question: 'Есть ли дети в вашей ситуации?',
    hint: 'Это помогает точнее подобрать формат поддержки',
    options: [
      { id: 'no_kids',    text: 'Нет, детей нет' },
      { id: 'kids_me',    text: 'Да, они остаются со мной' },
      { id: 'kids_share', text: 'Да, совместная опека' },
    ],
  },
  divorce_hard: {
    id: 'divorce_hard',
    question: 'Что сейчас самое тяжёлое?',
    hint: 'Можно выбрать то, что давит сильнее всего',
    options: [
      { id: 'practical',  text: 'Юридические, бытовые и финансовые вопросы' },
      { id: 'loneliness', text: 'Одиночество и перестройка всей жизни с нуля' },
      { id: 'guilt',      text: 'Вина, обида или злость — не знаю, куда деть' },
      { id: 'worryKids',  text: 'Переживаю за детей и их состояние' },
    ],
  },

  // ── OTHER branch ─────────────────────────────────────────────────────────
  other_when: {
    id: 'other_when',
    question: 'Как долго вам уже плохо?',
    hint: 'Примерно — это важно для понимания ситуации',
    options: [
      { id: 'weeks',  text: 'Несколько недель' },
      { id: 'months', text: 'Несколько месяцев' },
      { id: 'long',   text: 'Долго — уже не помню, когда было иначе' },
    ],
  },
  other_hard: {
    id: 'other_hard',
    question: 'Что захватывает сильнее всего?',
    hint: 'Нет правильного или неправильного ответа',
    options: [
      { id: 'anxiety',    text: 'Тревога и мысли, которые ходят по кругу' },
      { id: 'loneliness', text: 'Одиночество и ощущение пустоты' },
      { id: 'anger',      text: 'Злость или обида, которую некуда деть' },
      { id: 'apathy',     text: 'Апатия — ничего не хочется и не интересно' },
    ],
  },

  // ── PSYCH (common) ───────────────────────────────────────────────────────
  psych: {
    id: 'psych',
    question: 'Работали ли вы раньше с психологом?',
    hint: 'Это поможет подобрать подходящий формат',
    options: [
      { id: 'yes_good',  text: 'Да, и это хорошо помогало' },
      { id: 'yes_bad',   text: 'Да, но не очень подошло' },
      { id: 'no_want',   text: 'Нет, хочу попробовать — давно думаю об этом' },
      { id: 'no_unsure', text: 'Нет, и пока немного страшно' },
    ],
  },

  // ── CRISIS CHECK (last before result) ────────────────────────────────────
  crisis: {
    id: 'crisis',
    question: 'Есть ли сейчас ощущение, что вы можете причинить себе вред или не справиться с собой?',
    hint: 'Это обязательный вопрос для вашей безопасности. Ответьте честно — здесь нет правильного ответа',
    options: [
      { id: 'no',     text: 'Нет, такого ощущения нет' },
      { id: 'unsure', text: 'Не уверен(а)' },
      { id: 'yes',    text: 'Да, такие мысли есть' },
    ],
  },
}

function getNextStep(stepId: StepId, answerId: string): StepId | 'result' | 'crisis_screen' {
  if (stepId === 'situation') {
    if (answerId === 'fresh')   return 'fresh_when'
    if (answerId === 'months')  return 'months_when'
    if (answerId === 'divorce') return 'divorce_kids'
    return 'other_when'
  }
  if (stepId === 'fresh_when')   return 'fresh_hard'
  if (stepId === 'months_when')  return 'months_block'
  if (stepId === 'divorce_kids') return 'divorce_hard'
  if (stepId === 'other_when')   return 'other_hard'
  if (stepId === 'fresh_hard' || stepId === 'months_block' || stepId === 'divorce_hard' || stepId === 'other_hard') return 'psych'
  if (stepId === 'psych') return 'crisis'
  if (stepId === 'crisis') {
    if (answerId === 'yes' || answerId === 'unsure') return 'crisis_screen'
    return 'result'
  }
  return 'result'
}

// Maps Q3 answer → result category (thoughts/work/anxiety/future)
function getResultCategory(situation: string, q3Answer: string): string {
  const map: Record<string, Record<string, string>> = {
    fresh:   { thoughts: 'thoughts', body: 'anxiety', understand: 'anxiety', alone: 'future' },
    months:  { social: 'thoughts', compare: 'thoughts', fear: 'future', empty: 'anxiety' },
    divorce: { practical: 'work', loneliness: 'future', guilt: 'anxiety', worryKids: 'anxiety' },
    other:   { anxiety: 'anxiety', loneliness: 'future', anger: 'anxiety', apathy: 'work' },
  }
  return map[situation]?.[q3Answer] ?? 'anxiety'
}

// ── Result content ────────────────────────────────────────────────────────────

const situationTexts: Record<string, Record<string, string>> = {
  fresh: {
    thoughts: 'Похоже, сейчас самое трудное — остановить навязчивые мысли и справиться с желанием написать. Расставание ещё совсем свежее — это один из самых острых периодов, когда сильно тянет вернуть контакт.',
    anxiety:  'Похоже, расставание ударило сразу по нескольким уровням: и эмоционально, и физически. Тревога, пустота, непонимание — всё это нормальная реакция на острую потерю.',
    future:   'Похоже, сейчас тяжелее всего ощущение, что будущего нет и жизнь остановилась. Расставание ещё свежее — это один из самых острых периодов, когда особенно важно не оставаться одному.',
    work:     'Похоже, расставание выбило вас из привычного ритма. Когда разрыв ещё свежий — это частая реакция на сильную эмоциональную потерю.',
  },
  months: {
    thoughts: 'Похоже, прошло уже время, но мысли о человеке всё ещё возвращаются. Это может быть особенно тяжело: внешне жизнь вроде идёт дальше, а внутри связь всё ещё держит.',
    anxiety:  'Похоже, легче так и не стало: внутри остаются пустота и ощущение, что жизнь остановилась. Такое состояние важно не игнорировать.',
    future:   'Похоже, прошло уже несколько месяцев, но страх или пустота всё ещё держат. Это не значит, что вы «застряли навсегда» — скорее, сейчас не хватает понятного маршрута.',
    work:     'Похоже, даже спустя месяцы состояние продолжает влиять на обычную жизнь. Без опоры и понятного следующего шага трудно двигаться вперёд.',
  },
  divorce: {
    thoughts: 'Похоже, развод связан не только с болью, но и с сильной тягой вернуться к привычному. Когда рушится общая жизнь и планы — это один из самых трудных периодов.',
    work:     'Похоже, развод выбил вас из привычного ритма: бытовые, юридические вопросы накапливаются. Важно сначала вернуть внутреннюю опору.',
    anxiety:  'Похоже, развод ощущается как сильная внутренняя потеря: тревога, обида, непонимание что будет дальше. Это не просто расставание — это перестройка всей жизни.',
    future:   'Похоже, развод сейчас ощущается как точка, где жизнь будто остановилась. Особенно важно пройти этот период не в одиночку.',
  },
  other: {
    thoughts: 'Похоже, сложно даже точно описать, что происходит. Психика часто цепляется за один понятный импульс — вернуть контакт — когда внутри много чувств.',
    anxiety:  'Похоже, внутри много тревоги и мыслей по кругу. Если сложно подобрать слова — это нормально: иногда сначала нужно безопасное пространство.',
    future:   'Похоже, сейчас тяжело даже представить, что дальше будет лучше. Важно начать с маленького шага — не с больших решений, а с возвращения опоры.',
    work:     'Похоже, вам плохо, и это уже влияет на обычную жизнь. Даже если состояние сложно точно назвать, с ним можно начать разбираться постепенно.',
  },
}

const hardestBullets: Record<string, string[]> = {
  thoughts: ['Разберём, почему так сильно тянет написать', 'Покажем, что делать в момент отката', 'Объясним, как программа помогает не оставаться в этом цикле'],
  work:     ['Разберём, почему после разрыва проседают силы и режим', 'Поможем наметить первые маленькие шаги к обычной жизни', 'Покажем, как в программе возвращается структура недели'],
  anxiety:  ['Поможем разложить состояние на понятные части', 'Дадим первые способы стабилизации', 'Объясним, какой формат поддержки сейчас подойдёт'],
  future:   ['Разберём, почему сейчас так сложно думать о будущем', 'Поможем найти первые точки опоры', 'Покажем, как программа постепенно возвращает движение вперёд'],
}

const psychNotes: Record<string, string> = {
  yes_good:  'Значит, формат поддержки вам уже знаком — вводная встреча поможет понять, подойдёт ли именно групповая программа.',
  yes_bad:   'На вводной встрече можно спокойно посмотреть формат без обязательств и понять, подходит ли вам такой подход.',
  no_want:   'Вводная встреча подойдёт как мягкий первый шаг: можно просто слушать и не рассказывать о себе.',
  no_unsure: 'Можно прийти без готовности говорить о личном. На встрече разрешено просто слушать и знакомиться с форматом.',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [history, setHistory] = useState<StepId[]>(['situation'])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [isResult, setIsResult] = useState(false)
  const [isCrisisScreen, setIsCrisisScreen] = useState(false)

  const currentStepId = history[history.length - 1]
  const currentStep = allSteps[currentStepId]
  const stepIndex = history.length - 1
  const totalSteps = 5 // situation → branch_q2 → branch_q3 → psych → crisis

  const handleNext = () => {
    if (!selected) return
    const next = getNextStep(currentStepId, selected)
    const newAnswers = { ...answers, [currentStepId]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    if (next === 'result') {
      setIsResult(true)
    } else if (next === 'crisis_screen') {
      setIsCrisisScreen(true)
    } else {
      setHistory([...history, next as StepId])
    }
  }

  const handleBack = () => {
    if (history.length <= 1) return
    const prev = history[history.length - 2]
    setHistory(history.slice(0, -1))
    setSelected(answers[prev] ?? null)
  }

  const reset = () => {
    setHistory(['situation'])
    setAnswers({})
    setSelected(null)
    setIsResult(false)
    setIsCrisisScreen(false)
  }

  // Result values
  const situation = answers['situation'] ?? ''
  const q3Id = situation === 'fresh' ? 'fresh_hard' : situation === 'months' ? 'months_block' : situation === 'divorce' ? 'divorce_hard' : 'other_hard'
  const q3Answer = answers[q3Id] ?? ''
  const category = getResultCategory(situation, q3Answer)
  const mainText = situationTexts[situation]?.[category] ?? 'То, через что вы сейчас проходите — это серьёзно. На вводной встрече можно разобраться, какая поддержка подойдёт именно вам.'
  const bullets = hardestBullets[category] ?? hardestBullets.thoughts
  const psychNote = psychNotes[answers['psych'] ?? ''] ?? ''

  // Recommended articles for this category
  const baseSlugs = articlesByCategory[category] ?? articlesByCategory.anxiety
  const divorceSlugs = situation === 'divorce' ? ['kak-perezhit-razvod', ...baseSlugs.slice(0, 2)] : baseSlugs
  const recommendedSlugs = divorceSlugs.slice(0, 3)
  const recommendedPosts = recommendedSlugs.map(s => BLOG_POSTS.find(p => p.slug === s)).filter(Boolean) as typeof BLOG_POSTS

  // Save quiz result to localStorage when result is shown
  useEffect(() => {
    if (isResult) {
      try {
        localStorage.setItem('quizResult', JSON.stringify({ category, situation, slugs: recommendedSlugs, savedAt: new Date().toISOString() }))
      } catch { /* ignore */ }
    }
  }, [isResult, category, situation, recommendedSlugs])

  // ── Crisis Screen ─────────────────────────────────────────────────────────
  if (isCrisisScreen) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '4rem' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(250,247,243,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', height: '4rem', display: 'flex', alignItems: 'center' }}>
          <div className="container mx-auto px-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <LogoSvg size={40} />
            </Link>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Важная информация</span>
          </div>
        </div>

        <div style={{ maxWidth: '38rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
          <div style={{ background: '#FEF2F2', border: '2px solid #FCA5A5', borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🆘</div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#7F1D1D', marginBottom: '1rem', lineHeight: 1.4 }}>
              Сейчас важнее срочная поддержка, а не групповая программа
            </h1>
            <p style={{ color: '#991B1B', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
              Пожалуйста, обратитесь в экстренные службы — по номеру <strong>112</strong> или к ближайшему врачу/кризисному специалисту.
            </p>
            <p style={{ color: '#B91C1C', lineHeight: 1.75, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              «Снова с собой» не является кризисной службой и не заменяет медицинскую помощь.
            </p>
            <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem 1.25rem', border: '1px solid #FCA5A5' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#7F1D1D', marginBottom: '0.5rem' }}>Куда обратиться прямо сейчас:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#991B1B' }}>
                  <Phone size={14} />
                  <strong>112</strong> — единая экстренная служба
                </div>
                <div style={{ fontSize: '0.875rem', color: '#991B1B' }}>
                  <strong>8-800-2000-122</strong> — телефон доверия (бесплатно, круглосуточно)
                </div>
                <div style={{ fontSize: '0.875rem', color: '#991B1B' }}>
                  Ближайший врач-психиатр или психотерапевт
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', border: '1.5px solid #FCA5A5', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#7F1D1D', lineHeight: 1.7 }}>
            Программа «Снова с собой» предназначена для людей, переживающих расставание, но не находящихся в кризисном состоянии. Сейчас вам важнее получить профессиональную экстренную поддержку.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              href="/contacts"
              style={{ display: 'block', textAlign: 'center', width: '100%', padding: '0.875rem', borderRadius: '0.875rem', background: '#7F1D1D', color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}
            >
              Написать нам — мы поможем найти поддержку
            </Link>
            <Link
              href="/"
              style={{ display: 'block', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              ← На главную
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
            <LogoSvg size={40} />
          </Link>

          {!isResult && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} style={{
                  width: i === stepIndex ? '1.75rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '9999px',
                  background: i <= stepIndex ? 'var(--primary)' : 'var(--primary-light)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
          )}

          <span style={{ fontSize: '0.8rem', color: isResult ? 'var(--primary)' : 'var(--text-muted)', fontWeight: isResult ? 600 : 400 }}>
            {isResult ? 'Ваш результат' : `${stepIndex + 1} из ${totalSteps}`}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* ── Question ── */}
        {!isResult && (
          <div>
            {history.length > 1 && (
              <button
                onClick={handleBack}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem', padding: 0 }}
              >
                <ArrowLeft size={16} /> Назад
              </button>
            )}

            {/* Crisis question gets special styling */}
            {currentStepId === 'crisis' && (
              <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.875rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.825rem', color: '#92400E', lineHeight: 1.65 }}>
                Это важный вопрос для вашей безопасности. Ответьте честно — результат используется только для вашей пользы и никуда не передаётся.
              </div>
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
                const isDanger = currentStepId === 'crisis' && (option.id === 'yes' || option.id === 'unsure')
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelected(option.id)}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '1.25rem 1.5rem', borderRadius: '1rem',
                      border: isActive
                        ? `2px solid ${isDanger ? '#F97316' : 'var(--primary)'}`
                        : '2px solid var(--border)',
                      background: isActive
                        ? (isDanger ? '#FFF7ED' : 'var(--bg-sage)')
                        : 'white',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                    }}
                  >
                    <div style={{
                      width: '1.375rem', height: '1.375rem', borderRadius: '50%', flexShrink: 0,
                      border: isActive
                        ? `2px solid ${isDanger ? '#F97316' : 'var(--primary)'}`
                        : '2px solid var(--border)',
                      background: isActive ? (isDanger ? '#F97316' : 'var(--primary)') : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}>
                      {isActive && <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'white' }} />}
                    </div>
                    <span style={{ fontSize: '0.975rem', color: isActive ? (isDanger ? '#9A3412' : 'var(--primary-dark)') : 'var(--text)', fontWeight: isActive ? 600 : 400, lineHeight: 1.4 }}>
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
              {currentStepId === 'crisis' ? 'Получить рекомендацию →' : stepIndex === totalSteps - 1 ? 'Получить рекомендацию →' : 'Продолжить →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '1rem' }}>
              Ответы анонимны и не записываются
            </p>
          </div>
        )}

        {/* ── Result ── */}
        {isResult && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <LogoSvg size={64} />
            </div>

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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
                  {bullets.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <CheckCircle size={15} style={{ color: 'rgba(255,255,255,0.7)', flexShrink: 0, marginTop: '0.175rem' }} />
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {psychNote && (
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1.25rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.825rem', lineHeight: 1.65, margin: 0 }}>
                      {psychNote}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.12)', borderRadius: '0.875rem', padding: '1rem 1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
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
              Программа помогает постепенно вернуть опору: через встречи, задания, дневник состояния и поддержку группы. Результат зависит от ситуации и вовлечённости.
            </p>

            {/* Recommended articles */}
            {recommendedPosts.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <BookOpen size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>Что можно прочитать сейчас</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {recommendedPosts.map(post => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '0.875rem', padding: '0.875rem 1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', transition: 'border-color 0.2s' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>{post.title}</div>
                        <ArrowLeft size={14} style={{ color: 'var(--primary)', flexShrink: 0, transform: 'rotate(180deg)' }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <Link href="/contacts" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                Есть вопросы? Напишите нам →
              </Link>
              <button
                onClick={reset}
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
