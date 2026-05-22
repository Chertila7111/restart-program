import type { Metadata } from 'next'
import { ChtodelatTool } from './ChtodelatTool'

export const metadata: Metadata = {
  title: 'Что делать сегодня после расставания | Снова с собой',
  description: 'Не знаете, с чего начать день после расставания? Генератор маленьких действий: три конкретных шага на сегодня — для тела, ума и связи с людьми.',
  keywords: ['что делать после расставания', 'как пережить день после разрыва', 'маленькие шаги после расставания'],
}

export default function ChtodelatPage() {
  return <ChtodelatTool />
}
