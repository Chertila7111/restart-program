import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { CuratorShell } from '@/components/curator/CuratorShell'

export default async function CuratorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login?callbackUrl=/curator')

  const role = (session.user as any).role as string | undefined
  if (role !== 'curator' && role !== 'admin') redirect('/dashboard')

  return (
    <CuratorShell user={{ name: session.user.name ?? null, email: session.user.email! }}>
      {children}
    </CuratorShell>
  )
}
