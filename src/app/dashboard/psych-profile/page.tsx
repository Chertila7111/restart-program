import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PsychProfileForm } from './PsychProfileForm'

export default async function PsychProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const sessionRole = (session.user as any).role as string | undefined
  if (sessionRole !== 'psychologist' && sessionRole !== 'admin') redirect('/dashboard')

  let profile: { speciality: string | null; approach: string | null; education: string | null; experience: string | null; bio: string | null } | null = null
  let userName = session.user.name ?? ''
  let userEmail = session.user.email!

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (user) {
      userName = user.name ?? ''
      userEmail = user.email
      const psych = await (prisma as any).psychologistProfile.findUnique({ where: { userId: user.id } })
      profile = psych ?? null
    }
  } catch { /* DB unavailable */ }

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Мой профиль</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Информация, которую видят участники программы</p>

      <PsychProfileForm
        initialName={userName}
        initialEmail={userEmail}
        initialProfile={profile}
      />
    </div>
  )
}
