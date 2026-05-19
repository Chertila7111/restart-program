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

// Hardcoded tiers for demo/test accounts — highest priority, bypasses JWT and DB
const DEMO_EMAIL_TIERS: Record<string, Tier> = {
  'test@snova-s-soboy.ru':   'intro',
  'doctor@snova-s-soboy.ru': 'personal',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login?callbackUrl=/dashboard')

  // Specialists and curators have their own portals
  const sessionRole = (session.user as any).role as string | undefined
  if (sessionRole === 'psychologist') redirect('/specialist')
  if (sessionRole === 'curator') redirect('/curator')

  // Hardcoded tier for demo accounts — bypasses JWT cookie state and DB seed state
  const emailKey = session.user.email.toLowerCase()
  const hardcodedTier = DEMO_EMAIL_TIERS[emailKey]

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
    const tier = hardcodedTier ?? (sessionTier as Tier | undefined) ?? (role === 'user' ? 'intro' : getUserTier(role, []))
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
  const tier: Tier = hardcodedTier ?? (dbTier !== 'none'
    ? dbTier
    : (sessionTier as Tier | undefined) ?? (user.role === 'user' ? 'intro' : 'none'))
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
