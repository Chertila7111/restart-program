import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

const FULL_PROGRAM_IDS = ['base', 'plus', 'plus-pro', 'personal', 'personal-start', 'personal-balance', 'personal-deep']

export async function GET() {
  const session = await getServerSession(authOptions).catch(() => null)
  const userId = (session?.user as any)?.id as string | undefined

  if (!userId) return NextResponse.json({ hasIntro: false })

  try {
    await ensureDb()
    const orders = await prisma.order.findMany({
      where: { userId, status: { in: ['paid', 'paid_email_failed'] } },
      select: { product: true },
    })
    const hasPaidIntro = orders.some((o: { product: string }) => o.product === 'intro')
    const hasPaidFull  = orders.some((o: { product: string }) => FULL_PROGRAM_IDS.includes(o.product))
    return NextResponse.json({ hasIntro: hasPaidIntro && !hasPaidFull })
  } catch {
    const tier = (session?.user as any)?.tier as string | undefined
    return NextResponse.json({ hasIntro: tier === 'intro' })
  }
}
