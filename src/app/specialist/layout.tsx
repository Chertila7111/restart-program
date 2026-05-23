import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SpecialistShell } from '@/components/specialist/SpecialistShell'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function SpecialistLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login?callbackUrl=/specialist')

  const role = (session.user as any).role as string | undefined
  if (role !== 'psychologist' && role !== 'admin') redirect('/dashboard')

  return (
    <SpecialistShell user={{ name: session.user.name ?? null, email: session.user.email! }}>
      {children}
    </SpecialistShell>
  )
}
