export type Product = {
  id: string
  name: string
  price: number
  oldPrice?: number
  description: string
  features: string[]
  highlight?: boolean
  badge?: string
  color?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'intro',
    name: 'Вводная встреча',
    price: 1490,
    description: '90 минут с психологом — разбор вашей ситуации и первые шаги',
    features: [
      '90 минут 1 на 1 с психологом',
      'Анализ вашего состояния',
      'Первые конкретные шаги',
      'Рекомендации по программе',
    ],
    color: 'from-violet-400 to-violet-600',
  },
  {
    id: 'base',
    name: 'Restart Base',
    price: 14990,
    description: '4-недельная групповая программа с психологом и поддержкой',
    features: [
      '4 групповых встречи по 90 минут',
      'Закрытый чат поддержки 24/7',
      'Задания и дневник состояния',
      'Группа до 12 человек',
      'Запись всех встреч',
    ],
    color: 'from-violet-500 to-pink-500',
  },
  {
    id: 'plus',
    name: 'Restart Plus',
    price: 19990,
    description: 'Base + личная диагностика и план восстановления',
    features: [
      'Всё из Restart Base',
      'Личная диагностика состояния',
      'Индивидуальный план восстановления',
      'Приоритет в чате поддержки',
      'Доступ к материалам навсегда',
    ],
    highlight: true,
    badge: 'Популярный',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'personal',
    name: 'Restart Personal',
    price: 24990,
    description: 'Plus + индивидуальная сессия с психологом',
    features: [
      'Всё из Restart Plus',
      '1 индивидуальная сессия (60 мин)',
      'Разбор вашей конкретной ситуации',
      'Личные рекомендации',
      'Связь с психологом между встречами',
    ],
    color: 'from-rose-500 to-orange-500',
  },
  {
    id: 'career',
    name: 'Career Restart',
    price: 29990,
    description: 'Полный карьерный трек: работа, обучение, самостоятельность',
    features: [
      'Помощь с выбором направления',
      'Составление резюме',
      'Отклики на вакансии',
      'Подготовка к собеседованиям',
      'Поддержка в поиске работы',
      'Скидка 50% для участников Restart',
    ],
    badge: 'Карьерный трек',
    color: 'from-amber-500 to-orange-500',
  },
]

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
