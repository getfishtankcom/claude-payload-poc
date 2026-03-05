/**
 * @description
 * Server actions for authentication — login, register, recover, reset.
 * All actions use Aptify DB API for member verification.
 *
 * Key features:
 * - loginAction: Authenticates via Aptify, creates JWT session cookie
 * - registerAction: Creates new Aptify account
 * - recoverUsernameAction: Sends username recovery email
 * - resetPasswordAction: Initiates password reset
 *
 * @dependencies
 * - src/lib/aptify.ts: Aptify DB API client
 * - src/lib/session.ts: JWT session + rate limiting
 *
 * @notes
 * - Rate limiting: 5 attempts per 15 minutes on login
 * - CSRF protection via Next.js server actions (automatic)
 * - Error messages are always generic (prevent user enumeration)
 * - All actions run server-side only
 */
'use server'

import { headers } from 'next/headers'
import { authenticateMember, createAccount, recoverUsername, resetPassword } from '@/lib/aptify'
import { createSession, isRateLimited } from '@/lib/session'
import type { LoginFormState } from '@/components/LoginForm'

type AuthFormState = {
  success: boolean
  message: string
}

/**
 * Login server action — validates credentials via Aptify, creates JWT session.
 */
export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const username = (formData.get('username') as string)?.trim() || ''
  const password = (formData.get('password') as string) || ''

  if (!username || !password) {
    return { success: false, message: 'Invalid user name or password. Please try again.' }
  }

  // Rate limiting by IP
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' }
  }

  // Authenticate against Aptify
  const result = await authenticateMember(username, password)

  if (!result.success) {
    return { success: false, message: 'Invalid user name or password. Please try again.' }
  }

  // Create session
  await createSession(result.userId!, result.email || username, result.isMember)

  return { success: true, message: 'Login successful.' }
}

/**
 * Registration server action — creates account via Aptify.
 */
export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = (formData.get('email') as string)?.trim() || ''
  const password = (formData.get('password') as string) || ''
  const confirmPassword = (formData.get('confirmPassword') as string) || ''
  const firstName = (formData.get('firstName') as string)?.trim() || ''
  const lastName = (formData.get('lastName') as string)?.trim() || ''

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return { success: false, message: 'All fields are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  if (password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters.' }
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match.' }
  }

  const result = await createAccount(email, password, firstName, lastName)
  return result
}

/**
 * Forgot Username server action — sends recovery email via Aptify.
 */
export async function recoverUsernameAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = (formData.get('email') as string)?.trim() || ''

  if (!email) {
    return { success: false, message: 'Please enter your email address.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  return recoverUsername(email)
}

/**
 * Forgot Password server action — initiates reset via Aptify.
 */
export async function resetPasswordAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const username = (formData.get('username') as string)?.trim() || ''

  if (!username) {
    return { success: false, message: 'Please enter your username (email address).' }
  }

  return resetPassword(username)
}
