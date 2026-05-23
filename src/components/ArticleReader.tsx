'use client'

import { useEffect, useState, useRef } from 'react'

type Heading = { id: string; text: string }

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^а-яёa-z0-9\s]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineMd(t: string): string {
  const safe = escapeHtml(t)
  return safe
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

function parseMarkdown(md: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = []
  let html = ''
  let inUl = false
  let inOl = false
  const pLines: string[] = []

  function flushP() {
    if (pLines.length) {
      html += `<p>${inlineMd(pLines.join(' '))}</p>`
      pLines.length = 0
    }
  }
  function closeList() {
    if (inUl) { html += '</ul>'; inUl = false }
    if (inOl) { html += '</ol>'; inOl = false }
  }

  for (const raw of md.trim().split('\n')) {
    if (/^## /.test(raw)) {
      flushP(); closeList()
      const text = raw.slice(3).trim()
      const id = slugify(text)
      headings.push({ id, text })
      html += `<h2 id="${id}">${inlineMd(text)}</h2>`
    } else if (/^### /.test(raw)) {
      flushP(); closeList()
      const text = raw.slice(4).trim()
      html += `<h3>${inlineMd(text)}</h3>`
    } else if (/^- /.test(raw)) {
      flushP()
      if (inOl) { html += '</ol>'; inOl = false }
      if (!inUl) { html += '<ul>'; inUl = true }
      html += `<li>${inlineMd(raw.slice(2).trim())}</li>`
    } else if (/^\d+\. /.test(raw)) {
      flushP()
      if (inUl) { html += '</ul>'; inUl = false }
      if (!inOl) { html += '<ol>'; inOl = true }
      html += `<li>${inlineMd(raw.replace(/^\d+\. /, '').trim())}</li>`
    } else if (/^> /.test(raw)) {
      flushP(); closeList()
      html += `<blockquote>${inlineMd(raw.slice(2).trim())}</blockquote>`
    } else if (raw.trim() === '---') {
      flushP(); closeList()
      html += '<hr />'
    } else if (raw.trim() === '') {
      flushP(); closeList()
    } else {
      if (inUl || inOl) closeList()
      pLines.push(raw.trim())
    }
  }
  flushP(); closeList()

  return { html, headings }
}

export function ArticleReader({ content }: { content: string }) {
  const [progress, setProgress] = useState(0)
  const [activeId, setActiveId] = useState('')
  const [showMobilePill, setShowMobilePill] = useState(false)
  const articleRef = useRef<HTMLDivElement>(null)

  const { html, headings } = parseMarkdown(content)

  const activeIndex = headings.findIndex((h) => h.id === activeId)
  const activeHeading = headings.find((h) => h.id === activeId)

  useEffect(() => {
    function onScroll() {
      const el = articleRef.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const scrolled = Math.max(0, -top)
      const total = height - window.innerHeight
      const pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0
      setProgress(pct)
      // Show mobile pill once user has scrolled into article
      setShowMobilePill(scrolled > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-10% 0% -55% 0%', threshold: 0 }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const pct = Math.round(progress)

  return (
    <>
      {/* Mobile floating pill — fixed bottom right, only on mobile */}
      {showMobilePill && (
        <div className="article-mobile-pill" style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 300,
          background: 'var(--bg-dark)',
          color: 'white',
          borderRadius: '9999px',
          padding: '0.5rem 0.875rem',
          fontSize: '0.78rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          pointerEvents: 'none',
          maxWidth: '220px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: `conic-gradient(var(--primary) ${pct * 3.6}deg, rgba(255,255,255,0.15) 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--primary)' }}>{pct}%</span>
            </div>
          </div>
          <span style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.73rem',
          }}>
            {activeHeading ? activeHeading.text : 'Читаете'}
          </span>
        </div>
      )}

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        {/* Article body */}
        <div ref={articleRef} style={{ flex: 1, minWidth: 0 }}>
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        {/* Table of Contents + progress — hidden on mobile */}
        {headings.length > 1 && (
          <aside className="article-toc" style={{
            width: '200px',
            flexShrink: 0,
            position: 'sticky',
            top: '5rem',
            maxHeight: 'calc(100vh - 6rem)',
            overflowY: 'auto',
          }}>
            {/* Progress block at top */}
            <div style={{
              background: 'var(--bg-sage)',
              borderRadius: '0.875rem',
              padding: '0.875rem',
              marginBottom: '1.25rem',
              border: '1px solid var(--primary-light)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)' }}>
                  Прогресс
                </span>
                <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--primary)' }}>{pct}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--primary-light)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: '9999px', transition: 'width 0.15s linear' }} />
              </div>
              {activeHeading && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--primary-dark)', lineHeight: 1.4, fontWeight: 500 }}>
                  {activeHeading.text.length > 40
                    ? activeHeading.text.slice(0, 38) + '…'
                    : activeHeading.text}
                </div>
              )}
            </div>

            {/* Section label */}
            <div style={{
              fontSize: '0.67rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.07em',
              color: 'var(--text-light)', marginBottom: '0.5rem',
            }}>
              Содержание
            </div>

            {/* ToC nav */}
            <nav>
              {headings.map(({ id, text }, i) => {
                const active = activeId === id
                const passed = activeIndex > i
                return (
                  <button
                    key={id}
                    onClick={() => scrollToId(id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.375rem',
                      width: '100%', textAlign: 'left',
                      padding: '0.35rem 0.5rem 0.35rem 0.625rem',
                      marginBottom: '0.1rem',
                      borderRadius: '0 0.375rem 0.375rem 0',
                      background: active ? 'var(--bg-sage)' : 'transparent',
                      color: active ? 'var(--primary-dark)' : passed ? 'var(--text-light)' : 'var(--text-muted)',
                      fontSize: '0.77rem',
                      fontWeight: active ? 600 : 400,
                      lineHeight: 1.45,
                      cursor: 'pointer',
                      outline: 'none',
                      border: 'none',
                      borderLeft: `2px solid ${active ? 'var(--primary)' : passed ? 'var(--primary-light)' : 'var(--border)'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ flexShrink: 0, marginTop: '0.15rem', fontSize: '0.6rem', color: passed ? 'var(--primary)' : active ? 'var(--primary)' : 'var(--border)' }}>
                      {passed ? '✓' : active ? '●' : '○'}
                    </span>
                    <span>{text}</span>
                  </button>
                )
              })}
            </nav>
          </aside>
        )}
      </div>
    </>
  )
}
