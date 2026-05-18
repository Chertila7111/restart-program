import type { Metadata } from 'next'
import FaqContent from './FaqContent'

export const metadata: Metadata = {
  title: 'Частые вопросы | Снова с собой',
  description: 'Ответы на вопросы о программе «Снова с собой»: формат, безопасность, оплата, возврат, карьерный трек. Если не нашли ответ — напишите нам.',
  openGraph: {
    title: 'Частые вопросы — Снова с собой',
    description: 'Всё о программе восстановления после расставания: формат, психолог, группа, оплата.',
    url: 'https://snova-s-soboy.ru/faq',
  },
  alternates: { canonical: 'https://snova-s-soboy.ru/faq' },
}

export default function FaqPage() {
  return <FaqContent />
}
