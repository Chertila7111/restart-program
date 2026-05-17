'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'

const SLEEP_OPTIONS = [
  { value: 'good', label: 'Хорошо' },
  { value: 'ok', label: 'Нормально' },
  { value: 'bad', label: 'Плохо' },
  { value: 'none', label: 'Почти нет' },
]

const TRIGGER_OPTIONS = [
  'Воспоминания о партнёре',
  'Совместные места',
  'Социальные сети',
  'Одиночество',
  'Музыка или фильмы',
  'Сообщение или звонок',
  'Сравнение с другими',
  'Вопросы об отношениях',
  'Мысли о будущем',
  'Усталость и стресс',
  'Другое',
]

const HELPER_OPTIONS = [
  'Спорт или прогулка',
  'Разговор с другом',
  'Задание программы',
  'Запись мыслей',
  'Медитация или дыхание',
  'Хороший сон',
  'Творчество',
  'Природа',
  'Кино или книга',
  'Чат с куратором',
]

const NEXT_STEP_OPTIONS = [
  'Сделать задание программы',
  'Написать в дневник',
  'Позвонить другу',
  'Прогулка или спорт',
  'Побыть в тишине',
  'Посмотреть запись встречи',
  'Написать куратору',
  'Просто переждать',
]

function SliderField({ label, value, min, max, onChange, leftLabel, rightLabel, color = 'var(--primary)' }: {
  label: string; value: number; min: number; max: number
  onChange: (v: number) => void; leftLabel: string; rightLabel: string; color?: string
}) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 800, color }}>{value}/{max}</span>
      </label>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
        <span>{leftLabel}</span><span>{rightLabel}</span>
      </div>
    </div>
  )
}

function Chips({ options, selected, onToggle, multi = true }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; multi?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button key={opt} type="button" onClick={() => onToggle(opt)} style={{
            padding: '0.4rem 0.875rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.8rem',
            border: active ? '2px solid var(--primary)' : '1.5px solid var(--border)',
            background: active ? 'var(--primary-light)' : 'white',
            color: active ? 'var(--primary-dark)' : 'var(--text-muted)',
            fontWeight: active ? 700 : 400, transition: 'all 0.12s',
          }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export default function JournalNewPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    mood: 5, anxiety: 5, urgeToWrite: 2, energy: 6,
    sleep: 'ok',
    triggers: [] as string[],
    helpers: [] as string[],
    note: '',
    nextStep: '',
    sharedWithSpecialist: false,
  })

  function toggleMulti(field: 'triggers' | 'helpers', val: string) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val) ? prev[field].filter(v => v !== val) : [...prev[field], val],
    }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        const res = await fetch('/api/dashboard/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, type: 'daily', ...form }),
        })
        if (!res.ok) {
          const text = await res.text()
          let msg = 'Ошибка сохранения'
          try { msg = JSON.parse(text).error || msg } catch {}
          throw new Error(msg)
        }
        setSaved(true)
        setTimeout(() => router.push('/dashboard/journal'), 1200)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка сохранения')
      }
    })
  }

  return (
    <div style={{ maxWidth: '44rem' }}>
      {/* Back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Link href="/dashboard/journal" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
          <ArrowLeft size={15} /> Дневник
        </Link>
      </div>

      <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Запись за сегодня</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
        {new Date(today + 'T00:00:00').toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      {saved ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>Сохранено!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Возвращаемся в дневник...</p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Состояние
            </div>
            <SliderField label="Настроение" value={form.mood} min={1} max={10} onChange={v => setForm(p => ({ ...p, mood: v }))}
              leftLabel="Очень плохо" rightLabel="Отлично" />
            <SliderField label="Тревога" value={form.anxiety} min={1} max={10} onChange={v => setForm(p => ({ ...p, anxiety: v }))}
              leftLabel="Спокойно" rightLabel="Сильная тревога" color="#C28A5E" />
            <SliderField label="Желание написать бывшему" value={form.urgeToWrite} min={1} max={5} onChange={v => setForm(p => ({ ...p, urgeToWrite: v }))}
              leftLabel="Не хочется" rightLabel="Очень хочется" color="#EF4444" />
            <SliderField label="Энергия" value={form.energy} min={1} max={10} onChange={v => setForm(p => ({ ...p, energy: v }))}
              leftLabel="Нет сил" rightLabel="Полон энергии" color="#10B981" />
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Сон
            </div>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {SLEEP_OPTIONS.map(opt => (
                <button key={opt.value} type="button" onClick={() => setForm(p => ({ ...p, sleep: opt.value }))} style={{
                  flex: 1, padding: '0.5rem 0.25rem', borderRadius: '0.625rem', cursor: 'pointer', fontSize: '0.8rem',
                  border: form.sleep === opt.value ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: form.sleep === opt.value ? 'var(--primary-light)' : 'white',
                  color: form.sleep === opt.value ? 'var(--primary-dark)' : 'var(--text-muted)',
                  fontWeight: form.sleep === opt.value ? 700 : 400, transition: 'all 0.12s',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Что выбило из равновесия? <span style={{ fontWeight: 400, textTransform: 'none' }}>(несколько)</span>
            </div>
            <Chips options={TRIGGER_OPTIONS} selected={form.triggers} onToggle={v => toggleMulti('triggers', v)} />
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Что помогло? <span style={{ fontWeight: 400, textTransform: 'none' }}>(несколько)</span>
            </div>
            <Chips options={HELPER_OPTIONS} selected={form.helpers} onToggle={v => toggleMulti('helpers', v)} />
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Заметка
            </div>
            <textarea
              value={form.note}
              onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              placeholder="Что хочешь зафиксировать сегодня..."
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.875rem' }}
            />
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Что сделаю завтра?
            </div>
            <Chips
              options={NEXT_STEP_OPTIONS}
              selected={form.nextStep ? [form.nextStep] : []}
              onToggle={v => setForm(p => ({ ...p, nextStep: p.nextStep === v ? '' : v }))}
              multi={false}
            />
          </div>

          {/* Share toggle */}
          <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Share2 size={15} style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>Отправить куратору</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Куратор увидит эту запись</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, sharedWithSpecialist: !p.sharedWithSpecialist }))}
              style={{
                width: '3rem', height: '1.625rem', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                background: form.sharedWithSpecialist ? 'var(--primary)' : 'var(--border)',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: '0.1875rem', left: form.sharedWithSpecialist ? '1.4375rem' : '0.1875rem',
                width: '1.25rem', height: '1.25rem', borderRadius: '50%', background: 'white',
                transition: 'left 0.2s', display: 'block',
              }} />
            </button>
          </div>

          {error && <p style={{ color: '#EF4444', fontSize: '0.825rem', marginBottom: '0.75rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: '0.625rem' }}>{error}</p>}

          <button type="submit" disabled={isPending} className="btn-primary" style={{ width: '100%', opacity: isPending ? 0.7 : 1 }}>
            {isPending ? 'Сохраняем...' : 'Сохранить запись'}
          </button>
        </form>
      )}
    </div>
  )
}
