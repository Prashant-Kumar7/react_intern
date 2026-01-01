import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from './components/providers/QueryProvider'
import { InstantDBProvider } from './components/providers/InstantDBProvider'
import { ThemeProvider } from './components/theme-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryProvider>
        <InstantDBProvider>
          <App />
        </InstantDBProvider>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
)
