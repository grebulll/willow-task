import { Stack, Typography } from '@mui/material'
import type { Step } from '../onboarding/steps'
import { ScreenTitle } from './ScreenTitle'

// TEMPORARY: stands in for the final screen until it is built.
export function PlaceholderScreen({ step }: { step: Step }) {
  return (
    <Stack spacing={2}>
      <ScreenTitle>{step.title}</ScreenTitle>
      <Typography color="text.secondary">{step.description}</Typography>
    </Stack>
  )
}
