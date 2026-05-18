import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Снова с собой — восстановление после расставания',
    template: '%s | Снова с собой',
  },
  description:
    'Программа восстановления после расставания «Снова с собой». Психолог, группа поддержки, задания и карьерный трек.',
  keywords: [
    'как пережить расставание',
    'после расставания',
    'группа поддержки',
    'психолог онлайн',
    'восстановление после разрыва',
    'снова с собой программа',
  ],
  authors: [{ name: 'Снова с собой' }],
  creator: 'Снова с собой',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://snova-s-soboy.ru'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://snova-s-soboy.ru',
    siteName: 'Снова с собой',
    title: 'Снова с собой — восстановление после расставания',
    description:
      'Программа восстановления после расставания. Психолог, группа поддержки и практический план.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          {!isDashboard && <Header />}
          <main className={`flex-1${isDashboard ? '' : ' pt-16'}`}>{children}</main>
          {!isDashboard && <Footer />}
        </Providers>
      </body>
    </html>
  )
}
