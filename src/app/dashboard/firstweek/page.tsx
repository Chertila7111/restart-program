import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckSquare, PenLine, BookOpen, MessageCircle, CalendarDays, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Первые 7 дней',
  robots: { index: false, follow: false },
}

const DAYS = [
  {
    day: 1,
    icon: CheckSquare,
    title: 'Пройдите тест',
    desc: 'Пройдите короткий тест — он помогает понять, на каком этапе вы сейчас, и подбирает подходящий формат поддержки.',
    action: { label: 'Пройти тест →', href: '/quiz' },
  },
  {
    day: 2,
    icon: PenLine,
    title: 'Сделайте первую запись в дневнике',
    desc: 'Просто напишите, как вы себя чувствуете сейчас. Не нужно писать много — 3–5 предложений достаточно. Дневник работает только если вести его регулярно.',
    action: { label: 'Открыть дневник →', href: '/dashboard/journal' },
  },
  {
    day: 3,
    icon: BookOpen,
    title: 'Прочитайте одну статью',
    desc: 'Подборка подобрана под вашу ситуацию по результатам теста. Читать не нужно всё сразу — выберите то, что откликается прямо сейчас.',
    action: { label: 'Перейти в блог →', href: '/blog' },
  },
  {
    day: 4,
    icon: MessageCircle,
    title: 'Напишите куратору',
    desc: 'Познакомьтесь с куратором, задайте любой вопрос о программе или формате встреч. Куратор отвечает в рабочее время.',
    action: { label: 'Написать →', href: '/dashboard/chats' },
  },
  {
    day: 5,
    icon: CheckSquare,
    title: 'Выполните первое задание',
    desc: 'Задания — практические упражнения на 5–15 минут. Они помогают не просто думать о ситуации, а постепенно двигаться из неё.',
    action: { label: 'Задания →', href: '/dashboard/tasks' },
  },
  {
    day: 6,
    icon: CalendarDays,
    title: 'Подготовьтесь к встрече',
    desc: 'Подумайте, что сейчас беспокоит больше всего, какого ответа или поддержки не хватает. На встрече не нужно готовиться — просто прийти.',
    action: { label: 'Подробнее о встрече →', href: '/dashboard/meeting' },
    tips: [
      'Что сейчас тяжелее всего?',
      'Какой поддержки мне не хватает?',
      'Есть ли вопрос к психологу?',
      'Готов(а) ли я говорить или просто слушать?',
    ],
  },
  {
    day: 7,
    icon: PenLine,
    title: 'Подведите итог недели',
    desc: 'Сделайте запись в дневнике: что изменилось за 7 дней? Что стало чуть понятнее? Что по-прежнему сложно? Это важный ориентир.',
    action: { label: 'Открыть дневник →', href: '/dashboard/journal/new' },
  },
]

export default function FirstWeekPage() {
  return (
    <div style={{ maxWidth: '44rem' }}>
      <Link
        href="/dashboard"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.825rem', marginBottom: '1.5rem' }}
      >
        ← Кабинет
      </Link>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>
        Первые 7 дней
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.65 }}>
        Простой план, чтобы не застывать в ожидании. Не обязательно делать всё строго по дням — это ориентир, не требование.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {DAYS.map(({ day, icon: Icon, title, desc, action, tips }) => (
          <div key={day} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '2.75rem', height: '2.75rem', borderRadius: '50%',
                background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                  {day}
                </span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <Icon size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <h3 style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text)', margin: 0 }}>{title}</h3>
              </div>
              <p style={{ fontSize: '0.845rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 0.875rem' }}>{desc}</p>

              {tips && (
                <div style={{ background: 'var(--bg-soft)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '0.875rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Вопросы для размышления
                  </div>
                  {tips.map(t => (
                    <div key={t} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--primary)', flexShrink: 0 }}>→</span> {t}
                    </div>
                  ))}
                </div>
              )}

              <Link
                href={action.href}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.825rem', textDecoration: 'none' }}
              >
                {action.label} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', background: 'var(--bg-dark)', borderRadius: '1.25rem', padding: '1.75rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(168,184,160,0.9)', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
          Всё идёт своим темпом. Один маленький шаг в день — это уже движение вперёд.
        </p>
        <Link href="/dashboard/journal" className="btn-ghost-dark" style={{ fontSize: '0.875rem', padding: '0.625rem 1.5rem' }}>
          Открыть дневник →
        </Link>
      </div>
    </div>
  )
}
