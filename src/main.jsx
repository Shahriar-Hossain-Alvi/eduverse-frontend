import { StrictMode } from 'react'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './components/Routes/Routes.jsx'
import { createRoot } from 'react-dom/client'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='max-w-7xl mx-auto'>
      <RouterProvider router={router} />
    </div>
  </StrictMode>,
)
