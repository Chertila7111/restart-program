'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const DIMS = [
  { key: 'mood',    label: 'Настроение',              low: 'Очень плохо', high: 'Отлично' },
  { key: 'anxiety', label: 'Тревога',                 low: 'Нет тревоги', high: 'Очень сильная' },
  { key: 'urge',    label: 'Желание написать бывшему', low: 'Нет совсем',  high: 'Очень сильное' },
  { key: 'energy',  label: 'Энергия',                 low: 'Нет сил',     high: 'Много сил' },
  { key: 'lonely',  label: 'Одиночество',              low: 'Не чувствую', high: 'Сильное' },
] as const

type DimKey = typeof DIMS[number]['key']
type Entry = { date: string; values: Record<DimKey, number>; note: string }

const STORAGE_KEY = 'dnevnik-sostoyaniya-v1'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function loadEntries(): Entry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch { return [] }
}

function saveEntries(entries: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

const DEFAULT_VALUES: Record<DimKey, number> = { mood: 3, anxiety: 3, urge: 3, energy: 3, lonely: 3 }

export function DnevnikTool() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [values, setValues] = useState<Record<DimKey, number>>(DEFAULT_VALUES)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loaded = loadEntries()
    setEntries(loaded)
    const todayEntry = loaded.find(e => e.date === today())
    if (todayEntry) { setValues(todayEntry.values); setNote(todayEntry.note); setSaved(true) }
  }, [])

  const handleSave = () => {
    const newEntry: Entry = { date: today(), values, note }
    const updated = entries.filter(e => e.date !== today()).concat(newEntry)
    updated.sort((a, b) => b.date.localeCompare(a.date))
    setEntries(updated)
    saveEntries(updated)
    setSaved(true)
  }

  const last7 = entries.slice(0, 7)

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
            Дневник состояния
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.85)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Отмечайте состояние каждый день. Когда видишь динамику — понимаешь, что становится лучше, даже если сейчас кажется, что нет.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '36rem' }}>

          {/* Today's entry */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Сегодня — {mounted ? fmtDate(today()) : ''}
            </div>

            {DIMS.map(dim => (
              <div key={dim.key} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{dim.label}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>{values[dim.key]}/5</span>
                </div>
                <input
                  type="range" min={1} max={5} step={1}
                  value={values[dim.key]}
                  onChange={e => { setSaved(false); setValues(prev => ({ ...prev, [dim.key]: +e.target.value })) }}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  <span>{dim.low}</span><span>{dim.high}</span>
                </div>
              </div>
            ))}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                Заметка (необязательно)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={e => { setSaved(false); setNote(e.target.value) }}
                placeholder="Что происходило сегодня?"
                style={{ width: '100%', borderRadius: '0.75rem', border: '1.5px solid var(--border)', padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text)', background: 'var(--bg-soft)', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <button
              onClick={handleSave}
              style={{ width: '100%', background: saved ? 'var(--bg-sage)' : 'var(--primary)', color: saved ? 'var(--primary-dark)' : 'white', border: saved ? '1px solid var(--primary-light)' : 'none', borderRadius: '0.875rem', padding: '0.875rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
            >
              {saved ? '✓ Сохранено' : 'Сохранить запись'}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.625rem', textAlign: 'center' }}>
              Данные хранятся только в вашем браузере
            </p>
          </div>

          {/* History */}
          {mounted && last7.length > 1 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                Последние {last7.length} записей
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.625rem', color: 'var(--text-light)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Дата</th>
                      {DIMS.map(d => (
                        <th key={d.key} style={{ textAlign: 'center', padding: '0.5rem 0.375rem', color: 'var(--text-light)', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                          {d.label.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {last7.map(entry => (
                      <tr key={entry.date} style={{ borderBottom: '1px solid var(--bg-soft)' }}>
                        <td style={{ padding: '0.5rem 0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{fmtDate(entry.date)}</td>
                        {DIMS.map(d => (
                          <td key={d.key} style={{ textAlign: 'center', padding: '0.5rem 0.375rem', fontWeight: 600, color: entry.values[d.key] >= 4 ? 'var(--primary)' : entry.values[d.key] <= 2 ? '#C0392B' : 'var(--text)' }}>
                            {entry.values[d.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <Link href="/blog/kak-perezhit-rasstavanie" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Статья: Как пережить расставание <ArrowRight size={13} />
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
