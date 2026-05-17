import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ChatShell } from './ChatShell'

export default async function ChatsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const userId = (session.user as any).id as string
  const userName = session.user?.name ?? session.user?.email ?? 'Вы'
  const userRole = (session.user as any).role as string

  return (
    <div style={{ maxWidth: '56rem', height: 'calc(100vh - 7rem)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem', flexShrink: 0 }}>Сообщения</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flexShrink: 0 }}>Переписка с психологом и другими участниками</p>
      <ChatShell userId={userId} userName={userName} userRole={userRole} />
    </div>
  )
}
