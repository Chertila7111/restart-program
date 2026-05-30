import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SpecialistMonthCalendar } from './SpecialistMonthCalendar'

export default async function SpecialistCalendarPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')
  const specialistId = (session.user as any).id as string
  return <SpecialistMonthCalendar specialistId={specialistId} />
}
