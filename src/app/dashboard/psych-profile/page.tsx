import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { PsychProfileForm } from './PsychProfileForm'

export default async function PsychProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const sessionRole = (session.user as any).role as string | undefined
  if (sessionRole !== 'psychologist' && sessionRole !== 'admin') redirect('/dashboard')

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Мой профиль</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Информация, которую видят участники программы</p>
      <PsychProfileForm
        initialName={session.user.name ?? ''}
        initialEmail={session.user.email!}
        initialProfile={null}
      />
    </div>
  )
}
