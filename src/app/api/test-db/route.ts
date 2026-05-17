import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const info: Record<string, unknown> = {
    time: new Date().toISOString(),
    node: process.version,
    env: process.env.NODE_ENV,
    dbUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 30) + '...' : 'not set',
  }

  try {
    const count = await (prisma as any).user.count()
    info.db = 'ok'
    info.userCount = count
  } catch (err: any) {
    info.db = 'error'
    info.dbError = String(err?.message ?? err)
  }

  return NextResponse.json(info)
}
