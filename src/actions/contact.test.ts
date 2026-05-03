import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { createMock, verifyRecaptchaMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  verifyRecaptchaMock: vi.fn(),
}))

vi.mock('payload', () => ({
  getPayload: vi.fn(async () => ({ create: createMock })),
}))

vi.mock('@payload-config', () => ({ default: {} }))

vi.mock('@/lib/recaptcha', () => ({
  verifyRecaptcha: verifyRecaptchaMock,
}))

import { submitContactForm } from './contact'
import type { ContactFormState } from '@/components/ContactForm'

const initialState: ContactFormState = { success: false, message: '' }

const validFormData = (overrides: Record<string, string> = {}) => {
  const fd = new FormData()
  fd.set('fullName', 'Jane Doe')
  fd.set('email', 'jane@example.com')
  fd.set('comments', 'Hello, I have a question about IFRS adoption.')
  fd.set('title', 'Director')
  fd.set('organization', 'Acme Corp')
  fd.set('businessPhone', '555-0100')
  fd.set('recaptchaToken', 'token-abc')
  for (const [k, v] of Object.entries(overrides)) fd.set(k, v)
  return fd
}

describe('submitContactForm', () => {
  beforeEach(() => {
    createMock.mockReset()
    verifyRecaptchaMock.mockReset()
    verifyRecaptchaMock.mockResolvedValue({ success: true, score: 0.9 })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('persists a valid submission and returns success', async () => {
    createMock.mockResolvedValue({ id: 1 })

    const result = await submitContactForm(initialState, validFormData())

    expect(result.success).toBe(true)
    expect(result.message).toMatch(/thank you/i)
    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'form-submissions',
        overrideAccess: true,
        data: expect.objectContaining({
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          comments: 'Hello, I have a question about IFRS adoption.',
          status: 'new',
        }),
      }),
    )
  })

  it('rejects missing required fields without persisting', async () => {
    const fd = validFormData({ fullName: '', email: '', comments: '' })

    const result = await submitContactForm(initialState, fd)

    expect(result.success).toBe(false)
    expect(result.errors).toMatchObject({
      fullName: expect.any(String),
      email: expect.any(String),
      comments: expect.any(String),
    })
    expect(createMock).not.toHaveBeenCalled()
  })

  it('rejects invalid email format without persisting', async () => {
    const fd = validFormData({ email: 'not-an-email' })

    const result = await submitContactForm(initialState, fd)

    expect(result.success).toBe(false)
    expect(result.errors?.email).toMatch(/valid email/i)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('rejects when reCAPTCHA verification fails', async () => {
    verifyRecaptchaMock.mockResolvedValue({ success: false })

    const result = await submitContactForm(initialState, validFormData())

    expect(result.success).toBe(false)
    expect(result.message).toMatch(/recaptcha/i)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('returns failure (does NOT show success) when persistence throws', async () => {
    createMock.mockRejectedValue(new Error('db down'))
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await submitContactForm(initialState, validFormData())

    expect(result.success).toBe(false)
    expect(result.message).toMatch(/something went wrong/i)
    expect(errSpy).toHaveBeenCalled()
  })

  it('honeypot trips silent-success without persisting', async () => {
    const fd = validFormData()
    fd.set('website', 'http://spam.example.com')

    const result = await submitContactForm(initialState, fd)

    expect(result.success).toBe(true)
    expect(createMock).not.toHaveBeenCalled()
  })
})
