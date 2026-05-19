'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, User, Upload } from 'lucide-react'

type Profile = { name: string; bio: string; photoUrl: string }
const photoLabels = { idle: '', uploading: 'Загрузка...', done: '✓ Фото загружено', error: 'Ошибка загрузки' } as const

export default function CuratorProfilePage() {
  const [profile, setProfile] = useState<Profile>({ name: '', bio: '', photoUrl: '' })
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/curator/profile')
      .then(r => r.json())
      .then(d => { if (d.profile) setProfile(d.profile) })
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
        setProfile(p => ({ ...p, photoUrl: d.url }))
        setPhotoStatus('done')
        setTimeout(() => setPhotoStatus('idle'), 2000)
      } else {
        setPhotoStatus('error')
        setTimeout(() => setPhotoStatus('idle'), 3000)
      }
    } catch {
      setPhotoStatus('error')
      setTimeout(() => setPhotoStatus('idle'), 3000)
    }
  }

  async function save() {
    setSaveStatus('loading')
    try {
      const r = await fetch('/api/curator/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      setSaveStatus(r.ok ? 'saved' : 'error')
      if (r.ok) setTimeout(() => setSaveStatus('idle'), 2500)
    } catch { setSaveStatus('error') }
  }

  return (
    <div style={{ maxWidth: '44rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Мой профиль</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Эта информация видна участникам и администратору.
        </p>
      </div>

      {/* Avatar */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div
          style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: '#C28A5E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => fileRef.current?.click()}
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
            {photoStatus === 'uploading' ? 'Загрузка...' : 'Загрузить фото'}
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
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Основная информация</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Имя</label>
            <input
              type="text"
              placeholder="Ваше имя"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>О себе</label>
            <textarea
              rows={5}
              placeholder="Расскажите о себе — чем вы занимаетесь, как поддерживаете участников, ваш опыт..."
              value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical', background: 'var(--bg)', color: 'var(--text)', lineHeight: 1.6, boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={save}
          disabled={saveStatus === 'loading'}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saveStatus === 'loading' ? 0.75 : 1 }}
        >
          <Save size={15} />
          {saveStatus === 'loading' ? 'Сохранение...' : 'Сохранить профиль'}
        </button>
        {saveStatus === 'saved' && <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>✓ Сохранено</span>}
        {saveStatus === 'error' && <span style={{ fontSize: '0.875rem', color: '#B91C1C' }}>Ошибка сохранения</span>}
      </div>
    </div>
  )
}
