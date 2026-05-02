/**
 * @description
 * Mega menu dropdown component for the site header navigation.
 * Supports 3 dropdown configurations:
 * - "About Us": single column, 4 links
 * - "Boards": 4-column mega-menu, each column for a board with 7 sub-links
 * - "Active Projects": single column, 4 board links
 *
 * @dependencies
 * - @headlessui/react: Popover for accessible dropdown behavior
 * - next/link: Client-side navigation
 * - Design tokens from globals.css: colors, shadows, spacing
 *
 * @notes
 * - Opens on hover (desktop) with click fallback
 * - Closes on: mouse leave, Escape key, click outside, click on a link
 * - Uses Headless UI Popover for keyboard accessibility and focus management
 * - Positioned absolutely below trigger element, full-width
 */
'use client'

import React, { useRef, useCallback } from 'react'
import Link from 'next/link'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export type MegaMenuItem = {
  label: string
  href: string
  children?: MegaMenuItem[]
}

export type MegaMenuVariant = 'single-column' | 'multi-column'

type MegaMenuProps = {
  /** Trigger label text */
  trigger: string
  /** Menu items to display */
  items: MegaMenuItem[]
  /** Layout variant */
  variant?: MegaMenuVariant
  className?: string
}

export function MegaMenu({ trigger, items, variant = 'single-column', className = '' }: MegaMenuProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback((open: boolean, toggleFn: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (!open) toggleFn()
  }, [])

  const handleMouseLeave = useCallback((open: boolean, closeFn: () => void) => {
    if (open) {
      timeoutRef.current = setTimeout(() => {
        closeFn()
      }, 150)
    }
  }, [])

  return (
    <Popover className={`relative ${className}`.trim()}>
      {({ open, close }) => (
        <div
          onMouseEnter={() => {
            const button = panelRef.current?.previousElementSibling as HTMLButtonElement
            handleMouseEnter(open, () => button?.click())
          }}
          onMouseLeave={() => handleMouseLeave(open, close)}
        >
          <PopoverButton
            className="inline-flex items-center gap-1 text-sm font-medium text-text-primary hover:text-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-bright cursor-pointer"
            data-testid={`mega-menu-trigger-${trigger.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {trigger}
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </PopoverButton>

          <PopoverPanel
            ref={panelRef}
            className="absolute left-0 z-50 mt-2 w-max min-w-[200px] rounded-md bg-white shadow-lg ring-1 ring-black/5"
            data-testid={`mega-menu-panel-${trigger.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {variant === 'multi-column' ? (
              <div className="grid grid-cols-4 gap-0 p-4">
                {items.map((column) => (
                  <div key={column.label} className="min-w-[180px] px-4">
                    <Link
                      href={column.href}
                      className="block text-sm font-bold text-primary hover:underline"
                      onClick={() => close()}
                    >
                      {column.label}
                    </Link>
                    {column.children && (
                      <ul className="mt-2 space-y-1.5">
                        {column.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              className="block text-sm text-text-primary hover:text-primary hover:underline"
                              onClick={() => close()}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3">
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="block rounded-sm px-3 py-2 text-sm text-text-primary hover:bg-gray-50 hover:text-primary"
                        onClick={() => close()}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </PopoverPanel>
        </div>
      )}
    </Popover>
  )
}
