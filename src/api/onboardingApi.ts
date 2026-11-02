import type { OnboardingPayload } from '../onboarding/types'

const FAKE_LATENCY_MS = 800

// Mock of POST /api/onboarding. A real version would be:
//   fetch('/api/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
// It fails when the email contains "fail", so both outcomes can be tried.
export async function submitOnboarding(payload: OnboardingPayload): Promise<void> {
  const body = JSON.stringify(payload)
  await new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS))

  // The fake server reads the JSON body, like a real one would.
  const received: OnboardingPayload = JSON.parse(body)
  // Never log the password.
  console.info('POST /api/onboarding', {
    ...received,
    account: { ...received.account, password: '***' },
  })

  if (received.account.email.includes('fail')) {
    throw new Error('Onboarding request failed')
  }
}
