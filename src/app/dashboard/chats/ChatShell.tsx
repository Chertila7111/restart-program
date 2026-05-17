'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Plus, MessageCircle, Search, User } from 'lucide-react'

type Participant = { id: string; name: string | null; email: string; role: string }
type Conversation = {
  id: string
  subject: string | null
  lastMessage: { text: string; createdAt: string } | null
  updatedAt: string
  participants: Participant[]
}
type Message = {
  id: string
  text: string
  createdAt: string
  sender: { id: string; name: string | null; email: string; role: string }
}

function timeLabel(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return d.toLocaleDateString('ru-RU', { weekday: 'short' })
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function getInitial(p: Participant) {
  return ((p.name ?? p.email)[0] ?? '?').toUpperCase()
}

function ConvTitle(conv: Conversation, myId: string) {
  const others = conv.participants.filter(p => p.id !== myId)
  if (others.length === 0) return conv.subject ?? 'Чат'
  if (others.length === 1) return others[0].name ?? others[0].email
  return conv.subject ?? others.map(o => o.name ?? o.email.split('@')[0]).join(', ')
}

export function ChatShell({ userId, userName, userRole }: { userId: string; userName: string; userRole: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [creatingConv, setCreatingConv] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations')
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMessages = useCallback(async (convId: string) => {
    setMsgLoading(true)
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } finally {
      setMsgLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId)
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = setInterval(() => loadMessages(activeId), 4000)
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [activeId, loadMessages])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages.length])

  async function startDoctorChat() {
    setCreatingConv(true)
    try {
      const res = await fetch('/api/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      if (res.ok) {
        const data = await res.json()
        await loadConversations()
        setActiveId(data.id)
      }
    } finally {
      setCreatingConv(false)
    }
  }

  async function send() {
    const trimmed = text.trim()
    if (!trimmed || !activeId || sending) return
    setSending(true)
    setText('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeId, text: trimmed }),
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages(prev => [...prev, msg])
        // Update last message in conv list
        setConversations(prev => prev.map(c =>
          c.id === activeId
            ? { ...c, lastMessage: { text: trimmed, createdAt: new Date().toISOString() } }
            : c
        ))
      }
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const activeConv = conversations.find(c => c.id === activeId)
  const filtered = conversations.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    const title = ConvTitle(c, userId).toLowerCase()
    return title.includes(q) || (c.lastMessage?.text?.toLowerCase().includes(q) ?? false)
  })

  return (
    <div style={{
      flex: 1, display: 'flex', overflow: 'hidden',
      border: '1px solid var(--border)', borderRadius: '1.25rem',
      background: 'white', minHeight: 0,
    }}>
      {/* ── Conversation list ── */}
      <div style={{
        width: '17rem', flexShrink: 0, borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Search + new chat */}
        <div style={{ padding: '0.875rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск..."
              style={{ width: '100%', paddingLeft: '1.875rem', paddingRight: '0.5rem', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.8rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)' }}
            />
          </div>
          <button
            onClick={startDoctorChat}
            disabled={creatingConv}
            title="Новый чат с психологом"
            style={{
              width: '2rem', height: '2rem', borderRadius: '0.625rem', border: 'none',
              background: 'var(--primary)', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>Загрузка…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <MessageCircle size={28} style={{ color: 'var(--border)', marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {conversations.length === 0
                  ? 'У вас пока нет переписок.\nНажмите + чтобы начать чат с психологом.'
                  : 'Ничего не найдено'}
              </div>
              {conversations.length === 0 && (
                <button
                  onClick={startDoctorChat}
                  disabled={creatingConv}
                  style={{ fontSize: '0.78rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Написать психологу
                </button>
              )}
            </div>
          ) : (
            filtered.map(conv => {
              const isActive = conv.id === activeId
              const title = ConvTitle(conv, userId)
              const other = conv.participants.find(p => p.id !== userId) ?? conv.participants[0]
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  style={{
                    width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                    padding: '0.875rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'center',
                    background: isActive ? 'var(--bg-sage)' : 'transparent',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.1s',
                  }}
                >
                  <div style={{
                    width: '2.25rem', height: '2.25rem', borderRadius: '50%', flexShrink: 0,
                    background: other?.role === 'psychologist' ? 'var(--primary)' : 'var(--bg-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700,
                    color: other?.role === 'psychologist' ? 'white' : 'var(--text-muted)',
                  }}>
                    {other ? getInitial(other) : <User size={13} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: isActive ? 700 : 600, fontSize: '0.82rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '8rem' }}>
                        {title}
                      </span>
                      {conv.lastMessage && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', flexShrink: 0, marginLeft: '0.25rem' }}>
                          {timeLabel(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.1rem' }}>
                      {conv.lastMessage?.text ?? (conv.subject ?? 'Нет сообщений')}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* ── Message thread ── */}
      {activeConv ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Header */}
          <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {(() => {
              const other = activeConv.participants.find(p => p.id !== userId) ?? activeConv.participants[0]
              return (
                <>
                  <div style={{
                    width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {other ? getInitial(other) : 'М'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                      {ConvTitle(activeConv, userId)}
                    </div>
                    {other?.role === 'psychologist' && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>Психолог · отвечает пн–пт 10–19 МСК</div>
                    )}
                  </div>
                </>
              )
            })()}
          </div>

          {/* Messages */}
          <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
            {msgLoading && messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.8rem', padding: '2rem' }}>Загрузка…</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Напишите первое сообщение
                </div>
              </div>
            ) : (
              messages.map(msg => {
                const isMe = msg.sender.id === userId
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '72%' }}>
                      {!isMe && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginBottom: '0.25rem', fontWeight: 600 }}>
                          {msg.sender.name ?? msg.sender.email}
                        </div>
                      )}
                      <div style={{
                        padding: '0.625rem 0.875rem',
                        borderRadius: isMe ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                        background: isMe ? 'var(--primary)' : 'var(--bg-soft)',
                        color: isMe ? 'white' : 'var(--text)',
                        fontSize: '0.875rem', lineHeight: 1.55,
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '0.2rem', textAlign: isMe ? 'right' : 'left' }}>
                        {timeLabel(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Написать сообщение..."
              disabled={sending}
              style={{ flex: 1, padding: '0.625rem 0.875rem', borderRadius: '0.875rem', border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none' }}
            />
            <button
              onClick={send}
              disabled={!text.trim() || sending}
              style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: 'none',
                background: text.trim() && !sending ? 'var(--primary)' : 'var(--border)',
                cursor: text.trim() && !sending ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s',
              }}
            >
              <Send size={15} style={{ color: 'white' }} />
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
          <MessageCircle size={40} style={{ color: 'var(--border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>Выберите переписку</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>или начните новую, нажав +</div>
          </div>
        </div>
      )}
    </div>
  )
}
