import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Restart — восстановление после расставания',
    template: '%s | Restart',
  },
  description:
    'Программа восстановления и нового старта после расставания. Психолог, группа поддержки, задания и карьерный трек.',
  keywords: [
    'как пережить расставание',
    'после расставания',
    'группа поддержки',
    'психолог онлайн',
    'восстановление после разрыва',
    'restart программа',
  ],
  authors: [{ name: 'Restart' }],
  creator: 'Restart',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://restart-program.ru'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://restart-program.ru',
    siteName: 'Restart',
    title: 'Restart — восстановление после расставания',
    description:
      'Программа восстановления и нового старта после расставания. Психолог, группа поддержки и практический план.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
