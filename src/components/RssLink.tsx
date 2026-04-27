/**
 * RSS feed link — small icon + label that opens an RSS URL in a new tab.
 */
import React from 'react'

export interface RssLinkProps {
  feedUrl: string
  label?: string
}

export function RssLink({ feedUrl, label = 'RSS Feed' }: RssLinkProps) {
  return (
    <a
      href={feedUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: '#601F5B',
        textDecoration: 'none',
        fontSize: '13px',
      }}
    >
      <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A19.56 19.56 0 0 1 23.56 24h-2.83A16.74 16.74 0 0 0 4 7.27V4.44zm0 5.66a13.9 13.9 0 0 1 13.9 13.9h-2.83A11.07 11.07 0 0 0 4 12.93V10.1z" />
      </svg>
      {label}
    </a>
  )
}
