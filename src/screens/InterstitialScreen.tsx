import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { ScreenTitle } from '../app/ScreenTitle'
import { getNextPath } from '../onboarding/navigation'
import { useOnboarding } from '../onboarding/OnboardingContext'
import type { InterstitialStep } from '../onboarding/steps'

export function InterstitialScreen({ step }: { step: InterstitialStep }) {
  const { draft } = useOnboarding()
  const navigate = useNavigate()
  const next = getNextPath(step, draft)

  const title =
    step.addressByFirstName && draft.account ? `${step.title}, ${draft.account.firstName}` : step.title

  return (
    // Illustration beside the text; stacked on narrow screens.
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ alignItems: { sm: 'center' } }}>
      {/* Placeholder illustration, as allowed by the brief. */}
      <Box
        aria-hidden="true"
        sx={{
          flexShrink: 0,
          width: { xs: '100%', sm: 200 },
          height: { xs: 140, sm: 260 },
          borderRadius: 2,
          bgcolor: 'primary.light',
          opacity: 0.3,
        }}
      />
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <ScreenTitle>{title}</ScreenTitle>
        <Typography color="text.secondary">{step.description}</Typography>
        {next && (
          <Button variant="contained" onClick={() => navigate(next)}>
            Continue
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
