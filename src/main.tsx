import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Creating a client
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
    </StrictMode>,
  </QueryClientProvider>
)
