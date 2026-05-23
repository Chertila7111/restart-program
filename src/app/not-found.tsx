import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
          Страница не найдена
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '24rem' }}>
          Такой страницы не существует или она была перемещена.
        </p>
        <Link href="/" className="btn-primary">На главную →</Link>
      </div>
    </div>
  )
}
