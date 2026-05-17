import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { LighthouseIcon } from '@/components/LighthouseIcon'

export const metadata: Metadata = {
  title: 'О программе Restart — как это работает',
  description: 'Подробное описание программы Restart: 4 групповые встречи, чат с куратором, задания и дневник. Психолог, группа поддержки и карьерный трек.',
}

const programWeeks = [
  {
    week: 'Неделя 1',
    title: 'Стабилизация',
    meeting: 'Психолог разбирает, что происходит прямо сейчас: почему так больно, как работает привязанность и как не действовать из паники. Первые техники против острой тревоги.',
    task: 'Дневник состояния — 5 минут в день. Три вопроса: что я сейчас чувствую, что меня запустило, что немного помогло.',
    result: 'Вы понимаете, почему так больно — и у вас есть первые инструменты, чтобы выдерживать откаты.',
  },
  {
    week: 'Неделя 2',
    title: 'Границы и отпускание',
    meeting: 'Работа с желанием написать, надеждой на возврат, виной и злостью. Почему тянет вернуться и как не действовать из импульса.',
    task: 'Практика паузы 10 минут перед каждым порывом написать. Письмо, которое не отправляют — сказать всё, что не было сказано.',
    result: 'Откаты стали реже. Появился понятный план действий в момент импульса.',
  },
  {
    week: 'Неделя 3',
    title: 'Самооценка и режим',
    meeting: 'Работа с внутренним критиком, самообвинением и сравнением с новым партнёром. Как тело и режим напрямую влияют на самооценку.',
    task: 'Список сильных сторон и того, что остаётся вашим. Практики для восстановления сна и рабочего фокуса.',
    result: 'Режим восстанавливается. Самообвинение стихает. Появляются маленькие победы.',
  },
  {
    week: 'Неделя 4',
    title: 'Новый план',
    meeting: 'Образ будущего: кем хочу быть, что важно, как справляться без группы. Работа, окружение, отношения с собой.',
    task: 'Личный план восстановления — конкретный документ: что делать при откатах, на что опираться, следующие шаги на 3 месяца.',
    result: 'Вы выходите из программы с письменным планом и опорой на себя.',
  },
]

const psychologists = [
  {
    name: 'Мария Соколова',
    approach: 'КПТ (когнитивно-поведенческая терапия)',
    education: 'МГУ, клиническая психология · Сертификат КПТ',
    experience: '8 лет практики',
    groupExperience: '5 лет ведения групп',
    requests: ['расставания', 'эмоциональная зависимость', 'тревога', 'самооценка'],
    quote: 'В группе важно не заставлять человека быстро становиться сильным, а помочь ему безопасно вернуть опору.',
    tags: ['расставания', 'тревога', 'границы', 'самооценка'],
    color: '#4E7B5E',
  },
  {
    name: 'Алексей Петров',
    approach: 'Работа с потерями и горем',
    education: 'РГПУ, психологическое консультирование · Программа по работе с потерями',
    experience: '12 лет практики',
    groupExperience: '7 лет ведения групп поддержки',
    requests: ['горе и потери', 'кризисные состояния', 'поиск смыслов', 'восстановление после развода'],
    quote: 'Пережить расставание — значит не забыть, а научиться жить дальше с этим опытом.',
    tags: ['горе', 'потери', 'кризисы', 'смыслы'],
    color: '#3D6249',
  },
  {
    name: 'Ирина Новикова',
    approach: 'Гуманистическая терапия',
    education: 'НИУ ВШЭ, психология · Международная программа по гуманистической терапии',
    experience: '6 лет практики',
    groupExperience: '4 года в онлайн-группах',
    requests: ['эмоциональные кризисы', 'возвращение режима', 'самоуважение', 'новые цели'],
    quote: 'Самое важное — создать безопасное место, где можно быть честным с собой.',
    tags: ['кризисы', 'режим', 'цели', 'самоуважение'],
    color: '#C28A5E',
  },
]

