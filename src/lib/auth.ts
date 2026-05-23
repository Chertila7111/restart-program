import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import bcrypt from 'bcryptjs'
import { timingSafeEqual, createHash } from 'crypto'

function safeCompare(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export const authOptions: NextAuthOptions = {
  // PrismaAdapter removed — JWT strategy doesn't need it, and it crashes when DB is unavailable
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const emailLower = credentials.email.toLowerCase().trim()

        // ── Admin via environment variables (works without DB) ──
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()
        const adminPassword = process.env.ADMIN_PASSWORD
        if (adminEmail && adminPassword && emailLower === adminEmail) {
          if (safeCompare(credentials.password, adminPassword)) {
            return { id: 'admin', email: emailLower, name: process.env.ADMIN_NAME || 'Администратор', role: 'admin' }
          }
          return null
        }

        // ── Demo/test accounts (only in dev or when ENABLE_DEMO=true) ──
        if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEMO === 'true') {
          const demoAccounts: Record<string, { password: string; id: string; name: string; role: string; tier: string }> = {
            'test@snova-s-soboy.ru':    { password: 'Test2026!',    id: 'test-user-anna',        name: 'Анна (тест)',      role: 'user',         tier: 'intro' },
            'doctor@snova-s-soboy.ru':  { password: 'Doctor2026!',  id: 'doctor-maria-sokolova', name: 'Мария Соколова',  role: 'psychologist', tier: 'personal' },
            'curator@snova-s-soboy.ru': { password: 'Curator2026!', id: 'curator-elena-demo',    name: 'Елена Куратор',   role: 'curator',      tier: 'personal' },
          }
          const demo = demoAccounts[emailLower]
          if (demo) {
            if (credentials.password !== demo.password) return null
            try { await ensureDb() } catch { /* non-fatal */ }
            return { id: demo.id, email: emailLower, name: demo.name, role: demo.role, tier: demo.tier }
          }
        }

        // ── Regular users via DB ──
        try {
          await ensureDb()
          const user = await prisma.user.findUnique({ where: { email: emailLower } })
          if (!user || !user.passwordHash) return null
          const valid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!valid) return null
          return { id: user.id, email: user.email, name: user.name, role: user.role, tier: (user as any).tier ?? 'none' }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        if ((user as any).tier) token.tier = (user as any).tier
      }
      // Backfill tier from DB for sessions that pre-date the tier field
      if (!token.tier && token.id) {
        try {
          const rows = await (prisma as any).$queryRawUnsafe(
            `SELECT tier FROM "User" WHERE id = ? LIMIT 1`, token.id
          ) as { tier: string }[]
          if (rows[0]?.tier) token.tier = rows[0].tier
        } catch {}
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
        if (token.tier) (session.user as any).tier = token.tier as string
      }
      return session
    },
  },
}
