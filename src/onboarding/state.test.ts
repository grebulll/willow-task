import { initialState, onboardingReducer } from './state'

const account = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' }

describe('onboardingReducer', () => {
  it('sets the account', () => {
    const state = onboardingReducer(initialState, { type: 'setAccount', account })
    expect(state.draft.account).toEqual(account)
  })

  it('merges answers without dropping earlier ones', () => {
    const first = onboardingReducer(initialState, {
      type: 'setAnswers',
      answers: { householdIncome: 'over_1m' },
    })
    const second = onboardingReducer(first, { type: 'setAnswers', answers: { netWorth: '1m_5m' } })
    expect(second.draft).toEqual({ householdIncome: 'over_1m', netWorth: '1m_5m' })
  })

  it('replaces an answer when it changes', () => {
    const first = onboardingReducer(initialState, {
      type: 'setAnswers',
      answers: { citizenships: ['US'] },
    })
    const second = onboardingReducer(first, {
      type: 'setAnswers',
      answers: { citizenships: ['CA', 'GB'] },
    })
    expect(second.draft.citizenships).toEqual(['CA', 'GB'])
  })

  it('marks the flow as submitted and keeps the draft', () => {
    const withAccount = onboardingReducer(initialState, { type: 'setAccount', account })
    const state = onboardingReducer(withAccount, { type: 'markSubmitted' })
    expect(state).toEqual({ draft: { account }, submitted: true })
  })

  it('does not mutate the previous state', () => {
    onboardingReducer(initialState, { type: 'setAccount', account })
    expect(initialState).toEqual({ draft: {}, submitted: false })
  })
})
