import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../app/routes'
import { OnboardingProvider } from '../onboarding/OnboardingProvider'

describe('AccountScreen', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('shows errors on submit, then continues to the welcome screen once valid', async () => {
    const user = userEvent.setup()
    render(
      <OnboardingProvider>
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />
      </OnboardingProvider>,
    )

    await user.click(await screen.findByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Enter your first name')).toBeInTheDocument()
    expect(screen.getByText('Please accept to continue')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/First name/), '  Ada ')
    await user.type(screen.getByLabelText(/Last name/), 'Lovelace')
    await user.type(screen.getByLabelText(/Email address/), 'ada@example.com')
    await user.type(screen.getByLabelText(/^Password/), 'secret123')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(
      await screen.findByRole('heading', { name: 'Welcome to Willow Wealth, Ada' }),
    ).toBeInTheDocument()
  })
})
