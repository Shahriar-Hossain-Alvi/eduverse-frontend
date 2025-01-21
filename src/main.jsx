import { StrictMode } from 'react'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './components/Routes/Routes.jsx'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ThemeProvider from './components/Provider/ThemeProvider.jsx'
import AuthProvider from './components/Provider/AuthProvider.jsx'


const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className='max-w-[1440px] mx-auto'>
            <RouterProvider router={router} />
          </div>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
