'use client'

import { useState, useEffect } from 'react'
import { Save, Lock, Eye } from 'lucide-react'

type Profile = {
  age: string; city: string; timezone: string; phone: string; telegram: string
  about: string; situation: string; mainPain: string; goals: string[]
  moodNow: string; diaryAccess: string
}

const GOAL_OPTIONS = [
  { key: 'anxiety', label: 'Снизить тревогу' },
  { key: 'no_text', label: 'Перестать писать бывшему/бывшей' },
  { key: 'divorce', label: 'Пережить развод' },
  { key: 'routine', label: 'Вернуть режим и работу' },
  { key: 'selfesteem', label: 'Восстановить самооценку' },
  { key: 'direction', label: 'Понять, что делать дальше' },
  { key: 'loneliness', label: 'Не оставаться одному/одной' },
  { key: 'other', label: 'Другое' },
]

const DIARY_ACCESS_OPTIONS = [
  { key: 'private', label: 'Только я', sub: 'Психолог не видит дневник' },
  { key: 'specialist', label: 'Мой психолог', sub: 'Видит все мои записи' },
  { key: 'manual', label: 'Только выбранные записи', sub: 'Я сам(а) выбираю, что показать' },
]

export default function ParticipantProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    age: '', city: '', timezone: 'Europe/Moscow', phone: '', telegram: '',
    about: '', situation: '', mainPain: '', goals: [],
    moodNow: '5', diaryAccess: 'private',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/dashboard/profile')
      .then(r => r.json())
      .then(d => { if (d.profile) setProfile(p => ({ ...p, ...d.profile })) })
      .catch(() => {})
  }, [])

  function toggleGoal(key: string) {
    setProfile(p => ({
      ...p,
      goals: p.goals.includes(key) ? p.goals.filter(g => g !== key) : [...p.goals, key],
    }))
  }

  async function save() {
    setStatus('loading')
    try {
      const r = await fetch('/api/dashboard/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      setStatus(r.ok ? 'saved' : 'error')
      if (r.ok) setTimeout(() => setStatus('idle'), 2500)
    } catch { setStatus('error') }
  }

  const inp = (key: keyof Profile, label: string, placeholder: string, type = 'text') => (
    <div key={key}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>{label}</label>
      <input type={type} placeholder={placeholder} value={String(profile[key])} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
    </div>
  )

  return (
    <div style={{ maxWidth: '44rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Мой профиль</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Информация помогает психологу лучше понять вашу ситуацию. Всё строго конфиденциально.
        </p>
      </div>

      {/* Basic */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1.25rem' }}>О вас</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {inp('age', 'Возраст', '32')}
            {inp('city', 'Город', 'Москва')}
          </div>
          {inp('telegram', 'Telegram', '@username')}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Расскажите коротко о себе</label>
            <textarea rows={3} placeholder="Чем занимаетесь, что сейчас важно, как вам комфортнее общаться..." value={profile.about} onChange={e => setProfile(p => ({ ...p, about: e.target.value }))} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical', background: 'var(--bg)', color: 'var(--text)', lineHeight: 1.6, boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      {/* Situation */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Ситуация</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Что сейчас происходит</label>
            <textarea rows={3} placeholder="Коротко опишите свою ситуацию..." value={profile.situation} onChange={e => setProfile(p => ({ ...p, situation: e.target.value }))} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical', background: 'var(--bg)', color: 'var(--text)', lineHeight: 1.6, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Главная боль прямо сейчас</label>
            <input type="text" placeholder="Не могу перестать думать о нём/ней..." value={profile.mainPain} onChange={e => setProfile(p => ({ ...p, mainPain: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Насколько сейчас тяжело (1 — терпимо, 10 — невыносимо): <strong>{profile.moodNow}</strong>
            </label>
            <input type="range" min={1} max={10} value={profile.moodNow} onChange={e => setProfile(p => ({ ...p, moodNow: e.target.value }))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Цель участия</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Выберите всё, что подходит</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 13rem), 1fr))', gap: '0.625rem' }}>
          {GOAL_OPTIONS.map(({ key, label }) => {
            const selected = profile.goals.includes(key)
            return (
              <button key={key} onClick={() => toggleGoal(key)} style={{ padding: '0.625rem 0.875rem', borderRadius: '0.75rem', border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`, background: selected ? 'var(--primary-light)' : 'var(--bg)', color: selected ? 'var(--primary-dark)' : 'var(--text-muted)', fontSize: '0.825rem', fontWeight: selected ? 600 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Diary access */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Lock size={16} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>Доступ к дневнику</h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Ваш дневник видите только вы. Психолог увидит записи только если вы разрешите доступ.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {DIARY_ACCESS_OPTIONS.map(({ key, label, sub }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', border: `1.5px solid ${profile.diaryAccess === key ? 'var(--primary)' : 'var(--border)'}`, background: profile.diaryAccess === key ? 'var(--primary-light)' : 'var(--bg)', cursor: 'pointer', transition: 'all 0.15s', boxSizing: 'border-box', width: '100%' }}>
              <input type="radio" name="diaryAccess" value={key} checked={profile.diaryAccess === key} onChange={() => setProfile(p => ({ ...p, diaryAccess: key }))} style={{ accentColor: 'var(--primary)', marginTop: '0.1rem', flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={save} disabled={status === 'loading'} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={15} /> {status === 'loading' ? 'Сохранение...' : 'Сохранить профиль'}
        </button>
        {status === 'saved' && <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>✓ Сохранено</span>}
        {status === 'error' && <span style={{ fontSize: '0.875rem', color: '#B91C1C' }}>Ошибка</span>}
      </div>
    </div>
  )
}
