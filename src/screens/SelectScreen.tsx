import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { ScreenTitle } from '../app/ScreenTitle'
import { getNextPath } from '../onboarding/navigation'
import { useOnboarding } from '../onboarding/OnboardingContext'
import { answerUpdate } from '../onboarding/state'
import type { SelectStep } from '../onboarding/steps'

// One dropdown and a Continue button (B2, B3).
export function SelectScreen({ step }: { step: SelectStep }) {
  const { draft, setAnswers } = useOnboarding()
  const navigate = useNavigate()
  const [value, setValue] = useState<string>(draft[step.field] ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const option = step.options.find((o) => o.value === value)
    if (!option) {
      setError(`Choose your ${step.placeholder.toLowerCase()}`)
      return
    }

    const answer = answerUpdate(step.field, option.value)
    setAnswers(answer)
    // A disallowed answer (non-US tax residence) leads to the not-eligible screen.
    const next = getNextPath(step, { ...draft, ...answer })
    if (next) navigate(next)
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Box sx={{ textAlign: 'center' }}>
          <ScreenTitle>{step.title}</ScreenTitle>
          <Typography color="text.secondary">{step.description}</Typography>
        </Box>

        <TextField
          select
          label={step.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!!error}
          helperText={error}
        >
          {step.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" size="large" fullWidth>
          Continue
        </Button>
      </Stack>
    </Box>
  )
}
