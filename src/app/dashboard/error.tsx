'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ padding: '2rem', maxWidth: '44rem' }}>
      <h2 style={{ color: '#dc2626', fontWeight: 700, marginBottom: '1rem' }}>Ошибка страницы</h2>
      <pre style={{
        fontSize: '0.75rem',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        padding: '1rem',
        borderRadius: '0.5rem',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        marginBottom: '1rem',
        color: '#991b1b',
      }}>
        {error.message || '(пустое сообщение об ошибке)'}
      </pre>
      {error.stack && (
        <pre style={{
          fontSize: '0.65rem',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          marginBottom: '1rem',
          color: '#6b7280',
        }}>
          {error.stack}
        </pre>
      )}
      {error.digest && (
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>
          digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{
          padding: '0.5rem 1.25rem',
          background: '#4E7B5E',
          color: 'white',
          border: 'none',
          borderRadius: '0.625rem',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.875rem',
        }}
      >
        Попробовать снова
      </button>
    </div>
  )
}
