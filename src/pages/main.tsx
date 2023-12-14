import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import PassportsPage from './PassportsPage'
import PassportPage from './PassportPage'

const router = createBrowserRouter([
  {
    path: '/passports',
    element: <PassportsPage />
  },
  {
    path: '/passports/:passport_name',
    element: <PassportPage />
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)