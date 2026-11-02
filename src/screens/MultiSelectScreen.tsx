import Close from '@mui/icons-material/Close'
import { Box, Button, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { ScreenTitle } from '../app/ScreenTitle'
import { getNextPath } from '../onboarding/navigation'
import { useOnboarding } from '../onboarding/OnboardingContext'
import { answerUpdate } from '../onboarding/state'
import type { MultiSelectStep } from '../onboarding/steps'

const EMPTY_ROW_ERROR = 'Choose a country or remove this row'

// One dropdown per row, up to `maxItems` rows (B1).
export function MultiSelectScreen({ step }: { step: MultiSelectStep }) {
  const { draft, setAnswers } = useOnboarding()
  const navigate = useNavigate()
  const [rows, setRows] = useState<string[]>(draft[step.field] ?? [''])
  const [showErrors, setShowErrors] = useState(false)

  function rowLabel(index: number) {
    return index === 0 ? step.placeholder : `${step.placeholder} ${index + 1}`
  }

  function updateRow(index: number, value: string) {
    setRows((current) => current.map((row, i) => (i === index ? value : row)))
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (rows.some((row) => row === '')) {
      setShowErrors(true)
      return
    }

    // Maps each row back to a typed country code, keeping the user's order.
    const codes = rows.flatMap((row) =>
      step.options.filter((o) => o.value === row).map((o) => o.value),
    )
    const answer = answerUpdate(step.field, codes)
    setAnswers(answer)
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

        {rows.map((row, index) => {
          const hasError = showErrors && row === ''
          return (
            <Stack key={index} direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
              <TextField
                select
                fullWidth
                label={rowLabel(index)}
                value={row}
                onChange={(e) => updateRow(index, e.target.value)}
                error={hasError}
                helperText={hasError ? EMPTY_ROW_ERROR : undefined}
              >
                {step.options.map((option) => (
                  // A country picked in another row can't be picked again.
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    disabled={option.value !== row && rows.includes(option.value)}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {rows.length > 1 && (
                <IconButton aria-label={`Remove ${rowLabel(index)}`} onClick={() => removeRow(index)} sx={{ mt: 1 }}>
                  <Close />
                </IconButton>
              )}
            </Stack>
          )
        })}

        {rows.length < step.maxItems && (
          <Button variant="text" onClick={() => setRows((current) => [...current, ''])}>
            {step.addLabel}
          </Button>
        )}

        <Button type="submit" variant="contained" size="large" fullWidth>
          Continue
        </Button>
      </Stack>
    </Box>
  )
}
