import { Outlet, ScrollRestoration } from 'react-router'

export function RootLayout() {
  return (
    <>
      {/* Scrolls to the top on each new step. */}
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
