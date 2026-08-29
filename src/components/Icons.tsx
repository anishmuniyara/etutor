import type { ReactNode } from 'react'

interface IconProps {
  size?: number
  stroke?: string
  width?: number
  children: ReactNode
}

function Icon({ size = 18, stroke = 'currentColor', width = 2.2, children }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      {children}
    </svg>
  )
}

export const ChevronLeft = (p: Omit<IconProps, 'children'>) => (
  <Icon {...p}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
)

export const ChevronRight = (p: Omit<IconProps, 'children'>) => (
  <Icon {...p}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
)

export const HomeIcon = (p: Omit<IconProps, 'children'>) => (
  <Icon {...p}>
    <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Icon>
)

export const EyeOff = (p: Omit<IconProps, 'children'>) => (
  <Icon width={2} {...p}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <path d="M1 1l22 22" />
  </Icon>
)

export const Star = ({ filled, ...p }: Omit<IconProps, 'children'> & { filled?: boolean }) => (
  <svg
    width={p.size ?? 18}
    height={p.size ?? 18}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flex: 'none' }}
  >
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
  </svg>
)

export const SearchIcon = (p: Omit<IconProps, 'children'>) => (
  <Icon width={2} {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </Icon>
)

export const Speaker = ({ active, ...p }: Omit<IconProps, 'children'> & { active?: boolean }) => (
  <Icon width={2} {...p}>
    <path d="M11 5 6 9H2v6h4l5 4z" />
    {/* The outer arc only appears while speaking, so the icon shows state without a colour change. */}
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    {active ? <path d="M19 5a10 10 0 0 1 0 14" /> : null}
  </Icon>
)
