'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'

const QUESTIONS = [
  { key: 'weekSum1', label: 'Что было самым сложным на этой неделе?', placeholder: 'Момент, ситуация или чувство...' },
  { key: 'weekSum2', label: 'Что порадовало или удивило?', placeholder: 'Даже маленькое...' },
  { key: 'weekSum3', label: 'Что я узнал(а) о себе?', placeholder: 'Любое наблюдение...' },
  { key: 'weekSum4', label: 'Что хочу изменить на следующей неделе?', placeholder: 'Конкретно и реалистично...' },
  { key: 'weekSum5', label: 'За что благодарен(а) себе?', placeholder: 'Любое достижение считается...' },
]

export default function WeekSummaryPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    weekSum1: '', weekSum2: '', weekSum3: '', weekSum4: '', weekSum5: '',
  })

  // Monday of current week as date key
  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1)
  const weekDate = monday.toISOString().split('T')[0]

  // Format week range
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const weekLabel = `${monday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} – ${sunday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const filled = Object.values(form).filter(v => v.trim()).length
    if (filled === 0) { setError('Заполни хотя бы одно поле'); return }
    setError('')
    startTransition(async () => {
      try {
        const res = await fetch('/api/dashboard/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: weekDate, type: 'week_summary', ...form }),
        })
        if (!res.ok) throw new Error('Ошибка сохранения')
        setSaved(true)
        setTimeout(() => router.push('/dashboard/journal'), 1500)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка')
      }
    })
  }

  const filled = Object.values(form).filter(v => v.trim()).length

  return (
    <div style={{ maxWidth: '40rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Link href="/dashboard/journal" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
          <ArrowLeft size={15} /> Дневник
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
        <Calendar size={18} style={{ color: 'var(--primary)' }} />
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)' }}>Итоги недели</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
        {weekLabel} · {5 - filled} вопросов осталось
      </p>

      {saved ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌿</div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>Рефлексия сохранена!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Возвращаемся в дневник...</p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {QUESTIONS.map((q, i) => (
              <div key={q.key} className="card" style={{ padding: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.625rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {i + 1} из 5
                  </span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginTop: '0.25rem' }}>{q.label}</div>
                </label>
                <textarea
                  value={(form as any)[q.key]}
                  onChange={e => setForm(p => ({ ...p, [q.key]: e.target.value }))}
                  placeholder={q.placeholder}
                  rows={3}
                  style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.875rem' }}
                />
              </div>
            ))}
          </div>

          {error && <p style={{ color: '#EF4444', fontSize: '0.825rem', margin: '1rem 0', padding: '0.75rem', background: '#FEF2F2', borderRadius: '0.625rem' }}>{error}</p>}

          <button type="submit" disabled={isPending} className="btn-primary" style={{ width: '100%', marginTop: '1.25rem', opacity: isPending ? 0.7 : 1 }}>
            {isPending ? 'Сохраняем...' : 'Сохранить рефлексию'}
          </button>
        </form>
      )}
    </div>
  )
}
