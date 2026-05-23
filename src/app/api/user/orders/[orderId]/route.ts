import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string
  const { orderId } = await params

  try {
    await ensureDb()
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order || order.userId !== userId) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }
    return NextResponse.json({
      id: order.id,
      product: (order as any).product,
      productName: (order as any).productName,
      amount: (order as any).amount,
      status: (order as any).status,
    })
  } catch {
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
