/**
 * Floating mini-toolbar that appears above the active text-editing field.
 *
 * Receives the cursor position from the parent (driven by the preview
 * iframe via postMessage) and offers Bold / Italic / Underline / Link
 * actions. The actions are dispatched as `execCommand`-style strings via
 * postMessage so the iframe can apply them to its contenteditable field.
 */
'use client'

import React from 'react'

export interface InlineEditToolbarProps {
  /** Window-relative position of the toolbar's top-left corner. */
  x: number
  y: number
  /** Issue a formatting command back to the iframe. */
  onCommand: (cmd: 'bold' | 'italic' | 'underline' | 'link', value?: string) => void
}

const buttonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  padding: '4px 8px',
  fontSize: '12px',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 600,
}

export function InlineEditToolbar({ x, y, onCommand }: InlineEditToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Inline text formatting"
      style={{
        position: 'fixed',
        top: y,
        left: x,
        background: '#111827',
        color: 'white',
        borderRadius: '4px',
        padding: '4px',
        display: 'flex',
        gap: '2px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        zIndex: 10000,
      }}
    >
      <button type="button" style={{ ...buttonStyle, fontStyle: 'normal' }} onClick={() => onCommand('bold')}>
        B
      </button>
      <button type="button" style={{ ...buttonStyle, fontStyle: 'italic' }} onClick={() => onCommand('italic')}>
        I
      </button>
      <button
        type="button"
        style={{ ...buttonStyle, textDecoration: 'underline' }}
        onClick={() => onCommand('underline')}
      >
        U
      </button>
      <button
        type="button"
        style={buttonStyle}
        onClick={() => {
          const url = window.prompt('Link URL:')
          if (url) onCommand('link', url)
        }}
      >
        🔗
      </button>
    </div>
  )
}
