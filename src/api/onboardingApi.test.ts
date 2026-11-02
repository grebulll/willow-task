import type { OnboardingPayload } from '../onboarding/types'
import { submitOnboarding } from './onboardingApi'

function payload(email: string): OnboardingPayload {
  return {
    account: { firstName: 'Ada', lastName: 'Lovelace', email, password: 'secret123' },
    householdIncome: '200k_500k',
    netWorth: '1m_5m',
    qualifiedPurchaser: 'no',
    citizenships: ['US'],
    taxResidence: 'US',
    employmentStatus: 'employed',
    investmentPath: 'self_directed',
  }
}

describe('submitOnboarding', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('succeeds, and logs the payload without the password', async () => {
    const log = vi.spyOn(console, 'info').mockImplementation(() => {})
    const request = submitOnboarding(payload('ada@example.com'))
    await vi.runAllTimersAsync()
    await expect(request).resolves.toBeUndefined()
    expect(log).toHaveBeenCalled()
    expect(JSON.stringify(log.mock.calls)).not.toContain('secret123')
  })

  it('fails when the email contains "fail"', async () => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const request = submitOnboarding(payload('fail@test.com'))
    const assertion = expect(request).rejects.toThrow('Onboarding request failed')
    await vi.runAllTimersAsync()
    await assertion
  })
})
