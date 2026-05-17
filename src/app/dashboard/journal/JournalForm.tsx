'use client'

import { useState, useTransition } from 'react'

type Entry = {
  id: string
  userId: string
  date: string
  mood: number
  anxiety: number
  urgeToWrite: number
  sleep: string
  trigger: string | null
  helped: string | null
  nextStep: string | null
  createdAt: string
}

type Props = {
  today: string
  todayEntry: Entry | null
  recentEntries: Entry[]
}

const MOOD_EMOJI = (v: number) => v <= 3 ? '😔' : v <= 5 ? '😐' : v <= 7 ? '🙂' : '😊'
const MOOD_COLOR = (v: number) => v <= 3 ? '#EF4444' : v <= 5 ? '#F59E0B' : v <= 7 ? '#10B981' : '#4E7B5E'

const SLEEP_OPTIONS = [
  { value: 'good', label: 'Хорошо' },
  { value: 'ok',   label: 'Нормально' },
  { value: 'bad',  label: 'Плохо' },
]

export function JournalForm({ today, todayEntry, recentEntries }: Props) {
  const [saved, setSaved] = useState(!!todayEntry)
  const [entry, setEntry] = useState({
    mood:        todayEntry?.mood        ?? 5,
    anxiety:     todayEntry?.anxiety     ?? 5,
    urgeToWrite: todayEntry?.urgeToWrite ?? 1,
    sleep:       todayEntry?.sleep       ?? 'ok',
    trigger:     todayEntry?.trigger     ?? '',
    helped:      todayEntry?.helped      ?? '',
    nextStep:    todayEntry?.nextStep    ?? '',
  })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        const res = await fetch('/api/dashboard/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, ...entry }),
        })
        if (!res.ok) throw new Error()
        setSaved(true)
      } catch {
        setError('Не удалось сохранить. Попробуйте ещё раз.')
      }
    })
  }

  return (
    <>
      {/* Today's form */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Сегодня · {new Date(today + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>Как ты сегодня?</h2>
          </div>
          {saved && (
            <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, background: 'var(--primary-light)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
              ✓ Сохранено
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Mood */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Настроение</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span>{MOOD_EMOJI(entry.mood)}</span>
                <span style={{ fontWeight: 800, color: MOOD_COLOR(entry.mood) }}>{entry.mood}</span>
              </span>
            </label>
            <input
              type="range" min="1" max="10" value={entry.mood}
              onChange={e => setEntry(prev => ({ ...prev, mood: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
              <span>Очень плохо</span>
              <span>Отлично</span>
            </div>
          </div>

          {/* Anxiety */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Тревога</span>
              <span style={{ fontWeight: 800, color: MOOD_COLOR(11 - entry.anxiety) }}>{entry.anxiety}</span>
            </label>
            <input
              type="range" min="1" max="10" value={entry.anxiety}
              onChange={e => setEntry(prev => ({ ...prev, anxiety: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: '#C28A5E' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
              <span>Спокойно</span>
              <span>Сильная тревога</span>
            </div>
          </div>

          {/* Urge to write */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Желание написать бывшему</span>
              <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>{entry.urgeToWrite}/5</span>
            </label>
            <input
              type="range" min="1" max="5" value={entry.urgeToWrite}
              onChange={e => setEntry(prev => ({ ...prev, urgeToWrite: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
              <span>Не хочется</span>
              <span>Очень хочется</span>
            </div>
          </div>

          {/* Sleep */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', display: 'block', marginBottom: '0.625rem' }}>Сон</label>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {SLEEP_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEntry(prev => ({ ...prev, sleep: opt.value }))}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '0.625rem', cursor: 'pointer',
                    border: entry.sleep === opt.value ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: entry.sleep === opt.value ? 'var(--primary-light)' : 'white',
                    color: entry.sleep === opt.value ? 'var(--primary-dark)' : 'var(--text-muted)',
                    fontWeight: entry.sleep === opt.value ? 700 : 400,
                    fontSize: '0.825rem', transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>
                Что выбило из равновесия? <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>необязательно</span>
              </label>
              <textarea
                value={entry.trigger}
                onChange={e => setEntry(prev => ({ ...prev, trigger: e.target.value }))}
                placeholder="Мысль, ситуация или воспоминание..."
                rows={2}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>
                Что помогло? <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>необязательно</span>
              </label>
              <textarea
                value={entry.helped}
                onChange={e => setEntry(prev => ({ ...prev, helped: e.target.value }))}
                placeholder="Разговор, прогулка, задание из программы..."
                rows={2}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>
                Что сделаю завтра? <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>необязательно</span>
              </label>
              <textarea
                value={entry.nextStep}
                onChange={e => setEntry(prev => ({ ...prev, nextStep: e.target.value }))}
                placeholder="Один маленький шаг..."
                rows={2}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {error && <p style={{ color: '#EF4444', fontSize: '0.825rem', marginBottom: '0.75rem' }}>{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary"
            style={{ width: '100%', opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? 'Сохраняем...' : saved ? 'Обновить запись' : 'Сохранить'}
          </button>
        </form>
      </div>

      {/* History */}
      {recentEntries.length > 0 && (
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>История</h2>

          {/* Mood sparkline */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Настроение за {recentEntries.length} дней
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'flex-end', height: '3rem' }}>
              {[...recentEntries].reverse().map(e => (
                <div
                  key={e.date}
                  title={`${e.date}: настроение ${e.mood}`}
                  style={{
                    flex: 1, borderRadius: '0.25rem',
                    background: MOOD_COLOR(e.mood),
                    height: `${(e.mood / 10) * 100}%`,
                    minWidth: '0.5rem',
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Entry list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentEntries.map(e => (
              <div key={e.id} className="card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)' }}>
                    {new Date(e.date + 'T00:00:00').toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                  <div style={{ display: 'flex', gap: '0.875rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span title="Настроение">{MOOD_EMOJI(e.mood)} {e.mood}</span>
                    <span title="Тревога">😰 {e.anxiety}</span>
                    <span title="Сон">{e.sleep === 'good' ? '😴 Хорошо' : e.sleep === 'ok' ? '😐 Норм' : '😵 Плохо'}</span>
                  </div>
                </div>
                {e.helped && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Помогло: </span>{e.helped}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
