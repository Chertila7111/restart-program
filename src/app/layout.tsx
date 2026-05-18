import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import './globals.css'
import Providers from '@/components/Providers'
import SwRegister from '@/components/SwRegister'
import LayoutShell from '@/components/LayoutShell'
import CookieBanner from '@/components/CookieBanner'

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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    shortcut: '/icon-192.png',
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Снова с собой' },
  other: { 'mobile-web-app-capable': 'yes' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions).catch(() => null)

  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" sizes="192x192" />
        <meta name="theme-color" content="#4E7B5E" />
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=109291907','ym');
ym(109291907,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
        `}} />
        <noscript><div><img src="https://mc.yandex.ru/watch/109291907" style={{position:'absolute',left:'-9999px'}} alt="" /></div></noscript>
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers session={session}>
          <LayoutShell>{children}</LayoutShell>
          <CookieBanner />
        </Providers>
        <SwRegister />
      </body>
    </html>
  )
}
