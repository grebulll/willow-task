import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { OnboardingContext, type OnboardingContextValue } from './OnboardingContext'
import { onboardingReducer } from './state'
import { loadState, saveState } from './storage'

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, undefined, loadState)
  const [password, setPassword] = useState('')

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft: state.draft,
      submitted: state.submitted,
      password,
      setPassword,
      setAccount: (account) => dispatch({ type: 'setAccount', account }),
      setAnswers: (answers) => dispatch({ type: 'setAnswers', answers }),
      markSubmitted: () => {
        dispatch({ type: 'markSubmitted' })
        setPassword('')
      },
    }),
    [state, password],
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}
