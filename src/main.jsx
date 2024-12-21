import { StrictMode } from 'react'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './components/Routes/Routes.jsx'
import { createRoot } from 'react-dom/client'
import ThemeProvider from './components/Provider/ThemeContext.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <div className='max-w-7xl mx-auto'>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  </StrictMode>,
)
