import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { PROGRAM_MEETINGS } from '@/lib/dashboard-data'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:support@snova-s-soboy.ru',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// Called by Vercel Cron (hourly) or admin with Bearer token.
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const secret = process.env.NEXTAUTH_SECRET
  const cronSecret = process.env.CRON_SECRET
  const isVercelCron = req.headers.get('x-vercel-cron') === '1'

  const authorized =
    isVercelCron ||
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (secret && authHeader === `Bearer ${secret}`)

  if (!authorized) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await ensureDb()

  // Cron runs daily at 08:00 UTC (11:00 MSK). Find any meeting happening today.
  const now = new Date()
  const todayMsk = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }))
  const todayStr = `${todayMsk.getFullYear()}-${String(todayMsk.getMonth() + 1).padStart(2, '0')}-${String(todayMsk.getDate()).padStart(2, '0')}`

  const todayMeetings = PROGRAM_MEETINGS.filter(m => m.date === todayStr)
  if (todayMeetings.length === 0) {
    return NextResponse.json({ sent: 0, reason: 'no meetings today' })
  }

  const reminders = todayMeetings.map(m => ({
    title: 'Встреча сегодня!',
    body: `«${m.title}» — сегодня в ${m.time} МСК (${m.duration})`,
    tag: `meeting-today-${m.date}`,
  }))

  const subs = (await (prisma as any).$queryRawUnsafe(
    `SELECT endpoint, p256dh, auth FROM "PushSubscription"`
  )) as { endpoint: string; p256dh: string; auth: string }[]

  let sent = 0
  let failed = 0

  for (const reminder of reminders) {
    const payload = JSON.stringify({
      title: reminder.title,
      body: reminder.body,
      tag: reminder.tag,
      url: '/dashboard/meeting',
    })

    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        sent++
      } catch {
        failed++
      }
    }
  }

  return NextResponse.json({ sent, failed })
}
