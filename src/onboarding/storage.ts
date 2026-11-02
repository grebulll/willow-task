import { COUNTRIES, type CountryCode } from './countries'
import { initialState, type OnboardingState } from './state'
import {
  EMPLOYMENT_STATUSES,
  HOUSEHOLD_INCOMES,
  NET_WORTHS,
  QUALIFIED_PURCHASER_ANSWERS,
  type AccountDetails,
  type OnboardingDraft,
} from './types'

export const STORAGE_KEY = 'willow-onboarding'

const COUNTRY_CODES: readonly CountryCode[] = COUNTRIES.map((country) => country.code)

function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (values as readonly string[]).includes(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseAccount(value: unknown): AccountDetails | undefined {
  if (
    isRecord(value) &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    typeof value.email === 'string'
  ) {
    // Rebuilt field by field so nothing extra (e.g. a password) is carried over.
    return { firstName: value.firstName, lastName: value.lastName, email: value.email }
  }
  return undefined
}

function parseCountries(value: unknown): CountryCode[] | undefined {
  if (Array.isArray(value) && value.every((code) => isOneOf(COUNTRY_CODES, code))) {
    return value
  }
  return undefined
}

// Returns null if the saved data has the wrong shape or an unknown value,
// so the flow starts fresh instead of crashing on it.
export function parseState(value: unknown): OnboardingState | null {
  if (!isRecord(value) || typeof value.submitted !== 'boolean' || !isRecord(value.draft)) {
    return null
  }
  const saved = value.draft
  const draft: OnboardingDraft = {}

  if (saved.account !== undefined) {
    const account = parseAccount(saved.account)
    if (!account) return null
    draft.account = account
  }
  if (saved.householdIncome !== undefined) {
    if (!isOneOf(HOUSEHOLD_INCOMES, saved.householdIncome)) return null
    draft.householdIncome = saved.householdIncome
  }
  if (saved.netWorth !== undefined) {
    if (!isOneOf(NET_WORTHS, saved.netWorth)) return null
    draft.netWorth = saved.netWorth
  }
  if (saved.qualifiedPurchaser !== undefined) {
    if (!isOneOf(QUALIFIED_PURCHASER_ANSWERS, saved.qualifiedPurchaser)) return null
    draft.qualifiedPurchaser = saved.qualifiedPurchaser
  }
  if (saved.citizenships !== undefined) {
    const citizenships = parseCountries(saved.citizenships)
    if (!citizenships) return null
    draft.citizenships = citizenships
  }
  if (saved.taxResidence !== undefined) {
    if (!isOneOf(COUNTRY_CODES, saved.taxResidence)) return null
    draft.taxResidence = saved.taxResidence
  }
  if (saved.employmentStatus !== undefined) {
    if (!isOneOf(EMPLOYMENT_STATUSES, saved.employmentStatus)) return null
    draft.employmentStatus = saved.employmentStatus
  }

  return { draft, submitted: value.submitted }
}

// sessionStorage can throw (e.g. blocked storage), so both calls are guarded.
export function loadState(): OnboardingState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw === null) return initialState
    return parseState(JSON.parse(raw)) ?? initialState
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
