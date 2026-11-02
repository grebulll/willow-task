import CheckCircle from '@mui/icons-material/CheckCircle'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Navigate } from 'react-router'
import { ScreenTitle } from '../app/ScreenTitle'
import { submitOnboarding } from '../api/onboardingApi'
import { useOnboarding } from '../onboarding/OnboardingContext'
import { toPayload } from '../onboarding/payload'
import { FLOW, type FinalStep } from '../onboarding/steps'
import type { InvestmentPath } from '../onboarding/types'

type Status = 'idle' | 'submitting' | 'error'

const ACCOUNT_PATH = FLOW[0].path

export function FinalScreen({ step }: { step: FinalStep }) {
  const { draft, password, submitted, markSubmitted } = useOnboarding()
  const [status, setStatus] = useState<Status>('idle')
  const [lastPath, setLastPath] = useState<InvestmentPath | null>(null)

  // The password lives in memory only, so a refresh loses it.
  // Send the user back to the account form to re-enter it.
  if (!submitted && password === '') {
    return <Navigate to={`${ACCOUNT_PATH}?resume`} replace />
  }

  async function submit(path: InvestmentPath) {
    const payload = toPayload(draft, password, path)
    setLastPath(path)
    // The route guard should make this impossible; shown as an error just in case.
    if (!payload) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    try {
      await submitOnboarding(payload)
      markSubmitted()
    } catch {
      setStatus('error')
    }
  }

  const submitting = status === 'submitting'

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
      {/* Placeholder illustration, as allowed by the brief. */}
      <Box
        aria-hidden="true"
        sx={{
          flexShrink: 0,
          width: { xs: '100%', sm: 200 },
          height: { xs: 140, sm: 360 },
          borderRadius: 2,
          bgcolor: 'primary.light',
          opacity: 0.3,
        }}
      />
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <CheckCircle color="success" aria-hidden="true" />
          <ScreenTitle>{step.title}</ScreenTitle>
        </Stack>

        {submitted ? (
          <Alert severity="success">
            You're all set! We've received your details and your account is ready.
          </Alert>
        ) : (
          <>
            <Typography color="text.secondary">{step.description}</Typography>

            {step.choices.map((choice) => (
              <Card key={choice.value} variant="outlined">
                {/* Disabled while submitting, so the payload can't be sent twice. */}
                <CardActionArea disabled={submitting} onClick={() => submit(choice.value)} sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 600 }}>{choice.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {choice.description}
                  </Typography>
                </CardActionArea>
              </Card>
            ))}

            {submitting && (
              <Stack role="status" direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Submitting…</Typography>
              </Stack>
            )}

            {status === 'error' && lastPath && (
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={() => submit(lastPath)}>
                    Retry
                  </Button>
                }
              >
                Something went wrong and we couldn't save your details. Your answers are kept.
              </Alert>
            )}
          </>
        )}
      </Stack>
    </Stack>
  )
}
