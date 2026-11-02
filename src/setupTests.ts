import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement scrolling; react-router's ScrollRestoration calls it on every navigation.
window.scrollTo = () => {}
