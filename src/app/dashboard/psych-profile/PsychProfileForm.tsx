'use client'

import { useState, useTransition, useEffect } from 'react'
import { Link2 } from 'lucide-react'

type FormState = {
  name: string
  speciality: string
  approach: string
  education: string
  experience: string
  bio: string
  workStyle: string
  quote: string
  photoUrl: string
  meetingLink: string
}

type Props = {
  initialName: string
  initialEmail: string
  initialProfile: Partial<FormState> | null
}

export function PsychProfileForm({ initialName, initialEmail, initialProfile }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<FormState>({
    name:        initialName,
    speciality:  initialProfile?.speciality  ?? '',
    approach:    initialProfile?.approach    ?? '',
    education:   initialProfile?.education   ?? '',
    experience:  initialProfile?.experience  ?? '',
    bio:         initialProfile?.bio         ?? '',
    workStyle:   initialProfile?.workStyle   ?? '',
    quote:       initialProfile?.quote       ?? '',
    photoUrl:    initialProfile?.photoUrl    ?? '',
    meetingLink: initialProfile?.meetingLink ?? '',
  })

  // Load full profile data including new fields from API
  useEffect(() => {
    fetch('/api/dashboard/psych-profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || data.error) return
        setForm(prev => ({
          ...prev,
          name:        data.name        || prev.name,
          speciality:  data.speciality  || prev.speciality,
          approach:    data.approach    || prev.approach,
          education:   data.education   || prev.education,
          experience:  data.experience  || prev.experience,
          bio:         data.bio         || prev.bio,
          workStyle:   data.workStyle   || prev.workStyle,
          quote:       data.quote       || prev.quote,
          photoUrl:    data.photoUrl    || prev.photoUrl,
          meetingLink: data.meetingLink || prev.meetingLink,
        }))
      })
      .catch(() => {})
  }, [])

  function set(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }))
  }

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

  const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.375rem' }
  const sectionTitle = (t: string) => (
    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', marginTop: '0.25rem' }}>{t}</div>
  )

  return (
    <form onSubmit={submit}>
      {/* Avatar preview */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white', flexShrink: 0, overflow: 'hidden' }}>
          {form.photoUrl
            ? <img src={form.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
            : (form.name || initialEmail)[0].toUpperCase()
          }
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{form.name || 'Ваше имя'}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{form.speciality || 'Специальность'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>{initialEmail}</div>
        </div>
      </div>

      {/* Main fields */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        {sectionTitle('Основная информация')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {([
            { key: 'name',       label: 'Имя и фамилия',   placeholder: 'Мария Соколова',                  type: 'input' },
            { key: 'speciality', label: 'Специальность',    placeholder: 'Клинический психолог',             type: 'input' },
            { key: 'approach',   label: 'Подход',           placeholder: 'КПТ, схема-терапия',              type: 'input' },
            { key: 'education',  label: 'Образование',      placeholder: 'МГУ, факультет психологии · Сертификат КПТ', type: 'input' },
            { key: 'experience', label: 'Опыт',             placeholder: '9 лет практики · 300+ клиентов',  type: 'input' },
            { key: 'photoUrl',   label: 'Ссылка на фото',   placeholder: 'https://...',                      type: 'input' },
          ] as const).map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input
                value={form[f.key]}
                onChange={set(f.key)}
                placeholder={f.placeholder}
                style={{ fontSize: '0.875rem' }}
              />
            </div>
          ))}

          <div>
            <label style={labelStyle}>О себе</label>
            <textarea
              value={form.bio}
              onChange={set('bio')}
              placeholder="Расскажите о своём подходе к работе..."
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Стиль работы</label>
            <textarea
              value={form.workStyle}
              onChange={set('workStyle')}
              placeholder="Как проходят ваши группы, что участники могут ожидать..."
              rows={2}
              style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Цитата / девиз</label>
            <input
              value={form.quote}
              onChange={set('quote')}
              placeholder="«Боль говорит о том, что было важно»"
              style={{ fontSize: '0.875rem' }}
            />
          </div>
        </div>
      </div>

      {/* Meeting link */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        {sectionTitle('Встреча')}
        <div>
          <label style={labelStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Link2 size={14} style={{ color: 'var(--primary)' }} />
              Ссылка на видеозвонок
            </span>
          </label>
          <input
            value={form.meetingLink}
            onChange={set('meetingLink')}
            placeholder="https://telemost.yandex.ru/... или любая ссылка"
            type="url"
            style={{ fontSize: '0.875rem' }}
          />
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
            Пациенты увидят кнопку «Войти в звонок» за 24 часа до встречи. Яндекс Телемост, Zoom, Meet — любой сервис.
          </p>
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
