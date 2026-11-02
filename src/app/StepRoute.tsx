import { Navigate } from 'react-router'
import { getRedirect } from '../onboarding/navigation'
import { useOnboarding } from '../onboarding/OnboardingContext'
import type { Step } from '../onboarding/steps'
import { AccountScreen } from '../screens/AccountScreen'
import { Layout } from './Layout'
import { PlaceholderScreen } from './PlaceholderScreen'

function StepScreen({ step }: { step: Step }) {
  switch (step.kind) {
    case 'account':
      return <AccountScreen step={step} />
    default:
      return <PlaceholderScreen step={step} />
  }
}

// Applies the guard, then shows the screen for `step` inside the shared layout.
export function StepRoute({ step }: { step: Step }) {
  const { draft, submitted } = useOnboarding()
  const redirect = getRedirect(step, draft, submitted)

  // `replace` so browser back doesn't land on a step that redirects again.
  if (redirect) return <Navigate to={redirect} replace />

  return (
    <Layout step={step}>
      <StepScreen step={step} />
    </Layout>
  )
}
