import { COUNTRIES, ELIGIBLE_TAX_RESIDENCES, type CountryCode } from './countries'
import type { InvestmentPath, OnboardingDraft } from './types'

// ---- Step shapes ----

export type Option<V extends string> = {
  value: V
  label: string
  description?: string
}

type AnswerValue<F extends keyof OnboardingDraft> = NonNullable<OnboardingDraft[F]>

type StepBase = {
  id: string
  path: string
  title: string
  description: string
}

export type AccountStep = StepBase & {
  kind: 'account'
  consentLabel: string
}

export type InterstitialStep = StepBase & {
  kind: 'interstitial'
  // Renders the title as "<title>, <firstName>".
  addressByFirstName?: boolean
}

type CardsField = 'householdIncome' | 'netWorth' | 'qualifiedPurchaser'

// Picking a card advances, so there is no Continue button.
export type CardsStep = {
  [F in CardsField]: StepBase & {
    kind: 'cards'
    field: F
    options: readonly Option<AnswerValue<F>>[]
    help?: { label: string; text: string }
  }
}[CardsField]

type SelectField = 'taxResidence' | 'employmentStatus'

export type SelectStep = {
  [F in SelectField]: StepBase & {
    kind: 'select'
    field: F
    placeholder: string
    options: readonly Option<AnswerValue<F>>[]
    // When set, any other value goes to the "not eligible" screen.
    allowed?: readonly AnswerValue<F>[]
  }
}[SelectField]

export type MultiSelectStep = StepBase & {
  kind: 'multiSelect'
  field: 'citizenships'
  placeholder: string
  addLabel: string
  maxItems: number
  options: readonly Option<CountryCode>[]
}

export type FinalStep = StepBase & {
  kind: 'final'
  choices: readonly Option<InvestmentPath>[]
}

export type NotEligibleStep = StepBase & {
  kind: 'notEligible'
}

export type QuestionStep = CardsStep | SelectStep | MultiSelectStep

export type Step =
  | AccountStep
  | InterstitialStep
  | QuestionStep
  | FinalStep
  | NotEligibleStep

// ---- The flow ----

const COUNTRY_OPTIONS: readonly Option<CountryCode>[] = COUNTRIES.map(({ code, name }) => ({
  value: code,
  label: name,
}))

