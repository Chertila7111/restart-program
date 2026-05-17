import Link from 'next/link'
import { LighthouseIcon } from './LighthouseIcon'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: '#1C2B23', color: '#A8B8A0' }}>
      <div style={{ height: '5px', background: 'linear-gradient(to right, transparent, #C28A5E 20%, #C28A5E 80%, transparent)' }} />
      <div className="container mx-auto px-6" style={{ paddingTop: '4.5rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))', gap: '2.5rem' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '0.6rem',
                background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LighthouseIcon size={22} color="white" />
              </div>
              <span style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>Restart</span>
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#8A9E88', maxWidth: '18rem' }}>
              Бережная программа восстановления после расставания. Психолог, небольшая группа, понятный маршрут.
            </p>
          </div>

          {/* Программа */}
          <div>
            <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Программа</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/program', label: 'О программе' },
                { href: '/pricing', label: 'Тарифы' },
                { href: '/reviews', label: 'Отзывы' },
                { href: '/faq', label: 'FAQ' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: '0.875rem', color: '#8A9E88', textDecoration: 'none', transition: 'color 0.2s' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Полезное */}
          <div>
            <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Материалы</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/blog', label: 'Блог' },
                { href: '/blog/kak-perezhit-rasstoanie-7-shagov', label: 'Как пережить расставание' },
                { href: '/blog/kak-zabyt-byvshego-rukovodstvo', label: 'Как перестать думать о бывшем' },
                { href: '/contacts', label: 'Контакты' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: '0.875rem', color: '#8A9E88', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Юридическое */}
          <div>
            <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Документы</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/legal/privacy', label: 'Политика конфиденциальности' },
                { href: '/legal/terms', label: 'Пользовательское соглашение' },
                { href: '/legal/offer', label: 'Публичная оферта' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: '0.875rem', color: '#8A9E88', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1.5rem' }}>
              <a
                href="mailto:hello@restart-program.ru"
                style={{ fontSize: '0.875rem', color: '#8A9E88', textDecoration: 'none' }}
              >
                hello@restart-program.ru
              </a>
              <p style={{ fontSize: '0.75rem', color: '#5A6E58', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Юридические реквизиты будут опубликованы при запуске сервиса
              </p>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #2E3F2C',
          marginTop: '3rem',
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.875rem', color: '#5A6E58' }}>
            © {currentYear} Restart. Все права защищены.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#4A5E48', maxWidth: '44rem', lineHeight: 1.7 }}>
            Программа не является медицинской услугой и не заменяет психотерапию или медицинскую помощь. Если вам нужна кризисная или медицинская поддержка — пожалуйста, обратитесь к специалисту.
          </p>
        </div>
      </div>
    </footer>
  )
}
