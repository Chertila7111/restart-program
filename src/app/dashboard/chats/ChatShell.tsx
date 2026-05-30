'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Send, Plus, MessageCircle, Search, User, X, Bell,
  Trash2, Reply, Paperclip, FileText, Image as ImageIcon, File,
} from 'lucide-react'

type Participant = { id: string; name: string | null; email: string; role: string; lastSeenAt?: string | null }
type Conversation = {
  id: string
  subject: string | null
  lastMessage: { text: string; createdAt: string; senderId?: string } | null
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
type ReplyTarget = { id: string; senderName: string; preview: string }

// ── helpers ───────────────────────────────────────────────────────────────────

function lastSeenLabel(iso: string | null | undefined): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 2) return 'В сети'
  if (min < 60) return `${min} мин назад`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} ч назад`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Вчера'
  return `${d} дн назад`
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

function getInitial(p: { name: string | null; email: string }) {
  return ((p.name ?? p.email)[0] ?? '?').toUpperCase()
}

function ConvTitle(conv: Conversation, myId: string) {
  const others = conv.participants.filter(p => p.id !== myId)
  if (others.length === 0) return conv.subject ?? 'Чат'
  if (others.length === 1) return others[0].name ?? others[0].email
  return conv.subject ?? others.map(o => o.name ?? o.email.split('@')[0]).join(', ')
}

// Parse file message: [FILE]url|name|size
function parseFileMsg(text: string): { url: string; name: string; size: string } | null {
  if (!text.startsWith('[FILE]')) return null
  const parts = text.slice(6).split('|')
  return { url: parts[0] ?? '', name: parts[1] ?? 'Файл', size: parts[2] ?? '' }
}

// Parse reply message: [REPLY]senderName|preview\nActual text
function parseReply(text: string): { senderName: string; preview: string; body: string } | null {
  if (!text.startsWith('[REPLY]')) return null
  const nl = text.indexOf('\n')
  if (nl === -1) return null
  const header = text.slice(7, nl)
  const sep = header.indexOf('|')
  if (sep === -1) return null
  return {
    senderName: header.slice(0, sep),
    preview: header.slice(sep + 1),
    body: text.slice(nl + 1),
  }
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url)
}

// ── File message renderer ────────────────────────────────────────────────────

function FileCard({ url, name, size, isMe }: { url: string; name: string; size: string; isMe: boolean }) {
  const isImg = isImageUrl(url)
  if (isImg) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={url} alt={name} style={{ maxWidth: '16rem', maxHeight: '12rem', borderRadius: '0.75rem', display: 'block', objectFit: 'cover' }} />
      </a>
    )
  }
  const ext = name.split('.').pop()?.toUpperCase() ?? 'FILE'
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: '0.875rem', background: isMe ? 'rgba(255,255,255,0.15)' : 'var(--bg-soft)', border: `1px solid ${isMe ? 'rgba(255,255,255,0.2)' : 'var(--border)'}` }}>
      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: isMe ? 'rgba(255,255,255,0.2)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FileText size={16} style={{ color: isMe ? 'white' : 'var(--primary)' }} />
      </div>
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: isMe ? 'white' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '10rem' }}>{name}</div>
        <div style={{ fontSize: '0.7rem', color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{ext}{size ? ` · ${size}` : ''}</div>
      </div>
    </a>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

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
  const [lastReadMap, setLastReadMap] = useState<Record<string, string>>({})
  const [pushGranted, setPushGranted] = useState(false)
  const [showPushBanner, setShowPushBanner] = useState(false)
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null)
  const [uploading, setUploading] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const convPollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoOpenedRef = useRef(false)
  const lrmInitRef = useRef(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('chat_last_read')
      if (stored) setLastReadMap(JSON.parse(stored))
    } catch {}
    if (typeof Notification !== 'undefined') {
      if (Notification.permission === 'granted') setPushGranted(true)
      else if (Notification.permission === 'default' && !localStorage.getItem('push_asked')) setShowPushBanner(true)
    }
  }, [])

  useEffect(() => {
    if (!loading && conversations.length > 0 && !lrmInitRef.current) {
      lrmInitRef.current = true
      setLastReadMap(prev => {
        const updated = { ...prev }
        for (const conv of conversations) {
          if (!updated[conv.id] && conv.lastMessage) updated[conv.id] = conv.lastMessage.createdAt
        }
        try { localStorage.setItem('chat_last_read', JSON.stringify(updated)) } catch {}
        return updated
      })
    }
  }, [loading, conversations])

  function markAsRead(convId: string) {
    const ts = new Date().toISOString()
    setLastReadMap(prev => {
      const updated = { ...prev, [convId]: ts }
      try { localStorage.setItem('chat_last_read', JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  async function subscribePush() {
    if (typeof Notification === 'undefined') return
    const permission = await Notification.requestPermission()
    localStorage.setItem('push_asked', 'true')
    setShowPushBanner(false)
    if (permission !== 'granted') return
    setPushGranted(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) return
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey })
      const key = sub.getKey('p256dh')
      const auth = sub.getKey('auth')
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint, keys: { p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : '', auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : '' } }),
      })
    } catch {}
  }

  const isCurator = userRole === 'curator'
  const pickerApiUrl = isCurator ? '/api/curator/chat-users' : '/api/specialists'
  const pickerTitle = isCurator ? 'Написать участнику' : 'Написать специалисту'

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations')
      if (res.ok) setConversations(await res.json())
    } finally { setLoading(false) }
  }, [])

  const loadMessages = useCallback(async (convId: string, showSpinner = false) => {
    if (showSpinner) setMsgLoading(true)
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(prev => {
          if (prev.length === data.length && prev[prev.length - 1]?.id === data[data.length - 1]?.id) return prev
          return data
        })
      }
    } finally { if (showSpinner) setMsgLoading(false) }
  }, [])

  useEffect(() => {
    loadConversations()
    convPollRef.current = setInterval(() => loadConversations(), 8000)
    return () => { if (convPollRef.current) clearInterval(convPollRef.current) }
  }, [loadConversations])

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId, true)
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = setInterval(() => loadMessages(activeId, false), 4000)
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [activeId, loadMessages])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages.length])

  async function openPicker() {
    setShowPicker(true)
    if (specialists.length > 0) return
    setSpecsLoading(true)
    try {
      const res = await fetch(pickerApiUrl)
      if (res.ok) setSpecialists(await res.json())
    } finally { setSpecsLoading(false) }
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
    } finally { setCreatingConv(false) }
  }, [loadConversations])

  useEffect(() => {
    if (!initialUserId || autoOpenedRef.current || loading) return
    autoOpenedRef.current = true
    const existing = conversations.find(c => c.participants.some(p => p.id === initialUserId))
    if (existing) setActiveId(existing.id)
    else startChatWith(initialUserId, initialName ?? 'Участник')
  }, [initialUserId, initialName, loading, conversations, startChatWith])

  async function deleteMessage(msgId: string) {
    setMessages(prev => prev.filter(m => m.id !== msgId))
    try { await fetch(`/api/messages?id=${msgId}`, { method: 'DELETE' }) } catch {}
  }

  async function send(overrideText?: string) {
    const trimmed = (overrideText ?? text).trim()
    if (!trimmed || !activeId || sending) return
    setSending(true)

    let finalText = trimmed
    if (replyTarget) {
      finalText = `[REPLY]${replyTarget.senderName}|${replyTarget.preview}\n${trimmed}`
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeId, text: finalText }),
      })
      if (res.ok) {
        const msg = await res.json()
        setText('')
        setReplyTarget(null)
        setMessages(prev => [...prev, msg])
        // Mark as read immediately — own messages never show as unread
        markAsRead(activeId)
        setConversations(prev => prev.map(c =>
          c.id === activeId
            ? { ...c, lastMessage: { text: finalText, createdAt: new Date().toISOString(), senderId: userId } }
            : c
        ))
      }
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  async function uploadFile(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) { alert('Ошибка загрузки файла'); return }
      const { url } = await res.json()
      const sizeStr = file.size < 1024 * 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      await send(`[FILE]${url}|${file.name}|${sizeStr}`)
    } finally { setUploading(false) }
  }

  // Last message preview text for conversation list
  function lastMsgPreview(conv: Conversation): string {
    if (!conv.lastMessage) return conv.subject ?? 'Нет сообщений'
    let txt = conv.lastMessage.text
    // Strip reply header for preview
    if (txt.startsWith('[REPLY]')) {
      const nl = txt.indexOf('\n')
      txt = nl !== -1 ? txt.slice(nl + 1) : txt.slice(7)
    }
    // Strip file prefix
    if (txt.startsWith('[FILE]')) {
      const parts = txt.slice(6).split('|')
      txt = `📎 ${parts[1] ?? 'Файл'}`
    }
    const isOwn = conv.lastMessage.senderId === userId
    const sender = isOwn ? 'Вы' : (conv.participants.find(p => p.id === conv.lastMessage?.senderId)?.name ?? '')
    return sender ? `${sender}: ${txt}` : txt
  }

  const activeConv = conversations.find(c => c.id === activeId)
  const filtered = conversations.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return ConvTitle(c, userId).toLowerCase().includes(q) || (c.lastMessage?.text?.toLowerCase().includes(q) ?? false)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {showPushBanner && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 1.25rem', marginBottom: '0.75rem', background: 'var(--bg-sage)', borderRadius: '0.875rem', border: '1px solid var(--primary-light)', flexShrink: 0 }}>
          <Bell size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text)' }}>
            <strong>Уведомления о новых сообщениях</strong>
            <span style={{ color: 'var(--text-muted)' }}> — получайте их даже когда вкладка закрыта</span>
          </div>
          <button onClick={subscribePush} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem', padding: '0.375rem 0.875rem', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', flexShrink: 0 }}>Включить</button>
          <button onClick={() => { localStorage.setItem('push_asked', 'dismissed'); setShowPushBanner(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', flexShrink: 0 }}><X size={14} /></button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', border: '1px solid var(--border)', borderRadius: '1.25rem', background: 'white', minHeight: 0 }}>

        {/* ── Conversation list ── */}
        <div style={{ width: '22rem', flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.125rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..." style={{ width: '100%', paddingLeft: '1.875rem', paddingRight: '0.5rem', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.8rem', borderRadius: '0.625rem', border: '1.5px solid var(--border)', boxSizing: 'border-box' }} />
            </div>
            {!pushGranted && typeof Notification !== 'undefined' && Notification.permission !== 'granted' && (
              <button onClick={subscribePush} title="Уведомления" style={{ width: '2rem', height: '2rem', borderRadius: '0.625rem', border: 'none', background: 'var(--bg-soft)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bell size={13} />
              </button>
            )}
            <button onClick={openPicker} disabled={creatingConv} title="Новый чат" style={{ width: '2rem', height: '2rem', borderRadius: '0.625rem', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={14} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>Загрузка…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <MessageCircle size={28} style={{ color: 'var(--border)', marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {conversations.length === 0 ? 'Нет переписок. Нажмите + чтобы начать.' : 'Ничего не найдено'}
                </div>
                {conversations.length === 0 && (
                  <button onClick={openPicker} disabled={creatingConv} style={{ fontSize: '0.78rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600 }}>
                    {pickerTitle}
                  </button>
                )}
              </div>
            ) : (
              filtered.map(conv => {
                const isActive = conv.id === activeId
                const title = ConvTitle(conv, userId)
                const other = conv.participants.find(p => p.id !== userId) ?? conv.participants[0]
                const isUnread = !isActive && conv.lastMessage &&
                  conv.lastMessage.senderId !== userId && // never show own messages as unread
                  (!lastReadMap[conv.id] || new Date(conv.lastMessage.createdAt) > new Date(lastReadMap[conv.id]))
                const preview = lastMsgPreview(conv)
                return (
                  <button
                    key={conv.id}
                    onClick={() => { setActiveId(conv.id); markAsRead(conv.id) }}
                    style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', padding: '0.875rem 1.125rem', display: 'flex', gap: '0.875rem', alignItems: 'center', background: isActive ? 'var(--bg-sage)' : 'transparent', borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: other?.role === 'psychologist' ? 'var(--primary)' : 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: other?.role === 'psychologist' ? 'white' : 'var(--text-muted)' }}>
                        {other ? getInitial(other) : <User size={14} />}
                      </div>
                      {isUnread && (
                        <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', border: '2px solid white' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: isUnread ? 700 : 600, fontSize: '0.85rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '9rem' }}>{title}</span>
                        {conv.lastMessage && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', flexShrink: 0, marginLeft: '0.25rem' }}>{timeLabel(conv.lastMessage.createdAt)}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: isUnread ? 'var(--text)' : 'var(--text-light)', fontWeight: isUnread ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.1rem' }}>
                        {preview}
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
                const seen = lastSeenLabel(other?.lastSeenAt)
                return (
                  <>
                    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {other ? getInitial(other) : 'М'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{ConvTitle(activeConv, userId)}</div>
                      {seen && <div style={{ fontSize: '0.7rem', color: seen === 'В сети' ? '#059669' : 'var(--text-muted)' }}>{seen}</div>}
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Messages */}
            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', minHeight: 0 }}>
              {msgLoading && messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.8rem', padding: '2rem' }}>Загрузка…</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Напишите первое сообщение</div>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender.id === userId
                  const isHovered = hoveredMsgId === msg.id
                  const fileData = parseFileMsg(msg.text)
                  const replyData = parseReply(msg.text)

                  return (
                    <div
                      key={msg.id}
                      style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.375rem' }}
                      onMouseEnter={() => setHoveredMsgId(msg.id)}
                      onMouseLeave={() => setHoveredMsgId(null)}
                    >
                      {/* Action buttons on hover */}
                      <div style={{ display: 'flex', flexDirection: isMe ? 'row' : 'row-reverse', gap: '0.25rem', alignItems: 'center', visibility: isHovered ? 'visible' : 'hidden' }}>
                        <button
                          onClick={() => {
                            const preview = (replyData?.body ?? msg.text).replace(/^\[FILE\][^\n]*/,'📎 Файл').slice(0, 50)
                            setReplyTarget({ id: msg.id, senderName: msg.sender.name ?? msg.sender.email, preview })
                            inputRef.current?.focus()
                          }}
                          title="Ответить"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0.25rem', display: 'flex' }}
                        >
                          <Reply size={13} />
                        </button>
                        {isMe && (
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            title="Удалить"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0.25rem', display: 'flex' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#B91C1C' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-light)' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div style={{ maxWidth: '68%' }}>
                        {!isMe && (
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginBottom: '0.2rem', fontWeight: 600 }}>
                            {msg.sender.name ?? msg.sender.email}
                          </div>
                        )}
                        <div style={{
                          padding: fileData ? '0.5rem' : '0.75rem 1.1rem',
                          borderRadius: isMe ? '1.25rem 1.25rem 0.35rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.35rem',
                          background: isMe ? 'var(--primary)' : 'var(--bg-soft)',
                          color: isMe ? 'white' : 'var(--text)',
                          fontSize: '0.9rem', lineHeight: 1.6,
                        }}>
                          {/* Reply quote */}
                          {replyData && (
                            <div style={{ borderLeft: `2px solid ${isMe ? 'rgba(255,255,255,0.4)' : 'var(--primary)'}`, paddingLeft: '0.5rem', marginBottom: '0.5rem', opacity: 0.8 }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isMe ? 'rgba(255,255,255,0.8)' : 'var(--primary)' }}>{replyData.senderName}</div>
                              <div style={{ fontSize: '0.75rem', color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{replyData.preview}</div>
                            </div>
                          )}
                          {/* Content */}
                          {fileData
                            ? <FileCard url={fileData.url} name={fileData.name} size={fileData.size} isMe={isMe} />
                            : <span style={{ whiteSpace: 'pre-wrap' }}>{replyData ? replyData.body : msg.text}</span>
                          }
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '0.2rem', textAlign: isMe ? 'right' : 'left', display: 'flex', alignItems: 'center', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '0.25rem' }}>
                          {timeLabel(msg.createdAt)}
                          {isMe && <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>✓✓</span>}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Reply bar */}
            {replyTarget && (
              <div style={{ padding: '0.625rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--bg-sage)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <Reply size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>{replyTarget.senderName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{replyTarget.preview}</div>
                </div>
                <button onClick={() => setReplyTarget(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', display: 'flex', flexShrink: 0 }}>
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '0.875rem 1.25rem', borderTop: replyTarget ? 'none' : '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
              {/* File attach */}
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept="image/*,.pdf,.doc,.docx,.xlsx,.xls,.txt,.zip" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = '' }} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Прикрепить файл"
                style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', border: 'none', background: 'var(--bg-soft)', color: uploading ? 'var(--border)' : 'var(--text-muted)', cursor: uploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                {uploading ? <span style={{ fontSize: '0.7rem' }}>…</span> : <Paperclip size={15} />}
              </button>
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                placeholder={replyTarget ? `Ответ для ${replyTarget.senderName}…` : 'Написать сообщение…'}
                disabled={sending || uploading}
                style={{ flex: 1, padding: '0.625rem 1rem', borderRadius: '1.125rem', border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none' }}
              />
              <button
                onClick={() => send()}
                disabled={!text.trim() || sending}
                style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: 'none', background: text.trim() && !sending ? 'var(--primary)' : 'var(--border)', cursor: text.trim() && !sending ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
              >
                <Send size={15} style={{ color: 'white' }} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
            <MessageCircle size={40} style={{ color: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>Выберите переписку</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>или начните новую, нажав +</div>
            </div>
          </div>
        )}

        {/* ── Picker modal ── */}
        {showPicker && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9100, background: 'rgba(28,43,35,0.55)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={e => { if (e.target === e.currentTarget) setShowPicker(false) }}>
            <div style={{ background: 'var(--card)', borderRadius: '1.25rem', padding: '1.75rem', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>{pickerTitle}</h3>
                <button onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}><X size={18} /></button>
              </div>
              {specsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Загрузка…</div>
              ) : specialists.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Не найдено</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {specialists.map(s => {
                    const roleLabel = s.role === 'psychologist' ? 'Психолог' : s.role === 'curator' ? 'Куратор' : 'Участник'
                    return (
                      <button key={s.id} onClick={() => startChatWith(s.id, s.name ?? s.email)} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', borderRadius: '0.875rem', border: '1.5px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-light)' }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                          {getInitial(s)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.15rem' }}>{s.name ?? s.email.split('@')[0]}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{roleLabel}</div>
                          {s.speciality && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{s.speciality}</div>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
