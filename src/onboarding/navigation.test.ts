import { getBackPath, getNextPath, getRedirect } from './navigation'
import { FLOW_STEPS, NOT_ELIGIBLE_STEP, type Step } from './steps'
import type { OnboardingDraft } from './types'

function step(id: string): Step {
  const found = [...FLOW_STEPS, NOT_ELIGIBLE_STEP].find((s) => s.id === id)
  if (!found) throw new Error(`No step ${id}`)
  return found
}

const account = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' }

const completeDraft: Required<OnboardingDraft> = {
  account,
  householdIncome: '200k_500k',
  netWorth: '1m_5m',
  qualifiedPurchaser: 'no',
  citizenships: ['US'],
  taxResidence: 'US',
  employmentStatus: 'employed',
}

describe('getRedirect', () => {
  it('lets the user stay on the account form with no answers', () => {
    expect(getRedirect(step('account'), {}, false)).toBeNull()
  })

  it('sends the user back to the first unanswered step when they skip ahead', () => {
    expect(getRedirect(step('netWorth'), {}, false)).toBe('/')
    expect(getRedirect(step('netWorth'), { account }, false)).toBe('/household-income')
  })

  it('lets the user revisit earlier steps', () => {
    expect(getRedirect(step('account'), completeDraft, false)).toBeNull()
    expect(getRedirect(step('welcome'), completeDraft, false)).toBeNull()
    expect(getRedirect(step('householdIncome'), completeDraft, false)).toBeNull()
  })

  it('allows a welcome screen once the steps before it are answered', () => {
    const draft: OnboardingDraft = {
      account,
      householdIncome: 'over_1m',
      netWorth: 'over_5m',
      qualifiedPurchaser: 'yes',
    }
    expect(getRedirect(step('moreQuestions'), draft, false)).toBeNull()
  })

  it('only allows the final screen once everything is answered', () => {
    expect(getRedirect(step('ready'), { account }, false)).toBe('/household-income')
    expect(getRedirect(step('ready'), completeDraft, false)).toBeNull()
  })

  it('sends every step to the final screen after submitting', () => {
    expect(getRedirect(step('account'), completeDraft, true)).toBe('/ready')
    expect(getRedirect(step('taxResidence'), completeDraft, true)).toBe('/ready')
    expect(getRedirect(step('ready'), completeDraft, true)).toBeNull()
  })

  it('only allows the not-eligible screen after a non-US tax residence', () => {
    expect(getRedirect(NOT_ELIGIBLE_STEP, { account }, false)).toBe('/household-income')
    expect(getRedirect(NOT_ELIGIBLE_STEP, completeDraft, false)).toBe('/ready')
    expect(getRedirect(NOT_ELIGIBLE_STEP, { ...completeDraft, taxResidence: 'CA' }, false)).toBeNull()
  })

  it('keeps a non-US tax residence from reaching later steps', () => {
    const draft: OnboardingDraft = { ...completeDraft, taxResidence: 'CA' }
    expect(getRedirect(step('employmentStatus'), draft, false)).toBe('/tax-residence')
  })
})

describe('getNextPath', () => {
  it('follows the flow order', () => {
    expect(getNextPath(step('account'), {})).toBe('/welcome')
    expect(getNextPath(step('qualifiedPurchaser'), {})).toBe('/more-questions')
    expect(getNextPath(step('employmentStatus'), {})).toBe('/ready')
  })

  it('goes from tax residence to employment for a US tax residence', () => {
    expect(getNextPath(step('taxResidence'), { taxResidence: 'US' })).toBe('/employment')
  })

  it('goes from tax residence to the not-eligible screen otherwise', () => {
    expect(getNextPath(step('taxResidence'), { taxResidence: 'CA' })).toBe('/not-eligible')
  })

  it('has nothing after the final and not-eligible screens', () => {
    expect(getNextPath(step('ready'), completeDraft)).toBeNull()
    expect(getNextPath(NOT_ELIGIBLE_STEP, completeDraft)).toBeNull()
  })
})

describe('getBackPath', () => {
  it('goes from the first question back to the welcome screen', () => {
    expect(getBackPath(step('householdIncome'))).toBe('/welcome')
  })

  it('goes from the first question of section B back to its welcome screen', () => {
    expect(getBackPath(step('citizenships'))).toBe('/more-questions')
  })

  it.each(['account', 'welcome', 'moreQuestions', 'ready', 'notEligible'])(
    'has no back arrow on %s',
    (id) => {
      expect(getBackPath(step(id))).toBeNull()
    },
  )
})
