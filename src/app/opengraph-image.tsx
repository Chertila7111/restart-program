import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Снова с собой — восстановление после расставания'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#1C2B23',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,123,94,0.25) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(194,138,94,0.15) 0%, transparent 70%)', display: 'flex' }} />

        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(to right, transparent, #C28A5E 20%, #C28A5E 80%, transparent)', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '80px 100px' }}>
          {/* Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4E7B5E', display: 'flex' }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#A8D4B0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Онлайн-программа
            </span>
          </div>

          {/* Title */}
          <div style={{ fontSize: 72, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 28, letterSpacing: '-0.02em' }}>
            Снова с собой
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 30, color: '#A8B8A0', lineHeight: 1.5, maxWidth: 700, marginBottom: 56 }}>
            Бережная программа восстановления после расставания с психологом и группой поддержки
          </div>

          {/* Features */}
          <div style={{ display: 'flex', gap: 32 }}>
            {['4 недели', 'Психолог', 'Группа', 'Ваш план'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4E7B5E', display: 'flex' }} />
                <span style={{ fontSize: 22, color: '#C8E6C4', fontWeight: 600 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: 40, right: 100, fontSize: 20, color: 'rgba(168,184,160,0.6)', display: 'flex' }}>
          snova-s-soboy.ru
        </div>
      </div>
    ),
    { ...size }
  )
}