// The order of this list is the order of the flow.
export const FLOW = [
  {
    kind: 'account',
    id: 'account',
    path: '/',
    title: 'Create your account',
    description: 'Start building a portfolio tailored to your objectives.',
    consentLabel:
      'I have read and accepted the Privacy Policy, Electronic Disclosure and Consent and Terms of Service and I consent to the use of electronic records in connection with this application.',
  },
  {
    kind: 'interstitial',
    id: 'welcome',
    path: '/welcome',
    title: 'Welcome to Willow Wealth',
    addressByFirstName: true,
    description:
      "Let's begin setting up your individual account. Next, we'll ask a few quick questions to better understand your investor profile.",
  },
  {
    kind: 'cards',
    id: 'householdIncome',
    path: '/household-income',
    field: 'householdIncome',
    title: 'What is your annual household income?',
    description:
      'Please include all sources of income, such as salary, bonuses, rental properties and investments. If you have a spouse or spousal equivalent, please choose your joint income level.',
    options: [
      { value: 'under_200k', label: 'Under $200,000' },
      { value: '200k_500k', label: '$200,000 - $500,000' },
      { value: '500k_1m', label: '$500,001 - $1,000,000' },
      { value: 'over_1m', label: 'Over $1,000,000' },
    ],
  },
  {
    kind: 'cards',
    id: 'netWorth',
    path: '/net-worth',
    field: 'netWorth',
    title: 'What is your net worth?',
    description:
      'Please include all your assets, minus your primary residence and liabilities. If you have a spouse or spousal equivalent, please choose your joint net worth.',
    options: [
      { value: 'under_500k', label: '$0 - $500,000' },
      { value: '500k_1m', label: '$500,001 - $1,000,000' },
      { value: '1m_5m', label: '$1,000,001 - $5,000,000' },
      { value: 'over_5m', label: '$5,000,001+' },
    ],
  },
  {
    kind: 'cards',
    id: 'qualifiedPurchaser',
    path: '/qualified-purchaser',
    field: 'qualifiedPurchaser',
    title: 'Are you a qualified purchaser?',
    description:
      'Individual qualified purchasers own $5,000,000 in investments, but you are not required to be one to invest on Willow Wealth.',
    options: [
      { value: 'yes', label: 'Yes', description: 'I meet the qualified purchaser requirements' },
      { value: 'no', label: 'No', description: 'I do not meet the qualified purchaser requirements' },
    ],
    help: {
      label: 'What is a qualified purchaser?',
      text: 'Under the SEC rules (Investment Company Act of 1940, Section 2(a)(51)), an individual qualified purchaser owns at least $5,000,000 in investments, alone or jointly with a spouse.',
    },
  },
  {
    kind: 'interstitial',
    id: 'moreQuestions',
    path: '/more-questions',
    title: 'A few more questions to complete your account set-up',
    description:
      'As the last step in identity verification, FINRA, our regulator, requires us to ask about citizenship, employment and potential conflicts of interest.',
  },
  {
    kind: 'multiSelect',
    id: 'citizenships',
    path: '/citizenship',
    field: 'citizenships',
    title: 'What countries are you a citizen of?',
    description:
      'We are required to collect this information for regulatory purposes and determine your account eligibility.',
    placeholder: 'Country of citizenship',
    addLabel: 'Add another country',
    maxItems: 3,
    options: COUNTRY_OPTIONS,
  },
  {
    kind: 'select',
    id: 'taxResidence',
    path: '/tax-residence',
    field: 'taxResidence',
    title: 'What is your tax residence?',
    description:
      "Willow Wealth's investments are currently only available for U.S. taxpayers. Please confirm your tax residence is correct.",
    placeholder: 'Country of tax residence',
    options: COUNTRY_OPTIONS,
    allowed: ELIGIBLE_TAX_RESIDENCES,
  },
  {
    kind: 'select',
    id: 'employmentStatus',
    path: '/employment',
    field: 'employmentStatus',
    title: "What's your employment status?",
    description: "We're required to ask for this information for regulatory purposes.",
    placeholder: 'Employment status',
    options: [
      { value: 'employed', label: 'Employed' },
      { value: 'self_employed', label: 'Self-employed' },
      { value: 'retired', label: 'Retired' },
      { value: 'student', label: 'Student' },
      { value: 'not_employed', label: 'Not employed' },
    ],
  },
  {
    kind: 'final',
    id: 'ready',
    path: '/ready',
    title: "You're ready to invest on Willow Wealth",
    description:
      "Choose the path that's best for you below, whether you prefer to hand-pick your investment portfolio or let Willow Wealth do the work for you.",
    choices: [
      {
        value: 'self_directed',
        label: 'Select your own investments',
        description:
          'Explore a wide range of curated private markets investments spanning real estate, private credit, private equity, and more.',
      },
      {
        value: 'managed_portfolio',
        label: 'Set up a Managed Portfolio',
        description:
          "Select a strategy, and we'll assemble a portfolio of diversified funds from prominent asset managers.",
      },
    ],
  },
] as const satisfies readonly Step[]

// Not part of the linear flow: reached only from tax residence.
export const NOT_ELIGIBLE_STEP = {
  kind: 'notEligible',
  id: 'notEligible',
  path: '/not-eligible',
  title: "We can't open your account yet",
  description:
    "Willow Wealth's investments are currently only available for U.S. taxpayers. If your tax residence is the United States, go back and update your answer.",
} as const satisfies NotEligibleStep

export type StepId = (typeof FLOW)[number]['id'] | typeof NOT_ELIGIBLE_STEP.id

// ---- Helpers ----

export function isQuestionStep(step: Step): step is QuestionStep {
  return step.kind === 'cards' || step.kind === 'select' || step.kind === 'multiSelect'
}

export function isAllowedAnswer(step: SelectStep, value: string): boolean {
  return step.allowed === undefined || (step.allowed as readonly string[]).includes(value)
}

function isStepComplete(step: Step, draft: OnboardingDraft): boolean {
  switch (step.kind) {
    case 'account':
      return draft.account !== undefined
    case 'cards':
      return draft[step.field] !== undefined
    case 'select': {
      const value = draft[step.field]
      return value !== undefined && isAllowedAnswer(step, value)
    }
    case 'multiSelect':
      return (draft[step.field]?.length ?? 0) > 0
    default:
      // Interstitials and the final screen have nothing to answer.
      return true
  }
}

// The furthest step the user may visit: the first one still missing a valid
// answer, or the final screen when everything is answered.
// An answer that isn't allowed (non-US tax residence) counts as missing.
export function firstUnansweredStep(draft: OnboardingDraft): Step {
  return FLOW.find((step) => !isStepComplete(step, draft)) ?? FLOW[FLOW.length - 1]
}

// FLOW keeps its literal types for StepId; the helpers only need the wider Step type.
const FLOW_STEPS: readonly Step[] = FLOW
const QUESTION_STEPS: readonly QuestionStep[] = FLOW_STEPS.filter(isQuestionStep)

// "x / y" for question screens; null for screens without a counter.
export function getProgress(stepId: StepId): { current: number; total: number } | null {
  const index = QUESTION_STEPS.findIndex((step) => step.id === stepId)
  if (index === -1) return null
  return { current: index + 1, total: QUESTION_STEPS.length }
}
