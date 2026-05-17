export function LogoSvg({ size = 48, className = '' }: { size?: number; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/logo-icon.png"
      alt="Снова с собой"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain', display: 'block', background: 'none' }}
      className={className}
    />
  )
}
