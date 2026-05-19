'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, User, Upload, X } from 'lucide-react'

type Profile = {
  speciality: string; approach: string; education: string; experience: string
  bio: string; workStyle: string; quote: string; photoUrl: string
}

const photoLabels = { idle: '', uploading: 'Загрузка...', done: '✓ Фото загружено', error: 'Ошибка загрузки' } as const

export default function SpecialistProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    speciality: '', approach: '', education: '', experience: '',
    bio: '', workStyle: '', quote: '', photoUrl: '',
  })
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [showPreview, setShowPreview] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/specialist/profile')
      .then(r => r.json())
      .then(d => {
        if (d.profile) {
          const p = d.profile as Profile
          if (p.photoUrl?.startsWith('/uploads/')) {
            p.photoUrl = '/api/uploads/' + p.photoUrl.slice('/uploads/'.length)
          }
          setProfile(p)
        }
      })
      .catch(() => {})
  }, [])

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoStatus('uploading')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await fetch('/api/upload', { method: 'POST', body: fd })
      const d = await r.json()
      if (r.ok && d.url) {
        setProfile(p => ({ ...p, photoUrl: d.url + '?t=' + Date.now() }))
        setPhotoStatus('done')
        setTimeout(() => setPhotoStatus('idle'), 2000)
      } else {
        setPhotoStatus('error')
        setTimeout(() => setPhotoStatus('idle'), 3000)
      }
    } catch { setPhotoStatus('error'); setTimeout(() => setPhotoStatus('idle'), 3000) }
  }

  async function save() {
    setSaveStatus('loading')
    try {
      const photoUrl = profile.photoUrl.split('?')[0]
      const r = await fetch('/api/specialist/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, photoUrl }),
      })
      setSaveStatus(r.ok ? 'saved' : 'error')
      if (r.ok) setTimeout(() => setSaveStatus('idle'), 2500)
    } catch { setSaveStatus('error') }
  }

  const inp = (key: keyof Profile, label: string, placeholder: string, rows?: number) => (
    <div key={key}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>{label}</label>
      {rows ? (
        <textarea rows={rows} placeholder={placeholder} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
          style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical', background: 'var(--bg)', color: 'var(--text)', lineHeight: 1.6, boxSizing: 'border-box' }} />
      ) : (
        <input type="text" placeholder={placeholder} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
      )}
    </div>
  )

  return (
    <div style={{ maxWidth: '44rem' }}>

      {/* Photo lightbox */}
      {showPreview && profile.photoUrl && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowPreview(false)}
        >
          <button
            onClick={() => setShowPreview(false)}
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '2.5rem', height: '2.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
          >
            <X size={20} />
          </button>
          <img
            src={profile.photoUrl}
            alt="Фото профиля"
            style={{ maxWidth: '88vw', maxHeight: '84vh', borderRadius: '1rem', objectFit: 'contain', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Мой профиль</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Эта информация видна участникам в разделе «Мой психолог» и администратору.
        </p>
      </div>

      {/* Avatar */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div
          title={profile.photoUrl ? 'Нажмите чтобы увеличить' : 'Нажмите чтобы загрузить фото'}
          style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: '#3D6249', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', cursor: profile.photoUrl ? 'zoom-in' : 'pointer' }}
          onClick={() => {
            if (profile.photoUrl) setShowPreview(true)
            else fileRef.current?.click()
          }}
        >
          {profile.photoUrl
            ? <img src={profile.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
            : <User size={32} color="white" />
          }
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Фото профиля</div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={uploadPhoto} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={photoStatus === 'uploading'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', background: 'var(--bg)', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}
          >
            <Upload size={14} />
            {photoStatus === 'uploading' ? 'Загрузка...' : profile.photoUrl ? 'Сменить фото' : 'Загрузить фото'}
          </button>
          {photoStatus !== 'idle' && (
            <p style={{ fontSize: '0.775rem', margin: '0.375rem 0 0', color: photoStatus === 'error' ? '#B91C1C' : 'var(--primary)', fontWeight: 600 }}>
              {photoLabels[photoStatus]}
            </p>
          )}
          <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', margin: '0.375rem 0 0' }}>JPG, PNG, WebP · до 5 МБ</p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Профессиональная информация</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {inp('speciality', 'Специализация', 'Клинический психолог, работа с расставаниями и тревогой')}
          {inp('approach', 'Подходы', 'КПТ, схема-терапия, EMDR...')}
          {inp('education', 'Образование', 'МГУ, факультет психологии · Сертификат КПТ')}
          {inp('experience', 'Опыт', '9 лет практики · 300+ клиентов · 4 года групповой работы')}
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>О себе</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {inp('bio', 'Коротко о себе (для участников)', 'Я работаю с расставаниями, тревогой и самооценкой...', 4)}
          {inp('workStyle', 'Как я работаю', 'Работаю структурно и бережно: сначала стабилизация...', 4)}
          {inp('quote', 'Цитата для карточки', 'Важно не заставлять человека быстро стать сильным...')}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={save} disabled={saveStatus === 'loading'} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saveStatus === 'loading' ? 0.75 : 1 }}>
          <Save size={15} />
          {saveStatus === 'loading' ? 'Сохранение...' : 'Сохранить профиль'}
        </button>
        {saveStatus === 'saved' && <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>✓ Сохранено</span>}
        {saveStatus === 'error' && <span style={{ fontSize: '0.875rem', color: '#B91C1C' }}>Ошибка сохранения</span>}
      </div>
    </div>
  )
}
