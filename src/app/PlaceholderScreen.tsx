import { Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { getNextPath } from '../onboarding/navigation'
import { useOnboarding } from '../onboarding/OnboardingContext'
import type { AnswerUpdate } from '../onboarding/state'
import type { QuestionStep, Step } from '../onboarding/steps'
import { ScreenTitle } from './ScreenTitle'

// TEMPORARY: saves the first option so the guard lets the flow be clicked through.
// Goes away when the real screens are built.
function firstOptionAnswer(step: QuestionStep): AnswerUpdate {
  switch (step.field) {
    case 'householdIncome':
      return { householdIncome: step.options[0].value }
    case 'netWorth':
      return { netWorth: step.options[0].value }
    case 'qualifiedPurchaser':
      return { qualifiedPurchaser: step.options[0].value }
    case 'citizenships':
      return { citizenships: [step.options[0].value] }
    case 'taxResidence':
      return { taxResidence: step.options[0].value }
    case 'employmentStatus':
      return { employmentStatus: step.options[0].value }
  }
}

// TEMPORARY: stands in for each screen until the real one is built.
export function PlaceholderScreen({ step }: { step: Step }) {
  const { draft, setAnswers } = useOnboarding()
  const navigate = useNavigate()

  const title =
    step.kind === 'interstitial' && step.addressByFirstName && draft.account
      ? `${step.title}, ${draft.account.firstName}`
      : step.title

  function handleContinue() {
    let nextDraft = draft
    if (step.kind === 'cards' || step.kind === 'select' || step.kind === 'multiSelect') {
      const answer = firstOptionAnswer(step)
      setAnswers(answer)
      nextDraft = { ...draft, ...answer }
    }
    const next = getNextPath(step, nextDraft)
    if (next) navigate(next)
  }

  const hasContinue = step.kind !== 'final' && step.kind !== 'notEligible'

  return (
    <Stack spacing={2}>
      <ScreenTitle>{title}</ScreenTitle>
      <Typography color="text.secondary">{step.description}</Typography>
      {hasContinue && (
        <Button variant="contained" onClick={handleContinue}>
          Continue
        </Button>
      )}
    </Stack>
  )
}
