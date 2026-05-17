export function LogoSvg({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      role="img"
      aria-label="Снова с собой"
      className={className}
      style={{
        width: size,
        height: size,
        backgroundImage: 'url(/logo-icon.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        flexShrink: 0,
      }}
    />
  )
}
