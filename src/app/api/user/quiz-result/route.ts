import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { sendQuizResultEmail } from '@/lib/mailer'
import { BLOG_POSTS } from '@/lib/blog'

const ARTICLES_BY_CATEGORY: Record<string, string[]> = {
  thoughts: ['kak-ne-napisat-byvshemu', 'kak-ne-budit-nadezhdu-na-vozvrat', 'emotsionalnaya-zavisimost-v-otnosheniyakh'],
  anxiety:  ['trevoga-posle-rasstavaniya', 'pustota-posle-rasstavaniya', 'pochemu-tak-bolno-posle-rasstavaniya'],
  future:   ['kak-perezhit-rasstavanie', 'samoocenka-posle-rasstavaniya', 'kak-nachat-novuyu-zhizn-posle-rasstavaniya'],
  work:     ['posle-rasstavaniya-ne-mogu-rabotat', 'kak-nachat-novuyu-zhizn-posle-rasstavaniya', 'kogda-obrashchatsya-k-psikhologu-posle-rasstavaniya'],
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let category: string, situation: string
  try {
    const body = await req.json()
    category = body.category
    situation = body.situation
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  if (!category || !situation) return NextResponse.json({ error: 'missing fields' }, { status: 400 })

  let userName = session.user.name ?? ''

  try {
    await ensureDb()
    await (prisma as any).user.update({
      where: { email: session.user.email },
      data: { quizCategory: category, quizSituation: situation },
    })
  } catch { /* DB unavailable — localStorage fallback is sufficient */ }

  // Send quiz result email (fire-and-forget — don't block response)
  const slugs = (situation === 'divorce'
    ? ['kak-perezhit-razvod', ...(ARTICLES_BY_CATEGORY[category] ?? ARTICLES_BY_CATEGORY.anxiety).slice(0, 2)]
    : ARTICLES_BY_CATEGORY[category] ?? ARTICLES_BY_CATEGORY.anxiety
  ).slice(0, 3)
  const articleTitles = slugs
    .map(s => BLOG_POSTS.find(p => p.slug === s)?.title)
    .filter(Boolean) as string[]

  sendQuizResultEmail({
    to: session.user.email,
    name: userName,
    category,
    situation,
    articleTitles,
  }).catch(() => { /* ignore email errors */ })

  return NextResponse.json({ ok: true })
}
