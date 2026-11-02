export type AccountForm = {
  firstName: string
  lastName: string
  email: string
  password: string
  consent: boolean
}

export type AccountErrors = Partial<Record<keyof AccountForm, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 8

// Returns an error message per invalid field; an empty object means valid.
export function validateAccount(form: AccountForm): AccountErrors {
  const errors: AccountErrors = {}

  if (form.firstName.trim() === '') errors.firstName = 'Enter your first name'
  if (form.lastName.trim() === '') errors.lastName = 'Enter your last name'

  const email = form.email.trim()
  if (email === '') errors.email = 'Enter your email address'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address'

  if (form.password === '') errors.password = 'Enter a password'
  else if (form.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`
  }

  if (!form.consent) errors.consent = 'Please accept to continue'

  return errors
}
