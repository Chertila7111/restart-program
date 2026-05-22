'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, RefreshCw } from 'lucide-react'

const ACTIONS = {
  body: [
    'Выйти на улицу хотя бы на 15 минут — без телефона',
    'Сделать 10 минут растяжки или лёгкой разминки',
    'Приготовить что-то тёплое и вкусное — для себя',
    'Принять душ утром, даже если нет желания',
    'Лечь в одно и то же время сегодня вечером',
    'Выпить стакан воды прямо сейчас',
    'Пройтись пешком по новому маршруту',
    'Поставить будильник и встать в нормальное время',
  ],
  mind: [
    'Записать три вещи, которые вы сделали хорошо на этой неделе',
    'Прочитать 10 страниц книги — любой, не связанной с отношениями',
    'Написать в дневник: что вы чувствуете прямо сейчас — без цензуры',
    'Послушать музыку, которую вы любили до этих отношений',
    'Назвать вслух одну вещь, за которую вы благодарны сегодня',
    'Убрать телефон на 1 час и заняться чем-то руками',
    'Посмотреть фильм, который давно хотели',
    'Написать список: что вам нравилось делать в одиночестве',
  ],
  people: [
    'Написать одному другу: «Привет, как ты?» — просто так',
    'Позвонить кому-то из семьи',
    'Договориться о встрече с другом на этой неделе',
    'Ответить на сообщение, которое давно висит непрочитанным',
    'Написать кому-то, кого вы давно не видели',
    'Зайти в любое общественное место — кафе, библиотека',
    'Поделиться с другом чем-то хорошим, что случилось сегодня',
    'Сказать кому-то одну искреннюю фразу — спасибо, ты мне важен и т.п.',
  ],
}

type Category = keyof typeof ACTIONS

const CATEGORIES: { key: Category; label: string; emoji: string; color: string }[] = [
  { key: 'body',   label: 'Тело',             emoji: '🌿', color: 'var(--primary)' },
  { key: 'mind',   label: 'Ум',               emoji: '📖', color: '#7A6BA0' },
  { key: 'people', label: 'Связь с людьми',   emoji: '🤝', color: '#5B7FA6' },
]

function pick(arr: string[], exclude?: string): string {
  const pool = exclude ? arr.filter(a => a !== exclude) : arr
  return pool[Math.floor(Math.random() * pool.length)]
}

type Selected = Record<Category, string>

function pickAll(prev?: Selected): Selected {
  return {
    body:   pick(ACTIONS.body,   prev?.body),
    mind:   pick(ACTIONS.mind,   prev?.mind),
    people: pick(ACTIONS.people, prev?.people),
  }
}

export function ChtodelatTool() {
  const [selected, setSelected] = useState<Selected | null>(null)
  const [done, setDone] = useState<Record<Category, boolean>>({ body: false, mind: false, people: false })

  const generate = () => {
    setSelected(prev => pickAll(prev ?? undefined))
    setDone({ body: false, mind: false, people: false })
  }

  const refresh = (cat: Category) => {
    setSelected(prev => prev ? { ...prev, [cat]: pick(ACTIONS[cat], prev[cat]) } : prev)
    setDone(prev => ({ ...prev, [cat]: false }))
  }

  const toggle = (cat: Category) => {
    setDone(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const doneCount = Object.values(done).filter(Boolean).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <section style={{ background: 'var(--bg-dark)', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '16rem', height: '16rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '40rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Инструмент
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.25 }}>
            Что делать сегодня?
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.85)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Три маленьких действия на сегодня — для тела, ума и связи с людьми. Не нужно делать всё. Начните с одного.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '36rem', textAlign: 'center' }}>

          {!selected ? (
            <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                Нажмите кнопку — и получите три конкретных шага, которые вы можете сделать прямо сегодня. Ничего сложного. Только маленькие действия.
              </p>
              <button
                onClick={generate}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.875rem', padding: '0.875rem 2.5rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
              >
                Показать действия на сегодня
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '2rem' }}>
              {doneCount === 3 && (
                <div style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
                  ✓ Все три шага выполнены. Отлично!
                </div>
              )}

              {CATEGORIES.map(cat => {
                const action = selected[cat.key]
                const isDone = done[cat.key]
                return (
                  <div
                    key={cat.key}
                    className="card"
                    style={{ padding: '1.5rem', marginBottom: '1rem', textAlign: 'left', opacity: isDone ? 0.6 : 1, transition: 'opacity 0.2s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem' }}>{cat.emoji}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: cat.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {cat.label}
                        </span>
                      </div>
                      <button
                        onClick={() => refresh(cat.key)}
                        title="Другой вариант"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: isDone ? 'var(--text-muted)' : 'var(--text)', lineHeight: 1.6, marginBottom: '1rem', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {action}
                    </p>
                    <button
                      onClick={() => toggle(cat.key)}
                      style={{
                        background: isDone ? 'var(--bg-sage)' : 'transparent',
                        color: isDone ? 'var(--primary-dark)' : 'var(--primary)',
                        border: `1px solid ${isDone ? 'var(--primary-light)' : 'var(--primary)'}`,
                        borderRadius: '0.625rem',
                        padding: '0.375rem 1rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {isDone ? '✓ Готово' : 'Отметить как выполненное'}
                    </button>
                  </div>
                )
              })}

              <button
                onClick={generate}
                style={{ background: 'transparent', color: 'var(--text-light)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '0.75rem 2rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                Другой набор действий
              </button>
            </div>
          )}

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <Link href="/tools/dnevnik-sostoyaniya" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Отслеживать состояние — Дневник <ArrowRight size={13} />
            </Link>
            <Link href="/checkout?product=intro" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', marginTop: '0.5rem' }}>
              Нужна поддержка? Вводная встреча — 1 490 ₽ →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
