import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  if (!userId) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

  try {
    await ensureDb()

    // Hard delete in order: child tables first, then User
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "JournalEntry" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "TaskCompletion" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "GroupParticipant" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Booking" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "PushSubscription" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "ConversationMember" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "SpecialistNote" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Recommendation" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Notification" WHERE userId = ?`, userId)
    // Anonymise consent records — keep proof of consent even after account deletion (GDPR art. 17.3b)
    await (prisma as any).$executeRawUnsafe(
      `UPDATE "ConsentLog" SET userId = 'deleted:' || substr(id, 1, 12) WHERE userId = ?`,
      userId,
    )
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "UserProfile" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Account" WHERE userId = ?`, userId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Session" WHERE userId = ?`, userId)
    // Anonymise orders (keep for accounting, strip personal data)
    await (prisma as any).$executeRawUnsafe(
      `UPDATE "Order" SET email = 'deleted@deleted', name = 'Удалён', phone = NULL WHERE userId = ?`,
      userId,
    )
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "User" WHERE id = ?`, userId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('delete-account error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
