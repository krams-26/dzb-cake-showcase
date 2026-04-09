import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlinkUIProvider, Toaster } from '@blinkdotnew/ui'
import { I18nProvider } from './contexts/I18nContext'
import { StaffAuthProvider } from './contexts/StaffAuthContext'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlinkUIProvider theme="linear" darkMode="system">
        <I18nProvider>
          <StaffAuthProvider>
            <Toaster />
            <App />
          </StaffAuthProvider>
        </I18nProvider>
      </BlinkUIProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
