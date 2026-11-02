import {
  FLOW,
  NOT_ELIGIBLE_STEP,
  firstUnansweredStep,
  isAllowedAnswer,
  isQuestionStep,
  type Step,
} from './steps'
import type { OnboardingDraft } from './types'

const FINAL_STEP = FLOW[FLOW.length - 1]

function indexOfStep(step: Step): number {
  return FLOW.findIndex((s) => s.id === step.id)
}

// True when an answer was given but isn't allowed (e.g. a non-US tax residence).
function hasDisallowedAnswer(draft: OnboardingDraft): boolean {
  return FLOW.some((step) => {
    if (step.kind !== 'select') return false
    const value = draft[step.field]
    return value !== undefined && !isAllowedAnswer(step, value)
  })
}

// Where to send the user instead of `step`, or null if they may stay.
export function getRedirect(step: Step, draft: OnboardingDraft, submitted: boolean): string | null {
  if (submitted) {
    // The flow is locked after a successful submit.
    return step.kind === 'final' ? null : FINAL_STEP.path
  }

  const furthest = firstUnansweredStep(draft)

  if (step.kind === 'notEligible') {
    return hasDisallowedAnswer(draft) ? null : furthest.path
  }

  return indexOfStep(step) <= indexOfStep(furthest) ? null : furthest.path
}

// Where Continue (or picking a card) goes from `step`, given the answers so far.
export function getNextPath(step: Step, draft: OnboardingDraft): string | null {
  if (step.kind === 'select') {
    const value = draft[step.field]
    if (value !== undefined && !isAllowedAnswer(step, value)) {
      return NOT_ELIGIBLE_STEP.path
    }
  }

  const index = indexOfStep(step)
  if (index === -1 || index === FLOW.length - 1) return null
  return FLOW[index + 1].path
}

// Where the back arrow goes. Only question screens have one.
export function getBackPath(step: Step): string | null {
  if (!isQuestionStep(step)) return null
  return FLOW[indexOfStep(step) - 1].path
}
