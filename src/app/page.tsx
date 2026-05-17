import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Star } from 'lucide-react'
import { OrganizationSchema, ServiceSchema, FaqSchema } from '@/components/JsonLd'
import { FaqAccordion } from '@/components/FaqAccordion'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Снова с собой — пережить расставание и снова почувствовать опору',
  description:
    'Бережная 4-недельная онлайн-программа с психологом и небольшой группой. Эмоции, режим, самооценка, работа и новые цели — постепенно, без давления.',
}

const scenarios = [
  { id: 'thoughts', emoji: '💭', title: 'Мысли не останавливаются', desc: 'Постоянно прокручиваю разговоры, хочу написать' },
  { id: 'routine', emoji: '🌀', title: 'Выпал(а) из режима', desc: 'Работа, сон, питание — всё разладилось' },
  { id: 'anxiety', emoji: '🌫️', title: 'Тревога или пустота', desc: 'Не понимаю что со мной — странное состояние' },
  { id: 'urge', emoji: '📱', title: 'Очень хочу написать', desc: 'Желание написать или вернуть очень сильное' },
  { id: 'future', emoji: '🧭', title: 'Не вижу будущего', desc: 'Жизнь как будто остановилась, непонятно куда' },
  { id: 'self', emoji: '💙', title: 'Упала самооценка', desc: 'Трудно верить в себя, чувство потери себя' },
]

const layers = [
  {
    num: '1',
    step: 'Сначала',
    title: 'Стабилизировать состояние',
    desc: 'Психолог помогает прожить боль, тревогу, вину, злость, желание вернуться. Безопасно, без осуждения и без давления.',
    tag: 'Эмоции',
  },
  {
    num: '2',
    step: 'Потом',
    title: 'Вернуть опору',
    desc: 'Группа, чат с куратором, задания, дневник состояния — понятная структура каждой недели. Перестаёшь чувствовать себя одиноким в этом.',
    tag: 'Поддержка',
  },
  {
    num: '3',
    step: 'Потом',
    title: 'Двигаться вперёд',
    desc: 'Режим, самооценка, работа, деньги, цели. Когда эмоции становятся устойчивее — помогаем строить следующий шаг.',
    tag: 'Новый старт',
  },
]

const weeks = [
  {
    num: 'Неделя 1', title: 'Стабилизация',
    onMeeting: 'Разбираем, что происходит сейчас, снижаем острую тревогу',
    afterMeeting: 'Дневник состояния: фиксируем эмоции каждый день',
    outcome: 'Понимаете, что с вами и почему — уже меньше хаоса',
  },
  {
    num: 'Неделя 2', title: 'Отпускание и границы',
    onMeeting: 'Разбираем желание написать, надежду на возврат, чувство вины',
    afterMeeting: 'Практика «не писать в импульсе» — три шага в момент срыва',
    outcome: 'Понимаете, что делать в момент отката, а не только после',
  },
  {
    num: 'Неделя 3', title: 'Самооценка и режим',
    onMeeting: 'Работа с внутренним критиком, возвращение уверенности в себе',
    afterMeeting: 'Список сильных сторон и ресурсов',
    outcome: 'Возвращаются сон, работа, режим — устойчивость нарастает',
  },
  {
    num: 'Неделя 4', title: 'Новый план',
    onMeeting: 'Образ будущего: работа, окружение, деньги, личные цели',
    afterMeeting: 'Личный план восстановления — остаётся с вами',
    outcome: 'Ясность куда двигаться и что делать, если будет откат',
  },
]

const safetyPoints = [
  'Можно говорить столько, сколько комфортно — никто не давит',
  'Можно первое время просто слушать и не рассказывать о себе',
  'В группе действуют правила конфиденциальности',
  'Ведущий следит за безопасной и уважительной атмосферой',
  'Никто не даёт непрошеных советов и не оценивает',
  'Если групповой формат не подойдёт — мы честно скажем об этом',
]

const careerCards = [
  { title: 'Разобраться, куда двигаться', desc: 'Поможем выбрать направление, понять сильные стороны и реальные варианты заработка.' },
  { title: 'Упаковать себя', desc: 'Резюме, сопроводительные письма, портфолио, позиционирование.' },
  { title: 'Начать действовать', desc: 'Вакансии, отклики, подготовка к собеседованиям, план поиска работы.' },
]

