import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import bcrypt from 'bcryptjs'

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
          if (credentials.password === adminPassword) {
            return { id: 'admin', email: emailLower, name: process.env.ADMIN_NAME || 'Администратор', role: 'admin' }
          }
          return null
        }

        // ── Demo/test accounts (hardcoded, always work) ──
        const demoAccounts: Record<string, { password: string; id: string; name: string; role: string }> = {
          'test@snova-s-soboy.ru':   { password: 'Test2026!',   id: 'test-user-anna',       name: 'Анна (тест)',     role: 'user' },
          'doctor@snova-s-soboy.ru': { password: 'Doctor2026!', id: 'doctor-maria-sokolova', name: 'Мария Соколова', role: 'psychologist' },
        }
        const demo = demoAccounts[emailLower]
        if (demo) {
          if (credentials.password !== demo.password) return null
          // Ensure DB is seeded so dashboard data loads
          try { await ensureDb() } catch { /* non-fatal */ }
          return { id: demo.id, email: emailLower, name: demo.name, role: demo.role }
        }

        // ── Regular users via DB ──
        try {
          await ensureDb()
          const user = await prisma.user.findUnique({ where: { email: emailLower } })
          if (!user || !user.passwordHash) return null
          const valid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!valid) return null
          return { id: user.id, email: user.email, name: user.name, role: user.role }
        } catch {
          // DB unavailable — only admin env-var login works
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
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
      }
      return session
    },
  },
}
