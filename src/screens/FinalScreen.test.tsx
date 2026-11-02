import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { submitOnboarding } from '../api/onboardingApi'
import { routes } from '../app/routes'
import { OnboardingProvider } from '../onboarding/OnboardingProvider'
import { saveState } from '../onboarding/storage'
import type { OnboardingDraft } from '../onboarding/types'

vi.mock('../api/onboardingApi')

const completeDraft: Required<OnboardingDraft> = {
  account: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
  householdIncome: '200k_500k',
  netWorth: '1m_5m',
  qualifiedPurchaser: 'no',
  citizenships: ['US'],
  taxResidence: 'US',
  employmentStatus: 'employed',
}

// A promise the test resolves or rejects by hand, to see the in-between states.
function deferred() {
  let resolve = () => {}
  const promise = new Promise<void>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

// Starts on the account form (the password is in memory only), fills in the
// password, and lands on the final screen, like a user resuming after a refresh.
async function renderFinalScreen(user: ReturnType<typeof userEvent.setup>) {
  saveState({ draft: completeDraft, submitted: false })
  render(
    <OnboardingProvider>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/ready'] })} />
    </OnboardingProvider>,
  )
  expect(await screen.findByText(/Please re-enter it to finish/)).toBeInTheDocument()
  await user.type(screen.getByLabelText(/^Password/), 'secret123')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await screen.findByRole('heading', { name: "You're ready to invest on Willow Wealth" })
}

describe('FinalScreen', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(submitOnboarding).mockReset()
  })

  it('sends the user back to re-enter the password after a refresh, then returns', async () => {
    const user = userEvent.setup()
    await renderFinalScreen(user)
    expect(screen.getByRole('button', { name: /Select your own investments/ })).toBeInTheDocument()
  })

  it('submits the full payload, disables the cards while waiting, then shows success', async () => {
    const user = userEvent.setup()
    const request = deferred()
    vi.mocked(submitOnboarding).mockReturnValue(request.promise)
    await renderFinalScreen(user)

    await user.click(screen.getByRole('button', { name: /Set up a Managed Portfolio/ }))
    expect(screen.getByRole('status')).toHaveTextContent('Submitting…')
    expect(screen.getByRole('button', { name: /Select your own investments/ })).toBeDisabled()
    expect(submitOnboarding).toHaveBeenCalledWith({
      ...completeDraft,
      account: { ...completeDraft.account, password: 'secret123' },
      investmentPath: 'managed_portfolio',
    })

    await act(async () => request.resolve())
    expect(await screen.findByText(/You're all set!/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Select your own investments/ })).not.toBeInTheDocument()
  })

  it('shows an error with Retry that resends with the same choice', async () => {
    const user = userEvent.setup()
    vi.mocked(submitOnboarding)
      .mockRejectedValueOnce(new Error('Onboarding request failed'))
      .mockResolvedValueOnce(undefined)
    await renderFinalScreen(user)

    await user.click(screen.getByRole('button', { name: /Select your own investments/ }))
    expect(await screen.findByText(/couldn't save your details/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByText(/You're all set!/)).toBeInTheDocument()
    expect(submitOnboarding).toHaveBeenCalledTimes(2)
    expect(vi.mocked(submitOnboarding).mock.calls[1][0].investmentPath).toBe('self_directed')
  })
})
