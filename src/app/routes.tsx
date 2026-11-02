import { Navigate, type RouteObject } from 'react-router'
import { FLOW, NOT_ELIGIBLE_STEP } from '../onboarding/steps'
import { RootLayout } from './RootLayout'
import { StepRoute } from './StepRoute'

// One route per step, built from the flow data.
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      ...[...FLOW, NOT_ELIGIBLE_STEP].map((step) => ({
        path: step.path,
        // `key` so each step mounts fresh instead of reusing the previous step's state.
        element: <StepRoute key={step.id} step={step} />,
      })),
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
