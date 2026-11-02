import { initialState, type OnboardingState } from './state'
import { FLOW, isQuestionStep } from './steps'
import { STORAGE_KEY, loadState, parseState, saveState } from './storage'

const savedState: OnboardingState = {
  draft: {
    account: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
    householdIncome: '200k_500k',
    netWorth: '1m_5m',
    qualifiedPurchaser: 'no',
    citizenships: ['US', 'GB'],
    taxResidence: 'US',
    employmentStatus: 'employed',
  },
  submitted: false,
}

describe('storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('returns the initial state when nothing is saved', () => {
    expect(loadState()).toEqual(initialState)
  })

  it('loads what was saved', () => {
    saveState(savedState)
    expect(loadState()).toEqual(savedState)
  })

  it('starts fresh when the saved data is not valid JSON', () => {
    sessionStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadState()).toEqual(initialState)
  })

  it('starts fresh when the saved data has the wrong shape', () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ draft: [], submitted: 'yes' }))
    expect(loadState()).toEqual(initialState)
  })

  it.each([
    ['householdIncome', 'a lot'],
    ['netWorth', 42],
    ['qualifiedPurchaser', 'maybe'],
    ['citizenships', ['US', 'XX']],
    ['taxResidence', 'XX'],
    ['employmentStatus', 'astronaut'],
    ['account', { firstName: 'Ada' }],
  ])('rejects an unknown %s value', (field, value) => {
    expect(parseState({ draft: { [field]: value }, submitted: false })).toBeNull()
  })

  // Built from the step list, so a new question is included automatically.
  // Fails if parseState wasn't updated for it (the answer would be lost on refresh).
  it('keeps the answer to every question step after a reload', () => {
    const draft: Record<string, unknown> = {
      account: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
    }
    for (const step of FLOW) {
      if (!isQuestionStep(step)) continue
      const value = step.options[0].value
      draft[step.field] = step.kind === 'multiSelect' ? [value] : value
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ draft, submitted: false }))
    expect(loadState()).toEqual({ draft, submitted: false })
  })

  it('drops fields it does not know, such as a password', () => {
    const parsed = parseState({
      draft: {
        account: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', password: 'secret123' },
        password: 'secret123',
      },
      submitted: false,
    })
    expect(JSON.stringify(parsed)).not.toContain('secret123')
  })
})
