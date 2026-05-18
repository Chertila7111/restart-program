'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, CheckCircle, Smartphone } from 'lucide-react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

type Platform = 'ios' | 'android' | 'desktop' | 'pwa'
type ReminderState = 'idle' | 'subscribed' | 'denied' | 'unsupported'

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(ua)
  const isAndroid = /Android/.test(ua)
  const isPwa = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone === true
  if (isPwa) return 'pwa'
  if (isIos) return 'ios'
  if (isAndroid) return 'android'
  return 'desktop'
}

type Props = {
  meetingDate: string
  meetingTime: string
  meetingTitle: string
  meetingLink: string
}

export default function MeetingActions({ meetingDate, meetingTime, meetingTitle, meetingLink }: Props) {
  const [platform, setPlatform] = useState<Platform>('desktop')
  const [reminderState, setReminderState] = useState<ReminderState>('idle')
  const [busy, setBusy] = useState(false)
  const [showInstallHint, setShowInstallHint] = useState(false)

  useEffect(() => {
    const p = detectPlatform()
    setPlatform(p)

    // Check existing push subscription
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setReminderState('subscribed')
        })
      })
    } else if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window.navigator as any).standalone) {
      // iOS Safari without PWA
    } else {
      setReminderState('unsupported')
    }
  }, [])

  const subscribePush = async () => {
    setBusy(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'denied') { setReminderState('denied'); setBusy(false); return }
      if (permission !== 'granted') { setBusy(false); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      })
      setReminderState('subscribed')
    } catch {
      setReminderState('unsupported')
    }
    setBusy(false)
  }

  const unsubscribe = async () => {
    setBusy(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setReminderState('idle')
    } catch { /* ignore */ }
    setBusy(false)
  }

  const isPast = new Date(`${meetingDate}T${meetingTime}:00+03:00`) < new Date()

  if (isPast) return null

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.625rem' }}>
        Напоминание о встрече
      </h3>

      {/* SUBSCRIBED */}
      {reminderState === 'subscribed' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
            Напоминание включено — придёт утром в день встречи
          </div>
          <button
            onClick={unsubscribe}
            disabled={busy}
            style={{ fontSize: '0.775rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            {busy ? '...' : 'Отключить'}
          </button>
        </div>
      )}

      {/* iOS Safari (not installed as PWA) */}
      {reminderState === 'idle' && platform === 'ios' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Чтобы получать напоминания на iPhone, установите это приложение на экран:
          </p>
          <div style={{ background: 'var(--bg-soft)', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <div>1. Нажмите <strong style={{ color: 'var(--text)' }}>«Поделиться»</strong> (кнопка снизу Safari)</div>
            <div>2. Выберите <strong style={{ color: 'var(--text)' }}>«На экран «Домой»»</strong></div>
            <div>3. Откройте приложение — напоминания появятся автоматически</div>
          </div>
        </div>
      )}

      {/* PWA on iOS — push works */}
      {reminderState === 'idle' && platform === 'pwa' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Включите уведомление — придёт утром в день встречи, даже если приложение закрыто.
          </p>
          <button
            onClick={subscribePush}
            disabled={busy}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
              background: 'var(--primary)', color: 'white',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontWeight: 600, fontSize: '0.875rem',
            }}
          >
            <Bell size={15} />
            {busy ? 'Подключаем...' : 'Включить напоминание'}
          </button>
        </div>
      )}

      {/* Android / Desktop — push supported */}
      {reminderState === 'idle' && (platform === 'android' || platform === 'desktop') && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Включите уведомление — придёт утром в день встречи, даже если вкладка закрыта.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={subscribePush}
              disabled={busy}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
                background: 'var(--primary)', color: 'white',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 600, fontSize: '0.875rem',
              }}
            >
              <Bell size={15} />
              {busy ? 'Подключаем...' : 'Включить напоминание'}
            </button>
            {platform === 'android' && (
              <button
                onClick={() => setShowInstallHint(!showInstallHint)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.625rem 1rem', borderRadius: '0.75rem',
                  border: '1px solid var(--border)', background: 'white',
                  color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.825rem',
                }}
              >
                <Smartphone size={14} /> Установить приложение
              </button>
            )}
          </div>
          {showInstallHint && platform === 'android' && (
            <div style={{ marginTop: '0.875rem', background: 'var(--bg-soft)', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <div>1. Нажмите <strong style={{ color: 'var(--text)' }}>⋮</strong> (три точки в Chrome)</div>
              <div>2. Выберите <strong style={{ color: 'var(--text)' }}>«Добавить на главный экран»</strong></div>
              <div>3. Приложение появится как обычное — работает без браузера</div>
            </div>
          )}
        </div>
      )}

      {/* Denied */}
      {reminderState === 'denied' && (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Вы запретили уведомления. Разрешите их в настройках браузера (значок замка в адресной строке) и обновите страницу.
        </div>
      )}

      {/* Unsupported */}
      {reminderState === 'unsupported' && (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Ваш браузер не поддерживает push-уведомления. Попробуйте Chrome или Firefox.
        </div>
      )}

      {/* BellOff icon for subscribed state top-right */}
    </div>
  )
}
