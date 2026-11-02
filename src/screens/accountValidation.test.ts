import { validateAccount, type AccountForm } from './accountValidation'

const valid: AccountForm = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  password: 'secret123',
  consent: true,
}

describe('validateAccount', () => {
  it('accepts a complete form', () => {
    expect(validateAccount(valid)).toEqual({})
  })

  it('rejects blank and whitespace-only names', () => {
    expect(validateAccount({ ...valid, firstName: '', lastName: '   ' })).toEqual({
      firstName: 'Enter your first name',
      lastName: 'Enter your last name',
    })
  })

  it('rejects a missing or malformed email', () => {
    expect(validateAccount({ ...valid, email: '' }).email).toBe('Enter your email address')
    expect(validateAccount({ ...valid, email: 'ada@example' }).email).toBe('Enter a valid email address')
  })

  it('rejects a missing or short password', () => {
    expect(validateAccount({ ...valid, password: '' }).password).toBe('Enter a password')
    expect(validateAccount({ ...valid, password: 'short' }).password).toBe('Use at least 8 characters')
  })

  it('requires the consent checkbox', () => {
    expect(validateAccount({ ...valid, consent: false }).consent).toBe('Please accept to continue')
  })
})
