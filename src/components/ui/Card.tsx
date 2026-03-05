/**
 * @description
 * Compound Card component with Card, Card.Header, Card.Body, and Card.Footer sub-components.
 * Provides a flexible container for content previews, listings, and feature blocks.
 *
 * @dependencies
 * - Design tokens from globals.css: bg-white, shadow, border radius
 *
 * @notes
 * - Card shadow/border tokens are NEEDS REVIEW in design-tokens.md Section 8.2
 * - Using subtle shadow (shadow-sm) and light border as reasonable defaults
 * - Sub-components are attached to Card via Object.assign for clean API:
 *   <Card><Card.Header>...</Card.Header><Card.Body>...</Card.Body></Card>
 */
import React from 'react'

type CardProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
}

function CardRoot({ children, className = '', as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={`rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}

type SubComponentProps = {
  children: React.ReactNode
  className?: string
}

function Header({ children, className = '' }: SubComponentProps) {
  return <div className={`px-6 py-4 border-b border-gray-200 ${className}`.trim()}>{children}</div>
}

function Body({ children, className = '' }: SubComponentProps) {
  return <div className={`px-6 py-4 ${className}`.trim()}>{children}</div>
}

function Footer({ children, className = '' }: SubComponentProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`.trim()}>
      {children}
    </div>
  )
}

export const Card = Object.assign(CardRoot, {
  Header,
  Body,
  Footer,
})
