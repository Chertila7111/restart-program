export function LighthouseIcon({
  size = 36,
  color = 'currentColor',
  className = '',
}: {
  size?: number
  color?: string
  className?: string
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.22)}
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Light rays */}
      <path d="M18 7V2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 9L7.5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 9L28.5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Lamp room */}
      <rect x="11" y="7" width="14" height="7" rx="2" fill={color} />
      {/* Tower body — tapers from top to bottom */}
      <path d="M13 14L11 32H25L23 14H13Z" fill={color} />
      {/* Decorative stripe */}
      <rect x="11" y="22" width="14" height="2.5" rx="0" fill="white" opacity="0.22" />
      {/* Base platform */}
      <rect x="8" y="32" width="20" height="4" rx="2" fill={color} />
      {/* Water waves */}
      <path
        d="M1 40Q5.5 38 9 40Q13 42 18 40Q23 38 27 40Q30.5 42 35 40"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
