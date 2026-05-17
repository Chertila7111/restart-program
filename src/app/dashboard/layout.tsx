import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardShell, type Tier } from '@/components/dashboard/DashboardShell'

function getUserTier(role: string, orders: { product: string; status: string }[]): Tier {
  if (role === 'admin') return 'personal'
  const paid = orders.filter(o => o.status === 'paid').map(o => o.product)
  if (paid.includes('personal')) return 'personal'
  if (paid.includes('plus')) return 'plus'
  if (paid.includes('base')) return 'base'
  if (paid.includes('intro')) return 'intro'
  return 'none'
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login?callbackUrl=/dashboard')

  // Admin via env vars — no DB needed
  const sessionRole = (session.user as any).role as string | undefined
  if (sessionRole === 'admin') {
    return (
      <DashboardShell
        user={{ name: session.user.name ?? null, email: session.user.email! }}
        tier="personal"
        role="admin"
      >
        {children}
      </DashboardShell>
    )
  }

  let user: { name: string | null; email: string; role: string; orders: { product: string; status: string }[] } | null = null
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { orders: true },
    })
  } catch { /* DB unavailable */ }

  if (!user) redirect('/auth/login')

  const tier = getUserTier(user.role, user.orders)
  const role = user.role // 'user' | 'psychologist' | 'admin'

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email }}
      tier={tier}
      role={role}
    >
      {children}
    </DashboardShell>
  )
}