export default function ProgramPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-soft)', padding: '5rem 0 0' }}>
        <div className="container mx-auto px-6">
          <div style={{ maxWidth: '52rem', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem', borderRadius: '9999px',
              background: 'var(--primary-light)',
              fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-dark)',
              letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2rem',
            }}>
              О программе
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              Restart — не просто группа.<br />
              <span style={{ color: 'var(--primary)' }}>Это маршрут с понятной структурой.</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
              4-недельная онлайн-программа с психологом, закрытым чатом и структурированными практиками. Мы не предлагаем «просто поговорить» — мы даём конкретный путь из хаоса к опоре.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn-primary">Записаться →</Link>
              <Link href="/contacts" className="btn-outline">Задать вопрос</Link>
            </div>
          </div>

          {/* Route strip */}
          <div className="route-strip" style={{ display: 'flex', alignItems: 'center', gap: '0', background: 'white', borderRadius: '1.25rem 1.25rem 0 0', border: '1.5px solid var(--border)', borderBottom: 'none', overflow: 'hidden' }}>
            {[
              { label: '4 недели', sub: 'Длительность' },
              { label: '4 фокуса', sub: 'Каждую неделю — своя тема' },
              { label: '6 артефактов', sub: 'Что вы получаете в руки' },
              { label: '1 личный план', sub: 'В конце программы' },
            ].map((item, i) => (
              <div key={item.label} style={{ flex: 1, padding: '1.5rem 1.25rem', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none', position: 'relative' }}>
                {i === 0 && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />
                )}
                <div style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 800, color: i === 0 ? 'var(--primary)' : 'var(--text)', marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Что вы получаете в руки — артефакты */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--text)' }}>Что вы получаете в руки</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem' }}>Не список «фич» — а реальные инструменты восстановления</p>
          </div>

          <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Top: Cabinet (large) + Zoom/Chat stacked */}
            <div className="grid-hero" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', alignItems: 'stretch' }}>

              {/* Cabinet — main product mockup */}
              <div style={{ background: 'white', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                {/* Browser chrome */}
                <div style={{ background: '#F5F5F4', padding: '0.7rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
                      <div key={c} style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', background: c }} />
                    ))}
                  </div>
                  <div style={{ background: 'white', borderRadius: '0.375rem', padding: '0.25rem 0.875rem', fontSize: '0.72rem', color: 'var(--text-muted)', border: '1px solid var(--border)', maxWidth: '200px' }}>
                    restart.app/cabinet
                  </div>
                </div>

                {/* App layout */}
                <div style={{ display: 'flex', minHeight: '270px' }}>
                  {/* Sidebar */}
                  <div style={{ width: '165px', borderRight: '1px solid var(--border)', padding: '1rem 0.875rem', background: 'var(--bg-soft)', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem', paddingLeft: '0.375rem' }}>Личный кабинет</div>
                    {[
                      { icon: '📅', label: 'Встречи', active: true },
                      { icon: '📓', label: 'Дневник', active: false },
                      { icon: '✏️', label: 'Задания', active: false },
                      { icon: '📋', label: 'Мой план', active: false },
                      { icon: '💬', label: 'Чат', active: false },
                    ].map(item => (
                      <div key={item.label} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.45rem 0.5rem', borderRadius: '0.5rem', marginBottom: '0.2rem',
                        background: item.active ? 'var(--primary-light)' : 'transparent',
                        fontSize: '0.78rem',
                        color: item.active ? 'var(--primary-dark)' : 'var(--text-muted)',
                        fontWeight: item.active ? 600 : 400,
                      }}>
                        <span style={{ fontSize: '0.8rem' }}>{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div style={{ flex: 1, padding: '1.25rem 1.5rem', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)' }}>Неделя 3 из 4</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 700, background: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>75%</span>
                    </div>
                    <div style={{ height: '5px', background: 'var(--border)', borderRadius: '9999px', marginBottom: '1.25rem', overflow: 'hidden' }}>
                      <div style={{ width: '75%', height: '100%', background: 'var(--primary)', borderRadius: '9999px' }} />
                    </div>

                    {/* Next meeting */}
                    <div style={{ background: 'var(--bg-sage)', borderRadius: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.875rem' }}>📹</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Встреча 3 — Самооценка</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.1rem' }}>Через 2 дня · 19:00 МСК</div>
                      </div>
                      <div style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 600, flexShrink: 0 }}>Зайти →</div>
                    </div>

                    {/* Recordings */}
                    <div style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Записи встреч</div>
                    {['Встреча 1 — Стабилизация', 'Встреча 2 — Границы'].map(rec => (
                      <div key={rec} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 800 }}>▶</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flex: 1 }}>{rec}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>1:28 ч</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: Zoom + Chat stacked */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Zoom */}
                <div style={{ background: 'var(--bg)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden', flex: 1 }}>
                  <div style={{ background: 'var(--bg-dark)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: '0.95rem' }}>📹</span>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', flex: 1 }}>Встреча в Zoom</div>
                    <div style={{ fontSize: '0.67rem', background: 'rgba(78,123,94,0.45)', color: '#a8d8bc', padding: '0.175rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }}>● Live</div>
                  </div>
                  <div style={{ padding: '1rem 1.25rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.65, margin: 0 }}>
                      4 встречи по 90 мин. Группа 8–12 человек. Запись хранится в кабинете.
                    </p>
                  </div>
                </div>

                {/* Chat */}
                <div style={{ background: 'var(--bg)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden', flex: 1 }}>
                  <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-sage)', borderBottom: '1px solid var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: '0.95rem' }}>💬</span>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', flex: 1 }}>Чат с куратором</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 700 }}>Пн–Пт</div>
                  </div>
                  <div style={{ padding: '0.875rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <div style={{ alignSelf: 'flex-start', background: 'var(--bg-soft)', padding: '0.4rem 0.75rem', borderRadius: '0 0.75rem 0.75rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '85%' }}>
                      Хочется написать ему...
                    </div>
                    <div style={{ alignSelf: 'flex-end', background: 'var(--primary)', padding: '0.4rem 0.75rem', borderRadius: '0.75rem 0 0.75rem 0.75rem', fontSize: '0.75rem', color: 'white', maxWidth: '85%' }}>
                      Попробуй технику паузы 🙏
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom: 4 compact detail cards */}
            <div className="grid-four" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>

              {/* Diary compact */}
              <div style={{ background: 'var(--bg)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1.125rem', background: 'var(--secondary-light)', borderBottom: '1px solid #e8d5be', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>📓</span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>Дневник</div>
                </div>
                <div style={{ padding: '0.875rem 1.125rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Сегодня: 5 / 10</div>
                  <div style={{ height: '4px', borderRadius: '9999px', background: 'var(--primary-light)', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{ width: '50%', height: '100%', background: 'var(--primary)' }} />
                  </div>
                  <div style={{ height: '1.5rem', background: 'var(--bg-soft)', borderRadius: '0.375rem', border: '1px solid var(--border)' }} />
                </div>
              </div>

              {/* Task compact */}
              <div style={{ background: 'var(--bg)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1.125rem', background: 'var(--bg-sage)', borderBottom: '1px solid var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>✏️</span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>Задание</div>
                </div>
                <div style={{ padding: '0.875rem 1.125rem' }}>
                  {[{ text: 'Пауза 10 минут', done: true }, { text: 'Безопасное действие', done: false }].map(({ text, done }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                      <div style={{ width: '0.9rem', height: '0.9rem', borderRadius: '50%', background: done ? 'var(--primary)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', color: done ? 'white' : 'var(--primary)', flexShrink: 0, fontWeight: 800 }}>
                        {done ? '✓' : '2'}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: done ? 'var(--text-muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recording compact */}
              <div style={{ background: 'var(--bg)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1.125rem', background: '#1C1C1A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>▶️</span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Запись</div>
                </div>
                <div style={{ padding: '0.875rem 1.125rem' }}>
                  <div style={{ background: '#1C1C1A', borderRadius: '0.5rem', padding: '0.625rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.45rem', color: 'white', fontWeight: 800 }}>▶</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '3px', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: '35%', height: '100%', background: 'var(--primary)' }} />
                      </div>
                      <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>32:15 / 1:28:40</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan compact */}
              <div style={{ background: 'var(--bg)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1.125rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>📋</span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Личный план</div>
                </div>
                <div style={{ padding: '0.875rem 1.125rem' }}>
                  {['Куда двигаться', 'Как поддерживать себя', 'Мои ресурсы'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                      <CheckCircle size={11} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Программа по неделям */}
      <section className="section" style={{ background: 'var(--bg-sage)' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '56rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--text)' }}>Программа по неделям</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>Каждая неделя — отдельный фокус. Темп — мягкий, без спешки.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {programWeeks.map((w, i) => (
              <div key={w.week} style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '3rem', height: '3rem', borderRadius: '50%',
                    background: i === 0 ? 'var(--primary)' : 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: i === 0 ? 'white' : 'var(--primary)',
                    fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  {i < 3 && <div style={{ width: '2px', flex: 1, background: 'var(--primary-light)', margin: '0.5rem 0' }} />}
                </div>
                <div className="card" style={{ padding: '1.75rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--primary-light)', padding: '0.25rem 0.75rem', borderRadius: '9999px', flexShrink: 0 }}>
                      {w.week}
                    </span>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>{w.title}</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, paddingTop: '0.1rem', width: '80px' }}>Встреча</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{w.meeting}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, paddingTop: '0.1rem', width: '80px' }}>Задание</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{w.task}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--bg-sage)', borderRadius: '0.625rem', padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, paddingTop: '0.1rem', width: '80px' }}>Итог</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--primary-dark)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{w.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Психологи */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--text)' }}>Наши специалисты</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
              Дипломированные психологи. Опыт работы с расставаниями, кризисами и восстановлением.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))', gap: '1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
            {psychologists.map((p) => (
              <div key={p.name} className="card" style={{ padding: '2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '4rem', height: '4rem', borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${p.color}22, ${p.color}44)`,
                    border: `2px solid ${p.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', fontWeight: 800, color: p.color,
                  }}>
                    {p.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.2rem' }}>{p.name}</h3>
                    <span style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '9999px', background: 'var(--bg-sage)', color: 'var(--primary-dark)' }}>
                      {p.approach}
                    </span>
                  </div>
                </div>

                {/* Education + experience */}
                <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.67rem', letterSpacing: '0.05em' }}>Образование </span>
                    {p.education}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.67rem', letterSpacing: '0.05em' }}>Опыт </span>
                    {p.experience} · {p.groupExperience}
                  </div>
                </div>

                {/* Requests */}
                <div style={{ marginBottom: '1.1rem' }}>
                  <div style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>С какими запросами работает</div>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {p.requests.map(r => (
                      <li key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <CheckCircle size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quote */}
                <blockquote style={{
                  borderLeft: `3px solid ${p.color}66`,
                  paddingLeft: '0.875rem',
                  margin: '0 0 1.1rem',
                  fontSize: '0.85rem',
                  color: 'var(--text)',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                }}>
                  «{p.quote}»
                </blockquote>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {p.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: '0.72rem', fontWeight: 600,
                      padding: '0.2rem 0.625rem', borderRadius: '9999px',
                      background: 'var(--bg-sage)', color: 'var(--primary-dark)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem', padding: '1.5rem', background: 'var(--bg-soft)', borderRadius: '1rem', maxWidth: '44rem', margin: '2.5rem auto 0' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Имена специалистов — публичная информация. Образование, подход и документы подтверждены. Конкретного специалиста для вашей группы мы сообщим при записи.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-dark)' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <LighthouseIcon size={44} color="rgba(255,255,255,0.9)" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Начать восстановление
          </h2>
          <p style={{ color: 'rgba(168,184,160,1)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Ближайшая группа стартует скоро. Можно начать с вводной встречи — 1 490 ₽.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/quiz" className="btn-ghost-dark" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Пройти тест →
            </Link>
            <Link href="/contacts" style={{ fontSize: '1rem', padding: '0.875rem 2rem', color: 'rgba(168,184,160,0.8)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Задать вопрос
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
