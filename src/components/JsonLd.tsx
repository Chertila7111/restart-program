export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Снова с собой',
    url: 'https://snova-s-soboy.ru',
    logo: 'https://snova-s-soboy.ru/logo-icon.png',
    description:
      'Программа восстановления и нового старта после расставания. Психолог, группа поддержки и практический план.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@snova-s-soboy.ru',
      contactType: 'customer service',
      availableLanguage: 'Russian',
    },
    sameAs: ['https://t.me/snova_s_soboy'],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Снова с собой — восстановление после расставания',
    serviceType: 'Психологическое консультирование',
    provider: {
      '@type': 'Organization',
      name: 'Снова с собой',
      url: 'https://snova-s-soboy.ru',
    },
    description:
      '4-недельная онлайн-программа с психологом, группой поддержки, заданиями и карьерным треком для людей, переживающих расставание.',
    offers: [
      { '@type': 'Offer', name: 'Base', price: '14990', priceCurrency: 'RUB' },
      { '@type': 'Offer', name: 'Plus', price: '19990', priceCurrency: 'RUB' },
      { '@type': 'Offer', name: 'Plus Pro', price: '24990', priceCurrency: 'RUB' },
      { '@type': 'Offer', name: 'Карьерный трек', price: '29990', priceCurrency: 'RUB' },
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
      name: 'Снова с собой',
      url: 'https://snova-s-soboy.ru',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Снова с собой',
      url: 'https://snova-s-soboy.ru',
      logo: { '@type': 'ImageObject', url: 'https://snova-s-soboy.ru/logo-icon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://snova-s-soboy.ru/blog/${slug}` },
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
      item: `https://snova-s-soboy.ru${item.href}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
