/**
 * @description
 * Responsive container component for constraining content width.
 * Two variants:
 * - default: 1440px max-width (wireframe desktop reference)
 * - narrow: 1200px max-width (content-focused layouts)
 *
 * @dependencies
 * - Design tokens from globals.css: --breakpoint-2xl (1440px), layout values
 *
 * @notes
 * - Horizontal padding: 24px mobile, 32px tablet+, 48px desktop
 * - Centers content with auto margins
 * - Wireframe reference: 1440px desktop, 390px mobile (Section 6.3 of design tokens)
 */
import React from 'react'

type ContainerProps = {
  children: React.ReactNode
  variant?: 'default' | 'narrow'
  className?: string
  as?: 'div' | 'section' | 'main'
}

const maxWidthClasses = {
  default: 'max-w-[1440px]',
  narrow: 'max-w-[1200px]',
}

export function Container({
  children,
  variant = 'default',
  className = '',
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto px-6 md:px-8 xl:px-12 ${maxWidthClasses[variant]} ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}
