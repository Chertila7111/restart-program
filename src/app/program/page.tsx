import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock, Users, BookOpen, MessageCircle, Video } from 'lucide-react'

export const metadata: Metadata = {
  title: 'О программе Restart — как это работает',
  description: 'Подробное описание программы Restart: 4 групповые встречи, закрытый чат, задания и дневник. Психолог, группа поддержки и карьерный трек.',
}

const included = [
  { icon: Video, title: '4 групповые встречи', desc: 'Раз в неделю, по 90 минут. Ведёт дипломированный психолог. Встречи проходят в Zoom.' },
  { icon: MessageCircle, title: 'Закрытый чат 24/7', desc: 'Поддержка между встречами. Вы можете написать в любой момент — куратор отвечает в течение часа.' },
  { icon: BookOpen, title: 'Задания и дневник', desc: 'Структурированные практики между встречами. Дневник состояния для отслеживания прогресса.' },
  { icon: Users, title: 'Группа 8–12 человек', desc: 'Небольшая группа, где каждый участник получает внимание. Все в похожей ситуации.' },
  { icon: Clock, title: 'Запись всех встреч', desc: 'Не смогли прийти — посмотрите запись. Все материалы доступны в личном кабинете.' },
  { icon: CheckCircle, title: 'Личный план восстановления', desc: 'В конце программы вы получаете ваш личный план: что дальше, куда двигаться.' },
]

const psychologists = [
  { name: 'Мария Соколова', spec: 'Психолог, когнитивно-поведенческая терапия', exp: '8 лет практики' },
  { name: 'Алексей Петров', spec: 'Психолог, работа с горем и потерями', exp: '12 лет практики' },
  { name: 'Ирина Новикова', spec: 'Психолог-консультант, эмоциональные кризисы', exp: '6 лет практики' },
]

export default function ProgramPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 100%)', padding: '5rem 0' }}>
        <div className="container mx-auto px-6">
          <div style={{ maxWidth: '42rem' }}>
            <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', marginBottom: '1.5rem', display: 'inline-flex' }}>О программе</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#1F1535', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              Restart — не просто группа.<br />
              <span className="gradient-text">Это маршрут из боли в движение.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#4B5563', lineHeight: 1.8, marginBottom: '2rem' }}>
              4-недельная онлайн-программа с психологом, закрытым чатом и структурированными практиками. Мы не предлагаем "просто поговорить" — мы даём конкретный путь из состояния кризиса в состояние действия.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn-primary">Записаться →</Link>
              <Link href="/contacts" className="btn-secondary">Задать вопрос</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Что внутри */}
      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1F1535' }}>Что входит в программу</h2>
            <p style={{ color: '#6B7280', marginTop: '0.75rem' }}>Всё, что нужно для реального восстановления — в одном пакете</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1.5rem' }}>
            {included.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Icon size={22} style={{ color: '#7C3AED' }} />
                  </div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1F1535' }}>{item.title}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Программа по неделям */}
      <section className="section" style={{ background: '#F5F3FF' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1F1535' }}>Программа по неделям</h2>
          </div>

          {[
            {
              week: 'Неделя 1', title: 'Эмоциональная стабилизация',
              items: ['Разбираем, что происходит с вами прямо сейчас', 'Техники управления острой болью и тревогой', 'Как не "зависнуть" в боли — первые практики', 'Задание: дневник состояния на неделю']
            },
            {
              week: 'Неделя 2', title: 'Восстановление самооценки',
              items: ['Работа с внутренним критиком после расставания', 'Практики для восстановления уверенности', 'Разрыв между "я" и "отношения"', 'Задание: список сильных сторон и достижений']
            },
            {
              week: 'Неделя 3', title: 'Личный план жизни',
              items: ['Образ будущего: кем хочу быть через год', 'Ценности и приоритеты после перезагрузки', 'Маленькие цели как основа большого движения', 'Задание: личная карта целей']
            },
            {
              week: 'Неделя 4', title: 'Движение вперёд',
              items: ['Режим, работа, социальная жизнь — возвращение', 'Работа с возможными откатами', 'Итоговый план восстановления', 'Карьерный трек: что дальше для тех, кто хочет больше']
            },
          ].map((w, i) => (
            <div key={w.week} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                  {i + 1}
                </div>
                {i < 3 && <div style={{ width: '2px', flex: 1, background: '#E9D5FF', margin: '0.5rem 0' }} />}
              </div>
              <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
                <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', fontSize: '0.75rem', display: 'inline-flex', marginBottom: '0.75rem' }}>{w.week}</span>
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem', color: '#1F1535' }}>{w.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {w.items.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: '#4B5563' }}>
                      <CheckCircle size={16} style={{ color: '#7C3AED', flexShrink: 0, marginTop: '0.125rem' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Психологи */}
      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1F1535' }}>Наши психологи</h2>
            <p style={{ color: '#6B7280', marginTop: '0.75rem' }}>Все — дипломированные специалисты с подтверждёнными документами</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))', gap: '1.5rem', maxWidth: '52rem', margin: '0 auto' }}>
            {psychologists.map((p) => (
              <div key={p.name} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #EDE9FE, #FCE7F3)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#7C3AED' }}>
                  {p.name.charAt(0)}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', color: '#1F1535' }}>{p.name}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>{p.spec}</p>
                <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', fontSize: '0.75rem' }}>{p.exp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Начать восстановление</h2>
          <p style={{ color: '#EDE9FE', marginBottom: '2rem', fontSize: '1.125rem' }}>Ближайшая группа стартует скоро. Мест немного.</p>
          <Link href="/pricing" className="btn-accent" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>Выбрать тариф →</Link>
        </div>
      </section>
    </>
  )
}
