/**
 * @description
 * Auth Config global for FRAS Canada's login page CMS-editable content.
 * Stores all labels, URLs, and support information for the authentication page.
 *
 * Key features:
 * - Login form labels (username, password, button)
 * - Forgot username/password links
 * - Registration prompt and link
 * - CPA Canada login section with explanation text
 * - Support contact information
 *
 * @dependencies
 * - None
 *
 * @notes
 * - This is a Global (singleton), not a Collection
 * - Auth is via Aptify DB API (NOT OAuth/SAML)
 * - All text content is CMS-editable so non-developers can update labels
 */
import type { GlobalConfig } from 'payload'

export const AuthConfig: GlobalConfig = {
  slug: 'auth-config',
  label: 'Auth Config',
  admin: {
    description: 'Login page labels, links, and support contact information',
  },
  fields: [
    // Login form labels
    {
      name: 'usernameLabel',
      type: 'text',
      label: 'Username Label',
      defaultValue: 'Username',
    },
    {
      name: 'passwordLabel',
      type: 'text',
      label: 'Password Label',
      defaultValue: 'Password',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Login Button Label',
      defaultValue: 'Log In',
    },
    // Forgot links
    {
      name: 'forgotUsernameLabel',
      type: 'text',
      label: 'Forgot Username Label',
      defaultValue: 'Forgot Username?',
    },
    {
      name: 'forgotUsernameUrl',
      type: 'text',
      label: 'Forgot Username URL',
    },
    {
      name: 'forgotPasswordLabel',
      type: 'text',
      label: 'Forgot Password Label',
      defaultValue: 'Forgot Password?',
    },
    {
      name: 'forgotPasswordUrl',
      type: 'text',
      label: 'Forgot Password URL',
    },
    // Registration
    {
      name: 'registerPrompt',
      type: 'text',
      label: 'Register Prompt',
      defaultValue: "Don't have an account?",
    },
    {
      name: 'registerLinkLabel',
      type: 'text',
      label: 'Register Link Label',
      defaultValue: 'Register',
    },
    {
      name: 'registerUrl',
      type: 'text',
      label: 'Register URL',
    },
    // CPA Canada section
    {
      name: 'cpaExplanation',
      type: 'richText',
      label: 'CPA Canada Explanation',
      admin: {
        description: 'Explanation text about CPA Canada login integration',
      },
    },
    {
      name: 'cpaLoginUrl',
      type: 'text',
      label: 'CPA Canada Login URL',
    },
    // Support information
    {
      name: 'supportHeading',
      type: 'text',
      label: 'Support Heading',
      defaultValue: 'Need Help?',
    },
    {
      name: 'supportEmail',
      type: 'email',
      label: 'Support Email',
    },
    {
      name: 'supportPhoneTollFree',
      type: 'text',
      label: 'Support Phone (Toll Free)',
    },
    {
      name: 'supportPhoneIntl',
      type: 'text',
      label: 'Support Phone (International)',
    },
  ],
}
