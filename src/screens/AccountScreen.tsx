import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ScreenTitle } from '../app/ScreenTitle'
import { getNextPath } from '../onboarding/navigation'
import { useOnboarding } from '../onboarding/OnboardingContext'
import { FLOW_STEPS, type AccountStep } from '../onboarding/steps'

const FINAL_PATH = FLOW_STEPS[FLOW_STEPS.length - 1].path
import { validateAccount, type AccountErrors, type AccountForm } from './accountValidation'

export function AccountScreen({ step }: { step: AccountStep }) {
  const { draft, password, setAccount, setPassword } = useOnboarding()
  const navigate = useNavigate()
  // Set by the final screen when a refresh lost the password.
  const [searchParams] = useSearchParams()
  const resuming = searchParams.has('resume')

  // Prefilled when the user comes back. The password is only there if the page wasn't refreshed.
  const [form, setForm] = useState<AccountForm>({
    firstName: draft.account?.firstName ?? '',
    lastName: draft.account?.lastName ?? '',
    email: draft.account?.email ?? '',
    password,
    consent: draft.account !== undefined,
  })
  const [errors, setErrors] = useState<AccountErrors>({})
  const [showPassword, setShowPassword] = useState(false)

  function update<K extends keyof AccountForm>(field: K, value: AccountForm[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateAccount(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const account = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
    }
    setAccount(account)
    setPassword(form.password)
    // When resuming, everything else is already answered: go straight back to the final screen.
    const next = resuming ? FINAL_PATH : getNextPath(step, { ...draft, account })
    if (next) navigate(next)
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Box sx={{ textAlign: 'center' }}>
          <ScreenTitle>{step.title}</ScreenTitle>
          <Typography color="text.secondary">{step.description}</Typography>
        </Box>

        {resuming && (
          <Alert severity="info">
            For your security, your password isn't kept when the page is refreshed. Please re-enter it
            to finish.
          </Alert>
        )}

        <TextField
          label="First name"
          autoComplete="given-name"
          value={form.firstName}
          onChange={(e) => update('firstName', e.target.value)}
          error={!!errors.firstName}
          helperText={errors.firstName}
          required
        />
        <TextField
          label="Last name"
          autoComplete="family-name"
          value={form.lastName}
          onChange={(e) => update('lastName', e.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName}
          required
        />
        <TextField
          label="Email address"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          required
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((shown) => !shown)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.consent}
                onChange={(e) => update('consent', e.target.checked)}
              />
            }
            label={<Typography variant="body2">{step.consentLabel}</Typography>}
            sx={{ alignItems: 'flex-start' }}
          />
          {errors.consent && <FormHelperText error>{errors.consent}</FormHelperText>}
        </Box>

        <Button type="submit" variant="contained" size="large" fullWidth>
          Continue
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          {/* Dead link, as allowed by the brief. */}
          <Link href="#" onClick={(e) => e.preventDefault()}>
            Log in
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}
