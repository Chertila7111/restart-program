import { MOCK_CHAT_MESSAGES } from '@/lib/dashboard-data'
import { ChatUI } from './ChatUI'

export default function ChatsPage() {
  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Чаты</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Куратор отвечает в рабочее время (пн–пт, 10:00–19:00 МСК)</p>
      <ChatUI messages={MOCK_CHAT_MESSAGES} />
    </div>
  )
}
