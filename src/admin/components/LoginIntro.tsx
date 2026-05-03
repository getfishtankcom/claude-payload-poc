/**
 * Above-the-form copy on the admin login page.
 *
 * Mounted via `admin.components.beforeLogin` so it renders between the
 * Payload `Logo` graphic and the email/password form. Drops in the
 * branded "Sign in to ${fullName}" headline that the original QA called
 * out — without overriding the entire `LoginView` (Payload's auth form
 * carries the e2e + axe coverage we don't want to recreate).
 */
import * as React from 'react'

import { BRAND } from '@/config/brand'

export const LoginIntro: React.FC = () => {
  return (
    <div
      data-testid="admin-login-intro"
      style={{
        textAlign: 'center',
        margin: '4px 0 20px',
      }}
    >
      <h1
        style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '0 0 6px',
          color: 'var(--text-primary, #111827)',
          lineHeight: 1.3,
        }}
      >
        Sign in to {BRAND.fullName}
      </h1>
      <p
        style={{
          fontSize: '13px',
          margin: 0,
          color: 'var(--text-secondary, #4b5563)',
        }}
      >
        Use your CMS account to access the admin panel.
      </p>
    </div>
  )
}

export default LoginIntro
