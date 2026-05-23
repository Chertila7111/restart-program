'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const TOTAL = 10 * 60 // 10 minutes in seconds

const QUESTIONS = [
  'Что я хочу получить от этого сообщения?',
  'Что я почувствую, если не получу ответа?',
  'Что мне на самом деле нужно прямо сейчас?',
]

type Phase = 'idle' | 'running' | 'done'

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function PauzaTool() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [remaining, setRemaining] = useState(TOTAL)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (phase === 'running') {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setPhase('done')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [phase])

  const start = () => { setRemaining(TOTAL); setPhase('running') }
  const reset = () => { setPhase('idle'); setRemaining(TOTAL) }

  const pct = ((TOTAL - remaining) / TOTAL) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <section style={{ background: 'var(--bg-dark)', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '16rem', height: '16rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '40rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Инструмент
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.25 }}>
            Хочется написать бывшему?<br />Подождите 10 минут.
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.85)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Жёсткий запрет усиливает желание. Короткая пауза помогает вернуть контроль. Запустите таймер и ответьте на три вопроса.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '36rem', textAlign: 'center' }}>

          {/* Timer */}
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            {/* Progress ring (simple bar) */}
            <div style={{ height: '4px', background: 'var(--border)', borderRadius: '9999px', marginBottom: '2rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', transition: 'width 1s linear', borderRadius: '9999px' }} />
            </div>

            <div style={{ fontSize: 'clamp(3rem, 12vw, 5rem)', fontWeight: 800, color: phase === 'done' ? 'var(--primary)' : 'var(--text)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '1.5rem', fontVariantNumeric: 'tabular-nums' }}>
              {phase === 'done' ? '✓' : fmt(remaining)}
            </div>

            {phase === 'idle' && (
              <>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Нажмите «Запустить» — и пока идёт пауза, ответьте на три вопроса ниже. Не отправляйте ничего до конца таймера.
                </p>
                <button
                  onClick={start}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.875rem', padding: '0.875rem 2.5rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                >
                  Запустить паузу
                </button>
              </>
            )}

            {phase === 'running' && (
              <>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  Ответьте на вопросы ниже, пока идёт пауза. Не отправляйте сообщение.
                </p>
                <button
                  onClick={reset}
                  style={{ background: 'transparent', color: 'var(--text-light)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Сбросить
                </button>
              </>
            )}

            {phase === 'done' && (
              <>
                <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>10 минут прошло</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Как вы сейчас? Всё равно хочется написать — или немного полегчало?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={start}
                    style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '0.875rem', padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: 'var(--primary-dark)' }}
                  >
                    Всё равно хочется — ещё одна пауза
                  </button>
                  <button
                    onClick={reset}
                    style={{ background: 'transparent', color: 'var(--text-light)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Стало легче — не буду писать ✓
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Questions */}
          <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              Три вопроса для паузы
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {QUESTIONS.map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '1rem 1.25rem', background: 'var(--bg-soft)', borderRadius: '0.875rem', border: '1px solid var(--border)' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 }}>{q}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.875rem', lineHeight: 1.6 }}>
              Запишите ответы в заметки — не отправляйте. Часто написанное уже даёт облегчение.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <Link href="/blog/kak-ne-napisat-byvshemu" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Статья: Как не написать бывшему <ArrowRight size={13} />
            </Link>
            <Link href="/checkout?product=intro" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', marginTop: '0.5rem' }}>
              Нужна поддержка? Вводная встреча — 1 490 ₽ →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
