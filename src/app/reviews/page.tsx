import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Истории участников — Снова с собой',
  description: 'Истории людей, прошедших программу «Снова с собой». Честные, спокойные, без чудес — о том, как постепенно возвращается опора после расставания.',
}

const reviews = [
  {
    name: 'Аня',
    context: 'после 3 лет отношений',
    product: 'Плюс',
    scoreBefore: 2,
    scoreAfter: 7,
    before: 'Два месяца не могла нормально работать и спать.',
    helped: 'После первой встречи стало немного легче понять, что со мной происходит. Задания между встречами помогли вернуть хоть какую-то структуру дня.',
    after: 'К концу программы появился план — не грандиозный, но понятный. Стала снова ходить в зал и отвечать на рабочие письма.',
    tags: ['сон', 'режим', 'работа'],
    color: '#4E7B5E',
  },
  {
    name: 'Михаил',
    context: 'после внезапного разрыва',
    product: 'Базовый',
    scoreBefore: 3,
    scoreAfter: 7,
    before: 'Сначала вообще не понимал, зачем мне группа. Казалось, что это "не моё".',
    helped: 'Первые встречи просто слушал. Это само по себе помогло — понял, что не один в таком состоянии. Потом начал говорить.',
    after: 'Стало проще не проваливаться в мысли весь рабочий день. Постепенно вернулось ощущение, что жизнь продолжается.',
    tags: ['тревога', 'работа', 'не писать бывшей'],
    color: '#3D6249',
  },
  {
    name: 'Ольга',
    context: '8 месяцев — "само не проходило"',
    product: 'Базовый',
    scoreBefore: 3,
    scoreAfter: 8,
    before: 'Думала, что само пройдёт. Прошло 8 месяцев — не проходило.',
    helped: 'Помогло понять, почему именно так — и что с этим конкретно делать. Не абстрактные советы, а реальные упражнения.',
    after: 'Намного лучше понимаю себя. Стала снова общаться с людьми и строить планы на выходные.',
    tags: ['самооценка', 'понимание', 'общение'],
    color: '#5B7FA6',
  },
  {
    name: 'Виктория',
    context: 'после длительных отношений',
    product: 'Плюс',
    scoreBefore: 2,
    scoreAfter: 7,
    before: 'Боялась, что в группе будет неловко и странно.',
    helped: 'Оказалось, все там похожи — растерянные, но готовые двигаться. Никто не давил и не давал советов, которых не просили.',
    after: 'Именно безопасная атмосфера дала силы. Стало легче принимать, что расставание — не конец.',
    tags: ['тревога', 'принятие', 'не писать бывшему'],
    color: '#7A6BA0',
  },
  {
    name: 'Екатерина',
    context: 'расставание + потеря работы',
    product: 'Плюс + Карьера',
    scoreBefore: 1,
    scoreAfter: 8,
    before: 'После расставания просто перестала функционировать — пропустила сроки, потеряла работу.',
    helped: 'Сначала разобралась с эмоциями, потом взялась за карьерный трек. Помогли собрать резюме и подготовиться к собеседованиям.',
    after: 'Нашла новую работу, которая мне нравится. Главное — вернулось ощущение, что у меня есть будущее.',
    tags: ['работа', 'самооценка', 'режим'],
    color: '#C28A5E',
  },
  {
    name: 'Иван',
    context: 'после развода',
    product: 'Карьерный трек',
    scoreBefore: 3,
    scoreAfter: 7,
    before: 'После развода выпал из рабочего ритма на несколько месяцев.',
    helped: 'Карьерный трек помог структурировать поиск. Основная программа — понять, почему так сложно двигаться вперёд.',
    after: 'Нашёл работу через шесть недель. Хотелось бы больше индивидуальной работы с вакансиями, но результат есть.',
    tags: ['работа', 'режим', 'смыслы'],
    color: '#4E7B5E',
  },
]

function ScoreBar({ before, after }: { before: number; after: number }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        <span>До программы</span>
        <span>После программы</span>
      </div>
      <div style={{ position: 'relative', height: '6px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${after * 10}%`, background: 'var(--primary)', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
        <span style={{ fontWeight: 600, color: '#B91C1C' }}>{before}/10</span>
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{after}/10</span>
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <>
      <section style={{ background: 'var(--bg-soft)', padding: '5rem 0 3rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
            Истории участников
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Живые, спокойные, конкретные. Без чудес — о том, как постепенно возвращается опора.
          </p>
          <div style={{ marginTop: '1.75rem', padding: '1rem 1.5rem', background: 'white', borderRadius: '0.875rem', border: '1px solid var(--border)', display: 'inline-block', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Имена изменены, детали — с разрешения участников. Реальные результаты зависят от вовлечённости.
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '76rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1.5rem' }}>
            {reviews.map((r) => (
              <div key={r.name} style={{ background: 'white', borderRadius: '1.5rem', overflow: 'hidden', border: '1.5px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                {/* Color top strip */}
                <div style={{ height: '4px', background: r.color }} />

                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: `${r.color}22`, border: `2px solid ${r.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: r.color, flexShrink: 0 }}>
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.975rem' }}>{r.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.context}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: '9999px', background: 'var(--bg-sage)', color: 'var(--primary-dark)', whiteSpace: 'nowrap' }}>
                      {r.product}
                    </div>
                  </div>

                  {/* Score bar */}
                  <ScoreBar before={r.scoreBefore} after={r.scoreAfter} />

                  {/* Story sections */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem', flex: 1 }}>
                    <div style={{ padding: '0.875rem', background: 'var(--bg-soft)', borderRadius: '0.75rem' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>Было до</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{r.before}</p>
                    </div>
                    <div style={{ padding: '0.875rem', background: 'var(--bg-sage)', borderRadius: '0.75rem' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>Что помогло</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{r.helped}</p>
                    </div>
                    {/* After - visually highlighted */}
                    <div style={{ padding: '0.875rem 1rem', background: 'var(--primary)', borderRadius: '0.75rem' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>Что изменилось</div>
                      <p style={{ color: 'white', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{r.after}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {r.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '9999px', background: 'var(--bg-soft)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem 2rem', background: 'var(--bg-dark)', borderRadius: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Image src="/logo-icon.png" alt="" width={72} height={72} style={{ objectFit: 'contain', height: '64px', width: 'auto', opacity: 0.85 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.875rem)', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
              Узнали себя в одной из историй?
            </h2>
            <p style={{ color: 'rgba(168,184,160,1)', marginBottom: '1.75rem', fontSize: '0.975rem', lineHeight: 1.7, maxWidth: '32rem', margin: '0 auto 1.75rem' }}>
              Пройдите короткий тест — он займёт 2 минуты и поможет понять, какой формат поддержки сейчас безопаснее.
            </p>
            <Link href="/quiz" className="btn-ghost-dark">
              Пройти тест →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
