import type { CountryCode } from './countries'

// Each array is the single source of truth for its union type.
// The text shown on screen lives in the step definitions, not here.

export const HOUSEHOLD_INCOMES = ['under_200k', '200k_500k', '500k_1m', 'over_1m'] as const
export type HouseholdIncome = (typeof HOUSEHOLD_INCOMES)[number]

export const NET_WORTHS = ['under_500k', '500k_1m', '1m_5m', 'over_5m'] as const
export type NetWorth = (typeof NET_WORTHS)[number]

export const QUALIFIED_PURCHASER_ANSWERS = ['yes', 'no'] as const
export type QualifiedPurchaser = (typeof QUALIFIED_PURCHASER_ANSWERS)[number]

export const EMPLOYMENT_STATUSES = [
  'employed',
  'self_employed',
  'retired',
  'student',
  'not_employed',
] as const
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number]

export const INVESTMENT_PATHS = ['self_directed', 'managed_portfolio'] as const
export type InvestmentPath = (typeof INVESTMENT_PATHS)[number]

// The password is deliberately not part of this type: it is kept in memory only,
// so it can never end up in sessionStorage through the draft.
export type AccountDetails = {
  firstName: string
  lastName: string
  email: string
}

// What is saved while the user moves through the flow.
// `account` being set means the account step is done.
export type OnboardingDraft = {
  account?: AccountDetails
  householdIncome?: HouseholdIncome
  netWorth?: NetWorth
  qualifiedPurchaser?: QualifiedPurchaser
  citizenships?: CountryCode[]
  taxResidence?: CountryCode
  employmentStatus?: EmploymentStatus
}

// What POST /api/onboarding receives: the draft with every field required,
// plus the password and the path chosen on the final screen.
export type OnboardingPayload = Omit<Required<OnboardingDraft>, 'account'> & {
  account: AccountDetails & { password: string }
  investmentPath: InvestmentPath
}
