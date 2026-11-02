import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { OnboardingProvider } from '../onboarding/OnboardingProvider'
import type { OnboardingState } from '../onboarding/state'
import { saveState } from '../onboarding/storage'
import { routes } from './routes'

const account = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' }

function renderAt(path: string, saved?: OnboardingState) {
  if (saved) saveState(saved)
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <OnboardingProvider>
      <RouterProvider router={router} />
    </OnboardingProvider>,
  )
  return router
}

describe('routes', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('sends a user who skips ahead back to the account form', async () => {
    const router = renderAt('/net-worth')
    expect(await screen.findByRole('heading', { name: 'Create your account' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
  })

  it('shows the back arrow and progress on a question screen', async () => {
    renderAt('/net-worth', { draft: { account, householdIncome: 'over_1m' }, submitted: false })
    expect(await screen.findByRole('heading', { name: 'What is your net worth?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 6')).toBeInTheDocument()
  })

  it('shows neither on a welcome screen, and greets the user by first name', async () => {
    renderAt('/welcome', { draft: { account }, submitted: false })
    expect(
      await screen.findByRole('heading', { name: 'Welcome to Willow Wealth, Ada' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Step \d of 6/)).not.toBeInTheDocument()
  })

  it('goes back from the first question to the welcome screen', async () => {
    renderAt('/household-income', { draft: { account }, submitted: false })
    await userEvent.click(await screen.findByRole('button', { name: 'Back' }))
    expect(
      await screen.findByRole('heading', { name: 'Welcome to Willow Wealth, Ada' }),
    ).toBeInTheDocument()
  })

  it('moves from a welcome screen to its first question on Continue', async () => {
    renderAt('/welcome', { draft: { account }, submitted: false })
    await userEvent.click(await screen.findByRole('button', { name: 'Continue' }))
    expect(
      await screen.findByRole('heading', { name: 'What is your annual household income?' }),
    ).toBeInTheDocument()
  })

  it('focuses the heading of the new screen', async () => {
    renderAt('/welcome', { draft: { account }, submitted: false })
    await userEvent.click(await screen.findByRole('button', { name: 'Continue' }))
    expect(
      await screen.findByRole('heading', { name: 'What is your annual household income?' }),
    ).toHaveFocus()
  })

  it('locks the flow on the final screen after submitting', async () => {
    const router = renderAt('/', { draft: { account }, submitted: true })
    expect(
      await screen.findByRole('heading', { name: "You're ready to invest on Willow Wealth" }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/ready')
  })

  it('sends unknown URLs to the start', async () => {
    renderAt('/nope')
    expect(await screen.findByRole('heading', { name: 'Create your account' })).toBeInTheDocument()
  })
})
