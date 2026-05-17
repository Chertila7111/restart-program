'use client'

import { useState, useTransition } from 'react'

type Profile = {
  speciality: string | null
  approach: string | null
  education: string | null
  experience: string | null
  bio: string | null
} | null

type Props = {
  initialName: string
  initialEmail: string
  initialProfile: Profile
}

export function PsychProfileForm({ initialName, initialEmail, initialProfile }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: initialName,
    speciality: initialProfile?.speciality ?? '',
    approach: initialProfile?.approach ?? '',
    education: initialProfile?.education ?? '',
    experience: initialProfile?.experience ?? '',
    bio: initialProfile?.bio ?? '',
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaved(false)
    startTransition(async () => {
      try {
        const res = await fetch('/api/dashboard/psych-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Ошибка сохранения')
        setSaved(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка')
      }
    })
  }

  const fields = [
    { key: 'name', label: 'Имя и фамилия', placeholder: 'Мария Соколова', type: 'input' },
    { key: 'speciality', label: 'Специальность', placeholder: 'Клинический психолог', type: 'input' },
    { key: 'approach', label: 'Подход', placeholder: 'КПТ, схема-терапия', type: 'input' },
    { key: 'education', label: 'Образование', placeholder: 'МГУ, факультет психологии · Сертификат КПТ', type: 'input' },
    { key: 'experience', label: 'Опыт', placeholder: '9 лет практики · 300+ клиентов', type: 'input' },
    { key: 'bio', label: 'О себе (цитата)', placeholder: 'Несколько слов о вашем подходе к работе...', type: 'textarea' },
  ]

  return (
    <form onSubmit={submit}>
      {/* Preview avatar */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
          {(form.name || initialEmail)[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{form.name || 'Ваше имя'}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{form.speciality || 'Специальность'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>{initialEmail}</div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.375rem' }}>
                {f.label}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  rows={3}
                  style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.875rem' }}
                />
              ) : (
                <input
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ fontSize: '0.875rem' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p style={{ color: '#EF4444', fontSize: '0.825rem', marginBottom: '0.75rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: '0.625rem' }}>{error}</p>}
      {saved && <p style={{ color: 'var(--primary)', fontSize: '0.825rem', marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--primary-light)', borderRadius: '0.625rem' }}>✓ Профиль сохранён</p>}

      <button type="submit" disabled={isPending} className="btn-primary" style={{ width: '100%', opacity: isPending ? 0.7 : 1 }}>
        {isPending ? 'Сохраняем...' : 'Сохранить профиль'}
      </button>
    </form>
  )
}
