import HelpOutline from '@mui/icons-material/HelpOutlineOutlined'
import { Box, Button, Card, CardActionArea, Stack, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { ScreenTitle } from '../app/ScreenTitle'
import { getNextPath } from '../onboarding/navigation'
import { useOnboarding } from '../onboarding/OnboardingContext'
import { answerUpdate } from '../onboarding/state'
import type { CardsStep } from '../onboarding/steps'

// Picking a card saves the answer and moves on; there is no Continue button.
export function CardsScreen({ step }: { step: CardsStep }) {
  const { draft, setAnswers } = useOnboarding()
  const navigate = useNavigate()
  const selected = draft[step.field]

  function handlePick(value: (typeof step.options)[number]['value']) {
    const answer = answerUpdate(step.field, value)
    setAnswers(answer)
    const next = getNextPath(step, { ...draft, ...answer })
    if (next) navigate(next)
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ textAlign: 'center' }}>
        <ScreenTitle>{step.title}</ScreenTitle>
        <Typography color="text.secondary">{step.description}</Typography>
      </Box>

      <Stack spacing={1.5}>
        {step.options.map((option) => {
          const isSelected = selected === option.value
          return (
            <Card
              key={option.value}
              variant="outlined"
              sx={{ borderColor: isSelected ? 'primary.main' : undefined, borderWidth: isSelected ? 2 : 1 }}
            >
              {/* A button per option; aria-pressed announces the earlier pick. */}
              <CardActionArea aria-pressed={isSelected} onClick={() => handlePick(option.value)} sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>{option.label}</Typography>
                {option.description && (
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                )}
              </CardActionArea>
            </Card>
          )
        })}
      </Stack>

      {step.help && (
        <Box sx={{ textAlign: 'center' }}>
          {/* Tooltip shows on hover and on keyboard focus. */}
          <Tooltip title={step.help.text}>
            <Button variant="text" size="small" startIcon={<HelpOutline />}>
              {step.help.label}
            </Button>
          </Tooltip>
        </Box>
      )}
    </Stack>
  )
}
