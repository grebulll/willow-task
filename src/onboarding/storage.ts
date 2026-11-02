import { initialState, type OnboardingState } from './state'

export const STORAGE_KEY = 'willow-onboarding'

// sessionStorage can throw (e.g. blocked storage), so both calls are guarded.
export function loadState(): OnboardingState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    // The saved shape is trusted: only saveState writes it. Invalid JSON starts fresh.
    return raw === null ? initialState : (JSON.parse(raw) as OnboardingState)
  } catch {
    return initialState
  }
}

export function saveState(state: OnboardingState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Progress just won't survive a refresh.
  }
}
