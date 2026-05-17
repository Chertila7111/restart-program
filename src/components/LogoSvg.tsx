import Image from 'next/image'

export function LogoSvg({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo-icon.png"
      alt="Снова с собой"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain' }}
      className={className}
    />
  )
}
