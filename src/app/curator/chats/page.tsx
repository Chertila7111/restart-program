import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ChatShell } from '@/app/dashboard/chats/ChatShell'

export default async function CuratorChatsPage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id as string
  const userName = session?.user?.name ?? ''

  return (
    <div style={{ height: 'calc(100vh - 2rem)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Чаты</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Переписка с участниками программы</p>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChatShell userId={userId} userName={userName} userRole="curator" />
      </div>
    </div>
  )
}
