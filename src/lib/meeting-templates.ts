export type MeetingTemplate = {
  type: string
  label: string
  title: string
  description: string
  duration: string
  targetTiers: string[]
  icon: string
}

export const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    type: 'intro',
    label: 'Вводная встреча',
    icon: '🌱',
    title: 'Вводная встреча',
    description: '90 минут в небольшой группе с психологом. Разбираем, что происходит и почему так больно. Можно просто слушать — не нужно рассказывать о себе.',
    duration: '90 мин',
    targetTiers: ['intro', 'base', 'plus', 'personal'],
  },
  {
    type: 'week1',
    label: '1 встреча — Стабилизация',
    icon: '1️⃣',
    title: 'Что происходит и почему так больно',
    description: 'Разбираем механизм боли после расставания. Почему мозг реагирует на потерю отношений как на физическую боль, и что с этим делать прямо сейчас.',
    duration: '90 мин',
    targetTiers: ['base', 'plus', 'personal'],
  },
  {
    type: 'week2',
    label: '2 встреча — Принятие',
    icon: '2️⃣',
    title: 'Принятие: как отпустить, не предавая себя',
    description: 'Учимся отличать «отпустить» от «забыть». Работаем с чувством вины, злостью и тоской — они нормальны и имеют смысл.',
    duration: '90 мин',
    targetTiers: ['base', 'plus', 'personal'],
  },
  {
    type: 'week3',
    label: '3 встреча — Восстановление',
    icon: '3️⃣',
    title: 'Восстановление: возвращаем себе себя',
    description: 'Как перестать определять себя через отношения. Практики для восстановления самооценки и нахождения смысла в этом периоде.',
    duration: '90 мин',
    targetTiers: ['base', 'plus', 'personal'],
  },
  {
    type: 'week4',
    label: '4 встреча — Новое начало',
    icon: '4️⃣',
    title: 'Новое начало без страха',
    description: 'Подводим итоги. Строим план на следующий месяц — не «найти кого-то», а прожить жизнь, которую хочется прожить.',
    duration: '90 мин',
    targetTiers: ['base', 'plus', 'personal'],
  },
  {
    type: 'custom',
    label: 'Своя встреча',
    icon: '✏️',
    title: '',
    description: '',
    duration: '60 мин',
    targetTiers: ['intro', 'base', 'plus', 'personal'],
  },
]
