import type { Metadata } from 'next'
import Link from 'next/link'
import { Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Отзывы участников программы Restart',
  description: 'Реальные отзывы участников программы Restart. Истории восстановления после расставания — от первой встречи до нового старта в жизни.',
}

const reviews = [
  { name: 'Анна М.', age: 28, city: 'Москва', product: 'Restart Plus', rating: 5, text: 'После расставания с мужем 7 лет — я просто не могла встать с кровати. Restart был последней надеждой. Уже на второй встрече я почувствовала, что не одна. К концу программы у меня был план — конкретный, не размытый. Психолог Мария — просто чудо.' },
  { name: 'Михаил К.', age: 32, city: 'Санкт-Петербург', product: 'Restart Base', rating: 5, text: 'Честно — я шёл с большим скептицизмом. "Групповая терапия — это для слабаков". Спасибо, что ошибся. Мужики тоже там есть, и разговор был конкретным, без соплей. Помогло реально встать и начать работать снова.' },
  { name: 'Екатерина П.', age: 25, city: 'Казань', product: 'Career Restart', rating: 5, text: 'После расставания потеряла работу — просто перестала функционировать. Взяла Career Restart и за 2 месяца нашла новую работу, которая мне нравится. Параллельно восстановилась эмоционально. Это реально изменило мою жизнь.' },
  { name: 'Дмитрий В.', age: 35, city: 'Екатеринбург', product: 'Restart Personal', rating: 5, text: 'Индивидуальная сессия с психологом — отдельное спасибо. Именно там я разобрал то, что мучило несколько лет. Группа тоже помогла — понять, что это бывает у всех и что выход есть.' },
  { name: 'Ольга С.', age: 29, city: 'Новосибирск', product: 'Restart Base', rating: 5, text: 'Первую встречу шла и думала — зачем вообще. Ушла с пониманием, что со мной происходит, и с конкретными упражнениями. Через месяц начала снова ходить в зал, встречаться с друзьями, ездить на работу без слёз.' },
  { name: 'Артём Н.', age: 27, city: 'Ростов-на-Дону', product: 'Restart Plus', rating: 5, text: 'Расставание с девушкой после 5 лет — это катастрофа. Я думал, что уже не вернусь в норму. Restart вернул меня — постепенно, шаг за шагом. Задания были иногда тяжёлыми, но именно они работали.' },
  { name: 'Виктория Л.', age: 31, city: 'Тюмень', product: 'Restart Plus', rating: 5, text: 'Хотела поблагодарить за безопасную атмосферу. Я боялась, что будет странно и неловко. Но в группе все были такие же — растерянные, но готовые двигаться дальше. Именно это и дало силы.' },
  { name: 'Иван Г.', age: 38, city: 'Самара', product: 'Career Restart', rating: 4, text: 'Основная программа — отлично. Career Restart — тоже хорошо, хотя хотелось чуть больше индивидуальности в работе с вакансиями. Но результат есть — нашёл работу через 6 недель.' },
  { name: 'Светлана Ф.', age: 24, city: 'Краснодар', product: 'Restart Base', rating: 5, text: 'Пришла после разрыва 3 лет. Думала, что "само пройдёт". Не проходило 8 месяцев. Restart помог понять, почему — и что с этим делать. Теперь я намного лучше понимаю себя.' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '0.2rem' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < rating ? '#F59E0B' : 'none'} color={i < rating ? '#F59E0B' : '#D1D5DB'} />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 100%)', padding: '5rem 0 3rem' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center' }}>
          <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', marginBottom: '1.5rem', display: 'inline-flex' }}>Отзывы</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#1F1535', marginBottom: '1rem' }}>
            Реальные истории восстановления
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[{ num: avg, label: 'средняя оценка' }, { num: '500+', label: 'участников' }, { num: '92%', label: 'рекомендуют' }].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#7C3AED' }}>{s.num}</div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))', gap: '1.5rem' }}>
            {reviews.map((r) => (
              <div key={r.name} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1F1535' }}>{r.name}, {r.age} лет</div>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{r.city}</div>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p style={{ color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.9rem' }}>"{r.text}"</p>
                <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', fontSize: '0.75rem' }}>{r.product}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Готовы написать свою историю?</p>
            <Link href="/pricing" className="btn-primary">Начать программу →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
