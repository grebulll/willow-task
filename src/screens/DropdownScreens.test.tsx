import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../app/routes'
import { OnboardingProvider } from '../onboarding/OnboardingProvider'
import { saveState } from '../onboarding/storage'
import type { OnboardingDraft } from '../onboarding/types'

const sectionA: OnboardingDraft = {
  account: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
  householdIncome: 'over_1m',
  netWorth: 'over_5m',
  qualifiedPurchaser: 'yes',
}

function renderAt(path: string, draft: OnboardingDraft) {
  saveState({ draft, submitted: false })
  render(
    <OnboardingProvider>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />
    </OnboardingProvider>,
  )
}

async function choose(user: ReturnType<typeof userEvent.setup>, label: string, option: string) {
  await user.click(screen.getByRole('combobox', { name: label }))
  await user.click(within(screen.getByRole('listbox')).getByRole('option', { name: option }))
}

describe('dropdown screens', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('citizenship: requires a country per row, blocks duplicates, and allows removing rows', async () => {
    const user = userEvent.setup()
    renderAt('/citizenship', sectionA)

    await screen.findByRole('heading', { name: 'What countries are you a citizen of?' })
    await choose(user, 'Country of citizenship', 'United States')
    await user.click(screen.getByRole('button', { name: 'Add another country' }))

    // Empty row blocks Continue.
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Choose a country or remove this row')).toBeInTheDocument()

    // A country already picked can't be picked again.
    await user.click(screen.getByRole('combobox', { name: 'Country of citizenship 2' }))
    expect(within(screen.getByRole('listbox')).getByRole('option', { name: 'United States' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('button', { name: 'Remove Country of citizenship 2' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(await screen.findByRole('heading', { name: 'What is your tax residence?' })).toBeInTheDocument()
  })

  it('tax residence: a non-US answer leads to the not-eligible screen and back', async () => {
    const user = userEvent.setup()
    renderAt('/tax-residence', { ...sectionA, citizenships: ['CA'] })

    await screen.findByRole('heading', { name: 'What is your tax residence?' })
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Choose your country of tax residence')).toBeInTheDocument()

    await choose(user, 'Country of tax residence', 'Canada')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(await screen.findByRole('heading', { name: "We can't open your account yet" })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Update tax residence' }))
    await choose(user, 'Country of tax residence', 'United States')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(await screen.findByRole('heading', { name: "What's your employment status?" })).toBeInTheDocument()
  })
})
