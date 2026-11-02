import { createContext, useContext } from 'react'
import type { AnswerUpdate } from './state'
import type { AccountDetails, OnboardingDraft } from './types'

export type OnboardingContextValue = {
  draft: OnboardingDraft
  submitted: boolean
  // In memory only: never part of the draft, so never saved to sessionStorage.
  password: string
  setPassword: (password: string) => void
  setAccount: (account: AccountDetails) => void
  setAnswers: (answers: AnswerUpdate) => void
  // Locks the flow and clears the password.
  markSubmitted: () => void
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function useOnboarding(): OnboardingContextValue {
  const value = useContext(OnboardingContext)
  if (!value) {
    throw new Error('useOnboarding must be used inside OnboardingProvider')
  }
  return value
}
