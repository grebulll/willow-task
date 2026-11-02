import { toPayload } from './payload'
import type { OnboardingDraft } from './types'

const completeDraft: Required<OnboardingDraft> = {
  account: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
  householdIncome: '200k_500k',
  netWorth: '1m_5m',
  qualifiedPurchaser: 'no',
  citizenships: ['US', 'GB'],
  taxResidence: 'US',
  employmentStatus: 'employed',
}

describe('toPayload', () => {
  it('builds the payload from a complete draft, the password and the chosen path', () => {
    expect(toPayload(completeDraft, 'secret123', 'managed_portfolio')).toEqual({
      account: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'secret123',
      },
      householdIncome: '200k_500k',
      netWorth: '1m_5m',
      qualifiedPurchaser: 'no',
      citizenships: ['US', 'GB'],
      taxResidence: 'US',
      employmentStatus: 'employed',
      investmentPath: 'managed_portfolio',
    })
  })

  it.each(Object.keys(completeDraft) as (keyof OnboardingDraft)[])(
    'returns null when %s is missing',
    (field) => {
      const draft: OnboardingDraft = { ...completeDraft, [field]: undefined }
      expect(toPayload(draft, 'secret123', 'self_directed')).toBeNull()
    },
  )

  it('returns null when there are no citizenships', () => {
    const draft: OnboardingDraft = { ...completeDraft, citizenships: [] }
    expect(toPayload(draft, 'secret123', 'self_directed')).toBeNull()
  })

  it('returns null when the password is empty', () => {
    expect(toPayload(completeDraft, '', 'self_directed')).toBeNull()
  })

  it('does not add the password to the draft', () => {
    toPayload(completeDraft, 'secret123', 'self_directed')
    expect(completeDraft.account).not.toHaveProperty('password')
  })
})