const pricingPlans = [
  {
    id: 'start',
    name: 'Restart Base',
    price: '14 990',
    desc: 'Если нужна группа и понятная структура',
    features: [
      '4 групповые встречи в Zoom',
      'Чат с куратором в рабочее время',
      'Задания после каждой встречи',
      'Дневник восстановления',
      'Записи всех встреч',
    ],
    highlight: false,
    cta: 'Выбрать Base',
  },
  {
    id: 'plus',
    name: 'Restart Plus',
    price: '19 990',
    desc: 'Если хочется понять, что конкретно происходит',
    features: [
      'Всё из Base',
      'Личная диагностика 30 минут',
      'Индивидуальный план восстановления',
      'Персональные рекомендации',
      'Скидка 50% на карьерный трек',
    ],
    highlight: true,
    cta: 'Выбрать Plus',
  },
  {
    id: 'personal',
    name: 'Restart Personal',
    price: '24 990',
    desc: 'Если важно разобрать ситуацию глубже',
    features: [
      'Всё из Plus',
      '1 индивидуальная сессия с психологом',
      'Расширенный план восстановления',
      'Скидка 50% на карьерный трек',
    ],
    highlight: false,
    cta: 'Выбрать Personal',
  },
]

const reviews = [
  {
    name: 'Аня',
    context: 'после 3 лет отношений',
    text: 'Самым сложным было не писать человеку каждый вечер. На встречах стало легче понять, что со мной происходит, а задания помогли хотя бы немного вернуть сон и режим. Мне было важно, что никто не обесценивал мои чувства.',
    rating: 5,
    product: 'Restart Plus',
    color: '#4E7B5E',
  },
  {
    name: 'Михаил',
    context: 'после внезапного разрыва',
    text: 'Сначала боялся, что будет неловко. Оказалось, можно не рассказывать всё сразу. Я слушал других и впервые понял, что не один в этом состоянии. После программы стало проще работать и не проваливаться в мысли весь день.',
    rating: 5,
    product: 'Restart Base',
    color: '#3D6249',
  },
  {
    name: 'Екатерина',
    context: 'после расставания и смены работы',
    text: 'Для меня неожиданно полезным оказался блок про работу и деньги. После расставания я вообще выпала из жизни, а тут постепенно собрала резюме, начала откликаться и вернула ощущение, что у меня есть будущее.',
    rating: 5,
    product: 'Restart Plus + Career',
    color: '#C28A5E',
  },
]

const faqs = [
  { q: 'Это подходит для мужчин?', a: 'Да. Программа создана для всех, кто переживает расставание — независимо от пола. Есть и отдельные группы для мужчин, где разговор идёт в более комфортном формате.' },
  { q: 'Нужно ли рассказывать подробности своих отношений?', a: 'Нет. Вы делитесь ровно столько, сколько хотите. Можно первое время просто слушать — без какого-либо давления.' },
  { q: 'Что если я не смогу прийти на встречу?', a: 'Все встречи записываются. Вы получите запись и сможете посмотреть в удобное время, ничего не потеряв.' },
  { q: 'Как быстро будет результат?', a: 'Большинство участников замечают первые изменения уже после первой встречи. Устойчивый результат — к концу программы. Мы не обещаем чудес, но обещаем структуру и поддержку.' },
  { q: 'Вы заменяете психотерапию?', a: 'Нет. Мы не ставим диагнозы и не заменяем медицинскую помощь. Если человеку нужна индивидуальная психотерапия или срочная кризисная помощь — мы честно скажем об этом и подскажем, куда обратиться.' },
  { q: 'Есть ли возврат средств?', a: 'Да. В течение 7 дней с первой встречи при обоснованных претензиях — полный возврат. Мы уверены в программе и не держим никого насильно.' },
  { q: 'Можно ли участвовать без камеры?', a: 'Да. Камера не обязательна. Можно слушать и участвовать голосом или в чате — без давления включить видео. Многие начинают именно так.' },
  { q: 'Что если я пойму, что группа мне не подходит?', a: 'Мы честно скажем об этом ещё на вводной встрече, если заметим, что формат не ваш. Если поймёте сами после — вернём деньги и при необходимости посоветуем другой формат поддержки.' },
  { q: 'Кто отвечает в чате и в какое время?', a: 'В чате отвечает куратор программы — не робот. Время ответа: пн–пт, 10:00–19:00 по Москве. В выходные и вечером чат не работает — это важно знать заранее.' },
]

