import type { Metadata } from 'next'
import ContactsForm from './ContactsForm'

export const metadata: Metadata = {
  title: 'Контакты | Снова с собой',
  description: 'Напишите нам — ответим в течение нескольких часов. Email: hello@snova-s-soboy.ru, Telegram: @snova_s_soboy. Пн–Пт 10:00–19:00 МСК.',
  openGraph: {
    title: 'Контакты — Снова с собой',
    description: 'Если сомневаетесь, подходит ли программа — напишите. Ответим честно без давления.',
    url: 'https://snova-s-soboy.ru/contacts',
  },
  alternates: { canonical: 'https://snova-s-soboy.ru/contacts' },
}

export default function ContactsPage() {
  return <ContactsForm />
}
