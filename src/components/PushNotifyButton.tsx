'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export default function PushNotifyButton() {
  const [state, setState] = useState<'loading' | 'unsupported' | 'subscribed' | 'unsubscribed'>('loading')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setState(sub ? 'subscribed' : 'unsubscribed')
      })
    })
  }, [])

  const subscribe = async () => {
    setBusy(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setBusy(false); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      })
      setState('subscribed')
    } catch (e) {
      console.error('Push subscribe failed:', e)
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
      setState('unsubscribed')
    } catch (e) {
      console.error('Push unsubscribe failed:', e)
    }
    setBusy(false)
  }

  if (state === 'loading') return null
  if (state === 'unsupported') return null

  if (state === 'subscribed') {
    return (
      <button
        onClick={unsubscribe}
        disabled={busy}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          padding: '0.5rem 1rem', borderRadius: '0.625rem', border: '1px solid var(--border)',
          background: 'var(--bg-soft)', color: 'var(--text-muted)', fontSize: '0.8rem',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <BellOff size={14} style={{ color: 'var(--primary)' }} />
        {busy ? 'Отключаем...' : 'Уведомления включены'}
      </button>
    )
  }

  return (
    <button
      onClick={subscribe}
      disabled={busy}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
        padding: '0.5rem 1rem', borderRadius: '0.625rem', border: 'none',
        background: 'var(--primary)', color: 'white', fontSize: '0.8rem',
        cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
      }}
    >
      <Bell size={14} />
      {busy ? 'Подключаем...' : 'Включить напоминания'}
    </button>
  )
}
