import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardShell, type Tier } from '@/components/dashboard/DashboardShell'

function getUserTier(role: string, orders: { product: string; status: string }[]): Tier {
  if (role === 'admin' || role === 'psychologist') return 'personal'
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

  // Psychologists have their own portal
  const sessionRole = (session.user as any).role as string | undefined
  if (sessionRole === 'psychologist') redirect('/specialist')

  // Admin via env vars — no DB needed
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
  } catch (err) { console.error('[layout] DB error:', err) }

  // DB unavailable or demo user not seeded — fall back to session data
  if (!user) {
    const role = sessionRole ?? 'user'
    const sessionTier = (session.user as any).tier as string | undefined
    // If tier is in JWT (demo accounts), use it; otherwise default to 'intro'
    // so users who paid and have creds never see the fully locked state
    const tier = (sessionTier as Tier | undefined) ?? (role === 'user' ? 'intro' : getUserTier(role, []))
    return (
      <DashboardShell
        user={{ name: session.user.name ?? null, email: session.user.email! }}
        tier={tier}
        role={role}
      >
        {children}
      </DashboardShell>
    )
  }

  const dbTier = getUserTier(user.role, user.orders)
  const sessionTier = (session.user as any).tier as string | undefined
  // If DB has no paid orders (e.g. Vercel cold-start seed race), fall back to JWT tier
  // For regular users without either, default to 'intro' — they can only have creds if they paid
  const tier: Tier = dbTier !== 'none'
    ? dbTier
    : (sessionTier as Tier | undefined) ?? (user.role === 'user' ? 'intro' : 'none')
  const role = user.role

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
