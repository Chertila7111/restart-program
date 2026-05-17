'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'

const SITUATION_OPTIONS = [
  'Хочу написать бывшему',
  'Очень больно и плохо',
  'Злость или обида',
  'Навязчивые мысли',
  'Паника или тревога',
  'Не могу остановиться',
]

const SAFER_ACTIONS = [
  'Позвонить другу прямо сейчас',
  'Выйти на улицу',
  'Записать мысли в заметки',
  'Включить музыку и подвигаться',
  'Выпить воды и подышать',
  'Открыть задание программы',
  'Написать куратору',
]

export default function JournalQuickPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    situation: '',
    intensity: 5,
    wantToDo: '',
    saferAction: '',
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.situation) { setError('Выбери, что происходит'); return }
    setError('')
    startTransition(async () => {
      try {
        const res = await fetch('/api/dashboard/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, type: 'quick', ...form }),
        })
        if (!res.ok) throw new Error('Ошибка сохранения')
        setSaved(true)
        setTimeout(() => router.push('/dashboard/journal'), 1500)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка')
      }
    })
  }

  return (
    <div style={{ maxWidth: '38rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Link href="/dashboard/journal" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
          <ArrowLeft size={15} /> Дневник
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
        <Zap size={18} style={{ color: '#92400E' }} />
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)' }}>Кризисная запись</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
        Быстрая форма когда трудно. Просто отметь что происходит.
      </p>

      {saved ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🫂</div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>Записано. Ты справляешься.</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Возвращаемся в дневник...</p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Что происходит?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SITUATION_OPTIONS.map(opt => (
                <button key={opt} type="button" onClick={() => setForm(p => ({ ...p, situation: opt }))} style={{
                  padding: '0.75rem 1rem', borderRadius: '0.75rem', cursor: 'pointer',
                  textAlign: 'left', fontSize: '0.875rem',
                  border: form.situation === opt ? '2px solid #92400E' : '1.5px solid var(--border)',
                  background: form.situation === opt ? '#FEF3C7' : 'white',
                  color: form.situation === opt ? '#92400E' : 'var(--text)',
                  fontWeight: form.situation === opt ? 700 : 400, transition: 'all 0.12s',
                }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Интенсивность</span>
              <span style={{ fontWeight: 800, color: '#EF4444' }}>{form.intensity}/10</span>
            </label>
            <input type="range" min={1} max={10} value={form.intensity}
              onChange={e => setForm(p => ({ ...p, intensity: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: '#EF4444' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
              <span>Терпимо</span><span>Невыносимо</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', display: 'block', marginBottom: '0.5rem' }}>
              Что хочется сделать? <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>необязательно</span>
            </label>
            <textarea
              value={form.wantToDo}
              onChange={e => setForm(p => ({ ...p, wantToDo: e.target.value }))}
              placeholder="Написать ему, позвонить, убежать..."
              rows={2}
              style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.875rem' }}
            />
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Более безопасное действие
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SAFER_ACTIONS.map(opt => (
                <button key={opt} type="button" onClick={() => setForm(p => ({ ...p, saferAction: p.saferAction === opt ? '' : opt }))} style={{
                  padding: '0.4rem 0.875rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.8rem',
                  border: form.saferAction === opt ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: form.saferAction === opt ? 'var(--primary-light)' : 'white',
                  color: form.saferAction === opt ? 'var(--primary-dark)' : 'var(--text-muted)',
                  fontWeight: form.saferAction === opt ? 700 : 400, transition: 'all 0.12s',
                }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#EF4444', fontSize: '0.825rem', marginBottom: '0.75rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: '0.625rem' }}>{error}</p>}

          <button type="submit" disabled={isPending} style={{
            width: '100%', padding: '0.9rem', borderRadius: '0.875rem', border: 'none', cursor: isPending ? 'not-allowed' : 'pointer',
            background: '#92400E', color: 'white', fontWeight: 700, fontSize: '1rem', opacity: isPending ? 0.7 : 1,
          }}>
            {isPending ? 'Сохраняем...' : 'Зафиксировать'}
          </button>
        </form>
      )}
    </div>
  )
}
