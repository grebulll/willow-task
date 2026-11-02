import { initialState, type OnboardingState } from './state'
import { STORAGE_KEY, loadState, saveState } from './storage'

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
})
