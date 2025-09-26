import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginPage } from '../pages/Login'
import { PublicRoute } from '../pages/PublicRoute'
import { ProtectedRoute } from '../pages/ProtectedRoute'
import { DashboardPage } from '../pages/Dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,

    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
])

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
}
