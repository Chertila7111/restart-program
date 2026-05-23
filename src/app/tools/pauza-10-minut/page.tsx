import type { Metadata } from 'next'
import { PauzaTool } from './PauzaTool'

export const metadata: Metadata = {
  title: 'Пауза 10 минут — хочется написать бывшему? | Снова с собой',
  description: 'Интерактивный таймер: 10-минутная пауза перед тем как написать бывшему. Три вопроса, которые помогут понять, что вам на самом деле нужно.',
  keywords: ['хочется написать бывшему', 'пауза перед тем как написать', 'как удержаться от звонка бывшему'],
}

export default function PauzaPage() {
  return <PauzaTool />
}
