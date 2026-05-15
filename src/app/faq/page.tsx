'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    category: 'О программе',
    items: [
      { q: 'Что такое программа Restart?', a: 'Restart — 4-недельная онлайн-программа восстановления после расставания. Включает групповые встречи с психологом, закрытый чат, задания и дневник состояния.' },
      { q: 'Чем это отличается от обычного психолога?', a: 'Обычный психолог даёт разовые консультации. Restart — это структурированная 4-недельная программа с группой, заданиями, поддержкой между встречами и конкретным маршрутом восстановления.' },
      { q: 'Для кого подходит программа?', a: 'Для всех, кто переживает расставание или развод. Мужчин и женщин. Вне зависимости от длительности отношений или причины разрыва.' },
      { q: 'Это подходит для мужчин?', a: 'Да. В группах есть мужчины, и формат программы одинаково эффективен для всех. При запросе можем собрать группу только из мужчин.' },
    ],
  },
  {
    category: 'Формат и встречи',
    items: [
      { q: 'Как проходят встречи?', a: 'Онлайн, в Zoom, раз в неделю. Длительность — 90 минут. Ведёт дипломированный психолог. Встречи записываются.' },
      { q: 'Сколько человек в группе?', a: 'От 8 до 12 участников. Мы специально поддерживаем небольшой размер группы, чтобы каждый получал достаточно внимания.' },
      { q: 'Что если я не смогу прийти на встречу?', a: 'Все встречи записываются. Вы получите запись в личном кабинете в течение 24 часов. Пропуск одной встречи не критичен.' },
      { q: 'Нужно ли рассказывать подробности своих отношений?', a: 'Нет. Вы делитесь ровно столько, сколько хотите. Группа — безопасное пространство без осуждения и давления.' },
    ],
  },
  {
    category: 'Оплата и возврат',
    items: [
      { q: 'Какие способы оплаты доступны?', a: 'Банковские карты (Visa, Mastercard, Мир), ЮKassa, СБП. Все транзакции защищены.' },
      { q: 'Есть ли рассрочка?', a: 'Да, при оплате через ЮKassa доступна рассрочка на 3–6 месяцев без переплаты и без скрытых комиссий.' },
      { q: 'Возможен ли возврат?', a: 'Да. Если вы не удовлетворены после первой встречи, мы вернём полную стоимость в течение 7 дней. Условия возврата описаны в публичной оферте.' },
      { q: 'Входят ли материалы в стоимость?', a: 'Да, все материалы, задания, дневник и записи встреч включены в цену тарифа.' },
    ],
  },
  {
    category: 'Результаты',
    items: [
      { q: 'Как быстро будет результат?', a: 'Большинство участников замечают изменения уже после первой встречи. Устойчивый результат — к концу 4-недельной программы. 92% участников довольны результатом.' },
      { q: 'Гарантируете ли вы результат?', a: 'Программа не является медицинской услугой, и мы не даём юридически обязывающих гарантий результата. Эффективность зависит от вовлечённости участника. Но мы гарантируем профессиональный подход и возможность возврата при недовольстве первой встречей.' },
      { q: 'Что такое Career Restart?', a: 'Career Restart — дополнительный карьерный трек для участников программы. Помогаем вернуться к работе, сменить направление, составить резюме, откликнуться на вакансии и подготовиться к собеседованиям. Участники Restart получают скидку 50%.' },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="card"
      style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <h3 style={{ fontWeight: 600, color: '#1F1535', fontSize: '1rem' }}>{q}</h3>
        <ChevronDown
          size={20}
          style={{ color: '#7C3AED', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        />
      </div>
      {open && (
        <p style={{ color: '#6B7280', marginTop: '0.75rem', lineHeight: 1.7 }}>{a}</p>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 100%)', padding: '5rem 0 3rem' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center' }}>
          <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', marginBottom: '1.5rem', display: 'inline-flex' }}>FAQ</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#1F1535', marginBottom: '1rem' }}>
            Часто задаваемые вопросы
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>Не нашли ответ — напишите нам, ответим быстро</p>
        </div>
      </section>

      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '48rem' }}>
          {faqs.map((cat) => (
            <div key={cat.category} style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7C3AED', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EDE9FE' }}>
                {cat.category}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cat.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}

          <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #EDE9FE, #FCE7F3)' }}>
            <h3 style={{ fontWeight: 700, color: '#1F1535', marginBottom: '0.5rem' }}>Остался вопрос?</h3>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Напишите нам — ответим в течение нескольких часов</p>
            <Link href="/contacts" className="btn-primary">Написать нам →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
