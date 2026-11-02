import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Container, IconButton, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { getBackPath } from '../onboarding/navigation'
import { getProgress, type Step } from '../onboarding/steps'

// Hidden on screen, still read by screen readers.
const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const

export function Layout({ step, children }: { step: Step; children: ReactNode }) {
  const navigate = useNavigate()
  const backPath = getBackPath(step)
  const progress = getProgress(step.id)

  return (
    <>
      <Box component="header" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="md" sx={{ py: 2 }}>
          <Typography component="p" variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            WillowWealth
          </Typography>
        </Container>
      </Box>

      <Container component="main" maxWidth="sm" sx={{ py: 3 }}>
        {(backPath || progress) && (
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            {backPath ? (
              <IconButton aria-label="Back" edge="start" onClick={() => navigate(backPath)}>
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <span />
            )}
            {progress && (
              <Typography variant="body2" color="text.secondary">
                <span aria-hidden="true">
                  {progress.current} / {progress.total}
                </span>
                <Box component="span" sx={visuallyHidden}>
                  Step {progress.current} of {progress.total}
                </Box>
              </Typography>
            )}
          </Stack>
        )}
        {children}
      </Container>
    </>
  )
}