const faqSchemaItems = [
  { q: 'Что такое программа Restart?', a: 'Restart — 4-недельная онлайн-программа восстановления после расставания с психологом, группой поддержки, заданиями и карьерным треком.' },
  { q: 'Сколько стоит программа Restart?', a: 'Тарифы от 14 990 рублей (Base) до 24 990 рублей (Personal). Вводная встреча — 1 490 рублей.' },
  { q: 'Подходит ли программа для мужчин?', a: 'Да, программа одинаково эффективна для мужчин и женщин. Есть опция отдельных групп для мужчин.' },
  { q: 'Как пережить расставание?', a: 'Программа Restart помогает пережить расставание через эмоциональную стабилизацию, восстановление самооценки, построение личного плана и возвращение к активной жизни за 4 недели.' },
]

/* ──────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <ServiceSchema />
      <FaqSchema items={faqSchemaItems} />

      {/* ═══ 1. HERO ════════════════════════════════════════ */}
      <section style={{
        background: 'var(--bg)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-6rem', right: '-6rem',
          width: '42rem', height: '42rem', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,123,94,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-4rem', left: '-4rem',
          width: '28rem', height: '28rem', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(194,138,94,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div className="container mx-auto px-6" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="grid-hero" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
            gap: '4rem',
            alignItems: 'center',
          }}>
            {/* LEFT */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 1rem', borderRadius: '9999px',
                background: 'var(--primary-light)',
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-dark)',
                letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2.5rem',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                Набор в новую группу открыт
              </div>

              <h1 style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)',
                fontWeight: 800,
                color: 'var(--text)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
              }}>
                Пережить расставание<br />
                и снова почувствовать<br />
                <span style={{ color: 'var(--primary)' }}>опору.</span>
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: 'var(--text-muted)',
                lineHeight: 1.8,
                maxWidth: '32rem',
                marginBottom: '2.5rem',
              }}>
                Бережная 4-недельная программа с психологом, небольшой группой и понятным планом восстановления: эмоции, сон, режим, самооценка, работа и новые цели.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', marginBottom: '2.5rem' }}>
                <Link href="/quiz" className="btn-primary">Пройти короткий тест</Link>
                <Link href="/program" className="btn-outline">Посмотреть программу</Link>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '32rem' }}>
                Можно начать с короткой анкеты — без оплаты и без обязательств. Она поможет понять, какой формат сейчас безопаснее: группа, вводная встреча или индивидуальный специалист.
              </p>
            </div>

            {/* RIGHT — program product card */}
            <div className="hide-mobile" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'white',
                borderRadius: '2rem',
                padding: '2rem',
                boxShadow: '0 16px 56px rgba(28,28,26,0.12), 0 4px 16px rgba(28,28,26,0.06)',
                width: '100%',
                maxWidth: '310px',
                border: '1.5px solid var(--border)',
              }}>
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <Image src="/logo-icon.png" alt="Снова с собой" width={40} height={40} style={{ objectFit: 'contain', height: '2.5rem', width: 'auto', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>Снова с собой</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Программа восстановления</div>
                  </div>
                </div>

                {/* Specs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.5rem' }}>
                  {[
                    { icon: '📅', text: '4 недели · 1 встреча в неделю' },
                    { icon: '👥', text: '8–12 человек в группе' },
                    { icon: '💬', text: 'Психолог + чат + задания' },
                    { icon: '📓', text: 'Дневник состояния + личный план' },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontSize: '1rem', lineHeight: 1, width: '1.25rem', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                      {text}
                    </div>
                  ))}
                </div>

                {/* Route */}
                <div style={{ background: 'var(--bg-sage)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>
                    Маршрут
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      { n: '1', t: 'Стабилизация', active: true },
                      { n: '2', t: 'Границы и отпускание', active: false },
                      { n: '3', t: 'Самооценка и режим', active: false },
                      { n: '4', t: 'Новый план', active: false },
                    ].map(({ n, t, active }) => (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{
                          width: '1.625rem', height: '1.625rem', borderRadius: '50%',
                          background: active ? 'var(--primary)' : 'var(--primary-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem', fontWeight: 800,
                          color: active ? 'white' : 'var(--primary)',
                          flexShrink: 0,
                        }}>
                          {n}
                        </div>
                        <span style={{ fontSize: '0.83rem', color: active ? 'var(--text)' : 'var(--text-muted)', fontWeight: active ? 600 : 400 }}>
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price CTA */}
                <Link href="/checkout" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: 'var(--primary)',
                  borderRadius: '0.875rem',
                  color: 'white',
                  textDecoration: 'none',
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '0.15rem' }}>Вводная встреча</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>1 490 ₽</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.18)', padding: '0.35rem 0.875rem', borderRadius: '9999px', fontWeight: 600 }}>
                    Начать →
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Trust phrase */}
          <div style={{ maxWidth: '72rem', margin: '1.75rem auto 0', padding: '1rem 1.5rem', background: 'var(--bg-sage)', borderRadius: '0.875rem', border: '1px solid var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={17} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              Перед участием мы помогаем понять, подойдёт ли вам групповой формат. Если нет — честно предложим другой вариант поддержки.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 2. SCENARIOS (Headspace pattern) ════════════ */}
      <section className="section" style={{ background: 'var(--bg-soft)' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
              Что сейчас тяжелее всего?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Выберите то, что ближе — или пройдите короткий тест
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 17rem), 1fr))', gap: '1rem', maxWidth: '72rem', margin: '0 auto 2.5rem' }}>
            {scenarios.map((s) => (
              <Link key={s.id} href="/quiz" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '1.75rem',
                  background: 'white',
                  borderRadius: '1.25rem',
                  border: '1.5px solid var(--border)',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}>
                  <span style={{ fontSize: '1.875rem', lineHeight: 1, marginBottom: '0.25rem' }}>{s.emoji}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                  <div style={{ marginTop: 'auto', paddingTop: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                    Пройти тест →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ maxWidth: '44rem', margin: '0 auto', background: 'white', borderRadius: '1.25rem', padding: '1.75rem 2rem', borderLeft: '4px solid var(--primary)' }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.975rem', margin: 0 }}>
              С тобой не «что-то не так» — мозг реагирует на потерю близкого человека схожим образом с физической болью. Мы помогаем{' '}
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>постепенно вернуть себе опору</strong>{' '}
              — без давления и без обесценивания.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 3. THREE LAYERS — vertical path ════════════ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)' }}>
              Как устроено восстановление
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
              Три последовательных шага — от стабилизации к движению
            </p>
          </div>

          <div style={{ maxWidth: '44rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {layers.map((layer, i) => (
              <div key={layer.title}>
                <div style={{
                  display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                  padding: '2rem 2.5rem',
                  background: i === 0 ? 'var(--primary)' : i === 1 ? 'var(--bg-sage)' : 'var(--bg)',
                  borderRadius: '1.5rem',
                  border: i === 0 ? 'none' : '1.5px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: '2.75rem', height: '2.75rem', borderRadius: '50%',
                      background: i === 0 ? 'rgba(255,255,255,0.2)' : 'var(--primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1rem',
                      color: i === 0 ? 'white' : 'var(--primary)',
                      border: i === 0 ? '2px solid rgba(255,255,255,0.3)' : '2px solid var(--primary-light)',
                    }}>
                      {layer.num}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem', color: i === 0 ? 'rgba(255,255,255,0.65)' : 'var(--primary)' }}>
                      {layer.step}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: i === 0 ? 'white' : 'var(--text)' }}>{layer.title}</h3>
                    <p style={{ lineHeight: 1.8, fontSize: '0.95rem', margin: 0, color: i === 0 ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>{layer.desc}</p>
                    <div style={{ display: 'inline-flex', marginTop: '0.875rem', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: i === 0 ? 'rgba(255,255,255,0.15)' : 'var(--primary-light)', color: i === 0 ? 'rgba(255,255,255,0.9)' : 'var(--primary-dark)' }}>
                      {layer.tag}
                    </div>
                  </div>
                </div>
                {i < 2 && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <div style={{ width: '2px', height: '1.25rem', background: 'var(--primary-light)' }} />
                      <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid var(--primary-light)' }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. PROGRAM ROADMAP ═══════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg-sage)' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)' }}>
              Маршрут за 4 недели
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
              Не интенсив и не марафон — постепенное движение с опорой
            </p>
          </div>

          {/* Timeline roadmap */}
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            {/* Desktop: horizontal path */}
            <div className="grid-roadmap" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative', marginBottom: '1.5rem' }}>
              {/* Connecting line behind circles */}
              <div className="roadmap-connector" style={{ position: 'absolute', top: '1.375rem', left: '12.5%', right: '12.5%', height: '2px', background: 'linear-gradient(to right, var(--primary), var(--primary-light) 40%, var(--border) 70%)', zIndex: 0 }} />

              {weeks.map((w, i) => (
                <div key={w.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, padding: '0 0.5rem' }}>
                  {/* Step node */}
                  <div style={{
                    width: '2.75rem', height: '2.75rem', borderRadius: '50%',
                    background: i === 0 ? 'var(--primary)' : i === 1 ? 'var(--primary-light)' : 'white',
                    border: `2px solid ${i < 2 ? 'var(--primary)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.9rem',
                    color: i === 0 ? 'white' : 'var(--primary)',
                    marginBottom: '1.25rem',
                    boxShadow: i === 0 ? '0 4px 12px rgba(78,123,94,0.3)' : 'none',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>

                  {/* Week card */}
                  <div style={{
                    background: 'white', borderRadius: '1.25rem', padding: '1.25rem',
                    width: '100%',
                    borderTop: `3px solid ${i === 0 ? 'var(--primary)' : i === 1 ? 'var(--secondary)' : 'var(--border)'}`,
                    boxShadow: i === 0 ? '0 4px 20px rgba(78,123,94,0.12)' : '0 2px 8px rgba(28,28,26,0.04)',
                    opacity: i >= 2 ? 0.75 : 1,
                  }}>
                    <div style={{ fontSize: '0.63rem', fontWeight: 700, color: i === 0 ? 'var(--primary)' : 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem' }}>{w.num}</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.875rem', lineHeight: 1.3 }}>{w.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[
                        { label: 'На встрече', text: w.onMeeting, color: 'var(--primary)' },
                        { label: 'После встречи', text: w.afterMeeting, color: 'var(--secondary)' },
                        { label: 'Итог', text: w.outcome, color: 'var(--text-muted)' },
                      ].map(({ label, text, color }) => (
                        <div key={label}>
                          <div style={{ fontSize: '0.6rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>{label}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom result strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2rem', background: 'var(--primary)', borderRadius: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>В итоге:</span>
              {['Устойчивое состояние', 'Вернулся режим', 'Личный план восстановления'].map((item, i) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {i > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>·</span>}
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>✓ {item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/program" className="btn-secondary">Подробнее о программе →</Link>
          </div>
        </div>
      </section>

      {/* ═══ 5. PRODUCT MOCKUPS ═══════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)' }}>
              Как это выглядит изнутри
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
              Задания, дневник, кабинет — всё продумано
            </p>
          </div>

          <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Big cabinet mockup — full width */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.125rem 1.75rem', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.08)'].map((c, i) => (
                    <div key={i} style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Личный кабинет · Снова с собой</span>
              </div>
              <div className="grid-cabinet" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', background: 'white' }}>
                {/* Sidebar */}
                <div className="cabinet-sidebar" style={{ background: 'var(--bg-soft)', padding: '1.75rem 1.5rem', borderRight: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <Image src="/logo-icon.png" alt="" width={32} height={32} style={{ objectFit: 'contain', height: '2rem', width: 'auto' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>Снова с собой</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Неделя 2 из 4</div>
                    </div>
                  </div>
                  {[
                    { label: 'Кабинет', active: true },
                    { label: 'Задания', active: false },
                    { label: 'Дневник', active: false },
                    { label: 'Записи встреч', active: false },
                    { label: 'Чат группы', active: false },
                  ].map(({ label, active }) => (
                    <div key={label} style={{ padding: '0.6rem 0.75rem', borderRadius: '0.5rem', marginBottom: '0.25rem', background: active ? 'var(--primary-light)' : 'transparent', fontSize: '0.85rem', fontWeight: active ? 600 : 400, color: active ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
                      {label}
                    </div>
                  ))}
                </div>
                {/* Main */}
                <div style={{ padding: '1.75rem' }}>
                  {/* Next meeting card */}
                  <div style={{ background: 'var(--primary)', borderRadius: '1rem', padding: '1.25rem 1.5rem', color: 'white', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.7, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ближайшая встреча</div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>Четверг, 19:00 · Zoom</div>
                      <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>Неделя 2: Границы и отпускание</div>
                    </div>
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '0.625rem', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      Присоединиться →
                    </div>
                  </div>
                  {/* Progress */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      <span>Прогресс программы</span>
                      <span style={{ fontWeight: 600 }}>50%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--primary-light)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: '50%', height: '100%', background: 'var(--primary)', borderRadius: '9999px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>
                      <span>Неделя 1 ✓</span><span>Неделя 2 ●</span><span>Неделя 3</span><span>Неделя 4</span>
                    </div>
                  </div>
                  {/* Items */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { label: 'Задание недели', status: 'Открыто', ok: true },
                      { label: 'Материалы', status: '3 файла', ok: true },
                      { label: 'Записи встреч', status: '1 запись', ok: false },
                      { label: 'Чат группы', status: '5 новых', ok: false, badge: true },
                    ].map(({ label, status, ok, badge }) => (
                      <div key={label} style={{ padding: '0.875rem', background: 'var(--bg)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: ok ? 'var(--primary)' : 'var(--text)' }}>{status}</span>
                          {badge && <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>!</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Two smaller mockups below */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))', gap: '1.5rem' }}>

              {/* Diary */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-sage)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Дневник состояния · Неделя 1</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Моё состояние сегодня</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>4</span>
                      <div style={{ flex: 1, height: '6px', borderRadius: '9999px', background: 'var(--primary-light)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '40%', background: 'var(--primary)', borderRadius: '9999px' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10</span>
                    </div>
                  </div>
                  {['Что сильнее всего триггерит сегодня?', 'Что я могу сделать для себя сегодня?', 'Маленький шаг на завтра:'].map((q) => (
                    <div key={q} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text)', fontWeight: 500, marginBottom: '0.25rem' }}>{q}</div>
                      <div style={{ height: '2rem', background: 'var(--bg-soft)', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Task */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', background: 'var(--secondary-light)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--secondary)', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Практика · Неделя 2</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem' }}>Не писать в импульсе</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>Когда очень хочется написать — пройди три шага.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
                    {[
                      { text: 'Поставь паузу 10 минут', done: true },
                      { text: 'Запиши, что хочется отправить', done: true },
                      { text: 'Выбери безопасное действие', done: false },
                    ].map(({ text, done }, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', flexShrink: 0, background: done ? 'var(--primary)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: done ? 'white' : 'var(--primary)' }}>
                          {done ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: done ? 'var(--text-muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '0.75rem', background: 'var(--bg-sage)', borderRadius: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Прогресс: 2 из 3</div>
                    <div style={{ height: '4px', background: 'var(--primary-light)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: '66%', height: '100%', background: 'var(--primary)', borderRadius: '9999px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. WHY GROUP ISN'T SCARY ════════════════════ */}
      <section style={{ background: 'var(--bg-soft)', padding: '6rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '72rem' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
              Почему группа — это не страшно
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '38rem', margin: '0 auto', lineHeight: 1.7 }}>
              «А вдруг меня осудят?» — самый частый страх. Вот как устроена группа, чтобы этого не произошло.
            </p>
          </div>

          <div className="grid-two" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '2rem', alignItems: 'start' }}>
            {/* Left — quote + cta */}
            <div>
              {/* Big testimonial */}
              <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', marginBottom: '1.5rem', border: '1.5px solid var(--border)', position: 'relative' }}>
                <div style={{ fontSize: '5rem', lineHeight: 0.8, color: 'var(--primary)', opacity: 0.12, fontFamily: 'Georgia, serif', position: 'absolute', top: '1.5rem', left: '1.75rem', userSelect: 'none' }}>"</div>
                <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8, fontStyle: 'italic', position: 'relative', zIndex: 1, marginBottom: '1.25rem', paddingTop: '1rem' }}>
                  Первые встречи я просто слушал. Никто не заставлял говорить, не осуждал. Через неделю сам захотел поделиться.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>М</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>Михаил</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Базовый тариф · после внезапного разрыва</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'white', borderRadius: '1.25rem', border: '1.5px solid var(--primary-light)', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                  Мы не ставим диагнозы и не заменяем медицинскую помощь. Если нужна срочная кризисная поддержка — подскажем, куда обратиться.
                </p>
              </div>

              <Link href="/program" className="btn-primary">Узнать больше о формате</Link>
            </div>

            {/* Right — safety points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {safetyPoints.map((point, i) => (
                <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.125rem 1.25rem', background: 'white', borderRadius: '1rem', border: '1.5px solid var(--border)' }}>
                  <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle size={15} style={{ color: 'var(--primary)' }} />
                  </div>
                  <span style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.55 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. CAREER TRACK ══════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg-soft)' }}>
        <div className="container mx-auto px-6">
          <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'var(--secondary-light)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Следующий шаг после восстановления
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
              Когда станет легче —<br />поможем двигаться дальше
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', maxWidth: '42rem', marginBottom: '1.75rem' }}>
              Расставание часто бьёт не только по эмоциям, но и по работе, деньгам, режиму и ощущению будущего. Поэтому внутри Restart есть дополнительный карьерный трек — он не обязательный, и начинать стоит тогда, когда будете готовы.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.25rem', background: 'var(--primary-light)', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '2.5rem' }}>
              Участники программы получают −50% на карьерный трек
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {careerCards.map((c) => (
                <div key={c.title} className="card" style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.6rem' }}>{c.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.7 }}>
              Мы не обещаем работу без усилий, но помогаем пройти путь поиска понятнее, спокойнее и системнее.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 8. PRICING ═══════════════════════════════════ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)' }}>
              Выберите формат поддержки
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
              Который сейчас вам подходит
            </p>
          </div>

          <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Не готовы сразу? Начните с{' '}
            <Link href="/pricing" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>вводной встречи за 1 490 ₽</Link>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))', gap: '1.5rem', maxWidth: '62rem', margin: '0 auto', alignItems: 'start' }}>
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                style={plan.highlight ? {
                  background: 'white',
                  borderRadius: '1.5rem',
                  padding: '2.25rem',
                  position: 'relative',
                  boxShadow: '0 0 0 2px var(--primary), 0 20px 60px rgba(78,123,94,0.15)',
                } : {
                  background: 'var(--bg)',
                  borderRadius: '1.5rem',
                  padding: '2.25rem',
                  border: '1.5px solid var(--border)',
                }}
              >
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-1rem', left: '50%', transform: 'translateX(-50%)', padding: '0.3rem 1.25rem', borderRadius: '9999px', background: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(78,123,94,0.35)' }}>
                    Чаще всего выбирают
                  </div>
                )}
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{plan.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>{plan.desc}</p>
                <div style={{ marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, color: plan.highlight ? 'var(--primary)' : 'var(--text)' }}>{plan.price}</span>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}> ₽</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                      <CheckCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className={plan.highlight ? 'btn-primary' : 'btn-outline'} style={{ display: 'block', textAlign: 'center' }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/pricing" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
              Полное описание всех тарифов →
            </Link>
          </p>
        </div>
      </section>

      {/* ═══ 9. REVIEWS ═══════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)' }}>Истории участников</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem' }}>Живые, спокойные, конкретные</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))', gap: '1.5rem' }}>
            {reviews.map((r) => (
              <div key={r.name} className="card" style={{ padding: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.75rem', fontSize: '4rem', lineHeight: 1, color: 'var(--primary)', opacity: 0.07, fontFamily: 'Georgia, serif', userSelect: 'none' }}>
                  "
                </div>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.25rem' }}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={15} fill="#C28A5E" color="#C28A5E" />
                  ))}
                </div>
                <p style={{ color: 'var(--text)', lineHeight: 1.8, marginBottom: '1.75rem', fontSize: '0.95rem' }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div className="avatar" style={{ background: r.color }}>{r.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{r.context} · {r.product}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/reviews" className="btn-outline">Читать все истории →</Link>
          </div>
        </div>
      </section>

      {/* ═══ 10. FAQ ══════════════════════════════════════ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '50rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)' }}>Частые вопросы</h2>
          </div>
          <FaqAccordion items={faqs} />
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
              Все вопросы и ответы →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 11. SOFT CTA ═════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg-sage)' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center', maxWidth: '44rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Image src="/logo-icon.png" alt="" width={96} height={96} style={{ objectFit: 'contain', height: '80px', width: 'auto' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
            Не оставайтесь один на один с этим
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Вступайте в следующую группу. Первая встреча уже меняет многое — можно начать с вводной за 1 490 ₽.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/quiz" className="btn-primary">Пройти короткий тест</Link>
            <Link href="/pricing" className="btn-outline">Выбрать тариф</Link>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '1.5rem', lineHeight: 1.6 }}>
            Программа не является медицинской услугой. Результаты индивидуальны.
          </p>
        </div>
      </section>
    </>
  )
}
