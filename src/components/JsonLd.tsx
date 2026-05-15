export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Restart',
    url: 'https://restart-program.ru',
    logo: 'https://restart-program.ru/logo.png',
    description:
      'Программа восстановления и нового старта после расставания. Психолог, группа поддержки и практический план.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@restart-program.ru',
      contactType: 'customer service',
      availableLanguage: 'Russian',
    },
    sameAs: ['https://t.me/restart_support'],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Программа Restart — восстановление после расставания',
    serviceType: 'Психологическое консультирование',
    provider: {
      '@type': 'Organization',
      name: 'Restart',
      url: 'https://restart-program.ru',
    },
    description:
      '4-недельная онлайн-программа с психологом, группой поддержки, заданиями и карьерным треком для людей, переживающих расставание.',
    offers: [
      { '@type': 'Offer', name: 'Restart Base', price: '14990', priceCurrency: 'RUB' },
      { '@type': 'Offer', name: 'Restart Plus', price: '19990', priceCurrency: 'RUB' },
      { '@type': 'Offer', name: 'Restart Personal', price: '24990', priceCurrency: 'RUB' },
      { '@type': 'Offer', name: 'Career Restart', price: '29990', priceCurrency: 'RUB' },
    ],
    areaServed: { '@type': 'Country', name: 'Russia' },
    availableLanguage: 'Russian',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function FaqSchema({ items }: { items: Array<{ q: string; a: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ArticleSchema({
  title,
  description,
  publishedAt,
  slug,
}: {
  title: string
  description: string
  publishedAt: string
  slug: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Restart',
      url: 'https://restart-program.ru',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Restart',
      url: 'https://restart-program.ru',
      logo: { '@type': 'ImageObject', url: 'https://restart-program.ru/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://restart-program.ru/blog/${slug}` },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; href: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://restart-program.ru${item.href}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
