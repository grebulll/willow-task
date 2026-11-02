import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { routes } from './app/routes'
import { OnboardingProvider } from './onboarding/OnboardingProvider'
import { theme } from './theme'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <OnboardingProvider>
        <RouterProvider router={router} />
      </OnboardingProvider>
    </ThemeProvider>
  </StrictMode>,
)
