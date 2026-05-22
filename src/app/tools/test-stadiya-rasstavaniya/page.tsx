import type { Metadata } from 'next'
import { TestTool } from './TestTool'

export const metadata: Metadata = {
  title: 'Тест: на какой стадии после расставания вы сейчас | Снова с собой',
  description: '5 вопросов — и вы поймёте, на какой стадии восстановления находитесь. Острый период, адаптация, восстановление или движение вперёд — у каждой стадии свои рекомендации.',
  keywords: ['тест стадии расставания', 'на какой стадии после расставания', 'как понять что восстанавливаешься после разрыва'],
}

export default function TestPage() {
  return <TestTool />
}
