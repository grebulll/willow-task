import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../app/routes'
import { OnboardingProvider } from '../onboarding/OnboardingProvider'
import { saveState } from '../onboarding/storage'

describe('CardsScreen', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('advances on pick and shows the earlier pick when coming back', async () => {
    const user = userEvent.setup()
    saveState({
      draft: { account: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' } },
      submitted: false,
    })
    render(
      <OnboardingProvider>
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/household-income'] })} />
      </OnboardingProvider>,
    )

    await user.click(await screen.findByRole('button', { name: '$200,000 - $500,000' }))
    expect(await screen.findByRole('heading', { name: 'What is your net worth?' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await screen.findByRole('button', { name: '$200,000 - $500,000' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Under $200,000' })).toHaveAttribute('aria-pressed', 'false')
  })
})
