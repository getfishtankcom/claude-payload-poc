/**
 * @description
 * JWT session management with HTTP-only cookies.
 * Creates and verifies member session tokens for Aptify-authenticated users.
 *
 * Key features:
 * - createSession: Sets HTTP-only JWT cookie after successful Aptify login
 * - getSession: Reads and verifies JWT from cookie
 * - destroySession: Clears the session cookie
 * - Rate limiting: 5 login attempts per 15 minutes (in-memory)
 *
 * @dependencies
 * - next/headers: Cookie management
 * - JWT_SECRET env var
 *
 * @notes
 * - HTTP-only cookie prevents XSS token theft
 * - Secure flag set in production (HTTPS)
 * - SameSite=Lax for CSRF protection
 * - Rate limiting is in-memory (resets on server restart — acceptable for PoC)
 * - For production: use Redis or database-backed rate limiting
 */
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || process.env.PAYLOAD_SECRET || 'dev-secret-change-me'
const SESSION_COOKIE = 'fras-session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

type SessionPayload = {
  userId: string
  email: string
  isMember: boolean
  exp: number
}

// ── Simple JWT implementation (no external dependency) ─────────────────────

function base64UrlEncode(data: string): string {
  return Buffer.from(data).toString('base64url')
}

function base64UrlDecode(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf-8')
}

async function hmacSign(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Buffer.from(signature).toString('base64url')
}

async function hmacVerify(data: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(data)
  return expected === signature
}

async function createJWT(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
    }),
  )
  const signature = await hmacSign(`${header}.${body}`)
  return `${header}.${body}.${signature}`
}

async function verifyJWT(token: string): Promise<SessionPayload | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [header, body, signature] = parts
  const isValid = await hmacVerify(`${header}.${body}`, signature)
  if (!isValid) return null

  const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload
  if (payload.exp < Math.floor(Date.now() / 1000)) return null

  return payload
}

// ── Session Management ─────────────────────────────────────────────────────

/**
 * Create a session after successful Aptify authentication.
 * Sets an HTTP-only JWT cookie.
 */
export async function createSession(userId: string, email: string, isMember: boolean): Promise<void> {
  const token = await createJWT({ userId, email, isMember })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * Get the current session from the cookie.
 * Returns null if no valid session exists.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifyJWT(token)
}

/**
 * Destroy the current session by clearing the cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

// ── Rate Limiting (in-memory) ──────────────────────────────────────────────

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 5 // 5 attempts per window

// In-memory store — acceptable for PoC. Use Redis in production.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

/**
 * Check if a login attempt is rate-limited.
 * @param identifier - Usually the IP address or username
 * @returns true if the request should be blocked
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }

  record.count++
  if (record.count > RATE_LIMIT_MAX) {
    return true
  }

  return false
}
