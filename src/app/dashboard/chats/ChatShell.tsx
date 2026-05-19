'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Plus, MessageCircle, Search, User, X, Users, Trash2 } from 'lucide-react'

type Participant = { id: string; name: string | null; email: string; role: string; lastSeenAt?: string | null }
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
type Specialist = { id: string; name: string | null; email: string; role: string; speciality: string | null; bio: string | null }

function lastSeenLabel(iso: string | null | undefined): string {
  if (!iso) return 'Не заходил(а)'
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 2) return 'Онлайн'
  if (min < 60) return `Был(а) ${min} мин назад`
  const h = Math.floor(min / 60)
  if (h < 24) return `Был(а) ${h} ч назад`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Был(а) вчера'
  return `Был(а) ${d} дн назад`
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

export function ChatShell({
  userId, userName, userRole, initialUserId, initialName,
}: {
  userId: string; userName: string; userRole: string
  initialUserId?: string; initialName?: string
}) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [creatingConv, setCreatingConv] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [specsLoading, setSpecsLoading] = useState(false)
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const convPollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoOpenedRef = useRef(false)

  const isCurator = userRole === 'curator'
  const pickerApiUrl = isCurator ? '/api/curator/chat-users' : '/api/specialists'
  const pickerTitle = isCurator ? 'Написать участнику' : 'Написать специалисту'
  const emptyCtaLabel = isCurator ? 'Написать участнику' : 'Написать специалисту'

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

  const loadMessages = useCallback(async (convId: string, showSpinner = false) => {
    if (showSpinner) setMsgLoading(true)
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(prev => {
          // Skip re-render if nothing changed
          if (
            prev.length === data.length &&
            prev[prev.length - 1]?.id === data[data.length - 1]?.id
          ) return prev
          return data
        })
      }
    } finally {
      if (showSpinner) setMsgLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
    convPollRef.current = setInterval(() => loadConversations(), 8000)
    return () => {
      if (convPollRef.current) clearInterval(convPollRef.current)
    }
  }, [loadConversations])

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId, true)
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = setInterval(() => loadMessages(activeId, false), 4000)
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

  async function openPicker() {
    setShowPicker(true)
    if (specialists.length > 0) return
    setSpecsLoading(true)
    try {
      const res = await fetch(pickerApiUrl)
      if (res.ok) setSpecialists(await res.json())
    } finally {
      setSpecsLoading(false)
    }
  }

  const startChatWith = useCallback(async (targetUserId: string, targetName: string) => {
    setShowPicker(false)
    setCreatingConv(true)
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, subject: `Чат с ${targetName}` }),
      })
      if (res.ok) {
        const data = await res.json()
        await loadConversations()
        setActiveId(data.id)
      }
    } finally {
      setCreatingConv(false)
    }
  }, [loadConversations])

  // Auto-open chat when initialUserId is provided (e.g. from ?with= query param)
  useEffect(() => {
    if (!initialUserId || autoOpenedRef.current || loading) return
    autoOpenedRef.current = true
    const existing = conversations.find(c => c.participants.some(p => p.id === initialUserId))
    if (existing) {
      setActiveId(existing.id)
    } else {
      startChatWith(initialUserId, initialName ?? 'Участник')
    }
  }, [initialUserId, initialName, loading, conversations, startChatWith])

  async function deleteMessage(msgId: string) {
    setMessages(prev => prev.filter(m => m.id !== msgId))
    try {
      await fetch(`/api/messages?id=${msgId}`, { method: 'DELETE' })
    } catch { /* optimistic — ignore */ }
  }

  async function send() {
    const trimmed = text.trim()
    if (!trimmed || !activeId || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeId, text: trimmed }),
      })
      if (res.ok) {
        const msg = await res.json()
        setText('')
        setMessages(prev => [...prev, msg])
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
        width: '21rem', flexShrink: 0, borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Search + new chat */}
        <div style={{ padding: '1rem 1.125rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
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
            onClick={openPicker}
            disabled={creatingConv}
            title="Написать специалисту"
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
                  ? `У вас пока нет переписок.\nНажмите + чтобы начать чат.`
                  : 'Ничего не найдено'}
              </div>
              {conversations.length === 0 && (
                <button
                  onClick={openPicker}
                  disabled={creatingConv}
                  style={{ fontSize: '0.78rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  {emptyCtaLabel}
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
                    padding: '1rem 1.125rem', display: 'flex', gap: '0.875rem', alignItems: 'center',
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
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.875rem', flexShrink: 0 }}>
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
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {lastSeenLabel(other?.lastSeenAt)}
                    </div>
                  </div>
                </>
              )
            })()}
          </div>

          {/* Messages */}
          <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
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
                const isHovered = hoveredMsgId === msg.id
                return (
                  <div
                    key={msg.id}
                    style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.375rem' }}
                    onMouseEnter={() => setHoveredMsgId(msg.id)}
                    onMouseLeave={() => setHoveredMsgId(null)}
                  >
                    {isMe && (
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        title="Удалить сообщение"
                        style={{
                          visibility: isHovered ? 'visible' : 'hidden',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-light)', padding: '0.25rem',
                          display: 'flex', alignItems: 'center', flexShrink: 0,
                          transition: 'color 0.1s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#B91C1C' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-light)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    <div style={{ maxWidth: '72%' }}>
                      {!isMe && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginBottom: '0.25rem', fontWeight: 600 }}>
                          {msg.sender.name ?? msg.sender.email}
                        </div>
                      )}
                      <div style={{
                        padding: '0.75rem 1.125rem',
                        borderRadius: isMe ? '1.25rem 1.25rem 0.35rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.35rem',
                        background: isMe ? 'var(--primary)' : 'var(--bg-soft)',
                        color: isMe ? 'white' : 'var(--text)',
                        fontSize: '0.925rem', lineHeight: 1.6,
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
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Написать сообщение..."
              disabled={sending}
              style={{ flex: 1, padding: '0.75rem 1.125rem', borderRadius: '1.125rem', border: '1.5px solid var(--border)', fontSize: '0.925rem', outline: 'none' }}
            />
            <button
              onClick={send}
              disabled={!text.trim() || sending}
              style={{
                width: '2.75rem', height: '2.75rem', borderRadius: '50%', border: 'none',
                background: text.trim() && !sending ? 'var(--primary)' : 'var(--border)',
                cursor: text.trim() && !sending ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s',
              }}
            >
              <Send size={16} style={{ color: 'white' }} />
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

      {/* ── Specialist picker modal ── */}
      {showPicker && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'rgba(28,43,35,0.55)', backdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowPicker(false) }}
        >
          <div style={{
            background: 'var(--card)', borderRadius: '1.25rem',
            padding: '1.75rem', maxWidth: '400px', width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{pickerTitle}</h3>
              <button onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            {specsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Загрузка…</div>
            ) : specialists.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Специалистов не найдено</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {specialists.map(s => {
                  const initial = ((s.name ?? s.email)[0] ?? '?').toUpperCase()
                  const roleLabel = s.role === 'psychologist' ? 'Психолог' : s.role === 'curator' ? 'Куратор' : 'Участник'
                  return (
                    <button
                      key={s.id}
                      onClick={() => startChatWith(s.id, s.name ?? s.email)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.875rem',
                        padding: '0.875rem 1rem', borderRadius: '0.875rem',
                        border: '1.5px solid var(--border)', background: 'var(--bg)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-light)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)' }}
                    >
                      <div style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '50%', flexShrink: 0,
                        background: 'var(--primary)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: 'white',
                      }}>
                        {initial}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.15rem' }}>
                          {s.name ?? s.email.split('@')[0]}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{roleLabel}</div>
                        {s.speciality && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{s.speciality}</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.5 }}>
              Специалист ответит в рабочее время — пн–пт с 10:00 до 19:00 МСК
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
