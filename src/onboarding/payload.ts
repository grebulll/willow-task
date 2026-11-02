import type { InvestmentPath, OnboardingDraft, OnboardingPayload } from './types'

// Returns null when the draft is incomplete. The route guard should make that
// impossible on the final screen, so null is treated as an error there.
export function toPayload(
  draft: OnboardingDraft,
  password: string,
  investmentPath: InvestmentPath,
): OnboardingPayload | null {
  const {
    account,
    householdIncome,
    netWorth,
    qualifiedPurchaser,
    citizenships,
    taxResidence,
    employmentStatus,
  } = draft

  if (
    !account ||
    !householdIncome ||
    !netWorth ||
    !qualifiedPurchaser ||
    !citizenships ||
    citizenships.length === 0 ||
    !taxResidence ||
    !employmentStatus ||
    password === ''
  ) {
    return null
  }

  return {
    account: { ...account, password },
    householdIncome,
    netWorth,
    qualifiedPurchaser,
    citizenships,
    taxResidence,
    employmentStatus,
    investmentPath,
  }
}
