import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminPanel } from './AdminPanel'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')
  const sessionRole = (session.user as any).role as string | undefined
  if (sessionRole !== 'admin') redirect('/dashboard')

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  let stats = {
    totalUsers: 0,
    clients: 0,
    psychologists: 0,
    curators: 0,
    newUsersWeek: 0,
    newUsersMonth: 0,
    activeUsersMonth: 0,
    journalEntriesTotal: 0,
    ordersPaid: 0,
    ordersPending: 0,
    ordersRefunded: 0,
    revenueTotal: 0,
    tierNone: 0,
    tierIntro: 0,
    tierBase: 0,
    tierPlus: 0,
    tierPersonal: 0,
    tierClarity: 0,
    tierOther: 0,
    revenueByProduct: [] as { product: string; productName: string; count: number; amount: number }[],
    recentOrders: [] as { id: string; name: string; email: string; productName: string; amount: number; createdAt: string }[],
    leads: 0,
  }

  let users: {
    id: string; name: string | null; email: string; role: string; tier: string
    createdAt: string; hasPaid: boolean; paidProducts: string[]
  }[] = []
  let leads: { id: string; name: string; email: string; phone: string | null; message: string | null; createdAt: string }[] = []

  try {
    const [totalUsers, psychologists, curators, newWeek, newMonth, journalTotal, leadsCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'psychologist' } }),
      prisma.user.count({ where: { role: 'curator' } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.journalEntry.count(),
      prisma.lead.count(),
    ])

    stats.totalUsers = totalUsers
    stats.psychologists = psychologists
    stats.curators = curators
    stats.clients = totalUsers - psychologists - curators
    stats.newUsersWeek = newWeek
    stats.newUsersMonth = newMonth
    stats.journalEntriesTotal = journalTotal
    stats.leads = leadsCount

    const [paidOrders, pendingOrders, refundedOrders, revenueResult, activeJournalUsers] = await Promise.all([
      prisma.order.count({ where: { status: 'paid' } }),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'refunded' } }),
      prisma.order.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
      prisma.journalEntry.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { userId: true },
        distinct: ['userId'],
      }),
    ])

    stats.ordersPaid = paidOrders
    stats.ordersPending = pendingOrders
    stats.ordersRefunded = refundedOrders
    stats.revenueTotal = revenueResult._sum.amount ?? 0
    stats.activeUsersMonth = activeJournalUsers.length

    const [revenueByProduct, allPaidOrders] = await Promise.all([
      prisma.order.groupBy({
        by: ['product'],
        where: { status: 'paid' },
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.order.findMany({
        where: { status: 'paid' },
        select: { userId: true, product: true, productName: true },
      }),
    ])

    const productNames: Record<string, string> = {}
    allPaidOrders.forEach((o: { product: string; productName: string; userId: string | null }) => { productNames[o.product] = o.productName })
    stats.revenueByProduct = revenueByProduct.map((r: { product: string; _count: { id: number }; _sum: { amount: number | null } }) => ({
      product: r.product,
      productName: productNames[r.product] || r.product,
      count: r._count.id,
      amount: r._sum.amount ?? 0,
    })).sort((a: { amount: number }, b: { amount: number }) => b.amount - a.amount)

    const TIER_PRIORITY = ['personal', 'plus', 'base', 'clarity-deep', 'clarity-start', 'session', 'career', 'intro']
    const userTiers: Record<string, string> = {}
    allPaidOrders.forEach((o: { userId: string | null; product: string; productName: string }) => {
      if (!o.userId) return
      const cur = userTiers[o.userId]
      if (!cur || TIER_PRIORITY.indexOf(o.product) < TIER_PRIORITY.indexOf(cur)) {
        userTiers[o.userId] = o.product
      }
    })
    const tc: Record<string, number> = {}
    Object.values(userTiers).forEach(t => { tc[t] = (tc[t] || 0) + 1 })
    stats.tierIntro = tc['intro'] ?? 0
    stats.tierBase = tc['base'] ?? 0
    stats.tierPlus = tc['plus'] ?? 0
    stats.tierPersonal = tc['personal'] ?? 0
    stats.tierClarity = (tc['clarity-start'] ?? 0) + (tc['clarity-deep'] ?? 0)
    stats.tierOther = (tc['session'] ?? 0) + (tc['career'] ?? 0)
    stats.tierNone = stats.clients - Object.keys(userTiers).length

    const recentOrders = await prisma.order.findMany({
      where: { status: 'paid' },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, name: true, email: true, productName: true, amount: true, createdAt: true },
    })
    stats.recentOrders = recentOrders.map((o: { id: string; name: string; email: string; productName: string; amount: number; createdAt: Date }) => ({ ...o, createdAt: o.createdAt.toISOString() }))

    const rawUsers = await prisma.user.findMany({
      include: { orders: { where: { status: 'paid' }, select: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    users = rawUsers.map((u: { id: string; name: string | null; email: string; role: string; tier: string; createdAt: Date; orders: { product: string }[] }) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      tier: u.tier,
      createdAt: u.createdAt.toISOString(),
      hasPaid: u.orders.length > 0,
      paidProducts: u.orders.map((o: { product: string }) => o.product),
    }))

    const rawLeads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    leads = rawLeads.map((l: { id: string; name: string; email: string; phone: string | null; message: string | null; createdAt: Date }) => ({ ...l, createdAt: l.createdAt.toISOString() }))

  } catch { /* DB unavailable */ }

  return <AdminPanel stats={stats} users={users} leads={leads} />
}
