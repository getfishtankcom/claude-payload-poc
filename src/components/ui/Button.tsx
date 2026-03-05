/**
 * @description
 * Polymorphic Button component supporting <button> and <a> rendering.
 * 4 visual variants mapped to design tokens:
 * - primary: Purple fill (#601F5B), white text — main CTAs
 * - secondary: Transparent with purple border — secondary actions
 * - ghost: No border/bg, purple text with arrow — inline links
 * - dark: Dark fill (#333333), white text — on colored backgrounds
 *
 * 3 sizes: sm (14px text, tight padding), md (14px, standard), lg (16px, generous).
 *
 * @dependencies
 * - React: Component rendering
 * - Design tokens from globals.css: --color-primary, --radius-sm, etc.
 *
 * @notes
 * - Polymorphic: renders as <a> when `href` is provided, <button> otherwise
 * - All variants use border-radius: 5px (--radius-sm) per design tokens Section 8.1
 * - Ghost variant has no padding or border — acts as an inline text link with arrow
 * - Focus ring uses --color-primary-bright for WCAG 2.1 AA compliance
 */
import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonBaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  className?: string
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never
  }

type ButtonAsAnchor = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-vivid',
  secondary: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white',
  ghost: 'bg-transparent text-primary hover:text-primary-vivid p-0 rounded-none',
  dark: 'bg-dark text-white hover:bg-gray-800',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-regular rounded-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-bright'

  // Ghost variant ignores size padding
  const classes =
    variant === 'ghost'
      ? `${baseClasses} ${variantClasses[variant]} ${className}`.trim()
      : `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props as ButtonAsAnchor
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
        {variant === 'ghost' && <span className="ml-1" aria-hidden="true">→</span>}
      </a>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button className={classes} {...buttonProps}>
      {children}
      {variant === 'ghost' && <span className="ml-1" aria-hidden="true">→</span>}
    </button>
  )
}
