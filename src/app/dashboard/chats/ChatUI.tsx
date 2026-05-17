'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

type Message = { from: string; name: string; text: string; time: string }

export function ChatUI({ messages: initial }: { messages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initial)
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function send() {
    const trimmed = text.trim()
    if (!trimmed) return
    const now = new Date()
    setMessages(prev => [
      ...prev,
      { from: 'user', name: 'Вы', text: trimmed, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}` },
    ])
    setText('')
    // Simulated curator reply after delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: 'curator', name: 'Алина (куратор)', text: 'Спасибо за сообщение! Я отвечу вам в рабочее время — как правило, в течение нескольких часов.', time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}` },
      ])
    }, 1200)
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'min(560px, calc(100vh - 18rem))' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
          А
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>Алина (куратор)</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>Онлайн в рабочее время</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((msg, i) => {
          const isUser = msg.from === 'user'
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '78%' }}>
                {!isUser && (
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginBottom: '0.25rem', fontWeight: 600 }}>
                    {msg.name}
                  </div>
                )}
                <div style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: isUser ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                  background: isUser ? 'var(--primary)' : 'white',
                  border: isUser ? 'none' : '1px solid var(--border)',
                  color: isUser ? 'white' : 'var(--text)',
                  fontSize: '0.875rem',
                  lineHeight: 1.55,
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '0.25rem', textAlign: isUser ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.625rem' }}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Написать куратору..."
          style={{ flex: 1, padding: '0.625rem 0.875rem', borderRadius: '0.875rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none' }}
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '50%',
            background: text.trim() ? 'var(--primary)' : 'var(--border)',
            border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s', flexShrink: 0,
          }}
        >
          <Send size={15} style={{ color: 'white' }} />
        </button>
      </div>
    </div>
  )
}
