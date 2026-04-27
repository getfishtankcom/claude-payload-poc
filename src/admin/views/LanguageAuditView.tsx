/**
 * Server wrapper for the Language Audit admin view.
 * Mounted at /admin/language-audit via payload.config.ts.
 */
import React from 'react'
import { LanguageAuditViewClient } from './LanguageAuditViewClient'

const LanguageAuditView: React.FC = () => {
  return <LanguageAuditViewClient />
}

export default LanguageAuditView
