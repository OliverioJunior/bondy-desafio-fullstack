import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../../contexts/useAuthContext'

export const PublicRoute: React.FC = () => {
  const { user } = useAuthContext()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
