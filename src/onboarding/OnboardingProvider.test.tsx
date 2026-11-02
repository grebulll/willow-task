import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useOnboarding } from './OnboardingContext'
import { OnboardingProvider } from './OnboardingProvider'
import { STORAGE_KEY, saveState } from './storage'

const account = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' }

function wrapper({ children }: { children: ReactNode }) {
  return <OnboardingProvider>{children}</OnboardingProvider>
}

describe('OnboardingProvider', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('saves the draft to sessionStorage but never the password', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper })

    act(() => {
      result.current.setPassword('secret123')
      result.current.setAccount(account)
      result.current.setAnswers({ householdIncome: 'over_1m' })
    })

    const saved = sessionStorage.getItem(STORAGE_KEY) ?? ''
    expect(JSON.parse(saved)).toEqual({
      draft: { account, householdIncome: 'over_1m' },
      submitted: false,
    })
    expect(saved).not.toContain('secret123')
    expect(result.current.password).toBe('secret123')
  })

  it('restores saved progress on mount, without a password', () => {
    saveState({ draft: { account, netWorth: 'over_5m' }, submitted: false })

    const { result } = renderHook(() => useOnboarding(), { wrapper })

    expect(result.current.draft).toEqual({ account, netWorth: 'over_5m' })
    expect(result.current.password).toBe('')
  })

  it('locks the flow and clears the password on submit', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper })

    act(() => {
      result.current.setPassword('secret123')
    })
    act(() => {
      result.current.markSubmitted()
    })

    expect(result.current.submitted).toBe(true)
    expect(result.current.password).toBe('')
  })

  it('throws a clear error when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useOnboarding())).toThrow(
      'useOnboarding must be used inside OnboardingProvider',
    )
  })
})
