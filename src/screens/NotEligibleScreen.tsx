import { Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { ScreenTitle } from '../app/ScreenTitle'
import type { NotEligibleStep } from '../onboarding/steps'

export function NotEligibleScreen({ step }: { step: NotEligibleStep }) {
  const navigate = useNavigate()

  return (
    <Stack spacing={2} sx={{ textAlign: 'center', alignItems: 'center' }}>
      <ScreenTitle>{step.title}</ScreenTitle>
      <Typography color="text.secondary">{step.description}</Typography>
      <Button variant="contained" onClick={() => navigate(step.actionPath)}>
        {step.actionLabel}
      </Button>
    </Stack>
  )
}
