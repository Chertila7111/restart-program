'use client'

import { useState } from 'react'
import { Smartphone, ChevronDown, ChevronUp } from 'lucide-react'

const IOS_STEPS = [
  'Откройте сайт в браузере Safari на iPhone или iPad.',
  'Нажмите кнопку «Поделиться» (иконка квадрата со стрелкой вверх) в нижней панели браузера.',
  'Прокрутите вниз и выберите «На экран "Домой"».',
  'Нажмите «Добавить» — приложение появится на главном экране.',
]

const ANDROID_STEPS = [
  'Откройте сайт в браузере Chrome на Android.',
  'Нажмите три точки (⋮) в правом верхнем углу браузера.',
  'Выберите «Добавить на главный экран» или «Установить приложение».',
  'Нажмите «Добавить» или «Установить» — иконка появится на рабочем столе.',
]

export function PwaInstall() {
  const [open, setOpen] = useState<'ios' | 'android' | null>(null)

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
        <Smartphone size={16} style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Установка приложения</h2>
      </div>
      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
        Добавьте сайт на главный экран телефона — он откроется как приложение без браузерной строки.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* iOS */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <button
            onClick={() => setOpen(open === 'ios' ? null : 'ios')}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🍎</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>iPhone / iPad (iOS, Safari)</span>
            </div>
            {open === 'ios'
              ? <ChevronUp size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              : <ChevronDown size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
            }
          </button>
          {open === 'ios' && (
            <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)' }}>
              <ol style={{ paddingLeft: '1.25rem', marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {IOS_STEPS.map((step, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {step}
                  </li>
                ))}
              </ol>
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-sage)', borderRadius: '0.75rem', fontSize: '0.78rem', color: 'var(--primary-dark)' }}>
                Важно: работает только через Safari. В Chrome и других браузерах на iOS эта функция недоступна.
              </div>
            </div>
          )}
        </div>

        {/* Android */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <button
            onClick={() => setOpen(open === 'android' ? null : 'android')}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🤖</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>Android (Chrome)</span>
            </div>
            {open === 'android'
              ? <ChevronUp size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              : <ChevronDown size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
            }
          </button>
          {open === 'android' && (
            <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)' }}>
              <ol style={{ paddingLeft: '1.25rem', marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {ANDROID_STEPS.map((step, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {step}
                  </li>
                ))}
              </ol>
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-sage)', borderRadius: '0.75rem', fontSize: '0.78rem', color: 'var(--primary-dark)' }}>
                На некоторых устройствах Chrome автоматически предложит установить приложение через баннер внизу экрана.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
