import type { Metadata } from 'next'
import { DnevnikTool } from './DnevnikTool'

export const metadata: Metadata = {
  title: 'Дневник состояния после расставания | Снова с собой',
  description: 'Отслеживайте своё состояние каждый день: настроение, тревогу, желание написать бывшему, энергию. Видите динамику за неделю — и понимаете, что становится лучше.',
  keywords: ['дневник состояния после расставания', 'отслеживать восстановление расставание', 'трекер настроения после разрыва'],
}

export default function DnevnikPage() {
  return <DnevnikTool />
}
