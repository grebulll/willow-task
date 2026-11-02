import { COUNTRIES } from './countries'
import { FLOW, NOT_ELIGIBLE_STEP, firstUnansweredStep, getProgress, isQuestionStep } from './steps'
import {
  EMPLOYMENT_STATUSES,
  HOUSEHOLD_INCOMES,
  INVESTMENT_PATHS,
  NET_WORTHS,
  QUALIFIED_PURCHASER_ANSWERS,
  type OnboardingDraft,
} from './types'

const completeDraft: Required<OnboardingDraft> = {
  account: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
  householdIncome: '200k_500k',
  netWorth: '1m_5m',
  qualifiedPurchaser: 'no',
  citizenships: ['US'],
  taxResidence: 'US',
  employmentStatus: 'employed',
}

function optionValues(id: string): string[] {
  const step = FLOW.find((s) => s.id === id)
  if (!step || !isQuestionStep(step)) throw new Error(`No question step ${id}`)
  return step.options.map((option) => option.value)
}

describe('FLOW', () => {
  it('has unique ids and paths', () => {
    const steps = [...FLOW, NOT_ELIGIBLE_STEP]
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length)
    expect(new Set(steps.map((s) => s.path)).size).toBe(steps.length)
  })

  it('offers every fixed choice exactly once, in order', () => {
    expect(optionValues('householdIncome')).toEqual(HOUSEHOLD_INCOMES)
    expect(optionValues('netWorth')).toEqual(NET_WORTHS)
    expect(optionValues('qualifiedPurchaser')).toEqual(QUALIFIED_PURCHASER_ANSWERS)
    expect(optionValues('employmentStatus')).toEqual(EMPLOYMENT_STATUSES)
    expect(optionValues('citizenships')).toEqual(COUNTRIES.map((c) => c.code))
    expect(optionValues('taxResidence')).toEqual(COUNTRIES.map((c) => c.code))

    const final = FLOW.find((s) => s.kind === 'final')
    expect(final?.choices.map((c) => c.value)).toEqual(INVESTMENT_PATHS)
  })
})

describe('getProgress', () => {
  it('numbers the six question screens 1 to 6', () => {
    const ids = [
      'householdIncome',
      'netWorth',
      'qualifiedPurchaser',
      'citizenships',
      'taxResidence',
      'employmentStatus',
    ] as const
    ids.forEach((id, index) => {
      expect(getProgress(id)).toEqual({ current: index + 1, total: 6 })
    })
  })

  it.each(['account', 'welcome', 'moreQuestions', 'ready', 'notEligible'] as const)(
    'has no counter on %s',
    (id) => {
      expect(getProgress(id)).toBeNull()
    },
  )
})

describe('firstUnansweredStep', () => {
  it('starts at the account form', () => {
    expect(firstUnansweredStep({}).id).toBe('account')
  })

  it('goes to household income once the account is done', () => {
    expect(firstUnansweredStep({ account: completeDraft.account }).id).toBe('householdIncome')
  })

  it('finds a gap in the middle of the flow', () => {
    const draft: OnboardingDraft = { ...completeDraft, netWorth: undefined }
    expect(firstUnansweredStep(draft).id).toBe('netWorth')
  })

  it('treats an empty citizenship list as unanswered', () => {
    const draft: OnboardingDraft = { ...completeDraft, citizenships: [] }
    expect(firstUnansweredStep(draft).id).toBe('citizenships')
  })

  it('treats a non-US tax residence as unanswered', () => {
    const draft: OnboardingDraft = { ...completeDraft, taxResidence: 'CA' }
    expect(firstUnansweredStep(draft).id).toBe('taxResidence')
  })

  it('returns the final screen when everything is answered', () => {
    expect(firstUnansweredStep(completeDraft).id).toBe('ready')
  })
})
