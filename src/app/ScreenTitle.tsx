import { Typography } from '@mui/material'
import { useEffect, useRef, type ReactNode } from 'react'

// The screen's h1. Takes focus when the screen opens, so screen readers
// announce the new step after a navigation.
export function ScreenTitle({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <Typography ref={ref} variant="h5" component="h1" tabIndex={-1} sx={{ outline: 'none', mb: 1 }}>
      {children}
    </Typography>
  )
}
