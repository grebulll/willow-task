import { Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { getNextPath } from '../onboarding/navigation'
import { useOnboarding } from '../onboarding/OnboardingContext'
import { answerUpdate } from '../onboarding/state'
import type { Step } from '../onboarding/steps'
import { ScreenTitle } from './ScreenTitle'

// TEMPORARY: stands in for each screen until the real one is built.
// Continue saves the first option so the guard lets the flow be clicked through.
export function PlaceholderScreen({ step }: { step: Step }) {
  const { draft, setAnswers } = useOnboarding()
  const navigate = useNavigate()

  function handleContinue() {
    let nextDraft = draft
    if (step.kind === 'select' || step.kind === 'multiSelect') {
      const answer =
        step.kind === 'multiSelect'
          ? answerUpdate(step.field, [step.options[0].value])
          : answerUpdate(step.field, step.options[0].value)
      setAnswers(answer)
      nextDraft = { ...draft, ...answer }
    }
    const next = getNextPath(step, nextDraft)
    if (next) navigate(next)
  }

  const hasContinue = step.kind !== 'final' && step.kind !== 'notEligible'

  return (
    <Stack spacing={2}>
      <ScreenTitle>{step.title}</ScreenTitle>
      <Typography color="text.secondary">{step.description}</Typography>
      {hasContinue && (
        <Button variant="contained" onClick={handleContinue}>
          Continue
        </Button>
      )}
    </Stack>
  )
}
